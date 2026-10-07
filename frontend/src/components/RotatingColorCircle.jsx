import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import SoundEngine from '../utils/soundEffects';

export default function RotatingColorCircle() {
  const { theme, themes, themeIndex, nextTheme, prevTheme } = useTheme();
  const [rotationAngle, setRotationAngle] = useState(() => themeIndex * 15);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const circleRef = useRef(null);
  const tooltipTimeout = useRef(null);

  // Sync rotation angle with theme index
  useEffect(() => {
    setRotationAngle(themeIndex * (360 / themes.length));
  }, [themeIndex, themes.length]);

  const handleRotateNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRotating(true);
    SoundEngine.playModeSwitch();
    nextTheme();
    triggerTooltip();
    setTimeout(() => setIsRotating(false), 400);
  };

  // Mouse wheel scroll to rotate through colors smoothly
  const handleWheel = (e) => {
    e.preventDefault();
    SoundEngine.playModeSwitch();
    if (e.deltaY > 0) {
      nextTheme();
    } else {
      prevTheme();
    }
    triggerTooltip();
  };

  const triggerTooltip = () => {
    setShowTooltip(true);
    if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
    tooltipTimeout.current = setTimeout(() => {
      setShowTooltip(false);
    }, 2000);
  };

  return (
    <div
      className="relative flex items-center justify-center select-none"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* THE ROTATING COLOR CIRCLE BUTTON */}
      <button
        ref={circleRef}
        onClick={handleRotateNext}
        onWheel={handleWheel}
        className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full transition-transform duration-200 hover:scale-110 active:scale-95 group focus:outline-none cursor-pointer"
        style={{
          boxShadow: `0 0 20px -3px ${theme.glowColor}, inset 0 0 10px rgba(0,0,0,0.6)`,
        }}
        title="Rotate circle to change color (Click or scroll mouse wheel)"
        aria-label="Rotate Circle to Change Color"
      >
        {/* Outer Rotating Chromatic Dial with Notch Pointer */}
        <div
          className="absolute inset-0 rounded-full transition-transform"
          style={{
            transform: `rotate(${rotationAngle}deg)`,
            transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            background:
              'conic-gradient(from 0deg, #06b6d4, #3b82f6, #0284c7, #0ea5e9, #14b8a6, #2dd4bf, #34d399, #10b981, #84cc16, #a3e635, #eab308, #fbbf24, #f59e0b, #f97316, #fb7185, #ef4444, #f43f5e, #ec4899, #d946ef, #a855f7, #8b5cf6, #6366f1, #94a3b8, #cbd5e1, #06b6d4)',
            padding: '3px',
          }}
        >
          {/* Inner bezel background */}
          <div
            className="w-full h-full rounded-full relative"
            style={{ backgroundColor: theme.surface }}
          >
            {/* Top Rotation Pointer / Notch */}
            <div
              className="absolute -top-[2px] left-1/2 -translate-x-1/2 w-1.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]"
            />
          </div>
        </div>

        {/* Central Color Swatch (Color changes inside the circle when rotated) */}
        <div
          className="relative z-10 w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-white/80 transition-colors duration-400 flex items-center justify-center shadow-inner"
          style={{
            backgroundColor: theme.primary,
            boxShadow: `0 0 12px ${theme.glowColor}`,
          }}
        >
          {/* Center Quantum Core Dot */}
          <div
            className={`w-2 h-2 rounded-full bg-white transition-transform duration-300 ${
              isRotating ? 'scale-125' : 'scale-100'
            }`}
          />
        </div>
      </button>

      {/* Sleek Floating HUD Tooltip */}
      {showTooltip && (
        <div
          className="absolute -bottom-10 right-0 px-3 py-1 rounded-xl glass-dropdown border text-center whitespace-nowrap z-50 pointer-events-none animate-fade-in shadow-xl"
          style={{
            borderColor: theme.borderHover,
            boxShadow: `0 8px 20px -4px ${theme.glowColor}`,
          }}
        >
          <div className="flex items-center space-x-1.5 text-[11px] font-mono">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: theme.primary }}
            />
            <span className="font-bold text-white">{theme.name}</span>
            <span className="text-slate-400 text-[10px]">
              ({themeIndex + 1}/{themes.length})
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
