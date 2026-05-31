import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { pool } from '../config/db.js';

dotenv.config();

const passwordHash = await bcrypt.hash('AdminPass123', 12);

await pool.execute(
  'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE role = VALUES(role)',
  ['Veenbreeze Admin', 'admin@veenbreeze.com', passwordHash, 'admin']
);

console.log('Seed complete. Admin login: admin@veenbreeze.com / AdminPass123');
await pool.end();
