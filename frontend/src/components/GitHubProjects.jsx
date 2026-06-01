import { useEffect, useState } from 'react';
import axios from 'axios';
import { FiExternalLink, FiGitBranch, FiGithub, FiStar } from 'react-icons/fi';
import LoadingSpinner from './LoadingSpinner.jsx';

const fallbackUsername = 'Veenbreeze';

export default function GitHubProjects() {
  const username = import.meta.env.VITE_GITHUB_USERNAME || fallbackUsername;
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadRepositories() {
      setLoading(true);
      setError('');

      try {
        const { data } = await axios.get(`https://api.github.com/users/${username}/repos`, {
          params: {
            sort: 'updated',
            direction: 'desc',
            per_page: 6
          }
        });

        if (active) {
          setRepositories(data.filter((repo) => !repo.fork).slice(0, 6));
        }
      } catch {
        if (active) setError('GitHub projects could not be loaded right now.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadRepositories();

    return () => {
      active = false;
    };
  }, [username]);

  if (loading) return <LoadingSpinner label="Loading GitHub projects" />;

  if (error) {
    return (
      <div className="rounded-lg border border-coral/30 bg-coral/10 p-6 text-sm font-semibold text-coral">
        {error}
      </div>
    );
  }

  if (!repositories.length) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        No public repositories found for {username}.
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {repositories.map((repo) => (
        <article
          key={repo.id}
          className="rounded-lg border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40 transition hover:-translate-y-1 hover:border-brand-400 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/20"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-100">
                <FiGithub size={20} />
              </span>
              <h3 className="text-base font-black text-slate-950 dark:text-white">{repo.name}</h3>
            </div>
            <a
              className="rounded-md p-2 text-slate-500 transition hover:bg-brand-50 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-brand-100"
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${repo.name} on GitHub`}
            >
              <FiExternalLink size={18} />
            </a>
          </div>
          <p className="mt-4 min-h-20 text-sm leading-7 text-slate-600 dark:text-slate-300">
            {repo.description || 'A public GitHub project from this workspace.'}
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-xs font-bold text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-3 py-1.5 dark:bg-slate-800">
              <FiGitBranch /> {repo.language || 'Mixed'}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-3 py-1.5 dark:bg-slate-800">
              <FiStar /> {repo.stargazers_count}
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}
