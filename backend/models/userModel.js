import { pool } from '../config/db.js';

const publicFields = 'id, name, email, role, avatar, provider, created_at, updated_at';

export async function createUser({ name, email, passwordHash, role = 'user' }) {
  const { rows } = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING ${publicFields}`,
    [name, email, passwordHash, role]
  );
  return rows[0];
}

export async function createOAuthUser({ name, email, provider, providerId, avatar = null, role = 'user' }) {
  const { rows } = await pool.query(
    `INSERT INTO users (name, email, provider, provider_id, avatar, role)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING ${publicFields}`,
    [name, email, provider, providerId, avatar, role]
  );
  return rows[0];
}

export async function findUserByProvider(provider, providerId) {
  const { rows } = await pool.query(
    `SELECT ${publicFields} FROM users WHERE provider = $1 AND provider_id = $2 LIMIT 1`,
    [provider, providerId]
  );
  return rows[0] || null;
}

export async function updateUserProvider(id, provider, providerId) {
  await pool.query(
    'UPDATE users SET provider = $1, provider_id = $2, updated_at = NOW() WHERE id = $3',
    [provider, providerId, id]
  );
  return findUserById(id);
}

export async function findUserByEmail(email) {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
  return rows[0] || null;
}

export async function findUserById(id) {
  const { rows } = await pool.query(
    `SELECT ${publicFields} FROM users WHERE id = $1 LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

export async function listUsers() {
  const { rows } = await pool.query(
    `SELECT ${publicFields} FROM users ORDER BY created_at DESC`
  );
  return rows;
}

export async function updateUser(id, payload) {
  const fields = [];
  const values = [];
  let position = 1;

  ['name', 'email', 'role'].forEach((field) => {
    if (payload[field] !== undefined) {
      fields.push(`${field} = $${position++}`);
      values.push(payload[field]);
    }
  });

  if (!fields.length) return findUserById(id);

  fields.push(`updated_at = NOW()`);
  values.push(id);

  await pool.query(
    `UPDATE users SET ${fields.join(', ')} WHERE id = $${position}`,
    values
  );

  return findUserById(id);
}

export async function deleteUser(id) {
  const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
  return result.rowCount > 0;
}
