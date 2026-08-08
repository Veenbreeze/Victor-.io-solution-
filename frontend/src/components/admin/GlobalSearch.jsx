import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BriefcaseBusiness, CalendarDays, Image, Inbox, Search, Users, X } from 'lucide-react';
import { eventService, messageService, portfolioService, serviceService, userService } from '../../services/api.js';

const MODULES = [
  { key: 'services', label: 'Services', icon: BriefcaseBusiness, to: '/admin/services', fetch: serviceService.list, field: 'title' },
  { key: 'portfolio', label: 'Portfolio', icon: Image, to: '/admin/portfolio', fetch: portfolioService.list, field: 'title' },
  { key: 'events', label: 'Events', icon: CalendarDays, to: '/admin/events', fetch: eventService.list, field: 'title' },
  { key: 'users', label: 'Users', icon: Users, to: '/admin/users', fetch: userService.list, field: 'name' },
  { key: 'messages', label: 'Messages', icon: Inbox, to: '/admin/messages', fetch: messageService.list, field: 'name' }
];

export default function GlobalSearch({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [dataset, setDataset] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    if (!dataset) {
      setLoading(true);
      Promise.all(MODULES.map((m) => m.fetch().then((res) => [m.key, res.data]).catch(() => [m.key, []])))
        .then((entries) => setDataset(Object.fromEntries(entries)))
        .finally(() => setLoading(false));
    }
  }, [open, dataset]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const results = useMemo(() => {
    if (!dataset || !query.trim()) return [];
    const q = query.trim().toLowerCase();
    return MODULES.map((m) => ({
      ...m,
      matches: (dataset[m.key] || []).filter((row) => String(row[m.field] || '').toLowerCase().includes(q)).slice(0, 5)
    })).filter((m) => m.matches.length);
  }, [dataset, query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[95] flex items-start justify-center p-4 pt-24">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div role="dialog" aria-modal="true" aria-label="Global search" className="clay relative w-full max-w-lg rounded-clay p-2">
        <div className="flex items-center gap-2 border-b px-3 py-2.5" style={{ borderColor: 'var(--clay-border)' }}>
          <Search size={16} className="text-slate-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users, services, portfolio, events, messages…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
          <button onClick={onClose} aria-label="Close search" className="rounded p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white">
            <X size={16} />
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto p-2">
          {loading ? (
            <p className="px-2 py-8 text-center text-sm text-slate-500">Loading records…</p>
          ) : !query.trim() ? (
            <p className="px-2 py-8 text-center text-sm text-slate-500">Start typing to search across the platform.</p>
          ) : results.length ? (
            results.map((m) => (
              <div key={m.key} className="mb-2">
                <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{m.label}</p>
                {m.matches.map((row) => (
                  <button
                    key={row.id}
                    className="flex w-full items-center gap-2.5 rounded-clay-sm px-2 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-white/5"
                    onClick={() => {
                      navigate(m.to);
                      onClose();
                    }}
                  >
                    <m.icon size={15} className="shrink-0 text-slate-400" />
                    <span className="truncate text-slate-800 dark:text-slate-100">{row[m.field]}</span>
                  </button>
                ))}
              </div>
            ))
          ) : (
            <p className="px-2 py-8 text-center text-sm text-slate-500">No results for "{query}".</p>
          )}
        </div>
      </div>
    </div>
  );
}
