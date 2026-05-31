import { pool } from '../config/db.js';

export async function createMessage({ name, email, subject, message }) {
  const [result] = await pool.execute(
    'INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
    [name, email, subject, message]
  );
  const [rows] = await pool.execute('SELECT * FROM messages WHERE id = ? LIMIT 1', [result.insertId]);
  return rows[0];
}

export async function listMessages() {
  const [rows] = await pool.execute('SELECT * FROM messages ORDER BY created_at DESC');
  return rows;
}

export async function deleteMessage(id) {
  const [result] = await pool.execute('DELETE FROM messages WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
