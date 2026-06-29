import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import OAuthButtons from '../components/OAuthButtons.jsx';
import { getErrorMessage } from '../utils/format.js';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await register(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <header>
        <h2 className="text-3xl font-black tracking-tight">Create your account</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Register to access your dashboard and tools.
        </p>
      </header>

      <OAuthButtons isLoading={loading} disabled={loading} />

      <div className="grid gap-4">
        <div>
          <label className="field-label" htmlFor="reg-name">Full name</label>
          <div className="relative">
            <User
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              id="reg-name"
              className="field pl-10"
              autoComplete="name"
              placeholder="Jane Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="reg-email">Email</label>
          <div className="relative">
            <Mail
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              id="reg-email"
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
          <label className="field-label" htmlFor="reg-password">Password</label>
          <div className="relative">
            <Lock
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              id="reg-password"
              className="field pl-10 pr-10"
              type={showPassword ? 'text' : 'password'}
              minLength={8}
              autoComplete="new-password"
              placeholder="Minimum 8 characters"
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
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            Use at least 8 characters. Mix letters, numbers, and symbols for best security.
          </p>
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-coral/40 bg-coral/10 px-4 py-3 text-sm font-semibold text-coral">
          {error}
        </p>
      )}

      <button className="btn-primary w-full" disabled={loading}>
        <UserPlus size={18} /> {loading ? 'Creating…' : 'Register'}
      </button>

      <div className="space-y-3 text-center text-sm text-slate-600 dark:text-slate-300">
        <p>
          Already registered?{' '}
          <Link className="font-bold text-brand-700 dark:text-brand-200" to="/login">
            Login
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
