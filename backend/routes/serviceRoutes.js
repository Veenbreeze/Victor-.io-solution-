import { Router } from 'express';
import { addService, editService, getService, getServices, removeService } from '../controllers/serviceController.js';
import { protect, requirePermission } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getServices);
router.get('/:id', getService);
router.post('/', protect, requirePermission('services.create'), addService);
router.put('/:id', protect, requirePermission('services.update'), editService);
router.delete('/:id', protect, requirePermission('services.delete'), removeService);

export default router;
