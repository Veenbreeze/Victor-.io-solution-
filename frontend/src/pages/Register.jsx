import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage } from '../utils/format.js';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
    <form onSubmit={submit}>
      <h2 className="text-2xl font-black">Create account</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Register to access your Veenbreeze dashboard.</p>
      <div className="mt-6 grid gap-4">
        <input className="field" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="field" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="field" type="password" minLength={8} placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
      </div>
      {error && <p className="mt-4 text-sm font-semibold text-coral">{error}</p>}
      <button className="btn-primary mt-6 w-full" disabled={loading}>
        <UserPlus size={18} /> {loading ? 'Creating...' : 'Register'}
      </button>
      <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-300">
        Already registered? <Link className="font-bold text-brand-700 dark:text-brand-100" to="/login">Login</Link>
      </p>
    </form>
  );
}
