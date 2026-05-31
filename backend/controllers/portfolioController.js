import {
  createPortfolio,
  deletePortfolio,
  findPortfolioById,
  listPortfolio,
  updatePortfolio
} from '../models/portfolioModel.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { cleanString, parseJsonArray, requiredFields } from '../utils/validators.js';

function imageFromRequest(req) {
  if (req.file) return `/uploads/${req.file.filename}`;
  return cleanString(req.body.image_url || req.body.image || '');
}

export const getPortfolio = asyncHandler(async (_req, res) => {
  res.json(await listPortfolio());
});

export const addPortfolio = asyncHandler(async (req, res) => {
  const missing = requiredFields(req.body, ['title', 'description']);
  if (missing.length) return res.status(400).json({ message: `Missing fields: ${missing.join(', ')}` });

  const item = await createPortfolio({
    title: cleanString(req.body.title),
    description: cleanString(req.body.description),
    image_url: imageFromRequest(req),
    technologies: parseJsonArray(req.body.technologies),
    github_url: cleanString(req.body.github_url),
    live_url: cleanString(req.body.live_url)
  });

  return res.status(201).json(item);
});

export const editPortfolio = asyncHandler(async (req, res) => {
  const payload = {};
  ['title', 'description', 'github_url', 'live_url'].forEach((field) => {
    if (req.body[field] !== undefined) payload[field] = cleanString(req.body[field]);
  });
  if (req.file || req.body.image_url || req.body.image) payload.image_url = imageFromRequest(req);
  if (req.body.technologies !== undefined) payload.technologies = parseJsonArray(req.body.technologies);

  const updated = await updatePortfolio(req.params.id, payload);
  if (!updated) return res.status(404).json({ message: 'Portfolio item not found' });
  return res.json(updated);
});

export const removePortfolio = asyncHandler(async (req, res) => {
  const deleted = await deletePortfolio(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Portfolio item not found' });
  return res.json({ message: 'Portfolio item deleted successfully' });
});

export const getPortfolioItem = asyncHandler(async (req, res) => {
  const item = await findPortfolioById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Portfolio item not found' });
  return res.json(item);
});
