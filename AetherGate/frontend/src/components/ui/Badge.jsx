/**
 * StatusBadge — displays provider health/enabled states.
 * variant: 'success' | 'danger' | 'warning' | 'info' | 'neutral'
 */
export function Badge({ children, variant = 'neutral', dot = false, className = '' }) {
  const variants = {
    success: { bg: 'rgba(16,185,129,0.12)', color: 'var(--accent-success)', dot: '#10b981' },
    danger:  { bg: 'rgba(239,68,68,0.12)',  color: 'var(--accent-danger)',  dot: '#ef4444' },
    warning: { bg: 'rgba(245,158,11,0.12)', color: 'var(--accent-warning)', dot: '#f59e0b' },
    info:    { bg: 'rgba(59,130,246,0.12)', color: 'var(--accent-info)',    dot: '#3b82f6' },
    neutral: { bg: 'var(--bg-tertiary)',    color: 'var(--text-secondary)', dot: 'var(--text-muted)' },
    purple:  { bg: 'rgba(139,92,246,0.12)',color: '#8b5cf6',               dot: '#8b5cf6' },
  };

  const style = variants[variant] || variants.neutral;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}
      style={{ backgroundColor: style.bg, color: style.color }}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse-dot"
          style={{ backgroundColor: style.dot }}
        />
      )}
      {children}
    </span>
  );
}
