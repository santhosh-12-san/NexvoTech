import React, { useState } from 'react';
import Global3DBackground from '../components/Global3DBackground';
import About from '../components/About';
import Features from '../components/Features';
import Pricing from '../components/Pricing';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import NexvoBot from '../components/NexvoBot';
import CursorGlow from '../components/CursorGlow';
import MagneticButton from '../components/MagneticButton';
import { useTheme } from '../context/ThemeContext';
import { ArrowRight, Terminal, Shield, Cpu, Activity } from 'lucide-react';

export default function HomePage() {
  const [selectedPlanForContact, setSelectedPlanForContact] = useState('');
  const { theme } = useTheme();

  return (
    <div
      className="relative min-h-screen text-slate-100 selection:bg-white/20 transition-colors duration-500"
      style={{ backgroundColor: theme.bg }}
    >
      {/* Full-page cursor glow spotlight (tracks mouse, zero re-renders) */}
      <CursorGlow />

      {/* Pervasive Full-Page 3D Background with continuous geometries, particles and scroll tracking */}
      <Global3DBackground />

      {/* Global Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">

        {/* Cyberpunk grid overlay with gradient mask */}
        <div className="absolute inset-0 bg-grid-pattern opacity-35 z-[1] pointer-events-none" />
        <div
          className="absolute inset-0 z-[2] pointer-events-none transition-colors duration-500"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${theme.bg}80 60%, ${theme.bg} 100%)`,
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pointer-events-none">
          <div className="pointer-events-auto max-w-4xl mx-auto flex flex-col items-center">
            {/* Status Pill */}
            <div
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-mono mb-8 backdrop-blur-md transition-all duration-300"
              style={{
                backgroundColor: theme.badgeBg,
                borderColor: theme.badgeBorder,
                borderWidth: '1px',
                color: theme.badgeText,
                boxShadow: `0 0 20px -5px ${theme.glowColor}`,
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-ping"
                style={{ backgroundColor: theme.primary }}
              />
              <span className="font-semibold tracking-wider">NEURAL REVOLUTION IN TRANSIT</span>
              <span className="text-slate-500">|</span>
              <span style={{ color: theme.accent }}>{theme.name.toUpperCase()} CORE</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1] mb-6">
              Nexvo Technology:{' '}
              <span
                className={`block mt-2 bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}
              >
                Blending Human and Artificial Intelligence
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="max-w-2xl text-base sm:text-xl text-slate-300 font-normal leading-relaxed mb-10">
              The next-generation distributed platform engineered to synthesize human analytical judgment with real-time autonomous neural networks and zero-latency edge compute.
            </p>

            {/* Action Buttons — wrapped in MagneticButton for pull micro-interaction */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <MagneticButton
                as="a"
                href="#contact"
                strength={0.45}
                fieldRadius={120}
                className={`magnetic-shimmer overflow-hidden relative w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider text-white bg-gradient-to-r ${theme.btnGradient} active:scale-95 transition-colors duration-300 flex items-center justify-center space-x-2 group`}
                style={{
                  boxShadow: `0 10px 30px -8px ${theme.glowColor}`,
                }}
              >
                <span>Deploy Intelligent Cloud</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </MagneticButton>

              <MagneticButton
                as="a"
                href="#features"
                strength={0.38}
                fieldRadius={110}
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider text-slate-300 bg-slate-900/80 border hover:text-white backdrop-blur-md transition-all duration-300 flex items-center justify-center space-x-2"
                style={{ borderColor: theme.borderSubtle }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.primary; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.borderSubtle; }}
              >
                <Terminal className="w-4 h-4" style={{ color: theme.primary }} />
                <span>Explore Architecture</span>
              </MagneticButton>
            </div>

            {/* Floating Telemetry Indicators */}
            <div
              className="mt-14 pt-8 border-t w-full grid grid-cols-2 sm:grid-cols-3 gap-4 text-left transition-colors"
              style={{ borderColor: theme.borderSubtle }}
            >
              <div
                className="flex items-center space-x-3 p-3 rounded-xl border transition"
                style={{
                  backgroundColor: `${theme.surface}90`,
                  borderColor: theme.borderSubtle,
                }}
              >
                <Shield className="w-5 h-5 shrink-0" style={{ color: theme.primary }} />
                <div>
                  <div className="text-[11px] font-mono text-slate-400">ENCRYPTION</div>
                  <div className="text-xs font-semibold text-white">Zero-Knowledge Mesh</div>
                </div>
              </div>
              <div
                className="flex items-center space-x-3 p-3 rounded-xl border transition"
                style={{
                  backgroundColor: `${theme.surface}90`,
                  borderColor: theme.borderSubtle,
                }}
              >
                <Activity className="w-5 h-5 shrink-0" style={{ color: theme.secondary }} />
                <div>
                  <div className="text-[11px] font-mono text-slate-400">SUB-MS LATENCY</div>
                  <div className="text-xs font-semibold text-white">Global Edge Routing</div>
                </div>
              </div>
              <div
                className="col-span-2 sm:col-span-1 flex items-center space-x-3 p-3 rounded-xl border transition"
                style={{
                  backgroundColor: `${theme.surface}90`,
                  borderColor: theme.borderSubtle,
                }}
              >
                <Cpu className="w-5 h-5 shrink-0" style={{ color: theme.accent }} />
                <div>
                  <div className="text-[11px] font-mono text-slate-400">FOUNDATION MODELS</div>
                  <div className="text-xs font-semibold text-white">Dynamic Auto-tuning</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Sections */}
      <About />
      <Features />
      <Pricing onSelectPlan={(planName) => setSelectedPlanForContact(planName)} />
      <Testimonials />
      <Contact selectedPlan={selectedPlanForContact} />

      {/* Footer */}
      <Footer />

      {/* Floating AI Assistant & WhatsApp Direct Launcher */}
      <NexvoBot />
    </div>
  );
}
