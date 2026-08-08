import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  BriefcaseBusiness,
  CalendarDays,
  Image as ImageIcon,
  Inbox,
  Loader2,
  Mail,
  Users as UsersIcon
} from 'lucide-react';
import { adminService } from '../../services/api.js';
import { formatDate, getErrorMessage } from '../../utils/format.js';
import PageHeader from '../../components/admin/PageHeader.jsx';

const ACTIVITY_META = {
  message: { icon: Mail, label: (row) => `New inquiry from ${row.title}` },
  service: { icon: BriefcaseBusiness, label: (row) => `Service "${row.title}" updated` },
  portfolio: { icon: ImageIcon, label: (row) => `Portfolio item "${row.title}" updated` },
  event: { icon: CalendarDays, label: (row) => `Event "${row.title}" updated` },
  user: { icon: UsersIcon, label: (row) => `${row.title} joined` }
};

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, activityRes] = await Promise.all([adminService.stats(), adminService.activity(10)]);
      setStats(statsRes.data);
      setActivity(activityRes.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const kpis = stats && [
    { label: 'Users', value: stats.users, icon: UsersIcon },
    { label: 'Services', value: stats.services, icon: BriefcaseBusiness },
    { label: 'Portfolio items', value: stats.portfolio, icon: ImageIcon },
    { label: 'Active events', value: stats.activeEvents, icon: CalendarDays },
    { label: 'Total messages', value: stats.messages, icon: Inbox },
    { label: 'Unread messages', value: stats.newMessages, icon: Mail }
  ];

  return (
    <section>
      <PageHeader title="Overview" description="A snapshot of Victor.io Solutions operations." />

      {loading ? (
        <div className="mt-8 flex items-center justify-center gap-2 py-16 text-sm text-slate-500">
          <Loader2 size={18} className="animate-spin" /> Loading dashboard…
        </div>
      ) : error ? (
        <div className="mt-8 flex flex-col items-center gap-3 py-16 text-center text-sm text-slate-500">
          <AlertTriangle size={20} className="text-red-500" />
          <p>{error}</p>
          <button className="btn-ghost" onClick={load}>
            Try again
          </button>
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {kpis.map(({ label, value, icon: Icon }) => (
              <article key={label} className="stat-tile">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
                  <Icon size={16} className="text-brand-500" />
                </div>
                <p className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">{value}</p>
              </article>
            ))}
          </div>

          <div className="clay mt-8 rounded-clay p-6">
            <h2 className="font-semibold text-slate-950 dark:text-white">Recent activity</h2>
            {activity.length ? (
              <ul className="mt-4 divide-y" style={{ borderColor: 'var(--clay-border)' }}>
                {activity.map((row) => {
                  const meta = ACTIVITY_META[row.type] || ACTIVITY_META.service;
                  const Icon = meta.icon;
                  return (
                    <li key={`${row.type}-${row.id}`} className="flex items-center gap-3 py-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-300">
                        <Icon size={15} />
                      </span>
                      <p className="flex-1 truncate text-sm text-slate-700 dark:text-slate-200">{meta.label(row)}</p>
                      <span className="shrink-0 text-xs text-slate-400">{formatDate(row.created_at)}</span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-slate-500">No recent activity yet.</p>
            )}
          </div>
        </>
      )}
    </section>
  );
}
