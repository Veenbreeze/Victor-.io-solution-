import { Router } from 'express';
import { editUser, getUser, getUsers, removeUser } from '../controllers/userController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);
router.get('/', authorize('admin'), getUsers);
router.get('/:id', getUser);
router.put('/:id', authorize('admin'), editUser);
router.delete('/:id', authorize('admin'), removeUser);

export default router;
