-- =========================
-- DATABASE (Render PostgreSQL)
-- =========================
-- NOTE: kwenye Render tayari DB yako ipo, kwa hiyo SKIP CREATE DATABASE
-- endelea tu na tables

-- =========================
-- USERS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) UNIQUE NOT NULL,
  password VARCHAR(255),

  provider VARCHAR(20) DEFAULT 'email',
  provider_id VARCHAR(255),

  avatar TEXT,

  role VARCHAR(20) DEFAULT 'user',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- SERVICES TABLE
-- =========================
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  title VARCHAR(160) NOT NULL,
  slug VARCHAR(180) UNIQUE NOT NULL,
  description TEXT NOT NULL,

  icon VARCHAR(80) DEFAULT 'Sparkles',
  price VARCHAR(80) DEFAULT 'Custom quote',

  is_featured BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- PORTFOLIO TABLE
-- =========================
CREATE TABLE IF NOT EXISTS portfolio (
  id SERIAL PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  description TEXT NOT NULL,

  image_url TEXT,

  technologies JSONB,

  github_url TEXT,
  live_url TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- MESSAGES TABLE
-- =========================
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  subject VARCHAR(180) DEFAULT 'New inquiry',
  message TEXT NOT NULL,

  status VARCHAR(20) DEFAULT 'new',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- SAMPLE DATA (SERVICES)
-- =========================
INSERT INTO services (title, slug, description, icon, price, is_featured)
VALUES
('Web Development', 'web-development', 'Fast responsive websites and web apps.', 'Globe2', 'From $600', TRUE),
('System Development', 'system-development', 'Custom dashboards and business systems.', 'ServerCog', 'From $1200', TRUE),
('Django Solutions', 'django-solutions', 'Python Django APIs and backend systems.', 'Code2', 'From $900', FALSE),
('PHP Solutions', 'php-solutions', 'Modern PHP applications and maintenance.', 'Braces', 'From $700', FALSE),
('Graphic Design', 'graphic-design', 'Branding and marketing visuals.', 'Palette', 'From $120', FALSE),
('Social Media Management', 'social-media-management', 'Content and growth strategy.', 'Megaphone', 'From $250/mo', TRUE)
ON CONFLICT (slug) DO NOTHING;

-- =========================
-- SAMPLE DATA (PORTFOLIO)
-- =========================
INSERT INTO portfolio (title, description, image_url, technologies, github_url, live_url)
VALUES
(
'SaaS Dashboard',
'Analytics dashboard with real-time insights.',
'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
'["React","Node.js","PostgreSQL"]',
'https://github.com/example/dashboard',
'https://example.com'
),
(
'Agency Website',
'Modern animated agency website.',
'https://images.unsplash.com/photo-1497366754035-f200968a6e72',
'["React","Tailwind"]',
'https://github.com/example/agency',
'https://example.com'
)
ON CONFLICT DO NOTHING;