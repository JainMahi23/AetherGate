import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ErrorMessage } from '../ui/ErrorMessage';
import { Eye, EyeOff, Shield } from 'lucide-react';

export function ProviderFormModal({ isOpen, onClose, onSubmit, provider = null, isLoading = false }) {
  const isEditing = Boolean(provider && provider.id);

  const [formData, setFormData] = useState({
    providerName: '',
    providerCode: '',
    baseUrl: '',
    apiKey: '',
    modelName: '',
    enabled: true,
    healthy: true,
    priority: 1,
    timeoutMs: 30000,
  });

  const [showApiKey, setShowApiKey] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (provider) {
      setFormData({
        providerName: provider.providerName || '',
        providerCode: provider.providerCode || '',
        baseUrl: provider.baseUrl || '',
        apiKey: '', // Never prefilled for security
        modelName: provider.modelName || '',
        enabled: provider.enabled ?? true,
        healthy: provider.healthy ?? true,
        priority: provider.priority ?? 1,
        timeoutMs: provider.timeoutMs ?? 30000,
      });
    } else {
      setFormData({
        providerName: '',
        providerCode: '',
        baseUrl: '',
        apiKey: '',
        modelName: '',
        enabled: true,
        healthy: true,
        priority: 1,
        timeoutMs: 30000,
      });
    }
    setError('');
    setShowApiKey(false);
  }, [provider, isOpen]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.providerName.trim()) {
      setError('Provider name is required.');
      return;
    }
    if (!isEditing && !formData.providerCode.trim()) {
      setError('Provider code is required.');
      return;
    }
    if (!formData.baseUrl.trim()) {
      setError('Base URL is required.');
      return;
    }
    if (!formData.apiKey.trim()) {
      setError('API Key is required to save credentials securely on the backend.');
      return;
    }
    if (!formData.modelName.trim()) {
      setError('Model name is required.');
      return;
    }
    if (formData.priority < 1) {
      setError('Priority must be at least 1.');
      return;
    }
    if (formData.timeoutMs < 1000) {
      setError('Timeout must be at least 1000 ms.');
      return;
    }

    const payload = isEditing
      ? {
          providerName: formData.providerName.trim(),
          baseUrl: formData.baseUrl.trim(),
          apiKey: formData.apiKey.trim(),
          modelName: formData.modelName.trim(),
          enabled: formData.enabled,
          healthy: formData.healthy,
          priority: Number(formData.priority),
          timeoutMs: Number(formData.timeoutMs),
        }
      : {
          providerName: formData.providerName.trim(),
          providerCode: formData.providerCode.trim().toUpperCase(),
          baseUrl: formData.baseUrl.trim(),
          apiKey: formData.apiKey.trim(),
          modelName: formData.modelName.trim(),
          enabled: formData.enabled,
          healthy: formData.healthy,
          priority: Number(formData.priority),
          timeoutMs: Number(formData.timeoutMs),
        };

    onSubmit(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Provider: ${provider.providerName}` : 'Add New LLM Provider'}
      footer={
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={isLoading}>
            {isEditing ? 'Save Changes' : 'Create Provider'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

        {/* Provider Name */}
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
            Provider Name *
          </label>
          <input
            type="text"
            className="input-base"
            placeholder="e.g. Google Gemini or Anthropic Claude"
            value={formData.providerName}
            onChange={(e) => handleChange('providerName', e.target.value)}
          />
        </div>

        {/* Provider Code */}
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
            Provider Code * {isEditing && <span className="font-normal text-slate-400">(Cannot be modified)</span>}
          </label>
          <input
            type="text"
            className="input-base font-mono uppercase"
            placeholder="e.g. GEMINI, GROQ, CLAUDE"
            value={formData.providerCode}
            disabled={isEditing}
            onChange={(e) => handleChange('providerCode', e.target.value.toUpperCase())}
          />
        </div>

        {/* Base URL */}
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
            Base API URL *
          </label>
          <input
            type="url"
            className="input-base font-mono text-xs"
            placeholder="https://api.example.com/v1"
            value={formData.baseUrl}
            onChange={(e) => handleChange('baseUrl', e.target.value)}
          />
        </div>

        {/* API Key */}
        <div>
          <label className="block text-xs font-semibold mb-1 flex items-center justify-between" style={{ color: 'var(--text-secondary)' }}>
            <span>API Key / Secret *</span>
            <span className="text-[11px] font-normal text-amber-500 flex items-center gap-1">
              <Shield size={11} /> Never shown in plain text
            </span>
          </label>
          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              className="input-base pr-10 font-mono text-xs"
              placeholder={isEditing ? 'Enter new API key or paste existing key' : 'Enter provider API secret key'}
              value={formData.apiKey}
              onChange={(e) => handleChange('apiKey', e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              {showApiKey ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Model Name */}
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
            Model Identifier *
          </label>
          <input
            type="text"
            className="input-base font-mono text-xs"
            placeholder="e.g. gemini-2.5-flash or openai/gpt-oss-120b"
            value={formData.modelName}
            onChange={(e) => handleChange('modelName', e.target.value)}
          />
        </div>

        {/* Priority & Timeout row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
              Routing Priority * (1 = highest)
            </label>
            <input
              type="number"
              min="1"
              max="99"
              className="input-base"
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
              Timeout (ms) *
            </label>
            <input
              type="number"
              step="500"
              min="1000"
              className="input-base"
              value={formData.timeoutMs}
              onChange={(e) => handleChange('timeoutMs', e.target.value)}
            />
          </div>
        </div>

        {/* Flags: Enabled & Healthy checkboxes */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
            <input
              type="checkbox"
              checked={formData.enabled}
              onChange={(e) => handleChange('enabled', e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
            />
            <span>Enabled for Routing</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
            <input
              type="checkbox"
              checked={formData.healthy}
              onChange={(e) => handleChange('healthy', e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
            />
            <span>Marked Healthy</span>
          </label>
        </div>
      </form>
    </Modal>
  );
}
