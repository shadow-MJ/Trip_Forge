import db from '../config/db.js';

export const users = {
  findByEmail: (email) => db('users').whereRaw('LOWER(email) = ?', [email.toLowerCase()]).first(),
  findById: (id) => db('users').where({ id }).first(),
  insert: (row) => db('users').insert(row),
  update: (id, row) => db('users').where({ id }).update(row),
};
export const trips = {
  findById: (id) => db('trips').where({ id }).first(),
  insert: (row) => db('trips').insert(row),
  update: (id, row) => db('trips').where({ id }).update(row),
  delete: (id) => db('trips').where({ id }).delete(),
  mine: (userId) => db('trips').join('trip_members', 'trip_members.trip_id', 'trips.id')
    .where({ 'trip_members.user_id': userId, 'trip_members.status': 'approved' }),
};
