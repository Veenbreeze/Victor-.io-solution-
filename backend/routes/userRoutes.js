import { Router } from 'express';
import { editUser, getUser, getUsers, removeUser } from '../controllers/userController.js';
import { protect, requirePermission } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.get('/me', (req, res) => res.json(req.user));
router.get('/', requirePermission('users.view'), getUsers);
router.get('/:id', requirePermission('users.view'), getUser);
router.put('/:id', requirePermission('users.update'), editUser);
router.delete('/:id', requirePermission('users.delete'), removeUser);

export default router;
