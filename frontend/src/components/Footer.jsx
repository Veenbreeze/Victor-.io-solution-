import { Link } from 'react-router-dom';
import { FiGithub, FiInstagram, FiLinkedin, FiTwitter } from 'react-icons/fi';
import { Mail, MapPin } from 'lucide-react';

const quickLinks = [
  ['Home', '/'],
  ['About', '/about'],
  ['Services', '/services'],
  ['Portfolio', '/portfolio'],
  ['Contact', '/contact']
];

const socialLinks = [
  ['GitHub', FiGithub, 'https://github.com/Veenbreeze'],
  ['LinkedIn', FiLinkedin, 'https://www.linkedin.com'],
  ['Instagram', FiInstagram, 'https://www.instagram.com'],
  ['Twitter/X', FiTwitter, 'https://x.com']
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white pt-16 pb-8 dark:border-slate-800 dark:bg-slate-950">
      <div className="container-pad">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-gradient text-base font-black text-white shadow-glow">
                VIS
              </span>
              <span className="font-black uppercase tracking-wide text-slate-950 dark:text-white">
                Victor.io Solutions
              </span>
            </Link>
            <p className="mt-5 max-w-md text-sm leading-7 text-slate-600 dark:text-slate-300">
              Building digital solutions for businesses, creators, and innovators across the African
              continent and beyond.
            </p>
            <div className="mt-5 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
              <p className="flex items-center gap-2">
                <Mail size={16} className="text-brand-600" /> mpambijevictor04@gmail.com
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={16} className="text-brand-600" /> Dar es Salaam, Tanzania
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Quick Links
            </p>
            <nav className="mt-5 grid gap-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
              {quickLinks.map(([label, path]) => (
                <Link
                  key={path}
                  className="transition hover:translate-x-1 hover:text-brand-700 dark:hover:text-brand-200"
                  to={path}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-sm font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Social
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {socialLinks.map(([label, Icon, href]) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:-translate-y-1 hover:border-brand-500 hover:bg-brand-50 hover:text-brand-700 dark:border-slate-800 dark:text-slate-300 dark:hover:border-brand-400 dark:hover:bg-slate-900 dark:hover:text-brand-100"
                  aria-label={label}
                >
                  <Icon size={19} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-500 md:flex-row">
          <p>© {new Date().getFullYear()} Victor.io Solutions. All rights reserved.</p>
          <p>Crafted with attention to detail.</p>
        </div>
      </div>
    </footer>
  );
}
