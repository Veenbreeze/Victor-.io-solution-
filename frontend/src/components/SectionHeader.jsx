export default function SectionHeader({ eyebrow, title, description, centered = false }) {
  return (
    <div className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      {eyebrow && <p className="mb-3 text-sm font-bold uppercase tracking-widest text-brand-600">{eyebrow}</p>}
      <h2 className="section-title">{title}</h2>
      {description && <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">{description}</p>}
    </div>
  );
}
