import db from '../config/db.js';
import ApiError from '../utils/apiError.js';
import { generateInviteCode } from '../utils/inviteCode.js';
import { notify } from '../utils/notify.js';
import { ok } from '../utils/response.js';
import * as memberService from '../services/memberService.js';

export async function requestJoinByCode(req, res) {
  return ok(res, await memberService.joinByCode(req.validated.inviteCode, req.user));
}

export async function listMyJoinRequests(req, res) {
  const rows = await db('join_requests')
    .join('trips', 'trips.id', 'join_requests.trip_id')
    .join('users', 'users.id', 'join_requests.user_id')
    .where({ 'join_requests.user_id': req.user.id, 'join_requests.status': 'pending' })
    .select(
      'join_requests.*',
      'trips.name as trip_name',
      'trips.destination',
      'users.name',
      'users.email'
    );

  return ok(
    res,
    rows.map((x) => ({
      id: x.id,
      tripId: x.trip_id,
      tripName: x.trip_name,
      destination: x.destination,
      userId: x.user_id,
      name: x.name,
      email: x.email,
      status: x.status,
      requestedAt: x.requested_at,
    }))
  );
}

export async function cancelMyJoinRequest(req, res) {
  const deleted = await db('join_requests')
    .where({ id: req.params.requestId, user_id: req.user.id, status: 'pending' })
    .delete();

  if (!deleted) {
    throw new ApiError(404, 'Pending join request not found or already cancelled.', 'NOT_FOUND');
  }
  return ok(res, { canceled: true, request: { id: req.params.requestId } });
}

export async function listMembers(req, res) {
  return ok(res, await memberService.members(req.params.tripId));
}

export async function listPendingJoinRequests(req, res) {
  return ok(res, await memberService.pending(req.params.tripId));
}

export async function approveJoinRequest(req, res) {
  return ok(res, await memberService.approve(req.params.tripId, req.params.requestId, req.user));
}

export async function rejectJoinRequest(req, res) {
  return ok(res, await memberService.reject(req.params.tripId, req.params.requestId, req.user));
}

export async function regenerateInviteCode(req, res) {
  const trip = await db('trips').where({ id: req.params.tripId }).first();
  if (!trip) throw new ApiError(404, 'Trip not found.', 'NOT_FOUND');
  const code = generateInviteCode(trip.destination);
  await db('trips').where({ id: req.params.tripId }).update({ invite_code: code });
  await notify({
    tripId: req.params.tripId,
    actorId: req.user.id,
    type: 'Members',
    message: `${req.user.name} refreshed the trip invite code`,
    linkSuffix: 'members',
  });
  return ok(res, { inviteCode: code });
}

export async function removeMember(req, res) {
  return ok(res, await memberService.remove(req.params.tripId, req.params.memberId));
}

export async function leaveTrip(req, res) {
  return ok(res, await memberService.leave(req.params.tripId, req.user.id));
}
