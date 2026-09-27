import { useState, useCallback } from 'react';

const HISTORY_KEY = 'aethergate_history';
const MAX_HISTORY = 200;

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(items) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, MAX_HISTORY)));
  } catch {
    // localStorage full or unavailable
  }
}

/**
 * Hook for managing local chat history in localStorage.
 * Each history item: { id, prompt, response, provider, responseTime, timestamp, saved }
 */
export function useLocalHistory() {
  const [history, setHistory] = useState(loadHistory);

  const addEntry = useCallback((entry) => {
    const newEntry = {
      id: `hist_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };
    setHistory((prev) => {
      const updated = [newEntry, ...prev].slice(0, MAX_HISTORY);
      saveHistory(updated);
      return updated;
    });
    return newEntry.id;
  }, []);

  const deleteEntry = useCallback((id) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      saveHistory(updated);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  }, []);

  const getEntry = useCallback(
    (id) => history.find((item) => item.id === id),
    [history]
  );

  return { history, addEntry, deleteEntry, clearHistory, getEntry };
}
