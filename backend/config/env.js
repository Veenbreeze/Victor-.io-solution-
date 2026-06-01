import { getDatabaseConfig } from './dbEnv.js';

const requiredBaseVars = ['PORT', 'JWT_SECRET', 'CLIENT_URL'];
const optionalOAuthVars = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET'];
const requiredProductionVars = [...requiredBaseVars, ...optionalOAuthVars];

export function validateEnv() {
  const isProduction = process.env.NODE_ENV === 'production';
  const requiredVars = isProduction ? requiredProductionVars : requiredBaseVars;
  const missing = requiredVars.filter((key) => !String(process.env[key] ?? '').trim());

  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  const database = getDatabaseConfig();
  const missingDatabaseVars = ['host', 'user', 'password', 'database'].filter((key) => !String(database[key] ?? '').trim());

  if (missingDatabaseVars.length) {
    throw new Error(`Missing required database configuration: ${missingDatabaseVars.join(', ')}`);
  }

  if (isProduction && database.host === 'mysql.railway.internal') {
    throw new Error('Render cannot use mysql.railway.internal. Use the Railway public host from MYSQL_PUBLIC_URL instead.');
  }
}
