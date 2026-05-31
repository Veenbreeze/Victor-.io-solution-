import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from '../models/userModel.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { cleanString, isEmail, requiredFields } from '../utils/validators.js';

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function authPayload(user) {
  return {
    token: signToken(user),
    user
  };
}

export const register = asyncHandler(async (req, res) => {
  const missing = requiredFields(req.body, ['name', 'email', 'password']);
  if (missing.length) return res.status(400).json({ message: `Missing fields: ${missing.join(', ')}` });

  const name = cleanString(req.body.name);
  const email = cleanString(req.body.email).toLowerCase();
  const password = String(req.body.password);

  if (!isEmail(email)) return res.status(400).json({ message: 'Please provide a valid email address' });
  if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' });

  const existing = await findUserByEmail(email);
  if (existing) return res.status(409).json({ message: 'Email is already registered' });

  const passwordHash = await bcrypt.hash(password, 12);
  const role = req.body.role === 'admin' ? 'admin' : 'user';
  const user = await createUser({ name, email, passwordHash, role });

  return res.status(201).json(authPayload(user));
});

export const login = asyncHandler(async (req, res) => {
  const missing = requiredFields(req.body, ['email', 'password']);
  if (missing.length) return res.status(400).json({ message: `Missing fields: ${missing.join(', ')}` });

  const email = cleanString(req.body.email).toLowerCase();
  const user = await findUserByEmail(email);
  if (!user) return res.status(401).json({ message: 'Invalid email or password' });

  const matches = await bcrypt.compare(String(req.body.password), user.password);
  if (!matches) return res.status(401).json({ message: 'Invalid email or password' });

  delete user.password;
  return res.json(authPayload(user));
});
