import { pool } from '../config/db.js';

const publicFields = 'id, name, email, role, avatar, provider, created_at, updated_at';

export async function createUser({ name, email, passwordHash, role = 'user' }) {
  const [result] = await pool.execute(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, passwordHash, role]
  );
  return findUserById(result.insertId);
}

/**
 * Create user via OAuth (no password required)
 */
export async function createOAuthUser({ name, email, provider, providerId, avatar, role = 'user' }) {
  const [result] = await pool.execute(
    'INSERT INTO users (name, email, provider, provider_id, avatar, role) VALUES (?, ?, ?, ?, ?, ?)',
    [name, email, provider, providerId, avatar, role]
  );
  return findUserById(result.insertId);
}

/**
 * Find user by OAuth provider and provider ID
 */
export async function findUserByProvider(provider, providerId) {
  const [rows] = await pool.execute(
    `SELECT ${publicFields} FROM users WHERE provider = ? AND provider_id = ? LIMIT 1`,
    [provider, providerId]
  );
  return rows[0] || null;
}

/**
 * Update user with OAuth provider info (for account linking)
 */
export async function updateUserProvider(id, provider, providerId) {
  const [result] = await pool.execute(
    'UPDATE users SET provider = ?, provider_id = ? WHERE id = ?',
    [provider, providerId, id]
  );
  return findUserById(id);
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
