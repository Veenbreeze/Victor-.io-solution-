import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';

import {
  findUserByEmail,
  findUserByProvider,
  createOAuthUser,
  updateUserProvider
} from '../models/userModel.js';

const BACKEND_URL =
  process.env.BACKEND_URL || 'http://localhost:5000';

/* =========================
   GOOGLE STRATEGY
========================= */

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      callbackURL: `${BACKEND_URL}/api/auth/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
      try {

        const email = profile.emails?.[0]?.value;
        const providerId = profile.id;

        let user = await findUserByProvider('google', providerId);

        if (user) return done(null, user);

        if (email) {
          const existingUser = await findUserByEmail(email);

          if (existingUser) {
            await updateUserProvider(
              existingUser.id,
              'google',
              providerId
            );

            return done(null, existingUser);
          }
        }

        const newUser = await createOAuthUser({
          name: profile.displayName || 'Google User',
          email:
            email ||
            `google-${providerId}@oauth.local`,
          provider: 'google',
          providerId,
          avatar: profile.photos?.[0]?.value
        });

        done(null, newUser);

      } catch (err) {
        done(err);
      }
    }
  )
);

/* =========================
   GITHUB STRATEGY
========================= */

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,

      callbackURL: `${BACKEND_URL}/api/auth/github/callback`,

      scope: ['user:email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {

        const email = profile.emails?.[0]?.value;
        const providerId = profile.id.toString();

        let user = await findUserByProvider(
          'github',
          providerId
        );

        if (user) return done(null, user);

        if (email) {

          const existingUser =
            await findUserByEmail(email);

          if (existingUser) {

            await updateUserProvider(
              existingUser.id,
              'github',
              providerId
            );

            return done(null, existingUser);
          }
        }

        const newUser = await createOAuthUser({
          name:
            profile.displayName ||
            profile.username ||
            'GitHub User',

          email:
            email ||
            `github-${providerId}@oauth.local`,

          provider: 'github',
          providerId,
          avatar: profile.photos?.[0]?.value
        });

        done(null, newUser);

      } catch (err) {
        done(err);
      }
    }
  )
);

export default passport;