import { useState } from 'react';
import { Bookmark, Check, Copy, Clock, Cpu, CheckCircle2, Bot, Zap, Share2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatResponseTime } from '../../utils/formatters';

export function ChatResponse({ responseData, prompt, onSave, isSaved }) {
  const [copied, setCopied] = useState(false);

  if (!responseData) return null;

  const { provider, response, responseTime } = responseData;

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isGemini = provider?.toUpperCase() === 'GEMINI';
  const isGroq = provider?.toUpperCase() === 'GROQ';

  return (
    <div
      className="card p-5 border shadow-sm animate-fade-in space-y-4"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
      }}
    >
      {/* Header bar with routing result */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <div className="flex flex-wrap items-center gap-2">
          {/* Provider pill */}
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-sm"
            style={{
              backgroundColor: isGemini
                ? 'rgba(59,130,246,0.15)'
                : isGroq
                ? 'rgba(245,158,11,0.15)'
                : 'rgba(99,102,241,0.15)',
              color: isGemini
                ? 'var(--accent-info)'
                : isGroq
                ? 'var(--accent-warning)'
                : 'var(--accent-primary)',
              border: `1px solid ${
                isGemini
                  ? 'rgba(59,130,246,0.3)'
                  : isGroq
                  ? 'rgba(245,158,11,0.3)'
                  : 'rgba(99,102,241,0.3)'
              }`,
            }}
          >
            {isGemini ? <Bot size={14} /> : isGroq ? <Zap size={14} /> : <Cpu size={14} />}
            <span>✓ Routed to {provider}</span>
          </div>

          {/* Latency badge */}
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-medium"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
            }}
          >
            <Clock size={13} />
            <span>{responseTime} ms ({formatResponseTime(responseTime)})</span>
          </div>

          {/* Status badge */}
          <Badge variant="success" dot={true}>
            Success (200 OK)
          </Badge>
        </div>

        {/* Action buttons: Copy & Save to History */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleCopy}
            className="text-xs py-1.5 px-3"
          >
            {copied ? (
              <>
                <Check size={14} className="text-emerald-500" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy</span>
              </>
            )}
          </Button>

          {onSave && (
            <Button
              type="button"
              variant={isSaved ? 'secondary' : 'primary'}
              size="sm"
              onClick={onSave}
              disabled={isSaved}
              className="text-xs py-1.5 px-3"
            >
              <Bookmark size={14} className={isSaved ? 'text-indigo-400 fill-indigo-400' : ''} />
              <span>{isSaved ? 'Saved to History' : 'Save Work'}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Prompt preview if available */}
      {prompt && (
        <div
          className="p-3 rounded-lg text-xs border"
          style={{
            backgroundColor: 'var(--bg-tertiary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-secondary)',
          }}
        >
          <span className="font-semibold text-slate-400 block mb-1">PROMPT:</span>
          <p className="line-clamp-2 italic">{prompt}</p>
        </div>
      )}

      {/* Main Response Output */}
      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          Generated Output
        </div>
        <div
          className="response-content text-sm leading-relaxed whitespace-pre-wrap select-text p-4 rounded-xl border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)',
            minHeight: '120px',
          }}
        >
          {response}
        </div>
      </div>

      {/* Gateway telemetry footer */}
      <div
        className="flex flex-wrap items-center justify-between text-[11px] pt-3 border-t font-mono"
        style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
      >
        <span>Provider Model: {isGemini ? 'gemini-2.5-flash' : isGroq ? 'openai/gpt-oss-120b' : 'Custom'}</span>
        <span>AetherGate Gateway Engine v1.0.0</span>
      </div>
    </div>
  );
}
