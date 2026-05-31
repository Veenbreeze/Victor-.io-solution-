import { pool } from '../config/db.js';

export async function listServices() {
  const [rows] = await pool.execute('SELECT * FROM services ORDER BY created_at DESC');
  return rows;
}

export async function findServiceById(id) {
  const [rows] = await pool.execute('SELECT * FROM services WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

export async function createService({ title, slug, description, icon, price, is_featured = false }) {
  const [result] = await pool.execute(
    'INSERT INTO services (title, slug, description, icon, price, is_featured) VALUES (?, ?, ?, ?, ?, ?)',
    [title, slug, description, icon, price, is_featured]
  );
  return findServiceById(result.insertId);
}

export async function updateService(id, payload) {
  const fields = [];
  const values = [];
  ['title', 'slug', 'description', 'icon', 'price', 'is_featured'].forEach((field) => {
    if (payload[field] !== undefined) {
      fields.push(`${field} = ?`);
      values.push(payload[field]);
    }
  });

  if (!fields.length) return findServiceById(id);
  values.push(id);
  await pool.execute(`UPDATE services SET ${fields.join(', ')} WHERE id = ?`, values);
  return findServiceById(id);
}

export async function deleteService(id) {
  const [result] = await pool.execute('DELETE FROM services WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
