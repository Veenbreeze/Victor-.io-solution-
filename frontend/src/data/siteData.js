import { image } from 'framer-motion/client';
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
    price: 'From Tsh. 600,000'
  },
  {
    title: 'System Development',
    icon: ServerCog,
    description: 'Secure business systems for workflows, reporting, operations, and internal productivity.',
    price: 'From Tsh. 1,200,000'
  },
  {
    title: 'Django Solutions',
    icon: Code2,
    description: 'Python backends, APIs, admin panels, automation tools, and maintainable Django products.',
    price: 'From Tsh. 900,000'
  },
  {
    title: 'PHP Solutions',
    icon: Braces,
    description: 'Modern PHP applications, maintenance, migrations, and production support.',
    price: 'From Tsh. 700,000'
  },
  {
    title: 'Graphic Design',
    icon: Palette,
    description: 'Brand assets, social visuals, pitch decks, posters, and premium campaign design.',
    price: 'From Tsh. 120,000'
  },
  {
    title: 'CV Writing',
    icon: FileText,
    description: 'ATS-friendly CVs, resumes, cover letters, and LinkedIn positioning.',
    price: 'From Tsh. 45,000'
  },
  {
    title: 'Social Media Management',
    icon: Megaphone,
    description: 'Content systems, creative calendars, analytics, campaign execution, and growth support.',
    price: 'From Tsh. 250,000/mo'
  },
  {
    title: 'Coding Tutoring',
    icon: GraduationCap,
    description: 'Practical coaching in frontend, backend, databases, portfolio work, and freelancing delivery.',
    price: 'From Tsh. 25,000/hr'
  },
  {
    title: 'Freelancing Services',
    icon: BriefcaseBusiness,
    description: 'Portfolio setup, proposal systems, client communication, and delivery workflows.',
    price: 'From Tsh. 80,000'
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
    title: 'Abode Harmony',
    description: 'A modern property management platform that streamlines rental operations, tenant communication, and maintenance tracking for property owners and managers..',
    image_url: 'https://images.pexels.com/photos/20296321/pexels-photo-20296321.jpeg',
    technologies: ['Vite', 'TailwindCSS', 'Framer Motion'],
    github_url: 'https://github.com/veenbreeze/abode-harmony',
    live_url: 'https://example.com'
  },
  {
    title: 'Hospital Management System',
    description: 'A comprehensive system for managing hospital operations, patient records, and staff schedules.',
    image_url: 'https://images.pexels.com/photos/6129681/pexels-photo-6129681.jpeg',
    technologies: ['Django', 'MySQL', 'Bootstrap'],
    github_url: 'https://github.com/veenbreeze/hospital-management-system',
    live_url: 'https://example.com'
  }
];

export const pricingPlans = [
  {
    name: 'Launch',
    price: 'Tsh. 499,000',
    description: 'For personal brands and small businesses moving fast.',
    features: ['5-page website', 'Responsive design', 'Contact form', 'Basic SEO', '2 weeks support']
  },
  {
    name: 'Growth',
    price: 'Tsh. 1,250,000',
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
    name: 'Zakia N.',
    role: 'Founder, Goldfy company',
    image: 'src/assets/zakia.jpeg',
    quote:
      'Victor turned a rough idea into a polished platform that our customers understood immediately.'
  },
  {
    name: 'David M.',
    role: 'Operations Lead',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    quote:
      'The dashboard helped our team replace spreadsheets with a system we actually trust every day.'
  },
  {
    name: 'Britney N.',
    role: 'Freelance Designer',
    image: 'src/assets/britney.jpeg',
    quote:
      'Their CV and portfolio support helped me present my work with confidence and win better clients.'
  }
];