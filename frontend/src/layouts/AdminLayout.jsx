import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar.jsx';
import AdminHeader from '../components/admin/AdminHeader.jsx';

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('veenbreeze_admin_sidebar') === 'collapsed');
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapse = () => {
    setCollapsed((current) => {
      const next = !current;
      localStorage.setItem('veenbreeze_admin_sidebar', next ? 'collapsed' : 'expanded');
      return next;
    });
  };

  return (
    <div className="min-h-screen lg:flex" style={{ background: 'var(--clay-bg)' }}>
      <AdminSidebar
        collapsed={collapsed}
        onToggleCollapse={toggleCollapse}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="min-w-0 flex-1">
        <AdminHeader onOpenMobileNav={() => setMobileOpen(true)} />
        <main className="container-pad py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
