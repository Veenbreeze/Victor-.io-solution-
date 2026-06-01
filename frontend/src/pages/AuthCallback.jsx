import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

/**
 * OAuth Callback Page
 * Handles OAuth redirects from backend
 * Extracts token and user from URL params and stores in localStorage
 */
export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuthState } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const processCallback = async () => {
      try {
        const token = searchParams.get('token');
        const userJson = searchParams.get('user');
        const provider = searchParams.get('provider');
        const errorParam = searchParams.get('error');

        // Handle OAuth errors
        if (errorParam) {
          const errorMessages = {
            google_auth_failed: 'Google authentication failed. Please try again.',
            github_auth_failed: 'GitHub authentication failed. Please try again.',
            oauth_auth_failed: 'OAuth authentication failed. Please try again.'
          };
          setError(errorMessages[errorParam] || 'Authentication failed');
          setTimeout(() => navigate('/login', { replace: true }), 3000);
          return;
        }

        // Validate token and user data
        if (!token || !userJson) {
          setError('Invalid authentication response. Please try again.');
          setTimeout(() => navigate('/login', { replace: true }), 3000);
          return;
        }

        // Parse user data
        const user = JSON.parse(decodeURIComponent(userJson));

        // Store in localStorage
        localStorage.setItem('veenbreeze_token', token);
        localStorage.setItem('veenbreeze_user', JSON.stringify(user));

        // Update auth context
        setAuthState({ token, user });

        // Redirect to dashboard
        const redirectPath = user.role === 'admin' ? '/admin' : '/dashboard';
        navigate(redirectPath, { replace: true });
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError('Failed to process authentication. Please try again.');
        setTimeout(() => navigate('/login', { replace: true }), 3000);
      }
    };

    processCallback();
  }, [searchParams, navigate, setAuthState]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="rounded-lg bg-white dark:bg-slate-800 p-8 shadow-lg max-w-md w-full">
          <h1 className="text-lg font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-slate-600 dark:text-slate-300 mb-4">{error}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-slate-600 dark:text-slate-300 font-semibold">Processing your authentication...</p>
      </div>
    </div>
  );
}
