import { getStats } from '../models/adminModel.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const stats = asyncHandler(async (_req, res) => {
  res.json(await getStats());
});
