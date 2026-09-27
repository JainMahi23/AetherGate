import { useState, useEffect } from 'react';
import {
  BarChart2,
  TrendingUp,
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Cpu,
  Info,
  Server
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { MetricCard } from '../components/dashboard/MetricCard';
import { Button } from '../components/ui/Button';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { EmptyState } from '../components/ui/EmptyState';
import { getMetrics } from '../services/metricsService';
import { getErrorMessage } from '../utils/errorMessages';
import { formatResponseTime } from '../utils/formatters';

const PROVIDER_COLORS = {
  GEMINI: '#3b82f6',
  GROQ: '#f59e0b',
  OPENAI: '#10b981',
  CLAUDE: '#8b5cf6',
};

export default function MetricsPage() {
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchMetricsData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    setError('');

    try {
      const res = await getMetrics();
      if (res?.data) {
        setMetrics(res.data);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMetricsData();
  }, []);

  // Compute aggregate statistics
  const providerEntries = Object.entries(metrics);
  const totalRequests = providerEntries.reduce((acc, [_, m]) => acc + (m.totalRequests || 0), 0);
  const totalSuccessful = providerEntries.reduce((acc, [_, m]) => acc + (m.successfulRequests || 0), 0);
  const totalFailed = providerEntries.reduce((acc, [_, m]) => acc + (m.failedRequests || 0), 0);

  const avgResponseTimeOverall =
    totalSuccessful > 0
      ? Math.round(
          providerEntries.reduce(
            (acc, [_, m]) => acc + (m.averageResponseTime || 0) * (m.successfulRequests || 0),
            0
          ) / totalSuccessful
        )
      : 0;

  // Chart data: requests distribution
  const chartData = providerEntries.map(([name, m]) => ({
    name,
    total: m.totalRequests || 0,
    successful: m.successfulRequests || 0,
    failed: m.failedRequests || 0,
    avgLatency: m.averageResponseTime || 0,
    lastLatency: m.lastResponseTime || 0,
  }));

  // Pie chart data for share of requests
  const pieData = chartData
    .filter((d) => d.total > 0)
    .map((d) => ({
      name: d.name,
      value: d.total,
      color: PROVIDER_COLORS[d.name] || '#6366f1',
    }));

  if (loading) return <PageLoader message="Loading routing telemetry..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <BarChart2 size={22} className="text-indigo-500" />
            Gateway Telemetry & Performance
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Real-time provider metrics, request volume, latency, and failure rates
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => fetchMetricsData(true)}
          loading={refreshing}
        >
          <RefreshCw size={14} />
          Refresh Metrics
        </Button>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      {/* Backend In-Memory Notice */}
      <div
        className="p-3.5 rounded-xl border flex items-center gap-2.5 text-xs"
        style={{
          backgroundColor: 'var(--bg-tertiary)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-secondary)',
        }}
      >
        <Info size={15} className="text-indigo-400 flex-shrink-0" />
        <span>
          <strong>Live Backend Metrics:</strong> Aggregated in-memory by Spring Boot <code>ProviderMetricsService</code>. Data updates live on each chat request and resets on gateway restart.
        </span>
      </div>

      {/* Aggregate KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Gateway Requests"
          value={totalRequests > 0 ? totalRequests.toLocaleString() : '0'}
          sub="Dispatched requests"
          icon={Activity}
          color="var(--accent-primary)"
        />

        <MetricCard
          title="Successful Responses"
          value={totalSuccessful > 0 ? totalSuccessful.toLocaleString() : '0'}
          sub={`${totalRequests > 0 ? ((totalSuccessful / totalRequests) * 100).toFixed(1) : 100}% Success Rate`}
          icon={CheckCircle2}
          color="var(--accent-success)"
        />

        <MetricCard
          title="Failed / Fallbacks"
          value={totalFailed}
          sub="Triggered routing fallback"
          icon={XCircle}
          color="var(--accent-danger)"
        />

        <MetricCard
          title="Average Latency"
          value={avgResponseTimeOverall > 0 ? formatResponseTime(avgResponseTimeOverall) : '—'}
          sub={avgResponseTimeOverall > 0 ? `${avgResponseTimeOverall} ms avg` : 'Awaiting requests'}
          icon={Clock}
          color="var(--accent-warning)"
        />
      </div>

      {totalRequests === 0 ? (
        <EmptyState
          icon={BarChart2}
          title="No live gateway metrics recorded yet"
          description="Send requests via Chat Playground to view real-time latency and throughput analytics."
        />
      ) : (
        <>
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Latency by Provider BarChart */}
            <div
              className="lg:col-span-2 card p-5 border shadow-sm space-y-4"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                    Provider Response Time Comparison (ms)
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Average latency recorded per model
                  </p>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                    <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--border-color)',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: 'var(--text-primary)',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Bar dataKey="avgLatency" name="Avg Latency (ms)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="lastLatency" name="Last Request (ms)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Provider Traffic Share Pie Chart */}
            <div
              className="card p-5 border shadow-sm space-y-4 flex flex-col justify-between"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div>
                <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  Request Distribution
                </h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Traffic share across AI providers
                </p>
              </div>

              <div className="h-52 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      innerRadius={40}
                      paddingAngle={5}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-center gap-4 text-xs font-medium">
                {pieData.map((p) => (
                  <div key={p.name} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{p.name}: {p.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Provider Performance Breakdown Table */}
          <div
            className="card border overflow-hidden shadow-sm"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                Provider-wise Breakdown
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr
                    className="border-b uppercase text-[11px] font-semibold tracking-wider"
                    style={{
                      backgroundColor: 'var(--bg-tertiary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <th className="py-3 px-4">Provider Code</th>
                    <th className="py-3 px-4">Total Calls</th>
                    <th className="py-3 px-4">Successful</th>
                    <th className="py-3 px-4">Failed</th>
                    <th className="py-3 px-4">Avg Latency</th>
                    <th className="py-3 px-4">Last Latency</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                  {providerEntries.map(([code, m]) => (
                    <tr key={code} className="hover:bg-slate-500/5 transition-colors">
                      <td className="py-3 px-4 font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        <Server size={14} className="text-indigo-400" />
                        {code}
                      </td>
                      <td className="py-3 px-4 font-mono">{m.totalRequests}</td>
                      <td className="py-3 px-4 font-mono text-emerald-500 font-medium">{m.successfulRequests}</td>
                      <td className="py-3 px-4 font-mono text-rose-500 font-medium">{m.failedRequests}</td>
                      <td className="py-3 px-4 font-mono font-semibold" style={{ color: 'var(--accent-primary)' }}>
                        {formatResponseTime(m.averageResponseTime)}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-slate-400">
                        {formatResponseTime(m.lastResponseTime)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
