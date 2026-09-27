export function Card({ children, className = '', padding = true, hover = false }) {
  return (
    <div
      className={`card ${padding ? 'p-5' : ''} ${hover ? 'hover:shadow-lg-theme transition-shadow duration-200 cursor-pointer' : ''} ${className}`}
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
    >
      {children}
    </div>
  );
}
