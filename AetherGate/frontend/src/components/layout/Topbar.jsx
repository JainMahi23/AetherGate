import { Menu, Sun, Moon, Cloud, User } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Tooltip } from '../ui/Tooltip';

const THEME_CONFIG = [
  { key: 'light', icon: Sun,   label: 'Light' },
  { key: 'dark',  icon: Moon,  label: 'Dark' },
  { key: 'night', icon: Cloud, label: 'Night' },
];

export function Topbar({ onMenuToggle, pageTitle }) {
  const { theme, changeTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header
      className="flex items-center justify-between px-4 md:px-6 h-16 flex-shrink-0 sticky top-0 z-30"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
      }}
    >
      {/* Left side */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-lg transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          <Menu size={20} />
        </button>

        {pageTitle && (
          <h1 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            {pageTitle}
          </h1>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Theme switcher */}
        <div
          className="flex items-center gap-0.5 p-1 rounded-lg"
          style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
        >
          {THEME_CONFIG.map(({ key, icon: Icon, label }) => (
            <Tooltip key={key} content={`${label} mode`} position="bottom">
              <button
                onClick={() => changeTheme(key)}
                className="p-1.5 rounded-md transition-all duration-150"
                style={{
                  backgroundColor: theme === key ? 'var(--bg-secondary)' : 'transparent',
                  color: theme === key ? 'var(--accent-primary)' : 'var(--text-muted)',
                  boxShadow: theme === key ? 'var(--shadow-sm)' : 'none',
                }}
              >
                <Icon size={15} />
              </button>
            </Tooltip>
          ))}
        </div>

        {/* User avatar */}
        {user && (
          <div
            className="flex items-center gap-2 pl-2 ml-1"
            style={{ borderLeft: '1px solid var(--border-color)' }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
              style={{ backgroundColor: 'var(--accent-primary)', color: 'white' }}
            >
              {user.displayName?.charAt(0)?.toUpperCase() || <User size={14} />}
            </div>
            <span
              className="text-sm font-medium hidden sm:block"
              style={{ color: 'var(--text-primary)' }}
            >
              {user.displayName}
            </span>
            {user.isAdmin && (
              <span
                className="text-xs px-1.5 py-0.5 rounded-md font-medium hidden sm:block"
                style={{
                  backgroundColor: 'rgba(139,92,246,0.12)',
                  color: '#8b5cf6',
                  fontSize: '10px',
                }}
              >
                ADMIN
              </span>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
