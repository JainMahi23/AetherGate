import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Cloud,
  ShieldCheck,
  User,
  LogOut,
  Sliders,
  Check,
  KeyRound,
  Lock,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const CHAT_PREFS_KEY = 'aethergate_chat_preferences';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { theme, changeTheme } = useTheme();
  const { user, logout } = useAuth();

  const [chatPrefs, setChatPrefs] = useState(() => {
    try {
      const stored = localStorage.getItem(CHAT_PREFS_KEY);
      return stored
        ? JSON.parse(stored)
        : { defaultProvider: 'AUTO', enterToSend: true, smoothAnimations: true };
    } catch {
      return { defaultProvider: 'AUTO', enterToSend: true, smoothAnimations: true };
    }
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleUpdatePref = (key, value) => {
    const updated = { ...chatPrefs, [key]: value };
    setChatPrefs(updated);
    localStorage.setItem(CHAT_PREFS_KEY, JSON.stringify(updated));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in pb-12">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <SettingsIcon size={22} className="text-indigo-500" />
            Gateway Settings & Preferences
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Customize your gateway workspace, interface appearance, and inspect security parameters
          </p>
        </div>

        {savedSuccess && (
          <span className="text-xs px-2.5 py-1 rounded-md text-emerald-400 bg-emerald-500/10 flex items-center gap-1">
            <Check size={13} /> Settings Saved
          </span>
        )}
      </div>

      {/* 1. Appearance / Theme */}
      <div
        className="card p-5 border shadow-sm space-y-4"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="flex items-center gap-2">
          <Sun size={18} className="text-amber-400" />
          <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            Appearance & Workspace Theme
          </h2>
        </div>

        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          Choose your visual comfort mode. The preference is stored in your client sandbox.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: 'light',
              name: 'Light Mode',
              icon: Sun,
              desc: 'High contrast clean day interface',
              border: '#e2e8f0',
              bg: '#ffffff',
            },
            {
              id: 'dark',
              name: 'Dark Mode',
              icon: Moon,
              desc: 'Technical enterprise midnight aesthetic',
              border: '#334155',
              bg: '#1e293b',
            },
            {
              id: 'night',
              name: 'Night Mode',
              icon: Cloud,
              desc: 'Ultra deep low-light OLED black',
              border: '#1a2a40',
              bg: '#060b18',
            },
          ].map((mode) => {
            const isSelected = theme === mode.id;
            const Icon = mode.icon;

            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => changeTheme(mode.id)}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                  isSelected ? 'ring-2 ring-indigo-500 shadow-md' : 'opacity-80 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-color)',
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
                  >
                    <Icon size={16} />
                  </div>
                  {isSelected && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400">
                      Active
                    </span>
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {mode.name}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {mode.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Chat Preferences */}
      <div
        className="card p-5 border shadow-sm space-y-4"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="flex items-center gap-2">
          <Sliders size={18} className="text-indigo-400" />
          <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            Chat & Routing Preferences
          </h2>
        </div>

        <div className="space-y-4 divide-y" style={{ borderColor: 'var(--border-color)' }}>
          {/* Default Routing Target */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Default Provider Routing
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Preferred provider preselected when loading Chat Playground
              </div>
            </div>

            <select
              value={chatPrefs.defaultProvider}
              onChange={(e) => handleUpdatePref('defaultProvider', e.target.value)}
              className="input-base text-xs py-1.5 px-3 w-44"
            >
              <option value="AUTO">AUTO (Intelligent Route)</option>
              <option value="GEMINI">Google Gemini</option>
              <option value="GROQ">Groq Cloud</option>
            </select>
          </div>

          {/* Enter to Send */}
          <div className="pt-4 flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Keyboard Send Shortcut
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Pressing <kbd className="px-1 py-0.5 rounded border text-[11px]">Enter</kbd> sends prompt (<kbd className="px-1 py-0.5 rounded border text-[11px]">Shift+Enter</kbd> for newline)
              </div>
            </div>

            <input
              type="checkbox"
              checked={chatPrefs.enterToSend}
              onChange={(e) => handleUpdatePref('enterToSend', e.target.checked)}
              className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>

          {/* UI Animations */}
          <div className="pt-4 flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Routing Visual Pipeline Animations
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Display animated pipeline nodes during gateway routing simulation
              </div>
            </div>

            <input
              type="checkbox"
              checked={chatPrefs.smoothAnimations}
              onChange={(e) => handleUpdatePref('smoothAnimations', e.target.checked)}
              className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 3. Security Status */}
      <div
        className="card p-5 border shadow-sm space-y-4"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-emerald-400" />
          <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            Security & Authentication Architecture
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg border space-y-1" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
            <div className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
              Authentication Standard
            </div>
            <div className="font-medium text-emerald-400 flex items-center gap-1.5">
              <Lock size={13} /> JWT Bearer Token (Stateless Session)
            </div>
            <div className="text-[11px] text-slate-400">
              Injected into Authorization header on all protected API calls
            </div>
          </div>

          <div className="p-3 rounded-lg border space-y-1" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
            <div className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
              Gateway Secret Isolation
            </div>
            <div className="font-medium text-indigo-400 flex items-center gap-1.5">
              <KeyRound size={13} /> Strict Zero-Client Secret Storage
            </div>
            <div className="text-[11px] text-slate-400">
              Provider API keys reside entirely on Spring Boot server
            </div>
          </div>
        </div>
      </div>

      {/* 4. User Account & Session */}
      <div
        className="card p-5 border shadow-sm space-y-4"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="flex items-center gap-2">
          <User size={18} className="text-blue-400" />
          <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            Current Authenticated Account
          </h2>
        </div>

        {user ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm"
                style={{ backgroundColor: 'var(--accent-primary)' }}
              >
                {user.displayName?.charAt(0) || 'U'}
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  {user.displayName}
                </div>
                <div className="text-xs font-mono text-slate-400">
                  {user.email}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant={user.isAdmin ? 'purple' : 'info'}>
                {user.role}
              </Badge>

              <Button
                variant="secondary"
                size="sm"
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 border-red-500/20"
              >
                <LogOut size={14} />
                Sign Out
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-400">
            No active session detected.
          </div>
        )}
      </div>
    </div>
  );
}
