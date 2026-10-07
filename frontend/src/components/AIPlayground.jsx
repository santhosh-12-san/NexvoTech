import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import Card3DTilt from './Card3DTilt';
import SoundEngine from '../utils/soundEffects';
import {
  Sparkles,
  Terminal,
  Play,
  RotateCcw,
  Copy,
  Check,
  Cpu,
  Zap,
  Code2,
  Sliders,
  Activity,
  ArrowRight
} from 'lucide-react';

const MODELS = [
  {
    id: 'cognitive-omni',
    name: 'Cognitive Reasoning 70B',
    badge: 'Flagship Architecture',
    icon: Cpu,
    latency: '18.4ms',
    throughput: '380 tok/s',
    description: 'High-dimensional multi-step logical synthesis and enterprise decision pipelines.',
    presets: [
      {
        label: 'Enterprise Fraud Topology',
        prompt: 'Decompose a sub-millisecond fraud detection topology for multi-region financial transactions.',
        output: `[NEXVO COGNITIVE ENGINE v4.2 - INFERENCE LOG]
Initializing multi-modal graph neural tensor decomposition...
Analyzing transactional spatial topology:
  1. Edge Ingestion: Distributed Kafka partitioned topics over NVMe memory rings.
  2. Neural Screening: 8-bit quantized anomaly detection with <5ms threshold.
  3. Graph Verification: Zero-knowledge cryptographic attestation verifying wallet identity.
  4. Decision Matrix: Automated risk scoring (Confidence: 99.84%). Transaction authorized in 14.1ms.
Synthesized sovereign cognitive topology ready for deployment.`
      },
      {
        label: 'Supply Chain Optimization',
        prompt: 'Formulate an autonomous self-healing logistics routing protocol under high volatility.',
        output: `[NEXVO COGNITIVE ENGINE v4.2 - ROUTING PROTOCOL]
Vectorizing 14,200 dynamic edge nodes across global distribution paths...
Execution sequence:
  - Predictive bottleneck forecasting via spatial LSTM attention heads.
  - Multi-agent game theory consensus dynamically re-routing freight channels.
  - Carbon-neutral route optimization yielding 28.4% latency reduction.
Convergence verified. Protocol ready for production orchestration.`
      }
    ]
  },
  {
    id: 'edge-nano',
    name: 'Ultra-Edge Nano Engine',
    badge: 'Sub-Millisecond',
    icon: Zap,
    latency: '4.8ms',
    throughput: '890 tok/s',
    description: 'Ultra-quantized tensor runtime optimized for zero-latency distributed microservices.',
    presets: [
      {
        label: 'Real-time WebSocket Pipeline',
        prompt: 'Compile a zero-latency WebSocket stream parser for high-frequency telemetry.',
        output: `[NEXVO EDGE RUNTIME - COMPILED KERNEL]
Target Architecture: Linux x86_64 / ARM Neon SIMD
Allocating zero-copy memory ring buffer...
  • Socket read: epoll level-triggered non-blocking I/O
  • Tensor parsing: SIMD AVX-512 vectorized deserialization
  • Packet latency: 2.1 microseconds average jitter
  • Throughput benchmark: 1.2M messages/sec per core.
Kernel status: ACTIVE and listening on 0.0.0.0:8443.`
      }
    ]
  },
  {
    id: 'quantum-coder',
    name: 'Neural Code Synthesizer',
    badge: 'Code & Architecture',
    icon: Code2,
    latency: '24.1ms',
    throughput: '420 tok/s',
    description: 'Automated synthesis of production-ready microservices, REST APIs, and neural models.',
    presets: [
      {
        label: 'Django DRF + JWT Microservice',
        prompt: 'Generate an asynchronous high-throughput DRF endpoint with JWT token validation and Redis caching.',
        output: `from rest_framework import views, status, permissions
from rest_framework.response import Response
from django.core.cache import cache

class NeuralInferenceAPI(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    async def post(self, request):
        payload = request.data
        cache_key = f"neural:{hash(str(payload))}"
        
        cached_result = await cache.aget(cache_key)
        if cached_result:
            return Response({"result": cached_result, "source": "edge_cache"}, status=status.HTTP_200_OK)
            
        tensor_output = await execute_tensor_dispatch(payload)
        await cache.aset(cache_key, tensor_output, timeout=300)
        return Response({"result": tensor_output, "latency_ms": 14.2}, status=status.HTTP_200_OK)`
      }
    ]
  }
];

