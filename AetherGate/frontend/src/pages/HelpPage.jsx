import { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  Sparkles,
  Rocket,
  Shield,
  Layers,
  Cpu,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';

const FAQ_LIST = [
  {
    q: 'What is AetherGate?',
    a: 'AetherGate is an enterprise-grade intelligent multi-LLM gateway platform. It serves as a unified proxy layer between client applications and heterogeneous AI models, abstracting diverse API schemas, managing rate limits, orchestrating priority failover, and providing centralized telemetry.',
  },
  {
    q: 'What does the gateway do?',
    a: 'Instead of client applications integrating multiple SDKs and exposing API keys across multiple cloud providers, clients submit prompts to the AetherGate REST endpoint. The gateway authenticates requests, applies governance policies, checks provider health, routes the request to the optimal model, and returns a normalized response.',
  },
  {
    q: 'What is multi-LLM routing?',
    a: 'Multi-LLM routing is the process of dynamically selecting which Large Language Model fulfills a request based on operational parameters like provider availability, health status, priority rankings, and response time.',
  },
  {
    q: 'What is Auto mode?',
    a: 'In Auto mode, you submit your prompt without binding to a specific provider (the provider parameter is left null). The AetherGate routing engine scans active, healthy providers ordered by priority and automatically routes to the best eligible candidate.',
  },
  {
    q: 'Why was Gemini selected for a request?',
    a: 'In the default configuration, Google Gemini is assigned Priority #1. When healthy and enabled, the gateway selects Gemini first. Gemini provides expansive context understanding and rapid output with gemini-2.5-flash.',
  },
  {
    q: 'Why was Groq selected for a request?',
    a: 'Groq is assigned Priority #2 (or chosen explicitly). If Gemini experiences high load, downtime, or fails, the gateway automatically executes an immediate fallback to Groq to generate responses using openai/gpt-oss-120b with low-latency LPUs.',
  },
  {
    q: 'What does provider priority mean?',
    a: 'Priority is an integer (1 being highest) that governs the routing preference order. During Auto routing, the gateway evaluates providers in ascending order of priority, skipping any disabled or unhealthy backends.',
  },
  {
    q: 'What does provider health mean?',
    a: 'Provider health represents whether a model endpoint is currently operational. If a provider returns consecutive errors or timeouts, its health status is flagged unhealthy, and the gateway automatically bypasses it to prevent client request disruptions.',
  },
  {
    q: 'Why can a provider be unavailable?',
    a: 'A provider might be unavailable if it has been administratively disabled (enabled = false), marked unhealthy due to provider outages, missing upstream API keys, or exceeding configured timeout thresholds.',
  },
  {
    q: 'What is response time?',
    a: 'Response time (latency) is the total elapsed duration in milliseconds from when AetherGate dispatches the payload to the external LLM provider until the final generated token payload is received and verified.',
  },
  {
    q: 'Is my API key stored in the browser?',
    a: 'No. AetherGate enforces strict zero-client secret storage. All external LLM credentials (Gemini, Groq, OpenAI) are securely managed on the Spring Boot backend service. The frontend interacts only via standard JWT-authenticated HTTP requests.',
  },
  {
    q: 'Can more models be added?',
    a: 'Yes. Administrators can register new provider instances with custom model names, base URLs, and timeout settings directly through the Provider Registry without re-architecting the frontend.',
  },
  {
    q: 'Can Ollama be added later?',
    a: 'Yes. The backend architecture supports extensible LlmClient interfaces. Ollama or any self-hosted local model runner can be configured as a provider target.',
  },
  {
    q: 'What happens if a provider fails?',
    a: 'If a targeted provider fails or times out during execution, AetherGate records the failure metric and attempts fallback to subsequent healthy providers. If all available providers fail, the gateway responds with an informative 502/503 ALL_PROVIDERS_FAILED status.',
  },
];

const COMING_SOON_FEATURES = [
  { name: 'Ollama Self-Hosted Integration', desc: 'Direct connector for locally running models via Ollama' },
  { name: 'More LLM Providers (Claude, Mistral)', desc: 'Prebuilt native clients for Anthropic and Mistral AI' },
  { name: 'Automatic Model Discovery', desc: 'Sync available models dynamically from provider accounts' },
  { name: 'Advanced Cost Optimization', desc: 'Route prompts based on real-time token pricing estimates' },
  { name: 'Latency-Based Dynamic Routing', desc: 'Automatically prefer the lowest measured P95 latency endpoint' },
  { name: 'Capability-Based Routing', desc: 'Match prompt requirements (vision, code, reasoning) to model abilities' },
  { name: 'Provider Quota & Budget Awareness', desc: 'Enforce monthly dollar caps per provider' },
  { name: 'Advanced Analytics & Exports', desc: 'CSV/JSON telemetry export and granular timeline breakdowns' },
  { name: 'Model Version Management', desc: 'A/B testing and seamless model version migrations' },
  { name: 'Custom Routing Policies', desc: 'Rule builder for prompt length, keywords, or department headers' },
  { name: 'Team & Organization Management', desc: 'Multi-tenant organization workspaces with RBAC' },
];

export function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div
      className="border rounded-xl transition-colors overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: isOpen ? 'var(--accent-primary)' : 'var(--border-color)',
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left p-4 flex items-center justify-between gap-4 cursor-pointer"
      >
        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          {item.q}
        </span>
        <ChevronDown
          size={16}
          className={`flex-shrink-0 transition-transform duration-200 text-slate-400 ${
            isOpen ? 'rotate-180 text-indigo-400' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="px-4 pb-4 text-xs leading-relaxed border-t pt-3"
          style={{
            borderColor: 'var(--border-color)',
            color: 'var(--text-secondary)',
          }}
        >
          {item.a}
        </div>
      )}
    </div>
  );
}

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in pb-16">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <HelpCircle size={22} className="text-indigo-500" />
          Help Center & Technical Architecture FAQ
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          Understand gateway mechanisms, routing algorithms, fallback protocols, and security policies
        </p>
      </div>

      {/* Gateway Concept Banner */}
      <div
        className="card p-6 border shadow-sm rounded-2xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(59,130,246,0.04) 100%)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="flex items-center gap-2 mb-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles size={14} /> Core Architectural Principle
        </div>
        <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          One Gateway. Multiple AI Models. Intelligent Routing.
        </h2>
        <p className="text-xs leading-relaxed max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
          AetherGate decouples your client applications from individual AI vendors. Build with stability knowing that provider outages, rate limits, and latency spikes are automatically mitigated through intelligent failover.
        </p>
      </div>

      {/* FAQ Section */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Frequently Asked Questions
        </h2>
        <div className="space-y-2">
          {FAQ_LIST.map((item, idx) => (
            <FaqItem
              key={item.q}
              item={item}
              isOpen={openIndex === idx}
              onToggle={() => setOpenIndex(openIndex === idx ? -1 : idx)}
            />
          ))}
        </div>
      </div>

      {/* Coming Soon Roadmap */}
      <div className="space-y-4 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket size={18} className="text-indigo-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Future Roadmap & Capabilities
            </h2>
          </div>
          <Badge variant="purple">Future Architecture</Badge>
        </div>

        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          These capabilities are part of the AetherGate platform roadmap. The architecture has been pre-designed to cleanly accommodate them.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {COMING_SOON_FEATURES.map((feat) => (
            <div
              key={feat.name}
              className="p-4 rounded-xl border flex flex-col justify-between space-y-2 shadow-sm"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {feat.name}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-indigo-500/15 text-indigo-400 flex-shrink-0">
                  Coming Soon
                </span>
              </div>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
