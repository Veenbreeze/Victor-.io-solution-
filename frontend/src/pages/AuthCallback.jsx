import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const errorMessages = {
  google_auth_failed: 'Google authentication failed. Please try again.',
  github_auth_failed: 'GitHub authentication failed. Please try again.',
  oauth_auth_failed: 'OAuth authentication failed. Please try again.'
};

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuthState } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const userJson = searchParams.get('user');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError(errorMessages[errorParam] || 'Authentication failed');
      const t = setTimeout(() => navigate('/login', { replace: true }), 2500);
      return () => clearTimeout(t);
    }

    if (!token || !userJson) {
      setError('Invalid authentication response. Please try again.');
      const t = setTimeout(() => navigate('/login', { replace: true }), 2500);
      return () => clearTimeout(t);
    }

    try {
      const user = JSON.parse(decodeURIComponent(userJson));
      setAuthState({ token, user });
      const redirectPath = user.role === 'admin' ? '/admin' : '/dashboard';
      navigate(redirectPath, { replace: true });
    } catch (err) {
      console.error('OAuth callback error:', err);
      setError('Failed to process authentication. Please try again.');
      const t = setTimeout(() => navigate('/login', { replace: true }), 2500);
      return () => clearTimeout(t);
    }
  }, [searchParams, navigate, setAuthState]);

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="card-elevated max-w-md p-8">
          <h1 className="text-lg font-bold text-coral">Authentication error</h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{error}</p>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">Redirecting to login…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center text-center">
      <div>
        <LoadingSpinner />
        <p className="mt-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
          Processing your authentication…
        </p>
      </div>
    </div>
  );
}
