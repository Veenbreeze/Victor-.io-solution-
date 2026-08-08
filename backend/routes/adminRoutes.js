import { Router } from 'express';
import { auditLogs, recentActivity, stats } from '../controllers/adminController.js';
import { protect, requirePermission } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/stats', protect, requirePermission('reports.view'), stats);
router.get('/activity', protect, requirePermission('reports.view'), recentActivity);
router.get('/audit-logs', protect, requirePermission('audit.view'), auditLogs);

export default router;
