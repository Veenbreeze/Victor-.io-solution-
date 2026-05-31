import { Link, NavLink, Outlet } from 'react-router-dom';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const navItems = [
  ['Home', '/'],
  ['About', '/about'],
  ['Services', '/services'],
  ['Portfolio', '/portfolio'],
  ['Pricing', '/pricing'],
  ['Contact', '/contact']
];

function navClass({ isActive }) {
  return `rounded-md px-3 py-2 text-sm font-semibold transition ${
    isActive
      ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-100'
      : 'text-slate-600 hover:text-brand-700 dark:text-slate-300 dark:hover:text-brand-100'
  }`;
}

export default function MainLayout() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, isAdmin, logout } = useAuth();

  const dashboardPath = isAdmin ? '/admin' : '/dashboard';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#08111f] dark:text-white">
      <header className="sticky top-0 z-50 border-b border-white/30 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80">
        <nav className="container-pad flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-600 text-lg font-black text-white">VB</span>
            <span>
              <span className="block text-sm font-black uppercase tracking-wide text-slate-950 dark:text-white">Veenbreeze</span>
              <span className="block text-xs font-semibold text-brand-700 dark:text-brand-100">Solutions</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navItems.map(([label, path]) => (
              <NavLink key={path} to={path} className={navClass}>
                {label}
              </NavLink>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <button className="btn-secondary px-3 py-3" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {isAuthenticated ? (
              <>
                <Link to={dashboardPath} className="btn-primary py-3">
                  Dashboard
                </Link>
                <button className="btn-secondary py-3" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary py-3">
                  Login
                </Link>
                <Link to="/register" className="btn-primary py-3">
                  Register
                </Link>
              </>
            )}
          </div>

          <button className="btn-secondary px-3 py-3 lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Open menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {open && (
          <div className="container-pad border-t border-slate-200 pb-5 dark:border-slate-800 lg:hidden">
            <div className="grid gap-2 pt-4">
              {navItems.map(([label, path]) => (
                <NavLink key={path} to={path} className={navClass} onClick={() => setOpen(false)}>
                  {label}
                </NavLink>
              ))}
              <button className="btn-secondary mt-2" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />} Theme
              </button>
              {isAuthenticated ? (
                <>
                  <Link to={dashboardPath} className="btn-primary" onClick={() => setOpen(false)}>
                    Dashboard
                  </Link>
                  <button className="btn-secondary" onClick={logout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary" onClick={() => setOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary" onClick={() => setOpen(false)}>
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-950">
        <div className="container-pad grid gap-8 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="text-lg font-black text-slate-950 dark:text-white">Veenbreeze Solutions</p>
            <p className="mt-3 max-w-md text-sm leading-7 text-slate-600 dark:text-slate-300">
              Modern websites, systems, creative services, and digital execution for ambitious teams.
            </p>
          </div>
          <div>
            <p className="font-bold">Company</p>
            <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
              <Link to="/about">About</Link>
              <Link to="/services">Services</Link>
              <Link to="/portfolio">Portfolio</Link>
            </div>
          </div>
          <div>
            <p className="font-bold">Contact</p>
            <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
              <span>hello@veenbreeze.com</span>
              <span>Dar es Salaam, Tanzania</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
