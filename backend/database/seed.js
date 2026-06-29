import '../config/loadEnv.js';
import bcrypt from 'bcryptjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from '../config/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(__dirname, 'database.sql');

async function seed() {
  console.log('Applying schema...');
  const sql = await fs.readFile(schemaPath, 'utf8');
  await pool.query(sql);

  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@veenbreeze.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'AdminPass123';
  const adminName = process.env.SEED_ADMIN_NAME || 'Veenbreeze Admin';

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, 'admin')
     ON CONFLICT (email) DO UPDATE SET role = 'admin', password = EXCLUDED.password`,
    [adminName, adminEmail, passwordHash]
  );

  console.log(`Seed complete. Admin login: ${adminEmail} / ${adminPassword}`);
  await pool.end();
}

seed().catch(async (err) => {
  console.error('Seed failed:', err);
  await pool.end();
  process.exit(1);
});
