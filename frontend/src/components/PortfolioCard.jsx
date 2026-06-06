import { useState } from 'react';
import { ExternalLink, Github } from 'lucide-react';

export default function PortfolioCard({ item }) {
  const [opened, setOpened] = useState(false);

  return (
    <article
      onClick={() => setOpened(!opened)}
      className="
        cursor-pointer
        overflow-hidden
        rounded-3xl
        border
        border-slate-200
        bg-white
        shadow-lg
        transition-all
        duration-500
        hover:shadow-2xl
        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      {!opened ? (
        <>
          <img
            src={item.image_url}
            alt={item.title}
            className="h-72 w-full object-cover"
          />

          <div className="p-5">
            <h3 className="text-lg font-bold text-slate-950 dark:text-white">
              {item.title}
            </h3>

            <p className="mt-2 text-sm text-brand-600">
              Click to view details →
            </p>
          </div>
        </>
      ) : (
        <div className="p-6 min-h-[360px]">
          <h3 className="text-xl font-bold text-slate-950 dark:text-white">
            {item.title}
          </h3>

          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
            {item.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {(item.technologies || []).map((tech) => (
              <span
                key={tech}
                className="
                  rounded-full
                  bg-brand-100
                  px-3 py-1
                  text-xs
                  font-semibold
                  text-brand-700
                "
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <a
              href={item.github_url}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="btn-secondary px-4 py-2"
            >
              <Github size={16} />
              Code
            </a>

            <a
              href={item.live_url}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="btn-primary px-4 py-2"
            >
              <ExternalLink size={16} />
              Demo
            </a>
          </div>

          <p className="mt-6 text-xs text-slate-400">
            Click again to close
          </p>
        </div>
      )}
    </article>
  );
}