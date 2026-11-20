import 'dotenv/config';

const sqlite = process.env.DB_CLIENT === 'sqlite' || !process.env.DB_CLIENT;

export default {
  client: sqlite ? 'better-sqlite3' : 'mysql2',
  connection: sqlite
    ? { filename: process.env.DB_FILENAME || './data/tripforge.sqlite' }
    : {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 3306),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      },
  migrations: { directory: './migrations', tableName: 'knex_migrations' },
  seeds: { directory: './seeds' },
  useNullAsDefault: sqlite,
  pool: { afterCreate: sqlite ? (conn, done) => {
    conn.pragma('foreign_keys = ON');
    done(null, conn);
  } : undefined },
};
