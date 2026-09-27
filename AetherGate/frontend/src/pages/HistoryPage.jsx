import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { History as HistoryIcon, Search, Trash2, Filter, Sparkles, Database } from 'lucide-react';
import { HistoryCard } from '../components/history/HistoryCard';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal } from '../components/ui/Modal';
import { useLocalHistory } from '../hooks/useLocalHistory';

export default function HistoryPage() {
  const navigate = useNavigate();
  const { history, deleteEntry, clearHistory } = useLocalHistory();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  // Filter & Search
  const filteredHistory = useMemo(() => {
    return history
      .filter((item) => {
        // Provider filter
        if (selectedProvider !== 'ALL') {
          if (item.provider?.toUpperCase() !== selectedProvider) {
            return false;
          }
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchPrompt = item.prompt?.toLowerCase().includes(q);
          const matchResponse = item.response?.toLowerCase().includes(q);
          return matchPrompt || matchResponse;
        }
        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return sortBy === 'newest' ? timeB - timeA : timeA - timeB;
      });
  }, [history, searchQuery, selectedProvider, sortBy]);

  // Extract distinct providers from history
  const availableProviders = useMemo(() => {
    const set = new Set(history.map((h) => h.provider?.toUpperCase()).filter(Boolean));
    return Array.from(set);
  }, [history]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in pb-12">
      {/* Title & Clear Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <HistoryIcon size={22} className="text-indigo-500" />
            Prompt & Output History
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Stored locally in browser sandbox · Reopen previous generations anytime
          </p>
        </div>

        {history.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setConfirmClearOpen(true)}
            className="text-red-400 hover:text-red-300 self-start sm:self-auto"
          >
            <Trash2 size={14} />
            Clear All History
          </Button>
        )}
      </div>

      {/* Info notice explaining client-side storage */}
      <div
        className="p-3.5 rounded-xl border flex items-center gap-2.5 text-xs"
        style={{
          backgroundColor: 'var(--bg-tertiary)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-secondary)',
        }}
      >
        <Database size={15} className="text-indigo-400 flex-shrink-0" />
        <span>
          <strong>Local Persistence Active:</strong> All items are securely saved in your browser's LocalStorage. Closing or refreshing your browser preserves your history.
        </span>
      </div>

      {/* Filter and Search Bar */}
      {history.length > 0 && (
        <div
          className="card p-3 border shadow-sm flex flex-col md:flex-row items-center gap-3"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
          }}
        >
          {/* Search box */}
          <div className="relative flex-1 w-full">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search in prompts or responses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-base pl-9 text-xs py-2 w-full"
            />
          </div>

          {/* Provider Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-semibold uppercase text-slate-400 flex items-center gap-1">
              <Filter size={12} /> Provider:
            </span>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="input-base text-xs py-1.5 px-2.5 w-full md:w-36"
            >
              <option value="ALL">All Providers</option>
              {availableProviders.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-base text-xs py-1.5 px-2.5 w-full md:w-32"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      )}

      {/* History Items list or Empty State */}
      {history.length === 0 ? (
        <EmptyState
          icon={HistoryIcon}
          title="No previous conversations yet"
          description="Send your first request from the Chat Playground to start building your history."
          action={
            <Button variant="primary" onClick={() => navigate('/chat')}>
              <Sparkles size={15} />
              Open Chat Playground
            </Button>
          }
        />
      ) : filteredHistory.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No matching history items"
          description="Try adjusting your search terms or provider filters."
          action={
            <Button
              variant="secondary"
              onClick={() => {
                setSearchQuery('');
                setSelectedProvider('ALL');
              }}
            >
              Reset Filters
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => (
            <HistoryCard
              key={item.id}
              item={item}
              onDelete={deleteEntry}
            />
          ))}
        </div>
      )}

      {/* Clear Confirmation Modal */}
      <Modal
        isOpen={confirmClearOpen}
        onClose={() => setConfirmClearOpen(false)}
        title="Clear Local History"
        maxWidth="max-w-md"
        footer={
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => setConfirmClearOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                clearHistory();
                setConfirmClearOpen(false);
              }}
            >
              Delete All
            </Button>
          </div>
        }
      >
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Are you sure you want to delete all saved items from your browser storage? This cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
