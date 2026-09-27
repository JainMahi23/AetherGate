import { useState, useRef, useEffect } from 'react';
import { Send, Trash2, CornerDownLeft, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

export function ChatInput({ onSubmit, isGenerating, initialValue = '' }) {
  const [prompt, setPrompt] = useState(initialValue);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (initialValue) {
      setPrompt(initialValue);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [initialValue]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 260)}px`;
    }
  }, [prompt]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    onSubmit(prompt.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleClear = () => {
    setPrompt('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }
  };

  const charCount = prompt.length;

  return (
    <form onSubmit={handleSubmit} className="card p-3 border shadow-sm relative space-y-2">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isGenerating}
          placeholder="Ask anything or test multi-LLM routing... (Shift+Enter for newline, Enter to send)"
          rows={3}
          className="w-full bg-transparent resize-none border-none outline-none text-sm p-2 transition-colors disabled:opacity-50"
          style={{
            color: 'var(--text-primary)',
            minHeight: '80px',
            fontFamily: 'inherit',
          }}
        />
      </div>

      <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          <span>{charCount} characters</span>
          {prompt.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              disabled={isGenerating}
              className="flex items-center gap-1 hover:text-red-400 transition-colors cursor-pointer"
            >
              <Trash2 size={13} />
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] hidden sm:flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
            <CornerDownLeft size={12} /> Press Enter
          </span>

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={isGenerating}
            disabled={!prompt.trim() || isGenerating}
            className="px-5 py-2 text-xs font-semibold rounded-lg shadow-sm"
          >
            {isGenerating ? (
              <span>Generating...</span>
            ) : (
              <>
                <span>Generate</span>
                <Send size={14} />
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