export default function AIPlayground() {
  const { theme } = useTheme();

  const [activeModelId, setActiveModelId] = useState(MODELS[0].id);
  const activeModel = MODELS.find((m) => m.id === activeModelId) || MODELS[0];

  const [promptInput, setPromptInput] = useState(activeModel.presets[0].prompt);
  const [displayedOutput, setDisplayedOutput] = useState(activeModel.presets[0].output);
  const [isGenerating, setIsGenerating] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({ latency: activeModel.latency, throughput: activeModel.throughput });

  const streamingTimer = useRef(null);

  // Switch model handler
  const handleSelectModel = (model) => {
    SoundEngine.playBeep(640, 0.07);
    setActiveModelId(model.id);
    setPromptInput(model.presets[0].prompt);
    setDisplayedOutput(model.presets[0].output);
    setStats({ latency: model.latency, throughput: model.throughput });
  };

  // Run generation with typewriter streaming effect
  const handleGenerate = (customPromptText) => {
    const textToRun = typeof customPromptText === 'string' ? customPromptText : promptInput;
    if (!textToRun.trim() || isGenerating) return;

    SoundEngine.playBeep(980, 0.12, 'sawtooth');
    setIsGenerating(true);
    setDisplayedOutput('');

    // Match preset or formulate dynamic simulated AI response
    const matchingPreset = activeModel.presets.find(
      (p) => p.prompt.toLowerCase() === textToRun.toLowerCase()
    );

    const fullResponse =
      matchingPreset?.output ||
      `[NEXVO ${activeModel.name.toUpperCase()} - DYNAMIC INFERENCE]
Processing prompt vector: "${textToRun.slice(0, 80)}..."
Applying temperature sampling (T=${temperature}):
  • Token embedding dimensionality: 4096
  • Spatial attention heads converged in ${(Math.random() * 8 + 10).toFixed(1)}ms.
  • Synthesized cognitive response:
    Nexvo cognitive pipeline executed autonomous evaluation with zero latency overhead.
    Telemetry confirms 100% parameter validity across distributed edge nodes.
Execution completed successfully. (Confidence score: 99.92%).`;

    let currentIndex = 0;
    if (streamingTimer.current) clearInterval(streamingTimer.current);

    const chunkSize = 3;
    streamingTimer.current = setInterval(() => {
      currentIndex += chunkSize;
      if (currentIndex <= fullResponse.length) {
        setDisplayedOutput(fullResponse.slice(0, currentIndex));
      } else {
        setDisplayedOutput(fullResponse);
        clearInterval(streamingTimer.current);
        setIsGenerating(false);
        SoundEngine.playSuccess();
      }
    }, 18);
  };

  const handleCopy = () => {
    if (!displayedOutput) return;
    navigator.clipboard.writeText(displayedOutput);
    setCopied(true);
    SoundEngine.playBeep(1200, 0.05);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    return () => {
      if (streamingTimer.current) clearInterval(streamingTimer.current);
    };
  }, []);

  return (
    <section
      id="playground"
      className="relative py-28 overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: 'transparent' }}
    >
      {/* Background radial glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] blur-[150px] pointer-events-none rounded-full opacity-20 transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${theme.secondary} 0%, ${theme.primary} 60%, transparent 80%)`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div
            className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-xs font-mono mb-4 border transition-all"
            style={{
              backgroundColor: theme.badgeBg,
              borderColor: theme.badgeBorder,
              color: theme.badgeText,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: theme.primary }} />
            <span>INTERACTIVE NEURAL WORKBENCH</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Live AI Model{' '}
            <span className={`bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>
              Console &amp; Playground
            </span>
          </h2>

          <p className="mt-4 text-slate-400 text-base sm:text-lg leading-relaxed">
            Experience real-time sub-millisecond inference and multi-dimensional reasoning right in your browser before integrating into your production cloud.
          </p>
        </div>

        {/* Model Tabs Selection */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {MODELS.map((m) => {
            const Icon = m.icon;
            const isSelected = m.id === activeModelId;
            return (
              <button
                key={m.id}
                onClick={() => handleSelectModel(m)}
                className={`flex items-center space-x-3 px-5 py-3 rounded-2xl border text-xs sm:text-sm font-mono transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'text-white shadow-xl scale-105'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
                style={{
                  backgroundColor: isSelected ? `${theme.surface}e6` : undefined,
                  borderColor: isSelected ? theme.primary : undefined,
                  boxShadow: isSelected ? `0 0 25px -5px ${theme.glowColor}` : 'none',
                }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: isSelected ? theme.badgeBg : '#0f172a',
                    color: isSelected ? theme.primary : '#94a3b8',
                  }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="font-bold">{m.name}</div>
                  <div className="text-[10px] text-slate-500 font-sans">{m.badge}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Playground Grid Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls & Input Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div
              className="p-6 rounded-3xl border shadow-xl backdrop-blur-md"
              style={{
                backgroundColor: `${theme.surface}95`,
                borderColor: theme.borderSubtle,
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center space-x-1.5">
                  <Terminal className="w-3.5 h-3.5" style={{ color: theme.primary }} />
                  <span>Prompt Synthesis Parameter</span>
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  T={temperature.toFixed(2)}
                </span>
              </div>

              {/* Preset Prompts Buttons */}
              <div className="mb-4">
                <span className="block text-[11px] font-mono text-slate-400 mb-2">Preset Scenarios:</span>
                <div className="flex flex-wrap gap-2">
                  {activeModel.presets.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        SoundEngine.playBlip();
                        setPromptInput(preset.prompt);
                        handleGenerate(preset.prompt);
                      }}
                      className="text-xs px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition active:scale-95 text-left"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea for custom prompt */}
              <div className="mb-5">
                <textarea
                  rows={4}
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="Enter enterprise problem statement or AI task..."
                  className="w-full p-4 rounded-2xl bg-slate-950/80 border text-white text-xs sm:text-sm font-sans placeholder-slate-500 focus:outline-none transition resize-none leading-relaxed"
                  style={{ borderColor: theme.borderSubtle }}
                  onFocus={(e) => (e.target.style.borderColor = theme.primary)}
                  onBlur={(e) => (e.target.style.borderColor = theme.borderSubtle)}
                />
              </div>

              {/* Slider Controls */}
              <div className="mb-6 space-y-3 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Sliders className="w-3 h-3" />
                    <span>Neural Entropy (Temperature)</span>
                  </span>
                  <span>{temperature}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleGenerate()}
                disabled={isGenerating || !promptInput.trim()}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm font-mono uppercase tracking-wider text-white bg-gradient-to-r ${theme.btnGradient} active:scale-98 transition-all duration-200 flex items-center justify-center space-x-2 group disabled:opacity-50 shadow-lg cursor-pointer`}
                style={{
                  boxShadow: `0 8px 25px -5px ${theme.glowColor}`,
                }}
              >
                {isGenerating ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Streaming Neural Tensor...</span>
                  </div>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                    <span>Execute Inference Dispatch</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Output Terminal Console Column (7 cols) */}
          <div className="lg:col-span-7">
            <Card3DTilt maxTilt={4}>
              <div
                className="rounded-3xl border shadow-2xl overflow-hidden backdrop-blur-xl relative"
                style={{
                  backgroundColor: '#020617ee',
                  borderColor: theme.borderSubtle,
                  boxShadow: `0 20px 50px -10px rgba(0,0,0,0.9), 0 0 30px -5px ${theme.glowColor}`,
                }}
              >
                {/* Terminal Header */}
                <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950/90 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                    <span className="ml-2 text-xs font-mono text-slate-400 font-semibold">
                      nexvo-console // {activeModel.id}.sh
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs font-mono">
                    <span className="text-emerald-400 flex items-center space-x-1">
                      <Activity className="w-3 h-3 animate-pulse" />
                      <span>{stats.latency}</span>
                    </span>
                    <span className="text-slate-500">|</span>
                    <span className="text-slate-400">{stats.throughput}</span>

                    <button
                      onClick={handleCopy}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition ml-2"
                      title="Copy Terminal Output"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Output Terminal Body */}
                <div className="p-6 font-mono text-xs sm:text-sm text-slate-200 min-h-[340px] max-h-[480px] overflow-y-auto leading-relaxed select-text space-y-2">
                  <pre className="whitespace-pre-wrap font-mono text-slate-300">
                    {displayedOutput}
                  </pre>
                  {isGenerating && (
                    <span
                      className="inline-block w-2.5 h-4 ml-1 animate-pulse align-middle"
                      style={{ backgroundColor: theme.primary }}
                    />
                  )}
                </div>

                {/* Terminal Footer CTA */}
                <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
                  <span className="text-slate-400">
                    Ready to deploy this model to your enterprise architecture?
                  </span>
                  <a
                    href="#contact"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-white font-semibold transition group hover:underline"
                    style={{ color: theme.primary }}
                  >
                    <span>Request Model API Access</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </Card3DTilt>
          </div>
        </div>
      </div>
    </section>
  );
}
