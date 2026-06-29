import { pool } from '../config/db.js';

export async function listEvents() {
  const { rows } = await pool.query(
    'SELECT * FROM events ORDER BY starts_at DESC'
  );
  return rows;
}

export async function listUpcomingEvents(limit = 5) {
  const { rows } = await pool.query(
    `SELECT * FROM events
     WHERE is_active = TRUE
       AND (ends_at IS NULL OR ends_at > NOW())
     ORDER BY starts_at ASC
     LIMIT $1`,
    [limit]
  );
  return rows;
}

export async function findEventById(id) {
  const { rows } = await pool.query('SELECT * FROM events WHERE id = $1 LIMIT 1', [id]);
  return rows[0] || null;
}

export async function createEvent(payload) {
  const { rows } = await pool.query(
    `INSERT INTO events (title, description, starts_at, ends_at, location, link_url, cover_url, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      payload.title,
      payload.description || null,
      payload.starts_at,
      payload.ends_at || null,
      payload.location || null,
      payload.link_url || null,
      payload.cover_url || null,
      payload.is_active !== false
    ]
  );
  return rows[0];
}

export async function updateEvent(id, payload) {
  const fields = [];
  const values = [];
  let position = 1;

  ['title', 'description', 'starts_at', 'ends_at', 'location', 'link_url', 'cover_url', 'is_active'].forEach((field) => {
    if (payload[field] !== undefined) {
      fields.push(`${field} = $${position++}`);
      values.push(payload[field]);
    }
  });

  if (!fields.length) return findEventById(id);

  fields.push(`updated_at = NOW()`);
  values.push(id);

  const { rows } = await pool.query(
    `UPDATE events SET ${fields.join(', ')} WHERE id = $${position} RETURNING *`,
    values
  );
  return rows[0] || null;
}

export async function deleteEvent(id) {
  const result = await pool.query('DELETE FROM events WHERE id = $1', [id]);
  return result.rowCount > 0;
}
