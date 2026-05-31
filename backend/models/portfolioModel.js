import { pool } from '../config/db.js';

export async function listPortfolio() {
  const [rows] = await pool.execute('SELECT * FROM portfolio ORDER BY created_at DESC');
  return rows.map((item) => ({ ...item, technologies: JSON.parse(item.technologies || '[]') }));
}

export async function findPortfolioById(id) {
  const [rows] = await pool.execute('SELECT * FROM portfolio WHERE id = ? LIMIT 1', [id]);
  const item = rows[0] || null;
  return item ? { ...item, technologies: JSON.parse(item.technologies || '[]') } : null;
}

export async function createPortfolio({ title, description, image_url, technologies, github_url, live_url }) {
  const [result] = await pool.execute(
    'INSERT INTO portfolio (title, description, image_url, technologies, github_url, live_url) VALUES (?, ?, ?, ?, ?, ?)',
    [title, description, image_url, JSON.stringify(technologies), github_url, live_url]
  );
  return findPortfolioById(result.insertId);
}

export async function updatePortfolio(id, payload) {
  const fields = [];
  const values = [];
  ['title', 'description', 'image_url', 'github_url', 'live_url'].forEach((field) => {
    if (payload[field] !== undefined) {
      fields.push(`${field} = ?`);
      values.push(payload[field]);
    }
  });
  if (payload.technologies !== undefined) {
    fields.push('technologies = ?');
    values.push(JSON.stringify(payload.technologies));
  }

  if (!fields.length) return findPortfolioById(id);
  values.push(id);
  await pool.execute(`UPDATE portfolio SET ${fields.join(', ')} WHERE id = ?`, values);
  return findPortfolioById(id);
}

export async function deletePortfolio(id) {
  const [result] = await pool.execute('DELETE FROM portfolio WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
