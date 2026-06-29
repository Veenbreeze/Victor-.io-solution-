import { Router } from 'express';
import {
  addEvent,
  editEvent,
  getEvent,
  getEvents,
  getUpcomingEvents,
  removeEvent
} from '../controllers/eventController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/upcoming', getUpcomingEvents);
router.get('/', getEvents);
router.get('/:id', getEvent);
router.post('/', protect, authorize('admin'), addEvent);
router.put('/:id', protect, authorize('admin'), editEvent);
router.delete('/:id', protect, authorize('admin'), removeEvent);

export default router;
