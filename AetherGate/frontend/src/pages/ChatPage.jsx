import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageSquare, Sparkles, AlertCircle, History as HistoryIcon, RefreshCw } from 'lucide-react';
import { ProviderSelector } from '../components/chat/ProviderSelector';
import { ChatInput } from '../components/chat/ChatInput';
import { RoutingAnimation } from '../components/chat/RoutingAnimation';
import { ChatResponse } from '../components/chat/ChatResponse';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { sendChat } from '../services/chatService';
import { useLocalHistory } from '../hooks/useLocalHistory';
import { getErrorMessage } from '../utils/errorMessages';

export default function ChatPage() {
  const location = useLocation();
  const { addEntry } = useLocalHistory();

  const [selectedProvider, setSelectedProvider] = useState('AUTO');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [resolvedProvider, setResolvedProvider] = useState(null);
  const [responseTime, setResponseTime] = useState(null);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Check if opened from history or with preloaded prompt
  useEffect(() => {
    if (location.state?.prompt) {
      setCurrentPrompt(location.state.prompt);
    }
    if (location.state?.provider) {
      setSelectedProvider(location.state.provider);
    }
    if (location.state?.response) {
      setResponseData({
        provider: location.state.provider,
        response: location.state.response,
        responseTime: location.state.responseTime || 0,
      });
      setResolvedProvider(location.state.provider);
      setResponseTime(location.state.responseTime);
      setIsSaved(true);
    }
  }, [location.state]);

  const handleGenerate = async (prompt) => {
    setCurrentPrompt(prompt);
    setError('');
    setResponseData(null);
    setResolvedProvider(null);
    setResponseTime(null);
    setIsSaved(false);
    setIsGenerating(true);

    try {
      // If AUTO, send null/undefined so backend routing engine decides
      const targetProvider = selectedProvider === 'AUTO' ? null : selectedProvider;
      const result = await sendChat(prompt, targetProvider);

      if (result?.data) {
        setResponseData(result.data);
        setResolvedProvider(result.data.provider);
        setResponseTime(result.data.responseTime);

        // Auto-save session work to history or allow manual save
        addEntry({
          prompt,
          response: result.data.response,
          provider: result.data.provider,
          responseTime: result.data.responseTime,
        });
        setIsSaved(true);
      } else {
        setError('Server responded without data payload.');
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleManualSave = () => {
    if (!responseData || !currentPrompt) return;
    addEntry({
      prompt: currentPrompt,
      response: responseData.response,
      provider: responseData.provider,
      responseTime: responseData.responseTime,
    });
    setIsSaved(true);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in pb-12">
      {/* Title & Gateway Mission */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <MessageSquare size={22} className="text-indigo-500" />
            Chat Playground
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Experience multi-model intelligence with automated fallback & latency routing
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full border flex items-center gap-1.5 font-medium" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
            <Sparkles size={13} className="text-indigo-400" />
            Gateway Router Active
          </span>
        </div>
      </div>

      {/* Provider Selector */}
      <ProviderSelector
        selectedProvider={selectedProvider}
        onSelectProvider={setSelectedProvider}
        disabled={isGenerating}
      />

      {/* Input box */}
      <ChatInput
        onSubmit={handleGenerate}
        isGenerating={isGenerating}
        initialValue={location.state?.prompt || ''}
      />

      {/* Error alert if any */}
      {error && (
        <ErrorMessage
          message={error}
          onDismiss={() => setError('')}
        />
      )}

      {/* Routing pipeline simulation */}
      <RoutingAnimation
        isGenerating={isGenerating}
        targetProvider={selectedProvider}
        resolvedProvider={resolvedProvider}
        responseTime={responseTime}
      />

      {/* Response Display */}
      {responseData && (
        <ChatResponse
          responseData={responseData}
          prompt={currentPrompt}
          onSave={handleManualSave}
          isSaved={isSaved}
        />
      )}
    </div>
  );
}
