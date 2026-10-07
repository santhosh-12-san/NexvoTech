import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * CursorGlow — full-page radial spotlight that follows the cursor.
 * Renders two layers:
 *   1. A large, soft ambient halo  (~600 px)
 *   2. A tight, bright inner core  (~120 px)
 * Both track the real mouse position via a RAF-driven spring lerp so the
 * movement feels smooth and alive without janking the React render cycle.
 */
export default function CursorGlow() {
  const { theme } = useTheme();

  // Current "display" position (spring target)
  const pos = useRef({ x: -999, y: -999 });
  // Raw mouse position (always up-to-date)
  const target = useRef({ x: -999, y: -999 });
  const rafId = useRef(null);

  const outerRef = useRef(null);
  const innerRef = useRef(null);

  // Lerp factor — lower = slower / smoother
  const LERP = 0.1;

  const animate = useCallback(() => {
    pos.current.x += (target.current.x - pos.current.x) * LERP;
    pos.current.y += (target.current.y - pos.current.y) * LERP;

    const x = pos.current.x;
    const y = pos.current.y;

    if (outerRef.current) {
      outerRef.current.style.transform = `translate(${x - 300}px, ${y - 300}px)`;
    }
    if (innerRef.current) {
      innerRef.current.style.transform = `translate(${x - 60}px, ${y - 60}px)`;
    }

    rafId.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const handleMove = (e) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [animate]);

  return (
    <>
      {/* Large ambient halo — 600 × 600 px soft blob */}
      <div
        ref={outerRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 w-[600px] h-[600px] rounded-full z-[9998] will-change-transform"
        style={{
          background: `radial-gradient(circle, ${theme.glowColor}22 0%, ${theme.glowColor}08 45%, transparent 70%)`,
          mixBlendMode: 'screen',
        }}
      />

      {/* Tight bright core — 120 × 120 px */}
      <div
        ref={innerRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 w-[120px] h-[120px] rounded-full z-[9999] will-change-transform"
        style={{
          background: `radial-gradient(circle, ${theme.primary}28 0%, transparent 70%)`,
          mixBlendMode: 'screen',
        }}
      />
    </>
  );
}
