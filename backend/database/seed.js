import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { pool } from '../config/db.js';

dotenv.config();

await pool.execute(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`);

await pool.execute(`
  CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(160) NOT NULL,
    slug VARCHAR(180) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon VARCHAR(80) DEFAULT 'Sparkles',
    price VARCHAR(80) DEFAULT 'Custom quote',
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`);

await pool.execute(`
  CREATE TABLE IF NOT EXISTS portfolio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(180) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    technologies JSON NOT NULL,
    github_url VARCHAR(500),
    live_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`);

await pool.execute(`
  CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL,
    subject VARCHAR(180) DEFAULT 'New inquiry',
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'archived') NOT NULL DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`);

await pool.execute(
  `INSERT INTO services (title, slug, description, icon, price, is_featured) VALUES
  ('Web Development', 'web-development', 'Fast, responsive websites and web apps built for conversion, SEO, and long-term maintainability.', 'Globe2', 'From $600', TRUE),
  ('System Development', 'system-development', 'Custom operational systems, dashboards, workflow automations, and secure business platforms.', 'ServerCog', 'From $1,200', TRUE),
  ('Django Solutions', 'django-solutions', 'Robust Python and Django backends, APIs, admin panels, and integrations.', 'Code2', 'From $900', FALSE),
  ('PHP Solutions', 'php-solutions', 'Modern PHP applications, Laravel-style architecture, maintenance, and legacy upgrades.', 'Braces', 'From $700', FALSE),
  ('Graphic Design', 'graphic-design', 'Premium visual identity, marketing assets, social kits, and polished brand collateral.', 'Palette', 'From $120', FALSE),
  ('CV Writing', 'cv-writing', 'ATS-friendly CVs, resumes, LinkedIn refreshes, and professional profile positioning.', 'FileText', 'From $45', FALSE),
  ('Social Media Management', 'social-media-management', 'Content calendars, campaign assets, scheduling, analytics, and growth support.', 'Megaphone', 'From $250/mo', TRUE),
  ('Coding Tutoring', 'coding-tutoring', 'Practical one-on-one coaching for web development, databases, and project delivery.', 'GraduationCap', 'From $25/hr', FALSE),
  ('Freelancing Services', 'freelancing-services', 'Proposal writing, portfolio setup, client communication, and delivery systems for freelancers.', 'BriefcaseBusiness', 'From $80', FALSE)
  ON DUPLICATE KEY UPDATE title = VALUES(title)`
);

await pool.execute(
  `INSERT INTO portfolio (title, description, image_url, technologies, github_url, live_url) VALUES
  ('SaaS Analytics Dashboard', 'A secure KPI dashboard with role-aware reporting and real-time business insights.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80', JSON_ARRAY('React', 'Node.js', 'MySQL'), 'https://github.com/veenbreeze/analytics-dashboard', 'https://example.com'),
  ('Creative Agency Website', 'A high-converting agency website with polished motion, service funnels, and CMS-ready sections.', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80', JSON_ARRAY('React', 'TailwindCSS', 'Framer Motion'), 'https://github.com/veenbreeze/agency-site', 'https://example.com'),
  ('Student Learning Portal', 'A Django learning portal with progress tracking, content modules, and admin publishing workflows.', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80', JSON_ARRAY('Django', 'MySQL', 'Bootstrap'), 'https://github.com/veenbreeze/learning-portal', 'https://example.com')
  ON DUPLICATE KEY UPDATE title = VALUES(title)`
);

const passwordHash = await bcrypt.hash('AdminPass123', 12);

await pool.execute(
  'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE role = VALUES(role)',
  ['Veenbreeze Admin', 'admin@veenbreeze.com', passwordHash, 'admin']
);

console.log('Seed complete. Admin login: admin@veenbreeze.com / AdminPass123');
await pool.end();
