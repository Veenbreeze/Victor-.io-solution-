import { Router } from 'express';
import { stats } from '../controllers/adminController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/stats', protect, authorize('admin'), stats);

export default router;
