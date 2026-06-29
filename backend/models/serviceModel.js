import { pool } from '../config/db.js';

export async function listServices() {
  const { rows } = await pool.query('SELECT * FROM services ORDER BY created_at DESC');
  return rows;
}

export async function findServiceById(id) {
  const { rows } = await pool.query('SELECT * FROM services WHERE id = $1 LIMIT 1', [id]);
  return rows[0] || null;
}

export async function createService({ title, slug, description, icon, price, is_featured = false }) {
  const { rows } = await pool.query(
    `INSERT INTO services (title, slug, description, icon, price, is_featured)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [title, slug, description, icon, price, is_featured]
  );
  return rows[0];
}

export async function updateService(id, payload) {
  const fields = [];
  const values = [];
  let position = 1;

  ['title', 'slug', 'description', 'icon', 'price', 'is_featured'].forEach((field) => {
    if (payload[field] !== undefined) {
      fields.push(`${field} = $${position++}`);
      values.push(payload[field]);
    }
  });

  if (!fields.length) return findServiceById(id);

  fields.push(`updated_at = NOW()`);
  values.push(id);

  const { rows } = await pool.query(
    `UPDATE services SET ${fields.join(', ')} WHERE id = $${position} RETURNING *`,
    values
  );
  return rows[0] || null;
}

export async function deleteService(id) {
  const result = await pool.query('DELETE FROM services WHERE id = $1', [id]);
  return result.rowCount > 0;
}
