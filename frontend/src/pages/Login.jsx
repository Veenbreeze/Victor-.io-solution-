import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, LogIn, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import OAuthButtons from '../components/OAuthButtons.jsx';
import { getErrorMessage } from '../utils/format.js';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const user = await login(form);
      const fallback = user.role === 'admin' ? '/admin' : '/dashboard';
      navigate(location.state?.from?.pathname || fallback, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <header>
        <h2 className="text-3xl font-black tracking-tight">Welcome back</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Sign in to continue to your workspace.
        </p>
      </header>

      <OAuthButtons isLoading={loading} disabled={loading} />

      <div className="grid gap-4">
        <div>
          <label className="field-label" htmlFor="login-email">Email</label>
          <div className="relative">
            <Mail
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              id="login-email"
              className="field pl-10"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="login-password">Password</label>
          <div className="relative">
            <Lock
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              id="login-password"
              className="field pl-10 pr-10"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-brand-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-coral/40 bg-coral/10 px-4 py-3 text-sm font-semibold text-coral">
          {error}
        </p>
      )}

      <button className="btn-primary w-full" disabled={loading}>
        <LogIn size={18} /> {loading ? 'Signing in…' : 'Login'}
      </button>

      <div className="space-y-3 text-center text-sm text-slate-600 dark:text-slate-300">
        <p>
          Need an account?{' '}
          <Link className="font-bold text-brand-700 dark:text-brand-200" to="/register">
            Register
          </Link>
        </p>
        <Link
          className="inline-flex items-center justify-center gap-2 font-bold text-brand-700 transition hover:text-brand-900 dark:text-brand-200 dark:hover:text-white"
          to="/"
        >
          <ArrowLeft size={16} /> Back to home
        </Link>
      </div>
    </form>
  );
}
