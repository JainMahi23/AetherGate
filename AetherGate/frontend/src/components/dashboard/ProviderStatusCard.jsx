import { Badge } from '../ui/Badge';
import { InfoTooltip } from '../ui/Tooltip';
import { formatResponseTime } from '../../utils/formatters';
import { Server, Zap } from 'lucide-react';

const PROVIDER_ICONS = {
  GEMINI: '✦',
  GROQ:   '⚡',
};

export function ProviderStatusCard({ provider }) {
  const isOnline = provider.enabled && provider.healthy;
  const isDisabled = !provider.enabled;

  return (
    <div
      className="card p-5 relative overflow-hidden"
      style={{
        borderLeft: `3px solid ${
          isOnline ? 'var(--accent-success)' : isDisabled ? 'var(--text-muted)' : 'var(--accent-danger)'
        }`,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-base font-bold"
            style={{
              backgroundColor: isOnline ? 'rgba(16,185,129,0.1)' : 'var(--bg-tertiary)',
              color: isOnline ? 'var(--accent-success)' : 'var(--text-muted)',
            }}
          >
            {PROVIDER_ICONS[provider.providerCode] || <Server size={16} />}
          </div>
          <div>
            <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
              {provider.providerName || provider.providerCode}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {provider.providerCode}
            </div>
          </div>
        </div>

        <Badge
          variant={isOnline ? 'success' : isDisabled ? 'neutral' : 'danger'}
          dot={isOnline}
        >
          {isOnline ? 'Online' : isDisabled ? 'Disabled' : 'Unhealthy'}
        </Badge>
      </div>

      {/* Details */}
      <div className="space-y-2.5">
        <InfoRow
          label="Model"
          value={provider.modelName}
          tooltip="The AI model this provider uses to generate responses."
        />
        <InfoRow
          label="Priority"
          value={`#${provider.priority}`}
          tooltip="Provider priority determines the routing order. Lower number = higher priority."
        />
        <InfoRow
          label="Status"
          value={
            <Badge variant={provider.healthy ? 'success' : 'danger'}>
              {provider.healthy ? 'Healthy' : 'Unhealthy'}
            </Badge>
          }
          tooltip="Indicates whether this provider is marked healthy by AetherGate."
        />
        <InfoRow
          label="Timeout"
          value={formatResponseTime(provider.timeoutMs)}
          tooltip="Maximum time AetherGate will wait for a response from this provider."
        />
      </div>

      {/* Subtle glow when online */}
      {isOnline && (
        <div
          className="absolute -top-6 -right-6 w-24 h-24 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)' }}
        />
      )}
    </div>
  );
}

function InfoRow({ label, value, tooltip }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-0.5" style={{ color: 'var(--text-secondary)' }}>
        {label}
        {tooltip && <InfoTooltip content={tooltip} />}
      </span>
      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
        {value}
      </span>
    </div>
  );
}
