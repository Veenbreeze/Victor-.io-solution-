import { createService, deleteService, findServiceById, listServices, updateService } from '../models/serviceModel.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { cleanString, requiredFields } from '../utils/validators.js';

const slugify = (value) =>
  cleanString(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const getServices = asyncHandler(async (_req, res) => {
  res.json(await listServices());
});

export const addService = asyncHandler(async (req, res) => {
  const missing = requiredFields(req.body, ['title', 'description']);
  if (missing.length) return res.status(400).json({ message: `Missing fields: ${missing.join(', ')}` });

  const title = cleanString(req.body.title);
  const service = await createService({
    title,
    slug: req.body.slug ? slugify(req.body.slug) : slugify(title),
    description: cleanString(req.body.description),
    icon: cleanString(req.body.icon || 'Sparkles'),
    price: cleanString(req.body.price || 'Custom quote'),
    is_featured: Boolean(req.body.is_featured)
  });

  return res.status(201).json(service);
});

export const editService = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (payload.title !== undefined) payload.title = cleanString(payload.title);
  if (payload.slug !== undefined) payload.slug = slugify(payload.slug);
  if (payload.description !== undefined) payload.description = cleanString(payload.description);
  if (payload.icon !== undefined) payload.icon = cleanString(payload.icon);
  if (payload.price !== undefined) payload.price = cleanString(payload.price);
  if (payload.is_featured !== undefined) payload.is_featured = Boolean(payload.is_featured);

  const updated = await updateService(req.params.id, payload);
  if (!updated) return res.status(404).json({ message: 'Service not found' });
  return res.json(updated);
});

export const removeService = asyncHandler(async (req, res) => {
  const deleted = await deleteService(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Service not found' });
  return res.json({ message: 'Service deleted successfully' });
});

export const getService = asyncHandler(async (req, res) => {
  const service = await findServiceById(req.params.id);
  if (!service) return res.status(404).json({ message: 'Service not found' });
  return res.json(service);
});
