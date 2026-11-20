import knex from 'knex';
import knexConfig from '../../knexfile.js';

const db = knex(knexConfig);

export async function withTransaction(callback) {
  return db.transaction(callback);
}

export default db;
