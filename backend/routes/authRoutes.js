import { Router } from 'express';
import passport from 'passport';
import { login, register } from '../controllers/authController.js';
import { googleCallback, githubCallback, oauthFailure } from '../controllers/oauthController.js';

const router = Router();

// Email/Password Authentication
router.post('/register', register);
router.post('/login', login);

// Google OAuth
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/auth/google/failure'
  }),
  googleCallback
);

// GitHub OAuth
router.get(
  '/github',
  passport.authenticate('github', {
    scope: ['user:email'],
    session: false
  })
);

router.get(
  '/github/callback',
  passport.authenticate('github', {
    session: false,
    failureRedirect: '/auth/github/failure'
  }),
  githubCallback
);

// OAuth failure handlers
router.get('/google/failure', (req, res) =>
  oauthFailure(req, res, 'google')
);
router.get('/github/failure', (req, res) =>
  oauthFailure(req, res, 'github')
);

export default router;
