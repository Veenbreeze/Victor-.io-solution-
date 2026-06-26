import {
  createEvent,
  deleteEvent,
  findEventById,
  listEvents,
  listUpcomingEvents,
  updateEvent
} from '../models/eventModel.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { cleanString, requiredFields } from '../utils/validators.js';

function parseDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function normalizeBody(body) {
  return {
    title: cleanString(body.title),
    description: body.description !== undefined ? cleanString(body.description) : undefined,
    starts_at: body.starts_at !== undefined ? parseDate(body.starts_at) : undefined,
    ends_at: body.ends_at !== undefined ? parseDate(body.ends_at) : undefined,
    location: body.location !== undefined ? cleanString(body.location) : undefined,
    link_url: body.link_url !== undefined ? cleanString(body.link_url) : undefined,
    cover_url: body.cover_url !== undefined ? cleanString(body.cover_url) : undefined,
    is_active:
      body.is_active === undefined
        ? undefined
        : body.is_active === false || body.is_active === 'false'
          ? false
          : Boolean(body.is_active)
  };
}

export const getEvents = asyncHandler(async (_req, res) => {
  res.json(await listEvents());
});

export const getUpcomingEvents = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 5, 20);
  res.json(await listUpcomingEvents(limit));
});

export const getEvent = asyncHandler(async (req, res) => {
  const event = await findEventById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  return res.json(event);
});

export const addEvent = asyncHandler(async (req, res) => {
  const missing = requiredFields(req.body, ['title', 'starts_at']);
  if (missing.length) return res.status(400).json({ message: `Missing fields: ${missing.join(', ')}` });

  const payload = normalizeBody(req.body);
  if (!payload.starts_at) return res.status(400).json({ message: 'Invalid starts_at date' });

  const event = await createEvent(payload);
  return res.status(201).json(event);
});

export const editEvent = asyncHandler(async (req, res) => {
  const payload = normalizeBody(req.body);
  const updated = await updateEvent(req.params.id, payload);
  if (!updated) return res.status(404).json({ message: 'Event not found' });
  return res.json(updated);
});

export const removeEvent = asyncHandler(async (req, res) => {
  const deleted = await deleteEvent(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Event not found' });
  return res.json({ message: 'Event deleted successfully' });
});
