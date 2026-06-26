import { pool } from '../config/db.js';

function normalizePortfolio(item) {
  if (!item) return item;
  let technologies = item.technologies;

  if (technologies && typeof technologies === 'string') {
    try {
      technologies = JSON.parse(technologies);
    } catch {
      technologies = [];
    }
  }

  return { ...item, technologies: Array.isArray(technologies) ? technologies : [] };
}

export async function listPortfolio() {
  const { rows } = await pool.query('SELECT * FROM portfolio ORDER BY created_at DESC');
  return rows.map(normalizePortfolio);
}

export async function findPortfolioById(id) {
  const { rows } = await pool.query('SELECT * FROM portfolio WHERE id = $1 LIMIT 1', [id]);
  return rows[0] ? normalizePortfolio(rows[0]) : null;
}

export async function createPortfolio({ title, description, image_url, technologies, github_url, live_url }) {
  const { rows } = await pool.query(
    `INSERT INTO portfolio (title, description, image_url, technologies, github_url, live_url)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [title, description, image_url, JSON.stringify(technologies || []), github_url, live_url]
  );
  return normalizePortfolio(rows[0]);
}

export async function updatePortfolio(id, payload) {
  const fields = [];
  const values = [];
  let position = 1;

  ['title', 'description', 'image_url', 'github_url', 'live_url'].forEach((field) => {
    if (payload[field] !== undefined) {
      fields.push(`${field} = $${position++}`);
      values.push(payload[field]);
    }
  });

  if (payload.technologies !== undefined) {
    fields.push(`technologies = $${position++}`);
    values.push(JSON.stringify(payload.technologies));
  }

  if (!fields.length) return findPortfolioById(id);

  fields.push(`updated_at = NOW()`);
  values.push(id);

  const { rows } = await pool.query(
    `UPDATE portfolio SET ${fields.join(', ')} WHERE id = $${position} RETURNING *`,
    values
  );
  return rows[0] ? normalizePortfolio(rows[0]) : null;
}

export async function deletePortfolio(id) {
  const result = await pool.query('DELETE FROM portfolio WHERE id = $1', [id]);
  return result.rowCount > 0;
}
