import React, { useState, useEffect } from 'react';
import {
  Brain,
  Zap,
  Eye,
  Shield,
  Activity,
  Globe,
  Cpu,
  Lock,
  Layers,
  Terminal,
  Sparkles,
  Database,
  Server,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { ApiService } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import Card3DTilt from './Card3DTilt';

const iconMap = {
  Brain,
  Zap,
  Eye,
  Shield,
  Activity,
  Globe,
  Cpu,
  Lock,
  Layers,
  Terminal,
  Sparkles,
  Database,
  Server,
};

const fallbackFeatures = [
  {
    id: 1,
    title: 'Autonomous Neural Networks',
    description: 'Self-learning multi-modal architectures designed to process complex enterprise unstructured data in real time with 99.98% inference fidelity.',
    icon_name: 'Brain',
    badge: 'Core Engine',
  },
  {
    id: 2,
    title: 'Quantum-Speed Microservices',
    description: 'Sub-millisecond latency distributed APIs running resilient AI pipelines with automatic horizontal scaling and zero cold starts.',
    icon_name: 'Zap',
    badge: 'Ultra Low Latency',
  },
  {
    id: 3,
    title: 'Deep Cognitive Vision',
    description: 'State-of-the-art visual transformers delivering real-time spatio-temporal segmentation, robotic telemetry, and multimodal recognition.',
    icon_name: 'Eye',
    badge: 'Vision AI',
  },
  {
    id: 4,
    title: 'Decentralized Cyber Shield',
    description: 'Zero-trust cryptographic data protection with proactive automated threat vectors neutralization powered by continuous adversarial simulations.',
    icon_name: 'Shield',
    badge: 'Security',
  },
  {
    id: 5,
    title: 'Predictive Telemetry & Insights',
    description: 'Predictive market analytics and systems anomaly detection driven by non-linear Bayesian neural engines.',
    icon_name: 'Activity',
    badge: 'Predictive',
  },
  {
    id: 6,
    title: 'Global Edge Orchestration',
    description: 'Deploy model weights seamlessly across 300+ edge locations globally for ubiquitous local execution and data sovereignty compliance.',
    icon_name: 'Globe',
    badge: 'Global Edge',
  },
];

export default function Features() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  const loadFeatures = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getFeatures();
      if (Array.isArray(data) && data.length > 0) {
        setFeatures(data);
      } else {
        setFeatures(fallbackFeatures);
      }
    } catch (err) {
      console.warn('Backend not responding yet, displaying default seed features:', err);
      setFeatures(fallbackFeatures);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeatures();
  }, []);

  const getIcon = (name) => {
    const IconComponent = iconMap[name] || Cpu;
    return <IconComponent className="w-6 h-6" style={{ color: theme.primary }} />;
  };

  return (
    <section
      id="features"
      className="relative py-28 overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: 'transparent' }}
    >
      {/* Dynamic theme glow auras */}
      <div
        className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 opacity-20"
        style={{ backgroundColor: theme.primary }}
      />
      <div
        className="absolute bottom-10 left-0 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 opacity-20"
        style={{ backgroundColor: theme.secondary }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <div
              className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono mb-4 border transition-all"
              style={{
                backgroundColor: theme.badgeBg,
                borderColor: theme.badgeBorder,
                color: theme.badgeText,
              }}
            >
              <Cpu className="w-3.5 h-3.5" style={{ color: theme.primary }} />
              <span>CORE CAPABILITIES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Dynamic AI &amp; Neural{' '}
              <span className={`bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>
                Services
              </span>
            </h2>
            <p className="mt-3 text-slate-400 max-w-2xl text-base">
              Synchronized directly from our PostgreSQL-backed Django REST API, dynamically styled in {theme.name} palette.
            </p>
          </div>

          <div className="mt-6 md:mt-0 flex items-center space-x-3">
            <button
              onClick={loadFeatures}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-mono text-slate-300 hover:text-white border transition"
              style={{
                backgroundColor: `${theme.surface}90`,
                borderColor: theme.borderSubtle,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = theme.primary)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = theme.borderSubtle)}
              title="Sync with backend"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`}
                style={{ color: theme.primary }}
              />
              <span>Sync with Backend</span>
            </button>
          </div>
        </div>

        {/* Features Grid with 3D Tilt */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card3DTilt key={feature.id || index} className="h-full">
              <div
                className="glass-panel glass-panel-hover rounded-2xl p-8 relative flex flex-col justify-between group overflow-hidden h-full"
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
                {/* Subtle top indicator line on hover */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] transition-all duration-700 opacity-0 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${theme.primary}, transparent)`,
                  }}
                />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className="w-14 h-14 rounded-2xl border flex items-center justify-center group-hover:scale-105 transition-all duration-300"
                      style={{
                        backgroundColor: theme.bg,
                        borderColor: theme.borderSubtle,
                        boxShadow: `0 0 15px -3px ${theme.glowColor}`,
                      }}
                    >
                      {getIcon(feature.icon_name)}
                    </div>
                    {feature.badge && (
                      <span
                        className="text-xs font-mono px-2.5 py-1 rounded-full font-semibold tracking-wider uppercase border"
                        style={{
                          backgroundColor: theme.badgeBg,
                          borderColor: theme.badgeBorder,
                          color: theme.badgeText,
                        }}
                      >
                        {feature.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-white transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed mb-6 font-sans">
                    {feature.description}
                  </p>
                </div>

                <div
                  className="pt-4 border-t flex items-center justify-between text-xs font-mono"
                  style={{ borderColor: theme.borderSubtle }}
                >
                  <span className="text-slate-500">
                    REF://ID-0{feature.id || index + 1}
                  </span>
                  <a
                    href="#contact"
                    className="flex items-center space-x-1 group-hover:translate-x-1 transition-all"
                    style={{ color: theme.primary }}
                  >
                    <span>Deploy Model</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </a>
                </div>
              </div>
            </Card3DTilt>
          ))}
        </div>
      </div>
    </section>
  );
}
