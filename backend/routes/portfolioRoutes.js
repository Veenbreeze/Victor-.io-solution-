import { Router } from 'express';
import {
  addPortfolio,
  editPortfolio,
  getPortfolio,
  getPortfolioItem,
  removePortfolio
} from '../controllers/portfolioController.js';
import { protect, requirePermission } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

router.get('/', getPortfolio);
router.get('/:id', getPortfolioItem);
router.post('/', protect, requirePermission('portfolio.create'), upload.single('image'), addPortfolio);
router.put('/:id', protect, requirePermission('portfolio.update'), upload.single('image'), editPortfolio);
router.delete('/:id', protect, requirePermission('portfolio.delete'), removePortfolio);

export default router;
