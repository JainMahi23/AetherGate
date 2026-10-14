import { useState } from 'react';
import { Bookmark, Check, Copy, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';

export function ChatResponse({ responseData, prompt, onSave, isSaved }) {
  const [copied, setCopied] = useState(false);

  if (!responseData) return null;

  const { response, sources } = responseData;

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="card p-5 border shadow-sm animate-fade-in space-y-4"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
      }}
    >
      {/* Prompt preview */}
      {prompt && (
        <div
          className="p-3 rounded-lg text-xs border"
          style={{
            backgroundColor: 'var(--bg-tertiary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-secondary)',
          }}
        >
          <span className="font-semibold block mb-1" style={{ color: 'var(--text-muted)' }}>You asked:</span>
          <p className="line-clamp-2 italic">{prompt}</p>
        </div>
      )}

      {/* Main Response */}
      <div
        className="response-content text-sm leading-relaxed whitespace-pre-wrap select-text p-4 rounded-xl border"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
          minHeight: '80px',
        }}
      >
        {response}
      </div>

      {/* Sources (if web search was used) */}
      {sources && sources.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
            Sources
          </div>
          <div className="flex flex-wrap gap-2">
            {sources.map((source, idx) => (
              <a
                key={idx}
                href={source.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:opacity-80"
                style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--accent-primary)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <ExternalLink size={12} />
                <span className="truncate max-w-[200px]">{source.title}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div
        className="flex items-center gap-2 pt-3 border-t"
        style={{ borderColor: 'var(--border-color)' }}
      >
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
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
