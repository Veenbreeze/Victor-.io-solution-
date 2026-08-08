import { Link, NavLink } from 'react-router-dom';
import { ChevronsLeft, ChevronsRight, X } from 'lucide-react';
import { adminNav } from '../../config/adminNav.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminSidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }) {
  const { isAdmin } = useAuth();
  const visibleNav = adminNav
    .map((group) => ({ ...group, items: group.items.filter((item) => !item.adminOnly || isAdmin) }))
    .filter((group) => group.items.length);

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}
      <aside
        className={`clay fixed inset-y-0 left-0 z-50 flex flex-col rounded-none border-y-0 border-l-0 transition-all duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          collapsed ? 'lg:w-[68px]' : 'lg:w-64'
        } ${mobileOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b px-4" style={{ borderColor: 'var(--clay-border)' }}>
          <Link to="/admin" className="flex items-center gap-2.5 overflow-hidden" onClick={onCloseMobile}>
            <span className="clay-bubble h-8 w-8 shrink-0 text-sm font-bold">VIS</span>
            {!collapsed && (
              <span className="truncate text-sm font-bold text-slate-950 dark:text-white">Victor.io Admin</span>
            )}
          </Link>
          <button className="btn-ghost p-1.5 lg:hidden" onClick={onCloseMobile} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {visibleNav.map((group) => (
            <div key={group.section}>
              {!collapsed && (
                <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {group.section}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={onCloseMobile}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-clay-sm px-2.5 py-2.5 text-sm font-medium transition ${
                        isActive
                          ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300'
                          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5'
                      }`
                    }
                  >
                    <item.icon size={18} className="shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="hidden shrink-0 border-t p-3 lg:block" style={{ borderColor: 'var(--clay-border)' }}>
          <button
            className="btn-ghost w-full justify-center"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
          </button>
        </div>
      </aside>
    </>
  );
}
