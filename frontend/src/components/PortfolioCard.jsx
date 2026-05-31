import { ExternalLink, Github } from 'lucide-react';

export default function PortfolioCard({ item }) {
  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/20">
      <img className="h-56 w-full object-cover" src={item.image_url} alt={item.title} />
      <div className="p-6">
        <h3 className="text-lg font-bold text-slate-950 dark:text-white">{item.title}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {(item.technologies || []).map((tech) => (
            <span key={tech} className="rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {tech}
            </span>
          ))}
        </div>
        <div className="mt-6 flex gap-3">
          <a className="btn-secondary px-4 py-2" href={item.github_url} target="_blank" rel="noreferrer">
            <Github size={16} /> Code
          </a>
          <a className="btn-primary px-4 py-2" href={item.live_url} target="_blank" rel="noreferrer">
            <ExternalLink size={16} /> Demo
          </a>
        </div>
      </div>
    </article>
  );
}
