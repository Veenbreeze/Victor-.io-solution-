import { pool } from '../config/db.js';

export async function recordAudit({ actor, action, entityType, entityId, entityLabel, changes }) {
  try {
    await pool.query(
      `INSERT INTO audit_logs (actor_id, actor_name, action, entity_type, entity_id, entity_label, changes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        actor?.id ?? null,
        actor?.name ?? 'Unknown',
        action,
        entityType,
        entityId != null ? String(entityId) : null,
        entityLabel ?? null,
        changes ? JSON.stringify(changes) : null
      ]
    );
  } catch (err) {
    // Audit logging must never block the underlying business operation.
    console.error('Failed to record audit log:', err.message);
  }
}

export async function listAuditLogs(limit = 100) {
  const { rows } = await pool.query(
    'SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT $1',
    [Math.min(limit, 200)]
  );
  return rows;
}
