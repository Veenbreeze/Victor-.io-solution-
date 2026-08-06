import { Link, NavLink, Outlet } from 'react-router-dom';
import { LogOut, Menu, Moon, Sun, User as UserIcon, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import Footer from '../components/Footer.jsx';

const navItems = [
  ['Home', '/'],
  ['About', '/about'],
  ['Services', '/services'],
  ['Portfolio', '/portfolio'],
  ['Pricing', '/pricing'],
  ['Contact', '/contact']
];

function navClass({ isActive }) {
  return `relative rounded-lg px-3 py-2 text-sm font-semibold transition ${
    isActive
      ? 'text-brand-700 dark:text-brand-200'
      : 'text-slate-600 hover:text-brand-700 dark:text-slate-300 dark:hover:text-brand-100'
  }`;
}

export default function MainLayout() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const dashboardPath = isAdmin ? '/admin' : '/dashboard';

  return (
    <div className="min-h-screen text-slate-900 dark:text-white" style={{ background: 'var(--clay-bg)' }}>
      <header className="sticky top-0 z-50 px-3 pt-3">
        <nav className="clay container-pad flex items-center justify-between rounded-clay-sm py-3">
          <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <span className="clay-bubble h-11 w-11 text-lg">VIS</span>
            <span>
              <span className="block text-sm font-black uppercase tracking-wide text-slate-950 dark:text-white">Victor.io</span>
              <span className="block text-xs font-semibold text-brand-700 dark:text-brand-100">Solutions</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navItems.map(([label, path]) => (
              <NavLink key={path} to={path} end={path === '/'} className={navClass}>
                {({ isActive }) => (
                  <>
                    {label}
                    {isActive && (
                      <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand-gradient" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <button
              className="btn-ghost px-3 py-2.5"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {isAuthenticated ? (
              <>
                <Link to={dashboardPath} className="btn-primary">
                  <UserIcon size={16} /> {user?.name?.split(' ')[0] || 'Dashboard'}
                </Link>
                <button className="btn-ghost" onClick={logout}>
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Get started
                </Link>
              </>
            )}
          </div>

          <button
            className="btn-ghost px-3 py-2.5 lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Open menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {open && (
          <div className="container-pad pb-5 pt-3 lg:hidden">
            <div className="clay grid gap-2 rounded-clay-sm p-4">
              {navItems.map(([label, path]) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === '/'}
                  className={navClass}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </NavLink>
              ))}
              <button className="btn-secondary mt-2" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />} Theme
              </button>
              {isAuthenticated ? (
                <>
                  <Link
                    to={dashboardPath}
                    className="btn-primary"
                    onClick={() => setOpen(false)}
                  >
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
                    Get started
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

      <Footer />
    </div>
  );
}
