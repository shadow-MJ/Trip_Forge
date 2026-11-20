import { z } from 'zod';
import db from '../config/db.js';
import ApiError from '../utils/apiError.js';
import { newId } from '../utils/ids.js';
import { bdToPaise, paiseToBd } from '../utils/money.js';
import { notify } from '../utils/notify.js';

async function assertCanManage(tripId, row, user) {
  const member = await db('trip_members').where({ trip_id: tripId, user_id: user.id, status: 'approved' }).first();
  if (row.created_by !== user.id && member?.role !== 'Trip Creator') throw new ApiError(403, 'You can only edit or delete your own content.', 'FORBIDDEN');
}

export const activitySchema=z.object({day:z.coerce.number().int().positive(),title:z.string().trim().min(1),
 time:z.string().optional().default('09:00'),location:z.string().optional().default(''),cost:z.coerce.number().nonnegative().optional().default(0),notes:z.string().optional().default('')});
export function safeActivity(r){return {id:r.id,day:r.day_number,title:r.title,time:r.time,location:r.location,cost:paiseToBd(r.cost_paise),notes:r.notes};}
export async function list(tripId){return (await db('activities').where({trip_id:tripId}).orderBy([{column:'day_number',order:'asc'},{column:'sort_order',order:'asc'}])).map(safeActivity);}
export async function add(tripId,input,user){
 await db('itinerary_days').insert({id:newId('day'),trip_id:tripId,day_number:input.day,created_at:new Date()}).onConflict(['trip_id','day_number']).ignore();
 const row={id:newId('act'),trip_id:tripId,day_number:input.day,title:input.title,time:input.time,location:input.location,cost_paise:bdToPaise(input.cost),notes:input.notes,sort_order:await db('activities').where({trip_id:tripId,day_number:input.day}).count({c:'*'}).first().then(r=>Number(r.c||0)),created_by:user.id};
 await db('activities').insert(row); await notify({tripId,actorId:user.id,type:'Itinerary',message:`${user.name} added "${row.title}" to Day ${row.day_number}`,linkSuffix:'itinerary'}); return safeActivity(row);
}
export async function update(tripId,id,input,user){
 const row=await db('activities').where({trip_id:tripId,id}).first(); if(!row) throw new ApiError(404,'Activity not found.','NOT_FOUND');
 await assertCanManage(tripId,row,user);
 await db('activities').where({id}).update({...(input.day!==undefined?{day_number:input.day}:{}),...(input.title!==undefined?{title:input.title}:{}),...(input.time!==undefined?{time:input.time}:{}),...(input.location!==undefined?{location:input.location}:{}),...(input.cost!==undefined?{cost_paise:bdToPaise(input.cost)}:{}),...(input.notes!==undefined?{notes:input.notes}:{})});
 await notify({tripId,actorId:user.id,type:'Itinerary',message:`${user.name} updated itinerary item "${input.title||row.title}"`,linkSuffix:'itinerary'});
 return safeActivity({...row,...input.day?{day_number:input.day}:{},...input.title?{title:input.title}:{},...input.time?{time:input.time}:{},...input.location!==undefined?{location:input.location}:{},...input.cost!==undefined?{cost_paise:bdToPaise(input.cost)}:{},...input.notes!==undefined?{notes:input.notes}:{}});
}
export async function remove(tripId,id,user){const row=await db('activities').where({trip_id:tripId,id}).first();if(!row)throw new ApiError(404,'Activity not found.','NOT_FOUND');await assertCanManage(tripId,row,user);await db('activities').where({id}).delete();await notify({tripId,actorId:user.id,type:'Itinerary',message:`${user.name} deleted "${row.title}" from the itinerary`,linkSuffix:'itinerary'});return {deleted:true,id};}
export async function reorder(tripId,day,id,direction){
 const rows=await db('activities').where({trip_id:tripId,day_number:day}).orderBy('sort_order','asc');
 const idx=rows.findIndex(r=>r.id===id); if(idx<0)return rows.map(safeActivity);
 const swap=direction==='up'?idx-1:idx+1;if(swap<0||swap>=rows.length)return rows.map(safeActivity);
 await db.transaction(async trx=>{await trx('activities').where({id:rows[idx].id}).update({sort_order:swap});await trx('activities').where({id:rows[swap].id}).update({sort_order:idx});});
 return (await db('activities').where({trip_id:tripId,day_number:day}).orderBy('sort_order','asc')).map(safeActivity);
}
