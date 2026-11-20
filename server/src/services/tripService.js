import { z } from 'zod';
import db, { withTransaction } from '../config/db.js';
import ApiError from '../utils/apiError.js';
import { newId } from '../utils/ids.js';
import { generateInviteCode } from '../utils/inviteCode.js';
import { bdToPaise, paiseToBd } from '../utils/money.js';
import { notify } from '../utils/notify.js';

export const tripSchema = z.object({
  name: z.string().trim().min(1), destination: z.string().trim().min(1),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  budget: z.coerce.number().nonnegative().optional().default(0), description: z.string().optional().default(''),
});
export function safeTrip(row) {
  return { id: row.id, name: row.name, destination: row.destination, startDate: row.start_date,
    endDate: row.end_date, budget: paiseToBd(row.budget_paise), description: row.description,
    inviteCode: row.invite_code, createdBy: row.created_by,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
    coordinates: row.latitude != null ? { lat: Number(row.latitude), lng: Number(row.longitude) } : null };
}
export async function enrichTrip(tripId, userId) {
  const trip = await db('trips').where({ id: tripId }).first();
  if (!trip) throw new ApiError(404, 'Trip not found.', 'NOT_FOUND');
  const memberRows = await db('trip_members').join('users','users.id','trip_members.user_id')
    .where({ 'trip_members.trip_id': tripId, 'trip_members.status': 'approved' })
    .select('users.id','users.name','users.email','trip_members.role','trip_members.joined_at');
  const membership = memberRows.find(m => m.id === userId);
  if (!membership) throw new ApiError(403, 'You do not have access to this private trip workspace.', 'FORBIDDEN');
  const expenses = await db('expenses').where({ trip_id: tripId }).sum({ total: 'amount_paise' }).first();
  const itineraryCount = await db('activities').where({ trip_id: tripId }).count({ count: '*' }).first();
  const pendingCount = await db('join_requests').where({ trip_id: tripId, status: 'pending' }).count({ count: '*' }).first();
  return { ...safeTrip(trip), memberCount: memberRows.length,
    membersPreview: memberRows.slice(0,4).map(m => ({ id: m.id, name: m.name })),
    activityCount: Number(itineraryCount.count || 0),
    totalSpent: paiseToBd(expenses.total || 0), userRole: membership.role,
    pendingRequestsCount: Number(pendingCount.count || 0) };
}
export async function createTrip(input, user) {
  if (input.endDate < input.startDate) throw new ApiError(400, 'End date must be on or after start date.', 'VALIDATION_ERROR');
  const id = newId('trip');
  const now = new Date();
  await withTransaction(async trx => {
    await trx('trips').insert({ id, name: input.name, destination: input.destination, start_date: input.startDate,
      end_date: input.endDate, budget_paise: bdToPaise(input.budget), description: input.description,
      invite_code: generateInviteCode(input.destination), created_by: user.id, created_at: now });
    await trx('trip_members').insert({ trip_id: id, user_id: user.id, role: 'Trip Creator', status: 'approved', joined_at: now });
    const start = new Date(`${input.startDate}T00:00:00Z`);
    const end = new Date(`${input.endDate}T00:00:00Z`);
    const days = Math.round((end - start) / 86400000) + 1;
    for (let day = 1; day <= days; day++) await trx('itinerary_days').insert({ id: newId('day'), trip_id: id, day_number: day, created_at: now });
  });
  return enrichTrip(id, user.id);
}
export async function listTrips(userId) {
  const rows = await db('trips').join('trip_members','trip_members.trip_id','trips.id')
    .where({ 'trip_members.user_id': userId, 'trip_members.status': 'approved' }).select('trips.*');
  return Promise.all(rows.map(r => enrichTrip(r.id, userId)));
}
export async function updateTrip(tripId, input) {
  const current = await db('trips').where({ id: tripId }).first();
  const start = input.startDate ?? current.start_date, end = input.endDate ?? current.end_date;
  if (end < start) throw new ApiError(400, 'End date must be on or after start date.', 'VALIDATION_ERROR');
  await db('trips').where({ id: tripId }).update({
    ...(input.name !== undefined ? { name: input.name } : {}),
    ...(input.destination !== undefined ? { destination: input.destination } : {}),
    ...(input.startDate !== undefined ? { start_date: input.startDate } : {}),
    ...(input.endDate !== undefined ? { end_date: input.endDate } : {}),
    ...(input.budget !== undefined ? { budget_paise: bdToPaise(input.budget) } : {}),
    ...(input.description !== undefined ? { description: input.description } : {}),
  });
  return enrichTrip(tripId, current.created_by);
}
