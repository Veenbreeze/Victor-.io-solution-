import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { createUser, findUserByEmail, updateUserPassword } from '../models/userModel.js';
import {
  createPasswordReset,
  findActiveReset,
  incrementResetAttempts,
  invalidateResetsForUser,
  markResetUsed
} from '../models/passwordResetModel.js';
import { sendOtpEmail } from '../utils/emailService.js';
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
  if (existing) {
    const message =
      existing.provider && existing.provider !== 'email'
        ? `This email is already linked to a ${
            existing.provider === 'google' ? 'Google' : existing.provider === 'github' ? 'GitHub' : 'social'
          } account. Sign in with that provider, or use "Forgot password" to set a password for it.`
        : 'Email is already registered';
    return res.status(409).json({ message });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  // role is intentionally never taken from the request body: this is a public,
  // unauthenticated endpoint, so honoring a client-supplied role would let anyone
  // self-register as admin. Role changes must go through the admin-only
  // PUT /api/users/:id endpoint.
  const user = await createUser({ name, email, passwordHash, role: 'user' });

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

const OTP_TTL_MINUTES = 10;
const OTP_MAX_ATTEMPTS = 5;

function generateOtp() {
  return String(crypto.randomInt(0, 1000000)).padStart(6, '0');
}

// Always resolves to the same generic response so the endpoint can't be used
// to enumerate which emails are registered.
const GENERIC_RESET_RESPONSE = { message: 'If an account exists for that email, a reset code has been sent.' };

export const forgotPassword = asyncHandler(async (req, res) => {
  const email = cleanString(req.body.email).toLowerCase();
  if (!isEmail(email)) return res.status(400).json({ message: 'Please provide a valid email address' });

  const user = await findUserByEmail(email);
  if (!user) return res.json(GENERIC_RESET_RESPONSE);

  // Accounts created or linked via OAuth can still request an OTP here to set
  // a password — otherwise a user whose Google/GitHub sign-in silently created
  // an account (e.g. after a redirect failure) would have no way to get in.
  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  await invalidateResetsForUser(user.id);
  await createPasswordReset(user.id, otpHash, expiresAt);

  sendOtpEmail(user.email, user.name, otp).catch((err) => console.error('Failed to send OTP email:', err.message));

  return res.json(GENERIC_RESET_RESPONSE);
});

export const resetPassword = asyncHandler(async (req, res) => {
  const missing = requiredFields(req.body, ['email', 'otp', 'newPassword']);
  if (missing.length) return res.status(400).json({ message: `Missing fields: ${missing.join(', ')}` });

  const email = cleanString(req.body.email).toLowerCase();
  const otp = cleanString(req.body.otp);
  const newPassword = String(req.body.newPassword);

  if (newPassword.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' });

  const invalidResponse = { message: 'That code is invalid or has expired.' };

  const user = await findUserByEmail(email);
  if (!user) return res.status(400).json(invalidResponse);

  const reset = await findActiveReset(user.id);
  if (!reset) return res.status(400).json(invalidResponse);

  if (reset.attempts >= OTP_MAX_ATTEMPTS) {
    return res.status(429).json({ message: 'Too many attempts. Please request a new code.' });
  }

  const matches = await bcrypt.compare(otp, reset.otp_hash);
  if (!matches) {
    await incrementResetAttempts(reset.id);
    return res.status(400).json(invalidResponse);
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await updateUserPassword(user.id, passwordHash);
  await markResetUsed(reset.id);

  return res.json({ message: 'Password updated. You can now log in.' });
});
