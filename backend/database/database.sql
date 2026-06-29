-- =========================
-- PostgreSQL Schema (Render-ready)
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

CREATE UNIQUE INDEX IF NOT EXISTS users_provider_unique
  ON users (provider, provider_id)
  WHERE provider_id IS NOT NULL;

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

CREATE TABLE IF NOT EXISTS portfolio (
  id SERIAL PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  technologies JSONB DEFAULT '[]'::jsonb,
  github_url TEXT,
  live_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  description TEXT,
  starts_at TIMESTAMP NOT NULL,
  ends_at TIMESTAMP,
  location VARCHAR(180),
  link_url TEXT,
  cover_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS events_active_starts_idx ON events (is_active, starts_at);

INSERT INTO services (title, slug, description, icon, price, is_featured) VALUES
  ('Web Development', 'web-development', 'Fast, responsive websites and web apps built for conversion, SEO, and long-term maintainability.', 'Globe2', 'From Tsh. 600,000', TRUE),
  ('System Development', 'system-development', 'Custom operational systems, dashboards, workflow automations, and secure business platforms.', 'ServerCog', 'From Tsh. 1,200,000', TRUE),
  ('Django Solutions', 'django-solutions', 'Robust Python and Django backends, APIs, admin panels, and integrations.', 'Code2', 'From Tsh. 900,000', FALSE),
  ('PHP Solutions', 'php-solutions', 'Modern PHP applications, Laravel-style architecture, maintenance, and legacy upgrades.', 'Braces', 'From Tsh. 700,000', FALSE),
  ('Graphic Design', 'graphic-design', 'Premium visual identity, marketing assets, social kits, and polished brand collateral.', 'Palette', 'From Tsh. 120,000', FALSE),
  ('CV Writing', 'cv-writing', 'ATS-friendly CVs, resumes, LinkedIn refreshes, and professional profile positioning.', 'FileText', 'From Tsh. 45,000', FALSE),
  ('Social Media Management', 'social-media-management', 'Content calendars, campaign assets, scheduling, analytics, and growth support.', 'Megaphone', 'From Tsh. 250,000/mo', TRUE),
  ('Coding Tutoring', 'coding-tutoring', 'Practical one-on-one coaching for web development, databases, and project delivery.', 'GraduationCap', 'From Tsh. 25,000/hr', FALSE),
  ('Freelancing Services', 'freelancing-services', 'Proposal writing, portfolio setup, client communication, and delivery systems.', 'BriefcaseBusiness', 'From Tsh. 80,000', FALSE)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO portfolio (title, description, image_url, technologies, github_url, live_url) VALUES
  (
    'SaaS Analytics Dashboard',
    'A secure KPI dashboard with role-aware reporting and real-time business insights.',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    '["React","Node.js","PostgreSQL"]'::jsonb,
    'https://github.com/veenbreeze/analytics-dashboard',
    'https://example.com'
  ),
  (
    'Creative Agency Website',
    'A high-converting agency website with polished motion, service funnels, and CMS-ready sections.',
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    '["React","TailwindCSS","Framer Motion"]'::jsonb,
    'https://github.com/veenbreeze/agency-site',
    'https://example.com'
  )
ON CONFLICT DO NOTHING;
