import { ShieldCheck, Target, TrendingUp, Users } from 'lucide-react';
import SectionHeader from '../components/SectionHeader.jsx';

const values = [
  [Target, 'Clarity first', 'We turn broad ideas into focused product scopes, delivery plans, and measurable outcomes.'],
  [ShieldCheck, 'Secure by default', 'Auth, roles, validation, deployment variables, and database access are treated as core product work.'],
  [TrendingUp, 'Built to grow', 'We favor clean structures and maintainable patterns that can support future features.'],
  [Users, 'Human support', 'We help founders, students, freelancers, and teams make better digital decisions.']
];

export default function About() {
  return (
    <section className="py-20">
      <div className="container-pad">
        <SectionHeader
          eyebrow="About"
          title="A modern digital studio for builders who need more than a template."
          description="Veenbreeze Solutions blends full stack engineering, creative design, tutoring, and digital operations into one practical partner for launch-ready work."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {values.map(([Icon, title, body]) => (
            <article key={title} className="glass rounded-lg p-6">
              <Icon className="text-brand-600" size={28} />
              <h2 className="mt-5 text-xl font-bold text-slate-950 dark:text-white">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
