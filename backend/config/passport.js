import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';

import {
  findUserByEmail,
  findUserByProvider,
  createOAuthUser,
  updateUserProvider
} from '../models/userModel.js';
import { hasGoogleOAuth, hasGitHubOAuth } from './env.js';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

async function resolveOAuthUser({ provider, providerId, displayName, email, avatar }) {
  let user = await findUserByProvider(provider, providerId);
  if (user) return user;

  if (email) {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      await updateUserProvider(existingUser.id, provider, providerId);
      return existingUser;
    }
  }

  return createOAuthUser({
    name: displayName,
    email: email || `${provider}-${providerId}@oauth.local`,
    provider,
    providerId,
    avatar
  });
}

if (hasGoogleOAuth()) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${BACKEND_URL}/api/auth/google/callback`
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const user = await resolveOAuthUser({
            provider: 'google',
            providerId: profile.id,
            displayName: profile.displayName || 'Google User',
            email: profile.emails?.[0]?.value,
            avatar: profile.photos?.[0]?.value
          });
          done(null, user);
        } catch (err) {
          done(err);
        }
      }
    )
  );
}

if (hasGitHubOAuth()) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${BACKEND_URL}/api/auth/github/callback`,
        scope: ['user:email']
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const user = await resolveOAuthUser({
            provider: 'github',
            providerId: String(profile.id),
            displayName: profile.displayName || profile.username || 'GitHub User',
            email: profile.emails?.[0]?.value,
            avatar: profile.photos?.[0]?.value
          });
          done(null, user);
        } catch (err) {
          done(err);
        }
      }
    )
  );
}

export default passport;
