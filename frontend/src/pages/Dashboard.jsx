import { CalendarDays, FolderKanban, LifeBuoy, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const cards = [
  [FolderKanban, 'Active requests', 'Track your web, design, tutoring, and system development requests.'],
  [CalendarDays, 'Upcoming reviews', 'Keep milestones, revisions, and delivery dates visible.'],
  [LifeBuoy, 'Support', 'Get help with deployment, content, or improvement requests.']
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <section className="py-20">
      <div className="container-pad">
        <div className="rounded-lg bg-slate-950 p-8 text-white md:p-12">
          <Sparkles className="text-brand-100" />
          <h1 className="mt-5 text-3xl font-black tracking-normal">Welcome, {user?.name}</h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Your client workspace is ready for project updates, account details, and support requests.
          </p>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {cards.map(([Icon, title, body]) => (
            <article key={title} className="glass rounded-lg p-6">
              <Icon className="text-brand-600" size={26} />
              <h2 className="mt-5 text-lg font-bold text-slate-950 dark:text-white">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
