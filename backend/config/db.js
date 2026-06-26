import pkg from 'pg';
import { getDatabaseConfig } from './dbEnv.js';

const { Pool } = pkg;

const config = getDatabaseConfig();
const isProduction = process.env.NODE_ENV === 'production';

export const pool = new Pool({
  host: config.host,
  port: config.port,
  user: config.user,
  password: config.password,
  database: config.database,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL pool error:', err);
});

export async function query(text, params) {
  const result = await pool.query(text, params);
  return result;
}

export default pool;
