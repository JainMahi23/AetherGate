import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../services/authService';
import { getErrorMessage } from '../utils/errorMessages';
import { Button } from '../components/ui/Button';
import { ErrorMessage } from '../components/ui/ErrorMessage';

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
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
      const result = await registerUser(fullName.trim(), email.trim(), password);
      if (result?.data?.accessToken) {
        login(result.data.accessToken);
        navigate('/dashboard');
      } else {
        setError('Unexpected response from server. Please try again.');
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
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

        <div className="mb-8">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Create account
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Join the AetherGate platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
      </div>
    </div>
  );
}
