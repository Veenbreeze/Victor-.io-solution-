import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FiExternalLink,
  FiGitBranch,
  FiGithub,
  FiStar,
  FiUser
} from 'react-icons/fi';
import LoadingSpinner from './LoadingSpinner.jsx';

const fallbackUsername = 'Veenbreeze';

export default function GitHubProjects() {
  const username = import.meta.env.VITE_GITHUB_USERNAME || fallbackUsername;

  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState('next'); // 👈 controls curl direction

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError('');

      try {
        const { data } = await axios.get(
          `https://api.github.com/users/${username}/repos`,
          {
            params: {
              sort: 'updated',
              direction: 'desc',
              per_page: 6
            }
          }
        );

        if (active) {
          setRepositories(data.filter(r => !r.fork).slice(0, 6));
        }
      } catch {
        if (active) setError('Failed to load GitHub projects');
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => (active = false);
  }, [username]);

  if (loading) return <LoadingSpinner label="Opening GitHub book..." />;

  if (error) return (
    <div className="p-6 text-red-600 font-semibold border rounded-lg">
      {error}
    </div>
  );

  if (!repositories.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        No public repositories found for @{username}.
      </div>
    );
  }

  const current = repositories[page];

  const nextPage = () => {
    setDirection('next');
    setPage((p) => (p + 1) % repositories.length);
  };

  const prevPage = () => {
    setDirection('prev');
    setPage((p) => (p - 1 + repositories.length) % repositories.length);
  };

  return (
    <div className="flex flex-col items-center">

      {/* 📖 BOOK STAGE */}
      <div className="relative h-[450px] w-full max-w-3xl perspective-[2500px]">

        {/* LEFT BUTTON */}
        {/* <button
          onClick={prevPage}
          className="absolute left-0 top-1/2 z-20 -translate-y-1/2 rounded-full bg-slate-900 p-3 text-white"
        >
          ◀
        </button> */}

        {/* RIGHT BUTTON */}
        <button
          onClick={nextPage}
          className="absolute right-0 top-1/2 z-20 -translate-y-1/2 rounded-full bg-slate-900 p-3 text-white"
        >
          🏃‍♂️‍➡️
        </button>

        {/* 📄 PAGE */}
        <div
          key={current.id}
          className="absolute left-1/2 top-0 h-full w-[80%] -translate-x-1/2"
          style={{ perspective: '2000px' }}
        >

          {/* FRONT PAGE */}
          <div
            className={`absolute h-full w-full rounded-2xl bg-white dark:bg-slate-900 shadow-2xl backface-hidden transition-all duration-700`}
            style={{
              transformOrigin: direction === 'next' ? 'left' : 'right',
              animation: 'pageFlip 0.8s ease-in-out'
            }}
          >

            {/* spine */}
            <div className="absolute left-0 top-0 h-full w-2 bg-slate-300 dark:bg-slate-700" />

            {/* header */}
            <div className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                    <FiUser />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold">{current.name}</h2>
                    <p className="text-xs text-slate-500">
                      GitHub Project Book
                    </p>
                  </div>
                </div>

                <a
                  href={current.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-500 hover:text-brand-600"
                >
                  <FiExternalLink />
                </a>
              </div>

              {/* description */}
              <p className="mt-8 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {current.description || 'A production-ready repository with clean architecture and scalable design.'}
              </p>

              {/* meta */}
              <div className="mt-6 flex gap-3 text-xs font-bold text-slate-500">
                <span className="flex items-center gap-1 rounded bg-slate-100 px-3 py-1.5 dark:bg-slate-800">
                  <FiGitBranch /> {current.language || 'Mixed'}
                </span>

                <span className="flex items-center gap-1 rounded bg-slate-100 px-3 py-1.5 dark:bg-slate-800">
                  <FiStar /> {current.stargazers_count}
                </span>

                <span className="flex items-center gap-1 rounded bg-brand-50 px-3 py-1.5 text-brand-700 dark:bg-brand-900/40">
                  <FiGithub /> Repo
                </span>
              </div>
            </div>
          </div>

          {/* BACK PAGE SHADOW (curl illusion) */}
          <div
            className="absolute h-full w-full rounded-2xl bg-slate-200 dark:bg-slate-800 opacity-20 blur-sm"
            style={{
              transform: direction === 'next'
                ? 'rotateY(-15deg) translateX(10px)'
                : 'rotateY(15deg) translateX(-10px)',
            }}
          />
        </div>
      </div>

      {/* page dots */}
      <div className="mt-6 flex gap-2">
        {repositories.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > page ? 'next' : 'prev');
              setPage(i);
            }}
            className={`h-2 w-6 rounded-full transition-all ${
              i === page ? 'bg-brand-600' : 'bg-slate-300'
            }`}
          />
        ))}
      </div>

      {/* animation keyframe */}
      <style>
        {`
          @keyframes pageFlip {
            0% {
              transform: rotateY(0deg);
            }
            50% {
              transform: rotateY(-90deg);
              opacity: 0.7;
            }
            100% {
              transform: rotateY(0deg);
            }
          }

          .backface-hidden {
            backface-visibility: hidden;
          }
        `}
      </style>
    </div>
  );
}