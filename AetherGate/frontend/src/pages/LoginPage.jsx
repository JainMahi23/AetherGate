import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/authService';
import { getErrorMessage } from '../utils/errorMessages';
import { Button } from '../components/ui/Button';
import { ErrorMessage } from '../components/ui/ErrorMessage';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) { setError('Email is required.'); return; }
    if (!password)     { setError('Password is required.'); return; }

    setLoading(true);
    try {
      const result = await loginUser(email.trim(), password);
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
      className="min-h-screen flex"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Left branding panel */}
      <div
        className="hidden lg:flex flex-col justify-between p-12 w-[420px] flex-shrink-0"
        style={{ backgroundColor: 'var(--bg-sidebar)' }}
      >
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              <Zap size={20} color="white" />
            </div>
            <span className="text-white font-bold text-lg tracking-wider">AETHERGATE</span>
          </div>

          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white leading-tight">
              Enterprise Intelligent<br />Multi-LLM Gateway
            </h1>
            <p className="text-base" style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>
              One Gateway. Multiple AI Models. Intelligent Routing.
            </p>
          </div>

          {/* Feature badges */}
          <div className="mt-10 space-y-3">
            {[
              { label: 'Gemini 2.5 Flash', sub: 'Google AI' },
              { label: 'Groq / GPT-OSS-120B', sub: 'Ultra-fast inference' },
              { label: 'Intelligent Routing', sub: 'Priority-based provider selection' },
            ].map((f) => (
              <div
                key={f.label}
                className="flex items-start gap-3 p-3 rounded-xl"
                style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div
                  className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                  style={{ backgroundColor: 'var(--accent-primary)' }}
                />
                <div>
                  <div className="text-white text-sm font-medium">{f.label}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{f.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
          © 2026 AetherGate · Enterprise AI Gateway
        </div>
      </div>

      {/* Right login panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
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
              Welcome back
            </h2>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Sign in to access the gateway
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1.5"
                style={{ color: 'var(--text-primary)' }}
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="input-base"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1.5"
                style={{ color: 'var(--text-primary)' }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="input-base pr-10"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
                  style={{ color: 'var(--text-muted)' }}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            <ErrorMessage message={error} onDismiss={() => setError('')} />

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full justify-center"
            >
              {loading ? 'Signing in…' : (
                <>Sign in <ArrowRight size={16} /></>
              )}
            </Button>
          </form>

          {/* Register link */}
          <p className="text-sm text-center mt-6" style={{ color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold transition-colors hover:underline"
              style={{ color: 'var(--accent-primary)' }}
            >
              Create account
            </Link>
          </p>

          {/* Security notice */}
          <div
            className="mt-8 p-3 rounded-xl text-xs text-center"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-color)',
            }}
          >
            🔒 Secured by JWT authentication · Your credentials are never stored in the browser
          </div>
        </div>
      </div>
    </div>
  );
}
