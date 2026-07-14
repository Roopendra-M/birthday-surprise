"use client";

import { useState } from "react";

interface FloatingHeart {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  char: string;
}

const CHARS = ["❤️", "💕", "💗", "💖", "💝", "🌸", "✨", "💫", "🌺", "💞"];

function generateHearts(count: number): FloatingHeart[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: 14 + Math.random() * 22,
    duration: 8 + Math.random() * 14,
    delay: Math.random() * 12,
    opacity: 0.3 + Math.random() * 0.55,
    char: CHARS[Math.floor(Math.random() * CHARS.length)],
  }));
}

export default function FloatingHearts() {
  // Lazy initializer — safe client-side (component is ssr:false)
  const [hearts] = useState<FloatingHeart[]>(() => generateHearts(28));

  if (hearts.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {hearts.map((h) => (
        <span
          key={h.id}
          className="animate-drift-up"
          style={{
            position: "absolute",
            bottom: "-60px",
            left: `${h.x}%`,
            fontSize: `${h.size}px`,
            opacity: h.opacity,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
            filter: "drop-shadow(0 2px 4px rgba(249,85,142,0.3))",
            userSelect: "none",
          }}
        >
          {h.char}
        </span>
      ))}
    </div>
  );
}
