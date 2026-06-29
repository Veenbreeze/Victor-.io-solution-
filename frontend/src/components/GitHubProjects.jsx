import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { GitFork, Github, Star, ExternalLink, Code2 } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner.jsx';

const fallbackUsername = 'Veenbreeze';

const languageColors = {
  JavaScript: 'bg-yellow-400',
  TypeScript: 'bg-blue-500',
  Python: 'bg-emerald-500',
  HTML: 'bg-orange-500',
  CSS: 'bg-pink-500',
  PHP: 'bg-indigo-500',
  Java: 'bg-red-500',
  Go: 'bg-cyan-500',
  Vue: 'bg-emerald-400',
  Shell: 'bg-slate-500'
};

export default function GitHubProjects() {
  const username = import.meta.env.VITE_GITHUB_USERNAME || fallbackUsername;
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const { data } = await axios.get(
          `https://api.github.com/users/${username}/repos`,
          { params: { sort: 'updated', direction: 'desc', per_page: 12 } }
        );
        if (active) {
          setRepositories(data.filter((r) => !r.fork).slice(0, 6));
        }
      } catch {
        if (active) setError('Failed to load GitHub projects.');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [username]);

  if (loading) return <LoadingSpinner label="Loading repositories…" />;

  if (error) {
    return (
      <div className="rounded-2xl border border-coral/30 bg-coral/5 p-6 text-sm font-semibold text-coral">
        {error}
      </div>
    );
  }

  if (!repositories.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        No public repositories found for{' '}
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noreferrer"
          className="text-brand-700 underline dark:text-brand-200"
        >
          @{username}
        </a>
        .
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <Github size={16} /> Live from{' '}
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-brand-700 hover:underline dark:text-brand-200"
          >
            @{username}
          </a>
        </p>
        <a
          href={`https://github.com/${username}?tab=repositories`}
          target="_blank"
          rel="noreferrer"
          className="btn-ghost text-xs"
        >
          See all <ExternalLink size={14} />
        </a>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {repositories.map((repo, i) => (
          <motion.a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: i * 0.06, ease: 'easeOut' }}
            className="card-elevated group flex h-full flex-col p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-soft dark:bg-slate-800">
                <Github size={18} />
              </div>
              <span className="badge text-[10px]">
                <Code2 size={12} /> Repo
              </span>
            </div>

            <h3 className="mt-4 truncate text-base font-bold text-slate-950 dark:text-white">
              {repo.name}
            </h3>

            <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {repo.description || 'No description provided.'}
            </p>

            <div className="mt-5 flex items-center gap-4 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400">
              {repo.language && (
                <span className="flex items-center gap-1.5">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      languageColors[repo.language] || 'bg-slate-400'
                    }`}
                  />
                  {repo.language}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Star size={13} /> {repo.stargazers_count}
              </span>
              <span className="flex items-center gap-1">
                <GitFork size={13} /> {repo.forks_count}
              </span>
              <span className="ml-auto inline-flex items-center gap-1 text-brand-700 opacity-0 transition group-hover:opacity-100 dark:text-brand-200">
                Open <ExternalLink size={12} />
              </span>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
