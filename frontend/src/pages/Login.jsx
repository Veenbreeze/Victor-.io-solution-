import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import OAuthButtons from '../components/OAuthButtons.jsx';
import { getErrorMessage } from '../utils/format.js';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
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
    <form onSubmit={submit}>
      <h2 className="text-2xl font-black">Welcome back</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Sign in to continue to your workspace.</p>

      {/* OAuth Buttons */}
      <div className="mt-6">
        <OAuthButtons isLoading={loading} disabled={loading} />
      </div>

      {/* Email/Password Form */}
      <div className="mt-6 grid gap-4">
        <input 
          className="field" 
          type="email" 
          placeholder="Email" 
          value={form.email} 
          onChange={(e) => setForm({ ...form, email: e.target.value })} 
          required 
        />
        <input 
          className="field" 
          type="password" 
          placeholder="Password" 
          value={form.password} 
          onChange={(e) => setForm({ ...form, password: e.target.value })} 
          required 
        />
      </div>

      {error && <p className="mt-4 text-sm font-semibold text-coral">{error}</p>}
      <button className="btn-primary mt-6 w-full" disabled={loading}>
        <LogIn size={18} /> {loading ? 'Signing in...' : 'Login'}
      </button>

      <div className="mt-5 space-y-4 text-center text-sm text-slate-600 dark:text-slate-300">
        <p>
          Need an account? <Link className="font-bold text-brand-700 dark:text-brand-100" to="/register">Register</Link>
        </p>
        <Link className="inline-flex items-center justify-center gap-2 font-bold text-brand-700 transition hover:text-brand-900 dark:text-brand-100 dark:hover:text-white" to="/">
          <ArrowLeft size={16} /> Back to home
        </Link>
      </div>
    </form>
  );
}
