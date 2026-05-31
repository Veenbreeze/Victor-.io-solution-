import { pool } from '../config/db.js';

const publicFields = 'id, name, email, role, created_at, updated_at';

export async function createUser({ name, email, passwordHash, role = 'user' }) {
  const [result] = await pool.execute(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, passwordHash, role]
  );
  return findUserById(result.insertId);
}

export async function findUserByEmail(email) {
  const [rows] = await pool.execute('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
  return rows[0] || null;
}

export async function findUserById(id) {
  const [rows] = await pool.execute(`SELECT ${publicFields} FROM users WHERE id = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

export async function listUsers() {
  const [rows] = await pool.execute(`SELECT ${publicFields} FROM users ORDER BY created_at DESC`);
  return rows;
}

export async function updateUser(id, payload) {
  const fields = [];
  const values = [];
  ['name', 'email', 'role'].forEach((field) => {
    if (payload[field] !== undefined) {
      fields.push(`${field} = ?`);
      values.push(payload[field]);
    }
  });

  if (!fields.length) return findUserById(id);
  values.push(id);
  await pool.execute(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
  return findUserById(id);
}

export async function deleteUser(id) {
  const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
