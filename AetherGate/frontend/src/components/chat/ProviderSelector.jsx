import { Cpu, Sparkles, Zap, Bot } from 'lucide-react';
import { InfoTooltip } from '../ui/Tooltip';

const PROVIDER_OPTIONS = [
  {
    id: 'AUTO',
    name: 'Auto Route',
    subtitle: 'Gateway determines optimal provider',
    icon: Sparkles,
    badge: 'Recommended',
    color: 'var(--accent-primary)',
  },
  {
    id: 'GEMINI',
    name: 'Google Gemini',
    subtitle: 'gemini-2.5-flash',
    icon: Bot,
    badge: 'Online',
    color: 'var(--accent-info)',
  },
  {
    id: 'GROQ',
    name: 'Groq Cloud',
    subtitle: 'openai/gpt-oss-120b',
    icon: Zap,
    badge: 'Online',
    color: 'var(--accent-warning)',
  },
];

export function ProviderSelector({ selectedProvider, onSelectProvider, disabled = false }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
          <Cpu size={14} />
          Routing Strategy / Target Provider
          <InfoTooltip content="Auto mode lets AetherGate intelligently select the healthiest, highest-priority provider. Or manually force routing to a specific provider." />
        </label>
        <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
          Selected: <strong style={{ color: 'var(--accent-primary)' }}>{selectedProvider}</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {PROVIDER_OPTIONS.map((opt) => {
          const isSelected = selectedProvider === opt.id;
          const Icon = opt.icon;

          return (
            <button
              key={opt.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectProvider(opt.id)}
              className={`p-3 rounded-xl text-left border transition-all duration-200 cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'ring-2 ring-indigo-500 shadow-md'
                  : 'hover:border-slate-400 opacity-85 hover:opacity-100'
              }`}
              style={{
                backgroundColor: isSelected ? 'var(--bg-secondary)' : 'var(--bg-tertiary)',
                borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-color)',
              }}
            >
              <div className="flex items-start justify-between w-full mb-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: isSelected ? `${opt.color}25` : 'var(--bg-card)',
                    color: opt.color,
                  }}
                >
                  <Icon size={16} />
                </div>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: opt.id === 'AUTO' ? 'rgba(99,102,241,0.15)' : 'rgba(16,185,129,0.15)',
                    color: opt.id === 'AUTO' ? 'var(--accent-primary)' : 'var(--accent-success)',
                  }}
                >
                  {opt.badge}
                </span>
              </div>

              <div>
                <div className="text-sm font-semibold flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                  {opt.name}
                </div>
                <div className="text-xs truncate mt-0.5 font-mono" style={{ color: 'var(--text-muted)' }}>
                  {opt.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
