import { Router } from 'express';
import { editMessageStatus, getMessages, removeMessage, sendMessage } from '../controllers/messageController.js';
import { protect, requirePermission } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/contact', sendMessage);
router.get('/messages', protect, requirePermission('messages.view'), getMessages);
router.put('/messages/:id/status', protect, requirePermission('messages.update'), editMessageStatus);
router.delete('/messages/:id', protect, requirePermission('messages.delete'), removeMessage);

export default router;
