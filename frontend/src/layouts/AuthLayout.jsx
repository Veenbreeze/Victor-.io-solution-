import { Link, Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="container-pad grid min-h-screen items-center gap-12 py-10 lg:grid-cols-[1fr_480px]">
        <div>
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-600 text-lg font-black">VB</span>
            <span className="font-black uppercase tracking-wide">Victor.io Solutions</span>
          </Link>
          <h1 className="mt-12 max-w-2xl text-4xl font-black tracking-normal sm:text-6xl">
            Build smarter digital products with a team that sweats the details.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            Sign in to manage projects, services, portfolio records, users, and client inquiries.
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white p-6 text-slate-950 shadow-2xl dark:bg-slate-900 dark:text-white">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
