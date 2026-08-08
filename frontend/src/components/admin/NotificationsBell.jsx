import { useEffect, useRef, useState } from 'react';
import { Bell, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { messageService } from '../../services/api.js';
import { formatDate } from '../../utils/format.js';
import { useToast } from '../ui/Toast.jsx';

export default function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await messageService.list();
      setMessages(data.filter((m) => m.status === 'new'));
    } catch {
      // notifications are non-critical; fail silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const markRead = async (id) => {
    try {
      await messageService.updateStatus(id, 'read');
      setMessages((current) => current.filter((m) => m.id !== id));
    } catch {
      toast({ type: 'error', message: 'Could not update the message.' });
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        className="btn-ghost relative p-2.5"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${messages.length ? `, ${messages.length} unread` : ''}`}
      >
        <Bell size={18} />
        {messages.length > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {messages.length > 9 ? '9+' : messages.length}
          </span>
        )}
      </button>

      {open && (
        <div className="clay absolute right-0 top-full z-50 mt-2 w-80 rounded-clay p-2 shadow-clay-lg">
          <div className="flex items-center justify-between px-2 py-1.5">
            <p className="text-sm font-semibold text-slate-950 dark:text-white">Notifications</p>
            <span className="text-xs text-slate-500 dark:text-slate-400">{messages.length} new</span>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <p className="px-2 py-6 text-center text-sm text-slate-500">Loading…</p>
            ) : messages.length ? (
              messages.map((m) => (
                <div key={m.id} className="flex items-start gap-2 rounded-clay-sm px-2 py-2.5 hover:bg-slate-100 dark:hover:bg-white/5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">New inquiry from {m.name}</p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">{m.subject}</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">{formatDate(m.created_at)}</p>
                  </div>
                  <button
                    className="shrink-0 rounded-clay-sm p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
                    onClick={() => markRead(m.id)}
                    aria-label="Mark as read"
                    title="Mark as read"
                  >
                    <Check size={14} />
                  </button>
                </div>
              ))
            ) : (
              <p className="px-2 py-6 text-center text-sm text-slate-500">You're all caught up.</p>
            )}
          </div>
          <div className="border-t px-2 pt-2" style={{ borderColor: 'var(--clay-border)' }}>
            <Link
              to="/admin/messages"
              className="block rounded-clay-sm px-2 py-2 text-center text-xs font-semibold text-brand-700 hover:bg-brand-50 dark:text-brand-300 dark:hover:bg-brand-950/40"
              onClick={() => setOpen(false)}
            >
              View all messages
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
