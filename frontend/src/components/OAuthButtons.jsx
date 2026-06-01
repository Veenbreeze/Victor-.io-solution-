import { useEffect, useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { SiGoogle } from 'react-icons/si';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * OAuth Button Component
 * Displays Google and GitHub login buttons with loading states
 */
export default function OAuthButtons({ isLoading, disabled }) {
  const { oauthError, clearOAuthError } = useAuth();
  const [localLoading, setLocalLoading] = useState(false);
  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Clear error after 5 seconds
  useEffect(() => {
    if (oauthError) {
      const timer = setTimeout(clearOAuthError, 5000);
      return () => clearTimeout(timer);
    }
  }, [oauthError, clearOAuthError]);

  const handleGoogleLogin = () => {
    setLocalLoading(true);
    // Redirect to backend OAuth endpoint
    window.location.href = `${backendUrl.replace('/api', '')}/api/auth/google`;
  };

  const handleGitHubLogin = () => {
    setLocalLoading(true);
    // Redirect to backend OAuth endpoint
    window.location.href = `${backendUrl.replace('/api', '')}/api/auth/github`;
  };

  const buttonDisabled = isLoading || disabled || localLoading;

  return (
    <div className="space-y-3">
      {/* OAuth Error Message */}
      {oauthError && (
        <div className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-600 dark:bg-red-900/30 dark:text-red-400">
          ⚠️ {oauthError}
        </div>
      )}

      {/* Google Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={buttonDisabled}
        className="btn-oauth btn-google w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <SiGoogle size={18} />
        <span>{localLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
      </button>

      {/* GitHub Button */}
      <button
        type="button"
        onClick={handleGitHubLogin}
        disabled={buttonDisabled}
        className="btn-oauth btn-github w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FaGithub size={18} />
        <span>{localLoading ? 'Connecting to GitHub...' : 'Continue with GitHub'}</span>
      </button>

      {/* Divider */}
      <div className="relative py-3">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
        </div>
        <div className="relative flex justify-center text-xs font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 px-2">
          OR
        </div>
      </div>
    </div>
  );
}
