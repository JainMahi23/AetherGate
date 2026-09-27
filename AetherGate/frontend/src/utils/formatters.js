/**
 * Format milliseconds to a readable response time string.
 */
export function formatResponseTime(ms) {
  if (ms === null || ms === undefined || ms === 0) return '—';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

/**
 * Format a datetime string or Date to a readable label.
 */
export function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  try {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return String(dateStr);
  }
}

/**
 * Format a relative time from now.
 */
export function formatRelativeTime(dateStr) {
  if (!dateStr) return '';
  try {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  } catch {
    return '';
  }
}

/**
 * Truncate a string to maxLen characters.
 */
export function truncate(str, maxLen = 120) {
  if (!str) return '';
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + '…';
}

/**
 * Format a provider code for display (e.g. GEMINI → Gemini).
 */
export function formatProviderName(code) {
  if (!code) return '—';
  return code.charAt(0).toUpperCase() + code.slice(1).toLowerCase();
}
