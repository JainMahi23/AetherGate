import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Check, Trash2, ArrowUpRight, Clock, Bot, Zap, Cpu } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatDateTime, formatResponseTime } from '../../utils/formatters';

export function HistoryCard({ item, onDelete }) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const { id, prompt, response, provider, responseTime, timestamp } = item;

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReopenInPlayground = () => {
    navigate('/chat', {
      state: {
        prompt,
        response,
        provider,
        responseTime,
      },
    });
  };

  const isGemini = provider?.toUpperCase() === 'GEMINI';
  const isGroq = provider?.toUpperCase() === 'GROQ';

  return (
    <div
      className="card p-5 border shadow-sm space-y-3.5 hover:shadow-md transition-shadow"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
      }}
    >
      {/* Top row: Provider, Latency, Date, Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Provider badge */}
          <span
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: isGemini ? 'rgba(59,130,246,0.12)' : isGroq ? 'rgba(245,158,11,0.12)' : 'rgba(99,102,241,0.12)',
              color: isGemini ? 'var(--accent-info)' : isGroq ? 'var(--accent-warning)' : 'var(--accent-primary)',
            }}
          >
            {isGemini ? <Bot size={13} /> : isGroq ? <Zap size={13} /> : <Cpu size={13} />}
            {provider || 'GATEWAY'}
          </span>

          {/* Response time */}
          {responseTime && (
            <span className="text-xs font-mono font-medium text-slate-400">
              {formatResponseTime(responseTime)}
            </span>
          )}

          {/* Timestamp */}
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock size={12} />
            {formatDateTime(timestamp)}
          </span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReopenInPlayground}
            className="p-1.5 h-8 text-xs text-indigo-400 hover:text-indigo-300"
            title="Open in Playground"
          >
            <span className="hidden sm:inline mr-1">Reopen</span>
            <ArrowUpRight size={14} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="p-1.5 h-8 text-slate-400 hover:text-slate-200"
            title="Copy Response"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(id)}
            className="p-1.5 h-8 text-slate-400 hover:text-red-400"
            title="Delete from history"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>

      {/* Prompt summary */}
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
          Prompt
        </div>
        <p className="text-sm font-medium leading-snug line-clamp-2" style={{ color: 'var(--text-primary)' }}>
          {prompt}
        </p>
      </div>

      {/* Response snippet */}
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
          Response
        </div>
        <div
          className="p-3 rounded-lg text-xs leading-relaxed line-clamp-3 select-text border font-sans"
          style={{
            backgroundColor: 'var(--bg-tertiary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-secondary)',
          }}
        >
          {response}
        </div>
      </div>
    </div>
  );
}
