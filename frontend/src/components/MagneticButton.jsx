import React, { useRef, useState, useCallback } from 'react';
import SoundEngine from '../utils/soundEffects';

/**
 * MagneticButton — wraps any element (button, anchor, div …) and makes it
 * gently float toward the cursor when the cursor is within the "field" radius.
 *
 * Props:
 *   as          — element type to render ('a', 'button', 'div' …)  default 'button'
 *   strength    — how far the element travels (0–1)                 default 0.4
 *   fieldRadius — px radius of the magnetic field                   default 100
 *   playSound   — whether to play a sci-fi blip on enter           default true
 *   children    — slot
 *   …rest       — forwarded to the underlying element (href, onClick, className, style …)
 */
export default function MagneticButton({
  as: Tag = 'button',
  strength = 0.4,
  fieldRadius = 110,
  playSound = true,
  children,
  className = '',
  style = {},
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  ...rest
}) {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const inside = useRef(false);

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < fieldRadius) {
      setOffset({ x: dx * strength, y: dy * strength });
    } else {
      setOffset({ x: 0, y: 0 });
    }

    onMouseMove?.(e);
  }, [strength, fieldRadius, onMouseMove]);

  const handleMouseEnter = useCallback((e) => {
    if (!inside.current) {
      inside.current = true;
      if (playSound) SoundEngine.playBlip(1050);
    }
    onMouseEnter?.(e);
  }, [playSound, onMouseEnter]);

  const handleMouseLeave = useCallback((e) => {
    inside.current = false;
    setOffset({ x: 0, y: 0 });
    onMouseLeave?.(e);
  }, [onMouseLeave]);

  return (
    <Tag
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        ...style,
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: offset.x === 0 && offset.y === 0
          ? 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
          : 'transform 0.12s linear',
        willChange: 'transform',
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
