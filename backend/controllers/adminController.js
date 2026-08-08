import { getRecentActivity, getStats } from '../models/adminModel.js';
import { listAuditLogs } from '../models/auditModel.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const stats = asyncHandler(async (_req, res) => {
  res.json(await getStats());
});

export const recentActivity = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 8, 30);
  res.json(await getRecentActivity(limit));
});

export const auditLogs = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 100, 200);
  res.json(await listAuditLogs(limit));
});
