import { pool } from '../config/db.js';

export async function getStats() {
  const [usersRes, servicesRes, portfolioRes, messagesRes] = await Promise.all([
    pool.query('SELECT COUNT(*)::int AS total FROM users'),
    pool.query('SELECT COUNT(*)::int AS total FROM services'),
    pool.query('SELECT COUNT(*)::int AS total FROM portfolio'),
    pool.query('SELECT COUNT(*)::int AS total FROM messages')
  ]);

  return {
    users: usersRes.rows[0].total,
    services: servicesRes.rows[0].total,
    portfolio: portfolioRes.rows[0].total,
    messages: messagesRes.rows[0].total
  };
}
