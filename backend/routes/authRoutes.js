import { Router } from 'express';
import passport from 'passport';
import { login, register } from '../controllers/authController.js';
import { googleCallback, githubCallback, oauthFailure } from '../controllers/oauthController.js';
import { hasGoogleOAuth, hasGitHubOAuth } from '../config/env.js';

const router = Router();

// Email/Password Authentication
router.post('/register', register);
router.post('/login', login);

router.get('/providers', (_req, res) => {
  res.json({ google: hasGoogleOAuth(), github: hasGitHubOAuth() });
});

// ---- Google OAuth ----
router.get('/google', (req, res, next) => {
  if (!hasGoogleOAuth()) {
    return res.redirect(`${process.env.CLIENT_URL}/login?error=google_not_configured`);
  }
  return passport.authenticate('google', { scope: ['profile', 'email'], session: false })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
  if (!hasGoogleOAuth()) {
    return res.redirect(`${process.env.CLIENT_URL}/login?error=google_not_configured`);
  }
  return passport.authenticate('google', {
    session: false,
    failureRedirect: '/api/auth/google/failure'
  })(req, res, next);
}, googleCallback);

router.get('/google/failure', (req, res) => oauthFailure(req, res, 'google'));

// ---- GitHub OAuth ----
router.get('/github', (req, res, next) => {
  if (!hasGitHubOAuth()) {
    return res.redirect(`${process.env.CLIENT_URL}/login?error=github_not_configured`);
  }
  return passport.authenticate('github', { scope: ['user:email'], session: false })(req, res, next);
});

router.get('/github/callback', (req, res, next) => {
  if (!hasGitHubOAuth()) {
    return res.redirect(`${process.env.CLIENT_URL}/login?error=github_not_configured`);
  }
  return passport.authenticate('github', {
    session: false,
    failureRedirect: '/api/auth/github/failure'
  })(req, res, next);
}, githubCallback);

router.get('/github/failure', (req, res) => oauthFailure(req, res, 'github'));

export default router;
