export default function ServiceCard({ service }) {
  const Icon = service.icon;
  return (
    <article className="glass rounded-lg p-6 transition hover:-translate-y-1 hover:border-brand-400">
      {Icon && (
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-100">
          <Icon size={24} />
        </div>
      )}
      <h3 className="text-lg font-bold text-slate-950 dark:text-white">{service.title}</h3>
      <p className="mt-3 min-h-24 text-sm leading-7 text-slate-600 dark:text-slate-300">{service.description}</p>
      <p className="mt-5 text-sm font-bold text-coral">{service.price}</p>
    </article>
  );
}
