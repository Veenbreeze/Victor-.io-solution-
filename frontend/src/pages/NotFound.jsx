import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-center text-white">
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-brand-100">404</p>
        <h1 className="mt-4 text-4xl font-black tracking-normal">Page not found</h1>
        <p className="mt-4 text-slate-300">The page you requested does not exist.</p>
        <Link to="/" className="btn-primary mt-8">
          Return home
        </Link>
      </div>
    </section>
  );
}
