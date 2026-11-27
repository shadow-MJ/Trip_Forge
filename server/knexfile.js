import 'dotenv/config';

export default {
  client: 'better-sqlite3',
  connection: {
    filename: process.env.DB_FILENAME || './data/tripforge.sqlite',
  },
  migrations: { directory: './migrations', tableName: 'knex_migrations' },
  seeds: { directory: './seeds' },
  useNullAsDefault: true,
  pool: {
    afterCreate: (conn, done) => {
      conn.pragma('foreign_keys = ON');
      done(null, conn);
    },
  },
};
