import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, LogOut, Menu, Moon, Search, Sun, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { adminNavFlat } from '../../config/adminNav.js';
import NotificationsBell from './NotificationsBell.jsx';
import GlobalSearch from './GlobalSearch.jsx';

export default function AdminHeader({ onOpenMobileNav }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const current = adminNavFlat.find((item) =>
    item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)
  );

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <>
      <header className="clay sticky top-0 z-30 flex h-16 items-center gap-3 rounded-none border-x-0 border-t-0 px-4 sm:px-6">
        <button className="btn-ghost p-2 lg:hidden" onClick={onOpenMobileNav} aria-label="Open menu">
          <Menu size={20} />
        </button>

        <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-1.5 text-sm lg:flex">
          <span className="font-medium text-slate-500 dark:text-slate-400">Admin</span>
          {current && (
            <>
              <ChevronRight size={14} className="text-slate-400" />
              <span className="truncate font-semibold text-slate-950 dark:text-white">{current.label}</span>
            </>
          )}
        </nav>

        <button
          className="field ml-0 flex w-full max-w-sm items-center gap-2 text-left text-slate-400 lg:ml-auto"
          onClick={() => setSearchOpen(true)}
        >
          <Search size={15} />
          <span className="flex-1 truncate text-sm">Search…</span>
          <kbd className="hidden rounded border px-1.5 py-0.5 text-[10px] sm:inline" style={{ borderColor: 'var(--clay-border)' }}>
            Ctrl K
          </kbd>
        </button>

        <div className="ml-auto flex items-center gap-1.5 lg:ml-2">
          <button className="btn-ghost p-2.5" onClick={toggleTheme} aria-label="Toggle theme" title="Toggle theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <NotificationsBell />

          <div className="relative">
            <button
              className="flex items-center gap-2 rounded-clay-sm px-2 py-1.5 transition hover:bg-slate-100 dark:hover:bg-white/5"
              onClick={() => setProfileOpen((v) => !v)}
              aria-label="Account menu"
            >
              <span className="clay-bubble h-8 w-8 text-xs font-bold">
                {(user?.name || 'A').slice(0, 1).toUpperCase()}
              </span>
            </button>
            {profileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                <div className="clay absolute right-0 top-full z-50 mt-2 w-56 rounded-clay p-2 shadow-clay-lg">
                  <div className="px-3 py-2">
                    <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">{user?.name}</p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                  </div>
                  <div className="my-1 border-t" style={{ borderColor: 'var(--clay-border)' }} />
                  <Link
                    to="/"
                    className="flex items-center gap-2 rounded-clay-sm px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"
                    onClick={() => setProfileOpen(false)}
                  >
                    <UserIcon size={15} /> View public site
                  </Link>
                  <button
                    className="flex w-full items-center gap-2 rounded-clay-sm px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                    onClick={logout}
                  >
                    <LogOut size={15} /> Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
