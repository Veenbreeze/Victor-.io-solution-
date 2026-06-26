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
  const result = await pool.query('DELETE FROM messages WHERE id = $1', [id]);
  return result.rowCount > 0;
}
