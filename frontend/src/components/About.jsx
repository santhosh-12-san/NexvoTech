import React from 'react';
import { Brain, Zap, Shield, Orbit, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Card3DTilt from './Card3DTilt';

export default function About() {
  const { theme } = useTheme();

  const highlights = [
    {
      icon: Brain,
      title: 'Human-AI Symbiosis',
      desc: 'Merging deep human engineering intuition with multi-modal neural accelerators for unprecedented problem-solving velocity.',
    },
    {
      icon: Zap,
      title: 'Sub-Millisecond Inference',
      desc: 'Edge-distributed tensor pipelines optimized for ultra-low latency enterprise transactional pipelines.',
    },
    {
      icon: Shield,
      title: 'Cryptographic Security',
      desc: 'Hardware-verified cryptographic attestation and zero-knowledge privacy shields across all data layers.',
    },
    {
      icon: Orbit,
      title: 'Autonomous Scalability',
      desc: 'Self-tuning model routing dynamically allocating GPU compute across 300+ edge global datacenters.',
    },
  ];

  return (
    <section
      id="about"
      className="relative py-28 overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: 'transparent' }}
    >
      {/* Dynamic theme background radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] blur-[130px] pointer-events-none rounded-full opacity-20 transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${theme.primary} 0%, ${theme.secondary} 50%, transparent 70%)`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono mb-4 border transition-all"
            style={{
              backgroundColor: theme.badgeBg,
              borderColor: theme.badgeBorder,
              color: theme.badgeText,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: theme.primary }} />
            <span>ARCHITECTURAL PARADIGM</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Forging the Next Era of{' '}
            <span className={`bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>
              Cognitive Computing
            </span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-slate-400 leading-relaxed">
            At <strong className="text-white">Nexvo Technology</strong>, we eliminate the friction between raw AI capability and real-world deployment. Our hybrid cognitive platforms empower forward-thinking enterprises to build, orchestrate, and deploy sovereign intelligent infrastructure with absolute security and speed.
          </p>
        </div>

        {/* 4 Pillars Grid with 3D Tilt */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card3DTilt key={idx} className="h-full">
                <div
                  className="glass-panel glass-panel-hover rounded-2xl p-7 relative overflow-hidden group h-full flex flex-col justify-between"
                  style={{
                    backgroundColor: `${theme.surface}90`,
                    borderColor: theme.borderSubtle,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = theme.borderHover;
                    e.currentTarget.style.boxShadow = `0 10px 30px -10px ${theme.glowColor}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = theme.borderSubtle;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div>
                    <div
                      className="w-12 h-12 rounded-xl border flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-300"
                      style={{
                        backgroundColor: theme.bg,
                        borderColor: theme.borderSubtle,
                        color: theme.primary,
                        boxShadow: `0 0 15px -3px ${theme.glowColor}`,
                      }}
                    >
                      <Icon className="w-6 h-6" style={{ color: theme.primary }} />
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2 transition-colors">
                      {item.title}
                    </h3>
                    
                    <p className="text-sm text-slate-400 leading-relaxed font-sans">
                      {item.desc}
                    </p>
                  </div>

                  <div
                    className="mt-5 pt-4 border-t flex items-center text-xs font-mono transition-colors"
                    style={{
                      borderColor: theme.borderSubtle,
                      color: theme.primary,
                    }}
                  >
                    <span>SYSTEM LAYER 0{idx + 1}</span>
                    <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                  </div>
                </div>
              </Card3DTilt>
            );
          })}
        </div>

        {/* Live Metrics Showcase Bar */}
        <div
          className="mt-16 rounded-2xl p-8 border"
          style={{
            backgroundColor: `${theme.surface}95`,
            borderColor: theme.borderSubtle,
            boxShadow: `0 10px 30px -10px ${theme.glowColor}`,
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div
                className="text-3xl sm:text-4xl font-extrabold font-mono"
                style={{ color: theme.primary }}
              >
                99.98%
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 uppercase tracking-wider font-medium">Model Precision</p>
            </div>
            <div>
              <div
                className="text-3xl sm:text-4xl font-extrabold font-mono"
                style={{ color: theme.secondary }}
              >
                &lt; 1.4ms
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 uppercase tracking-wider font-medium">Global API Latency</p>
            </div>
            <div>
              <div
                className="text-3xl sm:text-4xl font-extrabold font-mono"
                style={{ color: theme.accent }}
              >
                300+
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 uppercase tracking-wider font-medium">Edge POP Locations</p>
            </div>
            <div>
              <div
                className="text-3xl sm:text-4xl font-extrabold font-mono"
                style={{ color: theme.primary }}
              >
                24/7/365
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 uppercase tracking-wider font-medium">Neural Telemetry</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
