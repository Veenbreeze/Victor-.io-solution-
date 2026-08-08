import { pool } from '../config/db.js';

export async function invalidateResetsForUser(userId) {
  await pool.query(
    'UPDATE password_resets SET used_at = NOW() WHERE user_id = $1 AND used_at IS NULL',
    [userId]
  );
}

export async function createPasswordReset(userId, otpHash, expiresAt) {
  const { rows } = await pool.query(
    `INSERT INTO password_resets (user_id, otp_hash, expires_at)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, otpHash, expiresAt]
  );
  return rows[0];
}

export async function findActiveReset(userId) {
  const { rows } = await pool.query(
    `SELECT * FROM password_resets
     WHERE user_id = $1 AND used_at IS NULL AND expires_at > NOW()
     ORDER BY created_at DESC
     LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
}

export async function incrementResetAttempts(id) {
  await pool.query('UPDATE password_resets SET attempts = attempts + 1 WHERE id = $1', [id]);
}

export async function markResetUsed(id) {
  await pool.query('UPDATE password_resets SET used_at = NOW() WHERE id = $1', [id]);
}
