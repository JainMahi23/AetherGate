import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Server, CheckCircle, Activity, Zap, RefreshCw, ArrowRight, GitBranch } from 'lucide-react';
import { MetricCard } from '../components/dashboard/MetricCard';
import { ProviderStatusCard } from '../components/dashboard/ProviderStatusCard';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { Button } from '../components/ui/Button';
import { getAllProviders } from '../services/providerService';
import { getMetrics } from '../services/metricsService';
import { getErrorMessage } from '../utils/errorMessages';
import { formatResponseTime } from '../utils/formatters';

export default function DashboardPage() {
  const [providers, setProviders] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');

    try {
      const [provRes, metRes] = await Promise.allSettled([
        getAllProviders(),
        getMetrics(),
      ]);

      if (provRes.status === 'fulfilled') {
        setProviders(provRes.value?.data || []);
      } else {
        setError(getErrorMessage(provRes.reason));
      }

      if (metRes.status === 'fulfilled') {
        setMetrics(metRes.value?.data || {});
      }
      // Metrics failure is non-blocking
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const totalProviders = providers.length;
  const activeProviders = providers.filter((p) => p.enabled && p.healthy).length;

  // Aggregate metrics across all providers
  const allMetrics = Object.values(metrics);
  const totalRequests = allMetrics.reduce((sum, m) => sum + (m.totalRequests || 0), 0);
  const totalSuccessful = allMetrics.reduce((sum, m) => sum + (m.successfulRequests || 0), 0);
  const avgResponseTime = allMetrics.length > 0
    ? Math.round(allMetrics.reduce((sum, m) => sum + (m.averageResponseTime || 0), 0) / allMetrics.length)
    : null;

  if (loading) return <PageLoader message="Loading dashboard…" />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Dashboard
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            One Gateway. Multiple AI Models. Intelligent Routing.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          loading={refreshing}
          onClick={() => fetchData(true)}
        >
          <RefreshCw size={14} />
          Refresh
        </Button>
      </div>

      {/* Error */}
      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Providers"
          value={totalProviders}
          sub="Configured in gateway"
          icon={Server}
          color="var(--accent-info)"
        />
        <MetricCard
          title="Active Providers"
          value={activeProviders}
          sub={`${totalProviders - activeProviders} unavailable`}
          icon={CheckCircle}
          color="var(--accent-success)"
        />
        <MetricCard
          title="Total Requests"
          value={totalRequests > 0 ? totalRequests.toLocaleString() : '—'}
          sub={totalRequests > 0 ? `${totalSuccessful} successful` : 'Session metrics'}
          icon={Activity}
          color="var(--accent-primary)"
        />
        <MetricCard
          title="Avg Response Time"
          value={avgResponseTime !== null ? formatResponseTime(avgResponseTime) : '—'}
          sub={avgResponseTime ? 'Across providers' : 'No requests yet'}
          icon={Zap}
          color="var(--accent-warning)"
        />
      </div>

      {/* Gateway flow visualization */}
      <div
        className="card p-6"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <div className="flex items-center gap-2 mb-5">
          <GitBranch size={18} style={{ color: 'var(--accent-primary)' }} />
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            Gateway Architecture
          </h2>
        </div>

        <div className="flex items-center gap-2 flex-wrap text-sm">
          {[
            { label: 'Your Request', color: 'var(--accent-info)' },
            null, // arrow
            { label: 'AetherGate', color: 'var(--accent-primary)', highlight: true },
            null,
            { label: 'Routing Engine', color: 'var(--accent-warning)' },
            null,
            { label: 'Gemini / Groq', color: 'var(--accent-success)' },
            null,
            { label: 'Response', color: 'var(--accent-info)' },
          ].map((item, i) =>
            item === null ? (
              <ArrowRight key={i} size={16} style={{ color: 'var(--text-muted)' }} />
            ) : (
              <div
                key={i}
                className="px-3 py-1.5 rounded-lg font-medium text-xs"
                style={{
                  backgroundColor: item.highlight
                    ? 'var(--accent-primary)'
                    : `${item.color}15`,
                  color: item.highlight ? 'white' : item.color,
                  border: `1px solid ${item.color}30`,
                }}
              >
                {item.label}
              </div>
            )
          )}
        </div>

        <p className="text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
          AetherGate intelligently routes every request to the best available AI provider based on priority, health, and availability.
        </p>
      </div>

      {/* Provider status */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            Provider Status
          </h2>
          <button
            onClick={() => navigate('/providers')}
            className="text-xs font-medium flex items-center gap-1 transition-opacity hover:opacity-70"
            style={{ color: 'var(--accent-primary)' }}
          >
            Manage providers <ArrowRight size={12} />
          </button>
        </div>

        {providers.length === 0 ? (
          <div
            className="card p-8 text-center"
            style={{ color: 'var(--text-muted)', fontSize: '14px' }}
          >
            No providers configured yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {providers.map((p) => (
              <ProviderStatusCard key={p.id} provider={p} />
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => navigate('/chat')}
          className="card p-5 text-left hover:shadow-lg-theme transition-all duration-200 group"
          style={{ cursor: 'pointer' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                style={{ backgroundColor: 'rgba(99,102,241,0.12)' }}
              >
                <Zap size={18} style={{ color: 'var(--accent-primary)' }} />
              </div>
              <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                Chat Playground
              </div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                Send prompts and see routing in action
              </div>
            </div>
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
              style={{ color: 'var(--text-muted)' }}
            />
          </div>
        </button>

        <button
          onClick={() => navigate('/metrics')}
          className="card p-5 text-left hover:shadow-lg-theme transition-all duration-200 group"
          style={{ cursor: 'pointer' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                style={{ backgroundColor: 'rgba(59,130,246,0.12)' }}
              >
                <Activity size={18} style={{ color: 'var(--accent-info)' }} />
              </div>
              <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                Metrics & Analytics
              </div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                View provider performance data
              </div>
            </div>
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
              style={{ color: 'var(--text-muted)' }}
            />
          </div>
        </button>
      </div>
    </div>
  );
}
