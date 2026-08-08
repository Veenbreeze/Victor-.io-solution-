import { pool } from '../config/db.js';

export async function getStats() {
  const [usersRes, servicesRes, portfolioRes, messagesRes, newMessagesRes, eventsRes] = await Promise.all([
    pool.query('SELECT COUNT(*)::int AS total FROM users'),
    pool.query('SELECT COUNT(*)::int AS total FROM services'),
    pool.query('SELECT COUNT(*)::int AS total FROM portfolio'),
    pool.query('SELECT COUNT(*)::int AS total FROM messages'),
    pool.query("SELECT COUNT(*)::int AS total FROM messages WHERE status = 'new'"),
    pool.query('SELECT COUNT(*)::int AS total FROM events WHERE is_active = TRUE')
  ]);

  return {
    users: usersRes.rows[0].total,
    services: servicesRes.rows[0].total,
    portfolio: portfolioRes.rows[0].total,
    messages: messagesRes.rows[0].total,
    newMessages: newMessagesRes.rows[0].total,
    activeEvents: eventsRes.rows[0].total
  };
}

export async function getRecentActivity(limit = 8) {
  const { rows } = await pool.query(
    `SELECT * FROM (
       SELECT id, 'message' AS type, name AS title, created_at FROM messages
       UNION ALL
       SELECT id, 'service' AS type, title, created_at FROM services
       UNION ALL
       SELECT id, 'portfolio' AS type, title, created_at FROM portfolio
       UNION ALL
       SELECT id, 'event' AS type, title, created_at FROM events
       UNION ALL
       SELECT id, 'user' AS type, name AS title, created_at FROM users
     ) activity
     ORDER BY created_at DESC
     LIMIT $1`,
    [limit]
  );
  return rows;
}
