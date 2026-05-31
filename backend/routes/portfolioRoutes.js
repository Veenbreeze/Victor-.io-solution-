import { Router } from 'express';
import {
  addPortfolio,
  editPortfolio,
  getPortfolio,
  getPortfolioItem,
  removePortfolio
} from '../controllers/portfolioController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

router.get('/', getPortfolio);
router.get('/:id', getPortfolioItem);
router.post('/', protect, authorize('admin'), upload.single('image'), addPortfolio);
router.put('/:id', protect, authorize('admin'), upload.single('image'), editPortfolio);
router.delete('/:id', protect, authorize('admin'), removePortfolio);

export default router;
