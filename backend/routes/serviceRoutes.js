import { Router } from 'express';
import { addService, editService, getService, getServices, removeService } from '../controllers/serviceController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getServices);
router.get('/:id', getService);
router.post('/', protect, authorize('admin'), addService);
router.put('/:id', protect, authorize('admin'), editService);
router.delete('/:id', protect, authorize('admin'), removeService);

export default router;
