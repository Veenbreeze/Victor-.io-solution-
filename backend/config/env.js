import { getDatabaseConfig } from './dbEnv.js';

const requiredBaseVars = ['JWT_SECRET', 'CLIENT_URL'];
const optionalOAuthVars = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET'
];

export function validateEnv() {
  const missing = requiredBaseVars.filter((key) => !String(process.env[key] ?? '').trim());

  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  const database = getDatabaseConfig();
  const missingDatabaseVars = ['host', 'user', 'password', 'database'].filter(
    (key) => !String(database[key] ?? '').trim()
  );

  if (missingDatabaseVars.length) {
    throw new Error(
      `Missing required database configuration: ${missingDatabaseVars.join(', ')}. Provide DATABASE_URL or DB_HOST/DB_USER/DB_PASSWORD/DB_NAME.`
    );
  }

  if (process.env.NODE_ENV === 'production') {
    const missingOAuth = optionalOAuthVars.filter((key) => !String(process.env[key] ?? '').trim());
    if (missingOAuth.length) {
      console.warn(
        `[env] OAuth providers are partially configured. Missing: ${missingOAuth.join(', ')}. Social login will be disabled for these providers.`
      );
    }
  }
}

export function hasGoogleOAuth() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

export function hasGitHubOAuth() {
  return Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);
}
