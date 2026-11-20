import db from '../config/db.js';
import { newId } from './ids.js';

export async function notify({ tripId, actorId, type, message, linkSuffix = 'overview' }) {
  const members = await db('trip_members').join('trips', 'trips.id', 'trip_members.trip_id')
    .where({ 'trip_members.trip_id': tripId, 'trip_members.status': 'approved' })
    .select('trip_members.user_id');
  const rows = members.filter((m) => m.user_id !== actorId).map((m) => ({
    id: newId('notif'), trip_id: tripId, user_id: m.user_id,
    category: type, message, link: `/trips/${tripId}/${linkSuffix}`, is_read: false,
    created_at: new Date(),
  }));
  if (rows.length) await db('notifications').insert(rows);
  await db('trip_updates').insert({
    id: newId('upd'), trip_id: tripId, text: message,
    created_at: new Date(),
  });
}
