import { useState, useRef, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

export function Tooltip({ content, children, position = 'top' }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  const positionClasses = {
    top:    'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left:   'right-full top-1/2 -translate-y-1/2 mr-2',
    right:  'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <span
      ref={ref}
      className="relative inline-flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span
          className={`absolute z-50 w-56 text-xs rounded-lg px-3 py-2 pointer-events-none animate-fade-in ${positionClasses[position]}`}
          style={{
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-lg)',
            lineHeight: '1.5',
          }}
        >
          {content}
        </span>
      )}
    </span>
  );
}

export function InfoTooltip({ content, position = 'top' }) {
  return (
    <Tooltip content={content} position={position}>
      <HelpCircle
        size={14}
        className="cursor-help ml-1"
        style={{ color: 'var(--text-muted)' }}
      />
    </Tooltip>
  );
}
