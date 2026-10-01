import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Zap, ArrowRight, Mail, CheckCircle } from 'lucide-react';
import { registerUser, verifyOtp, resendOtp } from '../services/authService';
import { getErrorMessage } from '../utils/errorMessages';
import { Button } from '../components/ui/Button';
import { ErrorMessage } from '../components/ui/ErrorMessage';

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // OTP state
  const [step, setStep] = useState('register'); // 'register' | 'verify'
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const cooldownRef = useRef(null);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
      return;
    }
    cooldownRef.current = setInterval(() => {
      setResendCooldown((c) => {
        if (c <= 1) {
          clearInterval(cooldownRef.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(cooldownRef.current);
  }, [resendCooldown]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    const { fullName, email, password } = form;
    if (!fullName.trim()) { setError('Full name is required.'); return; }
    if (fullName.trim().length < 3) { setError('Full name must be at least 3 characters.'); return; }
    if (!email.trim()) { setError('Email is required.'); return; }
    if (!password) { setError('Password is required.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }

    setLoading(true);
    try {
      await registerUser(fullName.trim(), email.trim(), password);
      // Registration successful — move to OTP verification step
      setStep('verify');
      setResendCooldown(60);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpError('');
    setOtpSuccess('');

    if (!otp.trim()) { setOtpError('Please enter the verification code.'); return; }
    if (otp.trim().length !== 6) { setOtpError('Verification code must be 6 digits.'); return; }

    setOtpLoading(true);
    try {
      await verifyOtp(form.email.trim(), otp.trim());
      setOtpSuccess('Email verified successfully! Redirecting to login…');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setOtpError(getErrorMessage(err));
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setOtpError('');
    setOtpSuccess('');
    setOtpLoading(true);
    try {
      await resendOtp(form.email.trim());
      setOtpSuccess('New verification code sent to your email.');
      setResendCooldown(60);
    } catch (err) {
      setOtpError(getErrorMessage(err));
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          >
            <Zap size={16} color="white" />
          </div>
          <span className="font-bold tracking-wider" style={{ color: 'var(--text-primary)' }}>
            AETHERGATE
          </span>
        </div>

        {step === 'register' && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Create account
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Join the AetherGate platform
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4" noValidate>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                  Full name
                </label>
                <input
                  type="text"
                  className="input-base"
                  placeholder="Your name"
                  value={form.fullName}
                  onChange={set('fullName')}
                  autoComplete="name"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                  Email address
                </label>
                <input
                  type="email"
                  className="input-base"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={set('email')}
                  autoComplete="email"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                  Password
                  <span className="ml-1 text-xs font-normal" style={{ color: 'var(--text-muted)' }}>
                    (min 8 characters)
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input-base pr-10"
                    placeholder="Choose a strong password"
                    value={form.password}
                    onChange={set('password')}
                    autoComplete="new-password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70"
                    style={{ color: 'var(--text-muted)' }}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <ErrorMessage message={error} onDismiss={() => setError('')} />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full justify-center"
              >
                {loading ? 'Creating account…' : 'Create account'}
              </Button>
            </form>

            <p className="text-sm text-center mt-6" style={{ color: 'var(--text-secondary)' }}>
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold hover:underline"
                style={{ color: 'var(--accent-primary)' }}
              >
                Sign in
              </Link>
            </p>
          </>
        )}

        {step === 'verify' && (
          <>
            <div className="mb-8">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: 'rgba(99,102,241,0.12)' }}
              >
                <Mail size={24} style={{ color: 'var(--accent-primary)' }} />
              </div>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Verify your email
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                We sent a 6-digit code to{' '}
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {form.email}
                </span>
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4" noValidate>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                  Verification code
                </label>
                <input
                  type="text"
                  className="input-base text-center tracking-[0.3em] text-lg font-mono"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtp(val);
                  }}
                  maxLength={6}
                  autoComplete="one-time-code"
                  autoFocus
                  disabled={otpLoading}
                />
              </div>

              {otpSuccess && (
                <div
                  className="flex items-center gap-2 p-3 rounded-xl text-sm"
                  style={{
                    backgroundColor: 'rgba(34,197,94,0.08)',
                    color: 'var(--accent-success, #22c55e)',
                    border: '1px solid rgba(34,197,94,0.2)',
                  }}
                >
                  <CheckCircle size={16} />
                  {otpSuccess}
                </div>
              )}

              <ErrorMessage message={otpError} onDismiss={() => setOtpError('')} />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={otpLoading}
                className="w-full justify-center"
                disabled={otpLoading || !!otpSuccess}
              >
                {otpLoading ? 'Verifying…' : (
                  <>Verify email <ArrowRight size={16} /></>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || otpLoading}
                  className="font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ color: 'var(--accent-primary)' }}
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                </button>
              </p>
            </div>

            <p className="text-sm text-center mt-4" style={{ color: 'var(--text-secondary)' }}>
              <button
                type="button"
                onClick={() => { setStep('register'); setOtp(''); setOtpError(''); setOtpSuccess(''); }}
                className="font-semibold hover:underline"
                style={{ color: 'var(--text-muted)' }}
              >
                ← Back to registration
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
