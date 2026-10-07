import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Palette, Check, Sparkles, X, SlidersHorizontal } from 'lucide-react';

export default function ThemeDock() {
  const { theme, themes, themeId, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside aria-label="Theme Customizer" className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center space-x-2.5 px-4 py-3 rounded-2xl glass-dropdown border border-slate-700/80 shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
          style={{
            borderColor: theme.borderHover,
            boxShadow: `0 10px 25px -5px ${theme.glowColor}`,
          }}
          title="Customize Theme & Background Colors"
        >
          {/* Animated color beacon */}
          <span className="relative flex h-3.5 w-3.5">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: theme.primary }}
            />
            <span
              className="relative inline-flex rounded-full h-3.5 w-3.5 border border-white/40"
              style={{ backgroundColor: theme.primary }}
            />
          </span>

          <Palette className="w-4 h-4 text-white group-hover:rotate-45 transition-transform duration-300" />
          <span className="text-xs font-mono font-bold tracking-wider text-white uppercase hidden sm:inline">
            {theme.name}
          </span>
          <span
            className="text-[10px] font-mono px-1.5 py-0.5 rounded uppercase hidden md:inline"
            style={{
              backgroundColor: theme.badgeBg,
              color: theme.badgeText,
              border: `1px solid ${theme.badgeBorder}`,
            }}
          >
            Change Color
          </span>
        </button>
      )}

      {/* Expanded Color Customizer Panel */}
      {isOpen && (
        <div
          className="w-80 sm:w-96 rounded-3xl glass-dropdown p-5 border shadow-2xl animate-fade-in relative overflow-hidden"
          style={{
            borderColor: theme.borderHover,
            boxShadow: `0 20px 40px -10px rgba(0,0,0,0.8), 0 0 35px -5px ${theme.glowColor}`,
          }}
        >
          {/* Top subtle accent bar */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{
              background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary}, ${theme.accent})`,
            }}
          />

          {/* Panel Header */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: theme.badgeBg }}
              >
                <SlidersHorizontal className="w-4 h-4" style={{ color: theme.primary }} />
              </div>
              <div>
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Chromatic Engine
                </h3>
                <p className="text-[10px] text-slate-400 font-mono">
                  Select Theme &amp; Background
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-300 mb-4 leading-relaxed font-sans">
            Customize the platform aesthetic. Instantly updates the <strong className="text-white">dark background</strong>, <strong className="text-white">3D hero canvas</strong>, <strong className="text-white">feature cards</strong>, and interactive lighting.
          </p>

          {/* 6 Theme Grid Swatches */}
          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {themes.map((item) => {
              const isSelected = item.id === themeId;
              return (
                <button
                  key={item.id}
                  onClick={() => setTheme(item.id)}
                  className={`w-full p-3 rounded-2xl text-left transition-all duration-200 flex items-center justify-between group border ${
                    isSelected
                      ? 'bg-slate-900/90 shadow-lg'
                      : 'bg-slate-950/40 hover:bg-slate-900/60 border-slate-800/60'
                  }`}
                  style={{
                    borderColor: isSelected ? item.primary : 'rgba(255,255,255,0.08)',
                    boxShadow: isSelected ? `0 0 15px -3px ${item.glowColor}` : 'none',
                  }}
                >
                  <div className="flex items-center space-x-3.5">
                    {/* Dual Swatch (Background + Primary) */}
                    <div
                      className="w-8 h-8 rounded-xl border border-white/20 flex items-center justify-center shadow-inner relative overflow-hidden shrink-0"
                      style={{ backgroundColor: item.bg }}
                    >
                      <div
                        className="w-4 h-4 rounded-full border border-white/50"
                        style={{ backgroundColor: item.primary }}
                      />
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white font-mono tracking-tight">
                          {item.name}
                        </span>
                        {isSelected && (
                          <span
                            className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded font-bold"
                            style={{
                              backgroundColor: item.badgeBg,
                              color: item.badgeText,
                            }}
                          >
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {item.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 ml-2">
                    {isSelected ? (
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-slate-950 font-bold"
                        style={{ backgroundColor: item.primary }}
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    ) : (
                      <div
                        className="w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ backgroundColor: item.primary }}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center space-x-1">
              <Sparkles className="w-3 h-3" style={{ color: theme.primary }} />
              <span>Persisted in LocalStorage</span>
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold hover:underline"
              style={{ color: theme.primary }}
            >
              Done &rarr;
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
