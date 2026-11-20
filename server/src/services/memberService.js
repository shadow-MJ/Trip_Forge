import db, { withTransaction } from '../config/db.js';
import ApiError from '../utils/apiError.js';
import { newId } from '../utils/ids.js';
import { generateInviteCode } from '../utils/inviteCode.js';
import { notify } from '../utils/notify.js';

export async function joinByCode(code, user) {
  const trip = await db('trips').whereRaw('UPPER(invite_code)=?', [code.trim().toUpperCase()]).first();
  if (!trip) throw new ApiError(404, 'No trip matches that invite code. Try 6767.', 'NOT_FOUND');
  const member = await db('trip_members').where({ trip_id: trip.id, user_id: user.id }).first();
  if (member && member.status === 'approved') throw new ApiError(409, 'You are already an active member of this trip.', 'CONFLICT');
  const pending = await db('join_requests').where({ trip_id: trip.id, user_id: user.id, status: 'pending' }).first();
  if (pending) throw new ApiError(409, `You already submitted a join request for "${trip.name}". Awaiting Trip Creator approval.`, 'CONFLICT');
  const request = { id:newId('req'), trip_id:trip.id, user_id:user.id, status:'pending', requested_at:new Date() };
  await db('join_requests').insert(request);
  await notify({ tripId:trip.id, actorId:user.id, type:'Members', message:`${user.name} requested to join the trip with invite code ${trip.invite_code}`, linkSuffix:'members' });
  return { status:'pending', request:{ id:request.id, tripId:trip.id, tripName:trip.name, destination:trip.destination, userId:user.id, name:user.name, email:user.email, status:'pending', requestedAt:request.requested_at },
    trip:{ id:trip.id,name:trip.name,destination:trip.destination,inviteCode:trip.invite_code },
    message:`Join request submitted for "${trip.name}"! The Trip Creator must approve before you can access the workspace.` };
}
export async function members(tripId) {
  return (await db('trip_members').join('users','users.id','trip_members.user_id')
    .where({ 'trip_members.trip_id':tripId,'trip_members.status':'approved' })
    .select('users.id','users.name','users.email','trip_members.role','trip_members.joined_at'))
    .map(r => ({ id:r.id,name:r.name,email:r.email,role:r.role,joinedAt:r.joined_at instanceof Date?r.joined_at.toISOString():r.joined_at }));
}
export async function pending(tripId) {
  return (await db('join_requests').join('users','users.id','join_requests.user_id').join('trips','trips.id','join_requests.trip_id')
    .where({ 'join_requests.trip_id':tripId,'join_requests.status':'pending' })
    .select('join_requests.*','users.name','users.email','trips.name as trip_name','trips.destination'))
    .map(r => ({ id:r.id,tripId:r.trip_id,tripName:r.trip_name,destination:r.destination,userId:r.user_id,name:r.name,email:r.email,status:r.status,requestedAt:r.requested_at }));
}
export async function approve(tripId, requestId, approver) {
  const request = await db('join_requests').where({ id:requestId,trip_id:tripId,status:'pending' }).first();
  if (!request) throw new ApiError(404,'Join request not found or already processed.','NOT_FOUND');
  await withTransaction(async trx => {
    await trx('join_requests').where({id:requestId}).update({status:'approved'});
    await trx('trip_members').insert({trip_id:tripId,user_id:request.user_id,role:'Trip Member',status:'approved',joined_at:new Date()});
  });
  const user = await db('users').where({id:request.user_id}).first();
  await notify({tripId,actorId:approver.id,type:'Members',message:`${approver.name} approved ${user.name}'s request to join the trip`,linkSuffix:'members'});
  return {approved:true,member:{id:user.id,name:user.name,email:user.email,role:'Trip Member',joinedAt:new Date().toISOString()},request:{id:request.id,tripId,status:'approved'}};
}
export async function reject(tripId, requestId, approver) {
  const request = await db('join_requests').where({id:requestId,trip_id:tripId,status:'pending'}).first();
  if (!request) throw new ApiError(404,'Join request not found or already processed.','NOT_FOUND');
  await db('join_requests').where({id:requestId}).update({status:'rejected'});
  const user=await db('users').where({id:request.user_id}).first();
  await notify({tripId,actorId:approver.id,type:'Members',message:`${approver.name} declined a join request from ${user.name}`,linkSuffix:'members'});
  return {rejected:true,requestId};
}
export async function leave(tripId,userId) {
  const member=await db('trip_members').where({trip_id:tripId,user_id:userId}).first();
  if (!member) throw new ApiError(404,'Membership not found.','NOT_FOUND');
  if (member.role==='Trip Creator') throw new ApiError(400,'The Trip Creator cannot leave without deleting the trip.','VALIDATION_ERROR');
  await db('trip_members').where({trip_id:tripId,user_id:userId}).delete();
  return {left:true,tripId};
}
export async function remove(tripId,memberId) {
  const member=await db('trip_members').where({trip_id:tripId,user_id:memberId}).first();
  if (!member) throw new ApiError(404,'Member not found.','NOT_FOUND');
  if (member.role==='Trip Creator') throw new ApiError(400,'The Trip Creator cannot be removed.','VALIDATION_ERROR');
  await db('trip_members').where({trip_id:tripId,user_id:memberId}).delete();
  return {removed:true,memberId};
}
