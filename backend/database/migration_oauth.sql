-- Migration: Add OAuth support to users table
-- Run this on existing databases to add OAuth columns

USE veenbreeze_solutions;

-- Add provider column if it doesn't exist
ALTER TABLE users ADD COLUMN provider VARCHAR(20) DEFAULT 'email' AFTER password;

-- Add provider_id column if it doesn't exist
ALTER TABLE users ADD COLUMN provider_id VARCHAR(255) AFTER provider;

-- Add avatar column if it doesn't exist
ALTER TABLE users ADD COLUMN avatar VARCHAR(500) AFTER provider_id;

-- Make password nullable (for OAuth users)
ALTER TABLE users MODIFY password VARCHAR(255) NULL;

-- Add unique constraint for provider_id
ALTER TABLE users ADD CONSTRAINT unique_provider_id UNIQUE (provider, provider_id);

-- Verify migration
SELECT 'OAuth migration completed successfully' as status;
SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'veenbreeze_solutions' AND TABLE_NAME = 'users';
