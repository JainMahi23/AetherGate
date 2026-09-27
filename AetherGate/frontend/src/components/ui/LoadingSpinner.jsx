export function LoadingSpinner({ size = 'md', message = '' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
  };
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <svg
        className={`${sizes[size]} animate-spin`}
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12" cy="12" r="10"
          stroke="var(--accent-primary)"
          strokeWidth="3"
        />
        <path
          className="opacity-75"
          fill="var(--accent-primary)"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      {message && (
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {message}
        </p>
      )}
    </div>
  );
}

export function PageLoader({ message = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center h-64">
      <LoadingSpinner size="lg" message={message} />
    </div>
  );
}
