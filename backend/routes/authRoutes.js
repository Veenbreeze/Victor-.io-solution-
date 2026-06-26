import { Router } from 'express';
import passport from 'passport';
import { login, register } from '../controllers/authController.js';
import { googleCallback, githubCallback, oauthFailure } from '../controllers/oauthController.js';
import { hasGoogleOAuth, hasGitHubOAuth } from '../config/env.js';

const router = Router();

// Email/Password Authentication
router.post('/register', register);
router.post('/login', login);

// OAuth status (useful for the frontend)
router.get('/providers', (_req, res) => {
  res.json({
    google: hasGoogleOAuth(),
    github: hasGitHubOAuth()
  });
});

if (hasGoogleOAuth()) {
  router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'], session: false })
  );

  router.get(
    '/google/callback',
    passport.authenticate('google', {
      session: false,
      failureRedirect: '/api/auth/google/failure'
    }),
    googleCallback
  );

  router.get('/google/failure', (req, res) => oauthFailure(req, res, 'google'));
}

if (hasGitHubOAuth()) {
  router.get(
    '/github',
    passport.authenticate('github', { scope: ['user:email'], session: false })
  );

  router.get(
    '/github/callback',
    passport.authenticate('github', {
      session: false,
      failureRedirect: '/api/auth/github/failure'
    }),
    githubCallback
  );

  router.get('/github/failure', (req, res) => oauthFailure(req, res, 'github'));
}

export default router;
