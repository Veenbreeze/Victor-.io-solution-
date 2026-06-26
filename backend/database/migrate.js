import '../config/loadEnv.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from '../config/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(__dirname, 'database.sql');

async function migrate() {
  const sql = await fs.readFile(schemaPath, 'utf8');
  console.log('Running schema migration...');
  await pool.query(sql);
  console.log('Migration complete.');
  await pool.end();
}

migrate().catch(async (err) => {
  console.error('Migration failed:', err);
  await pool.end();
  process.exit(1);
});
