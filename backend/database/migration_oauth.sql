-- Migration: Add OAuth support to existing PostgreSQL users table.
-- Safe to run multiple times.

ALTER TABLE users ADD COLUMN IF NOT EXISTS provider VARCHAR(20) DEFAULT 'email';
ALTER TABLE users ADD COLUMN IF NOT EXISTS provider_id VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT;

ALTER TABLE users ALTER COLUMN password DROP NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS users_provider_unique
  ON users (provider, provider_id)
  WHERE provider_id IS NOT NULL;
