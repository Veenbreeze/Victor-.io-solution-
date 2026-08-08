import { deleteUser, findUserById, listUsers, updateUser } from '../models/userModel.js';
import { recordAudit } from '../models/auditModel.js';
import { ROLES } from '../config/permissions.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { cleanString, isEmail } from '../utils/validators.js';

export const getUsers = asyncHandler(async (_req, res) => {
  res.json(await listUsers());
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await findUserById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json(user);
});

export const editUser = asyncHandler(async (req, res) => {
  const payload = {};
  if (req.body.name !== undefined) payload.name = cleanString(req.body.name);
  if (req.body.email !== undefined) {
    payload.email = cleanString(req.body.email).toLowerCase();
    if (!isEmail(payload.email)) return res.status(400).json({ message: 'Please provide a valid email address' });
  }
  if (req.body.role !== undefined) {
    if (!ROLES.includes(req.body.role)) return res.status(400).json({ message: 'Invalid role' });
    if (req.params.id === String(req.user.id) && req.body.role !== req.user.role) {
      return res.status(400).json({ message: 'You cannot change your own role' });
    }
    payload.role = req.body.role;
  }

  const updated = await updateUser(req.params.id, payload);
  if (!updated) return res.status(404).json({ message: 'User not found' });

  await recordAudit({
    actor: req.user,
    action: 'UPDATE',
    entityType: 'user',
    entityId: updated.id,
    entityLabel: updated.name,
    changes: payload
  });

  return res.json(updated);
});

export const removeUser = asyncHandler(async (req, res) => {
  const deleted = await deleteUser(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'User not found' });

  await recordAudit({
    actor: req.user,
    action: 'DELETE',
    entityType: 'user',
    entityId: deleted.id,
    entityLabel: deleted.name
  });

  return res.json({ message: 'User deleted successfully' });
});
