import { config } from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '..', '.env');

const result = config({ path: envPath });

if (result.error && process.env.NODE_ENV !== 'production') {
  console.warn(`[env] Could not load ${envPath}: ${result.error.message}`);
}
