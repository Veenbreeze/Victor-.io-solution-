import { Router } from 'express';
import {
  addEvent,
  editEvent,
  getEvent,
  getEvents,
  getUpcomingEvents,
  removeEvent
} from '../controllers/eventController.js';
import { protect, requirePermission } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/upcoming', getUpcomingEvents);
router.get('/', getEvents);
router.get('/:id', getEvent);
router.post('/', protect, requirePermission('events.create'), addEvent);
router.put('/:id', protect, requirePermission('events.update'), editEvent);
router.delete('/:id', protect, requirePermission('events.delete'), removeEvent);

export default router;
