import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  FolderKanban,
  LifeBuoy,
  Mail,
  Send,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { messageService, portfolioService, serviceService } from '../services/api.js';
import { getErrorMessage } from '../utils/format.js';

const quickCards = [
  {
    icon: FolderKanban,
    title: 'Active requests',
    body: 'Track your web, design, tutoring, and system development requests.',
    to: '/contact'
  },
  {
    icon: CalendarDays,
    title: 'Upcoming reviews',
    body: 'Keep milestones, revisions, and delivery dates visible.',
    to: '/services'
  },
  {
    icon: LifeBuoy,
    title: 'Support',
    body: 'Get help with deployment, content, or improvement requests.',
    to: '/contact'
  }
];

export default function Dashboard() {
  const { user } = useAuth();
  const [counts, setCounts] = useState({ services: 0, portfolio: 0 });
  const [contact, setContact] = useState({ subject: '', message: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([serviceService.list(), portfolioService.list()])
      .then(([s, p]) => setCounts({ services: s.data.length, portfolio: p.data.length }))
      .catch(() => {});
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      await messageService.send({
        name: user?.name,
        email: user?.email,
        subject: contact.subject || 'Dashboard inquiry',
        message: contact.message
      });
      setStatus('Message sent. We will get back to you shortly.');
      setContact({ subject: '', message: '' });
    } catch (err) {
      setStatus(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12">
      <div className="container-pad space-y-10">
        <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-8 text-white md:p-12">
          <div className="absolute inset-0 bg-mesh opacity-60" />
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="relative">
            <span className="badge border-white/20 bg-white/10 text-white">
              <Sparkles size={14} /> Welcome
            </span>
            <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
              Hi {user?.name || 'there'}, your workspace is ready.
            </h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              Browse new services, follow up on existing projects, and reach the team without leaving
              your dashboard.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/services" className="btn-primary">
                Explore services <ArrowUpRight size={16} />
              </Link>
              <Link to="/portfolio" className="btn-secondary border-white/20 bg-white/10 text-white hover:text-white">
                View portfolio
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile icon={TrendingUp} label="Services available" value={counts.services} />
          <StatTile icon={BookOpen} label="Portfolio items" value={counts.portfolio} />
          <StatTile icon={Mail} label="Your email" value={user?.email || '—'} mono />
          <StatTile icon={Sparkles} label="Account type" value={user?.role || 'user'} />
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {quickCards.map(({ icon: Icon, title, body, to }) => (
            <Link
              key={title}
              to={to}
              className="card-elevated p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-100">
                <Icon size={22} />
              </div>
              <h2 className="mt-5 text-lg font-bold text-slate-950 dark:text-white">{title}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{body}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 dark:text-brand-200">
                Open <ArrowUpRight size={14} />
              </span>
            </Link>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <form className="card-elevated p-6" onSubmit={submit}>
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">Send a quick note</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Need an update or a custom request? Reach the team directly.
            </p>
            <div className="mt-5 grid gap-4">
              <div>
                <label className="field-label" htmlFor="dash-subject">Subject</label>
                <input
                  id="dash-subject"
                  className="field"
                  placeholder="Project update, new request…"
                  value={contact.subject}
                  onChange={(e) => setContact({ ...contact, subject: e.target.value })}
                />
              </div>
              <div>
                <label className="field-label" htmlFor="dash-message">Message</label>
                <textarea
                  id="dash-message"
                  className="field min-h-32 resize-y"
                  placeholder="Tell us what you need…"
                  value={contact.message}
                  onChange={(e) => setContact({ ...contact, message: e.target.value })}
                  required
                />
              </div>
              {status && (
                <p className="text-sm font-semibold text-brand-700 dark:text-brand-200">{status}</p>
              )}
              <button className="btn-primary" disabled={loading}>
                <Send size={16} /> {loading ? 'Sending…' : 'Send message'}
              </button>
            </div>
          </form>

          <aside className="card-elevated p-6">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">Account details</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <Row label="Name" value={user?.name} />
              <Row label="Email" value={user?.email} />
              <Row label="Provider" value={user?.provider || 'email'} />
              <Row label="Role" value={user?.role} />
            </dl>
            <Link to="/contact" className="btn-ghost mt-6 w-full">
              Need to update something?
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}

function StatTile({ icon: Icon, label, value, mono = false }) {
  return (
    <article className="stat-tile">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <Icon size={18} className="text-brand-600 dark:text-brand-300" />
      </div>
      <p
        className={`mt-3 text-2xl font-black text-slate-950 dark:text-white ${mono ? 'break-all text-base font-bold' : ''}`}
      >
        {value}
      </p>
    </article>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-2 last:border-b-0 last:pb-0 dark:border-slate-800">
      <dt className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
        {label}
      </dt>
      <dd className="text-right text-sm font-semibold text-slate-900 dark:text-white">
        {value || '—'}
      </dd>
    </div>
  );
}
