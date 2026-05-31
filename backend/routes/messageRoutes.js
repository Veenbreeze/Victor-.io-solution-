import { Router } from 'express';
import { getMessages, removeMessage, sendMessage } from '../controllers/messageController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/contact', sendMessage);
router.get('/messages', protect, authorize('admin'), getMessages);
router.delete('/messages/:id', protect, authorize('admin'), removeMessage);

export default router;
