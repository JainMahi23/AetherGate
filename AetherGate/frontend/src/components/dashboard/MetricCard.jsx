import { TrendingUp } from 'lucide-react';

export function MetricCard({ title, value, sub, icon: Icon, color = 'var(--accent-primary)', loading = false }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          {title}
        </div>
        {Icon && (
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${color}18` }}
          >
            <Icon size={18} style={{ color }} />
          </div>
        )}
      </div>

      {loading ? (
        <div className="h-8 rounded shimmer" />
      ) : (
        <div
          className="text-2xl font-bold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          {value ?? '—'}
        </div>
      )}

      {sub && !loading && (
        <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          {sub}
        </div>
      )}
    </div>
  );
}
