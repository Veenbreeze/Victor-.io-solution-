import { Link, Outlet } from 'react-router-dom';
import { ShieldCheck, Sparkles, Zap } from 'lucide-react';

const highlights = [
  { icon: ShieldCheck, label: 'Secure JWT + OAuth sessions' },
  { icon: Zap, label: 'Real-time admin dashboards' },
  { icon: Sparkles, label: 'Premium digital studio tooling' }
];

export default function AuthLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-mesh opacity-90" />
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-slate-950/60 to-slate-950/95" />

      <div className="container-pad relative grid min-h-screen items-center gap-12 py-10 lg:grid-cols-[1.05fr_460px]">
        <div className="hidden lg:block">
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="clay-bubble h-12 w-12 text-lg">VIS</span>
            <span className="font-black uppercase tracking-wide">Victor.io Solutions</span>
          </Link>

          <h1 className="mt-14 max-w-2xl text-5xl font-black tracking-tight sm:text-6xl">
            Build smarter digital products with a team that{' '}
            <span className="gradient-text">sweats the details.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            Sign in to manage projects, services, portfolio records, users, and client inquiries from
            one polished workspace.
          </p>

          <ul className="mt-10 grid max-w-md gap-4">
            {highlights.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-sm font-semibold text-slate-200">
                <span className="flex h-10 w-10 items-center justify-center rounded-clay-sm bg-white/10 text-brand-200 shadow-clay-sm">
                  <Icon size={18} />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="clay rounded-clay-lg p-6 text-slate-950 dark:text-white sm:p-8">
          <Link
            to="/"
            className="mb-6 flex items-center gap-3 lg:hidden"
            aria-label="Victor.io Solutions"
          >
            <span className="clay-bubble h-10 w-10 text-sm">VIS</span>
            <span className="font-black uppercase tracking-wide text-slate-950 dark:text-white">
              Victor.io Solutions
            </span>
          </Link>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
