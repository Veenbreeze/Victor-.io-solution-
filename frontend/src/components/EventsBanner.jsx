import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CalendarDays, MapPin, X } from 'lucide-react';
import { eventService } from '../services/api.js';
import { formatDate } from '../utils/format.js';

function dismissKey(id) {
  return `vis_event_dismissed_${id}`;
}

export default function EventsBanner() {
  const [events, setEvents] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let active = true;
    eventService
      .upcoming(5)
      .then(({ data }) => {
        if (!active) return;
        const visible = data.filter((evt) => !localStorage.getItem(dismissKey(evt.id)));
        setEvents(visible);
        if (visible.length) {
          const t = setTimeout(() => setOpen(true), 1500);
          return () => clearTimeout(t);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (events.length <= 1) return undefined;
    const t = setInterval(() => {
      setActiveIndex((i) => (i + 1) % events.length);
    }, 6000);
    return () => clearInterval(t);
  }, [events.length]);

  if (!open || !events.length) return null;

  const event = events[activeIndex];
  const dateLabel = formatDate(event.starts_at);
  const timeLabel = new Date(event.starts_at).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit'
  });

  const dismiss = () => {
    localStorage.setItem(dismissKey(event.id), '1');
    const next = events.filter((e) => e.id !== event.id);
    setEvents(next);
    setActiveIndex(0);
    if (!next.length) setOpen(false);
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4 sm:bottom-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.96 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="pointer-events-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 text-white shadow-2xl backdrop-blur-xl"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-mesh opacity-50" />
            <div className="absolute inset-0 bg-grid opacity-20" />

            <div className="relative flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
              {event.cover_url ? (
                <img
                  src={event.cover_url}
                  alt={event.title}
                  className="h-16 w-16 shrink-0 rounded-xl object-cover ring-2 ring-white/10"
                />
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-glow">
                  <CalendarDays size={26} />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-200">
                  Upcoming event
                </p>
                <h3 className="mt-1 truncate text-lg font-black text-white">{event.title}</h3>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={13} /> {dateLabel} · {timeLabel}
                  </span>
                  {event.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin size={13} /> {event.location}
                    </span>
                  )}
                </div>
                {event.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-slate-300">{event.description}</p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {event.link_url && (
                  <a
                    href={event.link_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2 text-xs font-bold text-white shadow-glow transition hover:bg-brand-600"
                  >
                    Details <ArrowRight size={13} />
                  </a>
                )}
                <button
                  onClick={dismiss}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
                  aria-label="Dismiss event"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {events.length > 1 && (
              <div className="relative flex items-center justify-center gap-1.5 pb-3">
                {events.map((e, i) => (
                  <button
                    key={e.id}
                    onClick={() => setActiveIndex(i)}
                    className={`h-1 rounded-full transition-all ${
                      i === activeIndex ? 'w-8 bg-brand-300' : 'w-2 bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`Show event ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
