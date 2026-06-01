import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Generate JWT token for authenticated user
 */
function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Create auth payload with token and user data
 */
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

/**
 * Google OAuth Callback Handler
 * Called after Google redirects back with auth code
 */
export const googleCallback = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.redirect(`${process.env.CLIENT_URL}/login?error=google_auth_failed`);
  }

  const payload = authPayload(req.user);
  const token = payload.token;
  const userJson = encodeURIComponent(JSON.stringify(payload.user));

  // Redirect to frontend with token and user data in URL params
  return res.redirect(
    `${process.env.CLIENT_URL}/auth-callback?token=${token}&user=${userJson}&provider=google`
  );
});

/**
 * GitHub OAuth Callback Handler
 * Called after GitHub redirects back with auth code
 */
export const githubCallback = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.redirect(`${process.env.CLIENT_URL}/login?error=github_auth_failed`);
  }

  const payload = authPayload(req.user);
  const token = payload.token;
  const userJson = encodeURIComponent(JSON.stringify(payload.user));

  // Redirect to frontend with token and user data in URL params
  return res.redirect(
    `${process.env.CLIENT_URL}/auth-callback?token=${token}&user=${userJson}&provider=github`
  );
});

/**
 * OAuth failure handler
 */
export const oauthFailure = asyncHandler(async (req, res) => {
  const provider = req.params.provider || 'oauth';
  return res.redirect(`${process.env.CLIENT_URL}/login?error=${provider}_auth_failed`);
});
