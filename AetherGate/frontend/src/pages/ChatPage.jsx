import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { ChatInput } from '../components/chat/ChatInput';
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
      setIsSaved(true);
    }
  }, [location.state]);

  const handleGenerate = async (prompt) => {
    setCurrentPrompt(prompt);
    setError('');
    setResponseData(null);
    setIsSaved(false);
    setIsGenerating(true);

    try {
      // If AUTO, send null/undefined so backend routing engine decides
      const targetProvider = selectedProvider === 'AUTO' ? null : selectedProvider;
      const result = await sendChat(prompt, targetProvider);

      if (result?.data) {
        setResponseData(result.data);

        // Auto-save to history
        addEntry({
          prompt,
          response: result.data.response,
          provider: result.data.provider,
          responseTime: result.data.responseTime,
        });
        setIsSaved(true);
      } else {
        setError('Something went wrong. Please try again.');
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
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <MessageSquare size={22} className="text-indigo-500" />
          Chat
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          Ask anything — get intelligent answers
        </p>
      </div>

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

      {/* Loading indicator */}
      {isGenerating && (
        <div className="flex items-center gap-3 p-4 rounded-xl border animate-pulse"
          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Generating response…</span>
        </div>
      )}

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
