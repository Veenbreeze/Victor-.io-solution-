import {
  BriefcaseBusiness,
  Braces,
  Code2,
  FileText,
  Globe2,
  GraduationCap,
  Megaphone,
  Palette,
  ServerCog
} from 'lucide-react';

export const services = [
  {
    title: 'Web Development',
    icon: Globe2,
    description: 'Conversion-focused websites, dashboards, and apps with polished UX and clean engineering.',
    price: 'From $600'
  },
  {
    title: 'System Development',
    icon: ServerCog,
    description: 'Secure business systems for workflows, reporting, operations, and internal productivity.',
    price: 'From $1,200'
  },
  {
    title: 'Django Solutions',
    icon: Code2,
    description: 'Python backends, APIs, admin panels, automation tools, and maintainable Django products.',
    price: 'From $900'
  },
  {
    title: 'PHP Solutions',
    icon: Braces,
    description: 'Modern PHP applications, maintenance, migrations, and production support.',
    price: 'From $700'
  },
  {
    title: 'Graphic Design',
    icon: Palette,
    description: 'Brand assets, social visuals, pitch decks, posters, and premium campaign design.',
    price: 'From $120'
  },
  {
    title: 'CV Writing',
    icon: FileText,
    description: 'ATS-friendly CVs, resumes, cover letters, and LinkedIn positioning.',
    price: 'From $45'
  },
  {
    title: 'Social Media Management',
    icon: Megaphone,
    description: 'Content systems, creative calendars, analytics, campaign execution, and growth support.',
    price: 'From $250/mo'
  },
  {
    title: 'Coding Tutoring',
    icon: GraduationCap,
    description: 'Practical coaching in frontend, backend, databases, portfolio work, and freelancing delivery.',
    price: 'From $25/hr'
  },
  {
    title: 'Freelancing Services',
    icon: BriefcaseBusiness,
    description: 'Portfolio setup, proposal systems, client communication, and delivery workflows.',
    price: 'From $80'
  }
];

export const portfolioItems = [
  {
    title: 'SaaS Analytics Dashboard',
    description: 'A role-aware KPI dashboard for executives and operations teams.',
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    technologies: ['React', 'Node.js', 'MySQL'],
    github_url: 'https://github.com/veenbreeze/analytics-dashboard',
    live_url: 'https://example.com'
  },
  {
    title: 'Creative Agency Website',
    description: 'A polished services website with motion, lead capture, and admin-managed content.',
    image_url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    technologies: ['Vite', 'TailwindCSS', 'Framer Motion'],
    github_url: 'https://github.com/veenbreeze/agency-site',
    live_url: 'https://example.com'
  },
  {
    title: 'Student Learning Portal',
    description: 'An education portal with progress tracking, modules, and instructor controls.',
    image_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    technologies: ['Django', 'MySQL', 'Bootstrap'],
    github_url: 'https://github.com/veenbreeze/learning-portal',
    live_url: 'https://example.com'
  }
];

export const pricingPlans = [
  {
    name: 'Launch',
    price: '$499',
    description: 'For personal brands and small businesses moving fast.',
    features: ['5-page website', 'Responsive design', 'Contact form', 'Basic SEO', '2 weeks support']
  },
  {
    name: 'Growth',
    price: '$1,250',
    description: 'For teams that need systems, content, and stronger workflows.',
    features: ['Custom web app', 'Dashboard pages', 'Auth integration', 'Database setup', 'Priority support'],
    featured: true
  },
  {
    name: 'Scale',
    price: 'Custom',
    description: 'For production systems, admin panels, and long-term technical partnership.',
    features: ['System architecture', 'Admin controls', 'Integrations', 'Cloud deployment', 'Retainer option']
  }
];

export const testimonials = [
  {
    name: 'Amina K.',
    role: 'Founder, Retail Studio',
    quote: 'Veenbreeze turned a rough idea into a polished platform that our customers understood immediately.'
  },
  {
    name: 'David M.',
    role: 'Operations Lead',
    quote: 'The dashboard helped our team replace spreadsheets with a system we actually trust every day.'
  },
  {
    name: 'Grace N.',
    role: 'Freelance Designer',
    quote: 'Their CV and portfolio support helped me present my work with confidence and win better clients.'
  }
];
