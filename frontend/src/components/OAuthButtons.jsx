import { useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { SiGoogle } from 'react-icons/si';
import { useAuth } from '../context/AuthContext.jsx';

export default function OAuthButtons({ isLoading, disabled }) {
  const { oauthError } = useAuth();
  const [localLoading, setLocalLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const backendOrigin = apiUrl.replace(/\/api\/?$/, '');

  const start = (provider) => {
    setLocalLoading(true);
    window.location.href = `${backendOrigin}/api/auth/${provider}`;
  };

  const buttonDisabled = isLoading || disabled || localLoading;

  return (
    <div className="space-y-3">
      {oauthError && (
        <div className="rounded-xl border border-coral/40 bg-coral/10 px-4 py-3 text-sm font-semibold text-coral">
          {oauthError}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => start('google')}
          disabled={buttonDisabled}
          className="btn-oauth btn-google disabled:cursor-not-allowed disabled:opacity-50"
        >
          <SiGoogle size={18} />
          <span>{localLoading ? 'Redirecting…' : 'Google'}</span>
        </button>
        <button
          type="button"
          onClick={() => start('github')}
          disabled={buttonDisabled}
          className="btn-oauth btn-github disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FaGithub size={18} />
          <span>{localLoading ? 'Redirecting…' : 'GitHub'}</span>
        </button>
      </div>

      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-700" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:bg-slate-900 dark:text-slate-400">
            or continue with email
          </span>
        </div>
      </div>
    </div>
  );
}
