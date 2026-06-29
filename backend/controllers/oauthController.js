import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function authPayload(user) {
  return {
    token: signToken(user),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      provider: user.provider
    }
  };
}

function redirectWithSession(res, payload, provider) {
  const userJson = encodeURIComponent(JSON.stringify(payload.user));
  return res.redirect(
    `${process.env.CLIENT_URL}/auth-callback?token=${payload.token}&user=${userJson}&provider=${provider}`
  );
}

export const googleCallback = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.redirect(`${process.env.CLIENT_URL}/login?error=google_auth_failed`);
  }
  return redirectWithSession(res, authPayload(req.user), 'google');
});

export const githubCallback = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.redirect(`${process.env.CLIENT_URL}/login?error=github_auth_failed`);
  }
  return redirectWithSession(res, authPayload(req.user), 'github');
});

export const oauthFailure = asyncHandler(async (req, res, providerOverride) => {
  const provider = providerOverride || req.params.provider || 'oauth';
  return res.redirect(`${process.env.CLIENT_URL}/login?error=${provider}_auth_failed`);
});
