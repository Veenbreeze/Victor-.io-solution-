import { pool } from '../config/db.js';

export async function createMessage({ name, email, subject, message }) {
  const { rows } = await pool.query(
    `INSERT INTO messages (name, email, subject, message)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, email, subject, message]
  );
  return rows[0];
}

export async function listMessages() {
  const { rows } = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
  return rows;
}

export async function deleteMessage(id) {
  const { rows } = await pool.query('DELETE FROM messages WHERE id = $1 RETURNING *', [id]);
  return rows[0] || null;
}

export async function updateMessageStatus(id, status) {
  const { rows } = await pool.query(
    `UPDATE messages SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [status, id]
  );
  return rows[0] || null;
}
