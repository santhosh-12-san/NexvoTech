import React from 'react';
import { Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer
      className="relative border-t pt-16 pb-12 overflow-hidden transition-colors duration-500"
      style={{
        backgroundColor: `${theme.bg}`,
        borderColor: theme.borderSubtle,
      }}
    >
      {/* Decorative top gradient glow using dynamic theme primary */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${theme.primary}, transparent)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div
                className="w-9 h-9 rounded-xl p-[1px] shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                  boxShadow: `0 0 15px -3px ${theme.glowColor}`,
                }}
              >
                <div
                  className="w-full h-full rounded-[11px] flex items-center justify-center"
                  style={{ backgroundColor: theme.surface }}
                >
                  <Cpu className="w-4 h-4" style={{ color: theme.primary }} />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                NEXVO <span className="font-mono text-sm" style={{ color: theme.primary }}>TECHNOLOGY</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed mb-6 font-sans">
              Blending Human and Artificial Intelligence into unified, sovereign cognitive infrastructure. Production-ready AI APIs, neural edge accelerators, and zero-knowledge intelligence pipelines.
            </p>
            <div className="flex items-center space-x-3 text-slate-400">
              <span
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-[11px] font-mono border"
                style={{
                  backgroundColor: theme.badgeBg,
                  borderColor: theme.badgeBorder,
                  color: theme.badgeText,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: theme.primary }}
                />
                <span>PALETTE ACTIVE: {theme.name.toUpperCase()}</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-xs font-mono uppercase tracking-wider mb-4 font-semibold"
              style={{ color: theme.primary }}
            >
              Platform Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a href="#features" className="hover:text-white transition-colors">Core Features</a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">About Us</a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">Pricing Packages</a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-white transition-colors">Client Testimonials</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">Inquiry Portal</a>
              </li>
              <li>
                <a
                  href="https://wa.me/919113233351"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 transition-colors inline-flex items-center space-x-1 font-mono text-xs"
                >
                  <span>💬 WhatsApp: +91 91132 33351</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Tech Stack Specs */}
          <div>
            <h4
              className="text-xs font-mono uppercase tracking-wider mb-4 font-semibold"
              style={{ color: theme.primary }}
            >
              Full-Stack Architecture
            </h4>
            <div className="flex flex-wrap gap-2 text-[11px] font-mono">
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">Django 5 + DRF</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">PostgreSQL</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">SimpleJWT</span>
              <span
                className="px-2.5 py-1 rounded-md border"
                style={{
                  backgroundColor: theme.badgeBg,
                  borderColor: theme.badgeBorder,
                  color: theme.badgeText,
                }}
              >
                React 18 + Vite
              </span>
              <span
                className="px-2.5 py-1 rounded-md border"
                style={{
                  backgroundColor: theme.badgeBg,
                  borderColor: theme.badgeBorder,
                  color: theme.badgeText,
                }}
              >
                Three.js / R3F
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">Tailwind CSS</span>
            </div>

            <div className="mt-6">
              <Link
                to="/admin-login"
                className="text-xs font-mono text-slate-500 hover:text-white transition flex items-center space-x-1"
              >
                <span>&bull; Authenticated Admin Portal</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono">
          <p>&copy; {new Date().getFullYear()} Nexvo Technology Inc. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 flex items-center space-x-1">
            <span>Engineered with Next-Gen Intelligence</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
