import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 text-center text-white">
      <div className="absolute inset-0 bg-mesh opacity-70" />
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="relative">
        <p className="text-sm font-bold uppercase tracking-widest text-brand-200">404</p>
        <h1 className="mt-4 text-5xl font-black tracking-tight sm:text-7xl">
          <span className="gradient-text">Page not found</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-slate-300">
          The page you requested does not exist or has moved. Let's get you back on track.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-primary">
            <Home size={18} /> Return home
          </Link>
          <Link to="/contact" className="btn-secondary border-white/20 bg-white/10 text-white hover:text-white">
            <ArrowLeft size={18} /> Contact support
          </Link>
        </div>
      </div>
    </section>
  );
}
