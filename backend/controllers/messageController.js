import { createMessage, deleteMessage, listMessages } from '../models/messageModel.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { cleanString, isEmail, requiredFields } from '../utils/validators.js';

export const sendMessage = asyncHandler(async (req, res) => {
  const missing = requiredFields(req.body, ['name', 'email', 'message']);
  if (missing.length) return res.status(400).json({ message: `Missing fields: ${missing.join(', ')}` });

  const email = cleanString(req.body.email).toLowerCase();
  if (!isEmail(email)) return res.status(400).json({ message: 'Please provide a valid email address' });

  const message = await createMessage({
    name: cleanString(req.body.name),
    email,
    subject: cleanString(req.body.subject || 'New inquiry'),
    message: cleanString(req.body.message)
  });

  return res.status(201).json({ message: 'Message sent successfully', data: message });
});

export const getMessages = asyncHandler(async (_req, res) => {
  res.json(await listMessages());
});

export const removeMessage = asyncHandler(async (req, res) => {
  const deleted = await deleteMessage(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Message not found' });
  return res.json({ message: 'Message deleted successfully' });
});
