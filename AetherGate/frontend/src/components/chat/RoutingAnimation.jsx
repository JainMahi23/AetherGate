import { useEffect, useState } from 'react';
import { ArrowRight, Bot, CheckCircle, Cpu, Network, Sparkles, Zap } from 'lucide-react';

export function RoutingAnimation({ isGenerating, targetProvider, resolvedProvider, responseTime }) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (isGenerating) {
      setActiveStep(1);
      const timer1 = setTimeout(() => setActiveStep(2), 500);
      const timer2 = setTimeout(() => setActiveStep(3), 1200);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else if (resolvedProvider) {
      setActiveStep(4);
    } else {
      setActiveStep(0);
    }
  }, [isGenerating, resolvedProvider]);

  if (!isGenerating && !resolvedProvider) {
    return null;
  }

  const isGemini = (resolvedProvider || targetProvider) === 'GEMINI';
  const isGroq = (resolvedProvider || targetProvider) === 'GROQ';

  return (
    <div
      className="p-4 rounded-xl border mb-4 animate-fade-in transition-all duration-300 shadow-sm"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: isGenerating ? 'var(--accent-primary)' : 'var(--border-color)',
      }}
    >
      <div className="flex items-center justify-between mb-3 text-xs font-semibold uppercase tracking-wider">
        <span className="flex items-center gap-2" style={{ color: 'var(--accent-primary)' }}>
          <Network size={15} className={isGenerating ? 'animate-spin-slow' : ''} />
          {isGenerating ? 'Active Gateway Routing Simulation' : 'Request Routing Path Resolved'}
        </span>
        {responseTime ? (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium" style={{ backgroundColor: 'rgba(16,185,129,0.15)', color: 'var(--accent-success)' }}>
            Latency: {responseTime} ms
          </span>
        ) : (
          <span className="text-slate-400 font-normal lowercase tracking-normal">evaluating live routes...</span>
        )}
      </div>

      {/* Nodes pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
        {/* Step 1: User Request */}
        <div
          className={`p-2.5 rounded-lg border text-center transition-all duration-300 ${
            activeStep >= 1 ? 'border-indigo-500 shadow-sm' : 'opacity-40 border-slate-600'
          }`}
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <div className="text-[11px] font-mono font-semibold" style={{ color: 'var(--text-muted)' }}>STEP 1</div>
          <div className="text-xs font-bold mt-0.5 flex items-center justify-center gap-1" style={{ color: 'var(--text-primary)' }}>
            <Sparkles size={13} className="text-blue-400" /> Client Prompt
          </div>
        </div>

        {/* Step 2: Gateway */}
        <div
          className={`p-2.5 rounded-lg border text-center transition-all duration-300 ${
            activeStep >= 2 ? 'border-indigo-500 shadow-sm' : 'opacity-40 border-slate-600'
          }`}
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <div className="text-[11px] font-mono font-semibold" style={{ color: 'var(--text-muted)' }}>STEP 2</div>
          <div className="text-xs font-bold mt-0.5 flex items-center justify-center gap-1" style={{ color: 'var(--text-primary)' }}>
            <Cpu size={13} className="text-indigo-400" /> AetherGate Core
          </div>
        </div>

        {/* Step 3: Routing Engine */}
        <div
          className={`p-2.5 rounded-lg border text-center transition-all duration-300 ${
            activeStep >= 3 ? 'border-indigo-500 shadow-sm' : 'opacity-40 border-slate-600'
          }`}
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <div className="text-[11px] font-mono font-semibold" style={{ color: 'var(--text-muted)' }}>STEP 3</div>
          <div className="text-xs font-bold mt-0.5 flex items-center justify-center gap-1" style={{ color: 'var(--text-primary)' }}>
            <Network size={13} className="text-amber-400" /> Priority Engine
          </div>
        </div>

        {/* Step 4: Provider Selection */}
        <div
          className={`p-2.5 rounded-lg border text-center transition-all duration-300 ${
            activeStep >= 4 ? 'border-emerald-500 shadow-sm' : 'opacity-40 border-slate-600'
          }`}
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: resolvedProvider ? 'var(--accent-success)' : undefined
          }}
        >
          <div className="text-[11px] font-mono font-semibold" style={{ color: 'var(--text-muted)' }}>STEP 4</div>
          <div className="text-xs font-bold mt-0.5 flex items-center justify-center gap-1" style={{ color: 'var(--text-primary)' }}>
            {resolvedProvider === 'GEMINI' ? (
              <><Bot size={13} className="text-blue-400" /> Gemini (2.5-flash)</>
            ) : resolvedProvider === 'GROQ' ? (
              <><Zap size={13} className="text-amber-400" /> Groq (OSS-120b)</>
            ) : (
              <><Cpu size={13} className="text-purple-400" /> {targetProvider === 'AUTO' ? 'Auto Selected' : targetProvider}</>
            )}
          </div>
        </div>

        {/* Step 5: Final Response */}
        <div
          className={`p-2.5 rounded-lg border text-center transition-all duration-300 ${
            !isGenerating && resolvedProvider ? 'border-emerald-500 shadow-sm' : 'opacity-40 border-slate-600'
          }`}
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <div className="text-[11px] font-mono font-semibold" style={{ color: 'var(--text-muted)' }}>STEP 5</div>
          <div className="text-xs font-bold mt-0.5 flex items-center justify-center gap-1" style={{ color: 'var(--text-primary)' }}>
            <CheckCircle size={13} className="text-emerald-400" /> {isGenerating ? 'Streaming...' : 'Success (200 OK)'}
          </div>
        </div>
      </div>

      {/* Real-time status subline */}
      <div className="mt-3 text-xs flex items-center justify-between px-1" style={{ color: 'var(--text-secondary)' }}>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${isGenerating ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
          {isGenerating ? (
            <span>Routing through AetherGate security filter & provider priority resolver...</span>
          ) : (
            <span>
              Request successfully routed to <strong style={{ color: 'var(--text-primary)' }}>{resolvedProvider}</strong> in{' '}
              <strong style={{ color: 'var(--accent-success)' }}>{responseTime ? (responseTime / 1000).toFixed(2) + 's' : 'fast'}</strong>.
            </span>
          )}
        </div>
        {targetProvider === 'AUTO' && isGenerating && (
          <span className="text-[11px] font-mono text-indigo-400 hidden sm:inline">Priority Order: [GEMINI (P1) → GROQ (P2)]</span>
        )}
      </div>
    </div>
  );
}
