import { AlertTriangle, X } from 'lucide-react';

export function ErrorMessage({ message, onDismiss, className = '' }) {
  if (!message) return null;
  return (
    <div
      className={`flex items-start gap-3 p-3.5 rounded-lg text-sm ${className}`}
      style={{
        backgroundColor: 'rgba(239,68,68,0.08)',
        border: '1px solid rgba(239,68,68,0.25)',
        color: 'var(--accent-danger)',
      }}
    >
      <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
      <span className="flex-1">{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="flex-shrink-0 hover:opacity-70 transition-opacity">
          <X size={14} />
        </button>
      )}
    </div>
  );
}

export function SuccessMessage({ message, className = '' }) {
  if (!message) return null;
  return (
    <div
      className={`flex items-start gap-3 p-3.5 rounded-lg text-sm ${className}`}
      style={{
        backgroundColor: 'rgba(16,185,129,0.08)',
        border: '1px solid rgba(16,185,129,0.25)',
        color: 'var(--accent-success)',
      }}
    >
      <span>✓</span>
      <span>{message}</span>
    </div>
  );
}
