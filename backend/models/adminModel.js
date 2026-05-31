import { pool } from '../config/db.js';

export async function getStats() {
  const [[users]] = await pool.execute('SELECT COUNT(*) AS total FROM users');
  const [[services]] = await pool.execute('SELECT COUNT(*) AS total FROM services');
  const [[portfolio]] = await pool.execute('SELECT COUNT(*) AS total FROM portfolio');
  const [[messages]] = await pool.execute('SELECT COUNT(*) AS total FROM messages');

  return {
    users: users.total,
    services: services.total,
    portfolio: portfolio.total,
    messages: messages.total
  };
}
