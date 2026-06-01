import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { getDatabaseConfig } from './dbEnv.js';

dotenv.config();

const database = getDatabaseConfig();

export const pool = mysql.createPool({
  host: database.host,
  port: database.port,
  user: database.user,
  password: database.password,
  database: database.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  namedPlaceholders: true
});

export async function pingDatabase() {
  const connection = await pool.getConnection();
  try {
    await connection.ping();
  } finally {
    connection.release();
  }
}
