import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, KeyRound, Lock, Mail, ShieldCheck } from 'lucide-react';
import { authService } from '../services/api.js';
import { getErrorMessage } from '../utils/format.js';

const RESEND_COOLDOWN_SECONDS = 45;

export default function ForgotPassword() {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const requestOtp = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await authService.forgotPassword(email);
      setNotice(data.message);
      setStep('reset');
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (cooldown > 0) return;
    setError('');
    try {
      const { data } = await authService.forgotPassword(email);
      setNotice(data.message);
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const submitReset = async (event) => {
    event.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({ email, otp, newPassword });
      navigate('/login', { state: { resetSuccess: true } });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-black tracking-tight">
          {step === 'email' ? 'Reset your password' : 'Enter your code'}
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {step === 'email'
            ? "We'll email you a one-time code to reset your password."
            : `Enter the 6-digit code sent to ${email} along with your new password.`}
        </p>
      </header>

      {notice && (
        <p className="flex items-start gap-2 rounded-xl border border-brand-300/40 bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-700 dark:border-brand-900/40 dark:bg-brand-900/20 dark:text-brand-200">
          <ShieldCheck size={16} className="mt-0.5 shrink-0" />
          {notice}
        </p>
      )}
      {error && (
        <p className="rounded-xl border border-coral/40 bg-coral/10 px-4 py-3 text-sm font-semibold text-coral">
          {error}
        </p>
      )}

      {step === 'email' ? (
        <form onSubmit={requestOtp} className="grid gap-4">
          <div>
            <label className="field-label" htmlFor="forgot-email">
              Email
            </label>
            <div className="relative">
              <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="forgot-email"
                className="field pl-10"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <button className="btn-primary w-full" disabled={loading}>
            {loading ? 'Sending code…' : 'Send reset code'}
          </button>
        </form>
      ) : (
        <form onSubmit={submitReset} className="grid gap-4">
          <div>
            <label className="field-label" htmlFor="otp">
              6-digit code
            </label>
            <div className="relative">
              <KeyRound size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="otp"
                className="field pl-10 tracking-[0.5em]"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
              />
            </div>
          </div>

          <div>
            <label className="field-label" htmlFor="new-password">
              New password
            </label>
            <div className="relative">
              <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="new-password"
                className="field pl-10 pr-10"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={8}
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

          <div>
            <label className="field-label" htmlFor="confirm-password">
              Confirm new password
            </label>
            <div className="relative">
              <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="confirm-password"
                className="field pl-10"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>
          </div>

          <button className="btn-primary w-full" disabled={loading}>
            {loading ? 'Resetting…' : 'Reset password'}
          </button>

          <button
            type="button"
            className="text-sm font-semibold text-brand-700 transition hover:text-brand-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-brand-200"
            onClick={resendOtp}
            disabled={cooldown > 0}
          >
            {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
          </button>
        </form>
      )}

      <Link
        className="inline-flex items-center justify-center gap-2 text-sm font-bold text-brand-700 transition hover:text-brand-900 dark:text-brand-200 dark:hover:text-white"
        to="/login"
      >
        <ArrowLeft size={16} /> Back to login
      </Link>
    </div>
  );
}
