import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, MessageSquare, Server, History,
  BarChart2, Settings, HelpCircle, LogOut,
  ChevronLeft, ChevronRight, Zap, Menu, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/chat',      icon: MessageSquare,   label: 'Chat Playground' },
  { path: '/providers', icon: Server,           label: 'Providers' },
  { path: '/history',   icon: History,          label: 'History' },
  { path: '/metrics',   icon: BarChart2,        label: 'Metrics' },
  { path: '/help',      icon: HelpCircle,       label: 'Help & FAQ' },
  { path: '/settings',  icon: Settings,         label: 'Settings' },
];

function NavItem({ item, collapsed, onClick }) {
  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative ${
          isActive
            ? 'text-white'
            : ''
        }`
      }
      style={({ isActive }) => ({
        backgroundColor: isActive ? 'var(--accent-primary)' : 'transparent',
        color: isActive ? '#ffffff' : 'var(--text-sidebar)',
      })}
      onMouseEnter={(e) => {
        if (!e.currentTarget.classList.contains('active')) {
          e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)';
          e.currentTarget.style.color = 'var(--text-sidebar-active)';
        }
      }}
      onMouseLeave={(e) => {
        const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = 'var(--text-sidebar)';
        }
      }}
    >
      <item.icon size={18} className="flex-shrink-0" />
      {!collapsed && <span className="truncate">{item.label}</span>}
      {collapsed && (
        <span
          className="absolute left-full ml-2 px-2 py-1 rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {item.label}
        </span>
      )}
    </NavLink>
  );
}

// Desktop sidebar
export function Sidebar({ collapsed, onToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className="hidden md:flex flex-col h-screen sticky top-0 flex-shrink-0 transition-all duration-300"
      style={{
        width: collapsed ? '64px' : '220px',
        backgroundColor: 'var(--bg-sidebar)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 py-5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', minHeight: '72px' }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'var(--accent-primary)' }}
        >
          <Zap size={16} color="white" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in overflow-hidden">
            <div className="text-white text-sm font-bold leading-tight tracking-wide">
              AETHERGATE
            </div>
            <div className="text-xs leading-tight" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
              Multi-LLM Gateway
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.path} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Footer */}
      <div
        className="px-2 py-3 space-y-0.5"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* User info */}
        {!collapsed && user && (
          <div className="px-3 py-2 mb-1 animate-fade-in">
            <div className="text-xs font-medium text-white truncate">{user.displayName}</div>
            <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
              {user.email}
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
          style={{ color: 'var(--text-sidebar)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.15)';
            e.currentTarget.style.color = '#f87171';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--text-sidebar)';
          }}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)';
            e.currentTarget.style.color = 'var(--text-sidebar-active)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
        >
          {collapsed
            ? <ChevronRight size={16} className="flex-shrink-0" />
            : <><ChevronLeft size={16} /><span>Collapse</span></>
          }
        </button>
      </div>
    </aside>
  );
}

// Mobile drawer
export function MobileSidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose();
  };

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 md:hidden"
        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        onClick={onClose}
      />
      {/* Drawer */}
      <aside
        className="fixed left-0 top-0 bottom-0 z-50 w-64 flex flex-col animate-slide-left md:hidden"
        style={{
          backgroundColor: 'var(--bg-sidebar)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              <Zap size={16} color="white" />
            </div>
            <div>
              <div className="text-white text-sm font-bold tracking-wide">AETHERGATE</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
                Multi-LLM Gateway
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.path} item={item} collapsed={false} onClick={onClose} />
          ))}
        </nav>

        <div className="px-2 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {user && (
            <div className="px-3 py-2 mb-1">
              <div className="text-xs font-medium text-white truncate">{user.displayName}</div>
              <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user.email}</div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium"
            style={{ color: 'var(--text-sidebar)' }}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
