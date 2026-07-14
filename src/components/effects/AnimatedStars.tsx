"use client";

import { useState } from "react";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  type: "four" | "six" | "dot";
}

const TYPES: Star["type"][] = ["four", "six", "dot", "dot", "four"];

function generateStars(count: number): Star[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 8 + Math.random() * 18,
    duration: 2 + Math.random() * 3,
    delay: Math.random() * 4,
    type: TYPES[Math.floor(Math.random() * TYPES.length)],
  }));
}

function StarShape({ type, size }: { type: Star["type"]; size: number }) {
  if (type === "dot") {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: "radial-gradient(circle, #ffe066 0%, #ffa0c6 100%)",
        }}
      />
    );
  }

  if (type === "four") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={`sg4-${size}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffe066" />
            <stop offset="100%" stopColor="#ffb347" />
          </linearGradient>
        </defs>
        <path
          d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z"
          fill={`url(#sg4-${size})`}
        />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`sg6-${size}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffc8de" />
          <stop offset="100%" stopColor="#a98eff" />
        </linearGradient>
      </defs>
      <path
        d="M12 1 L14 9 L22 7 L16 13 L22 19 L14 17 L12 25 L10 17 L2 19 L8 13 L2 7 L10 9 Z"
        fill={`url(#sg6-${size})`}
      />
    </svg>
  );
}

export default function AnimatedStars() {
  // Lazy initializer — safe because this component is only rendered client-side (ssr:false)
  const [stars] = useState<Star[]>(() => generateStars(22));

  if (stars.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {stars.map((s) => (
        <div
          key={s.id}
          className="animate-twinkle"
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
        >
          <StarShape type={s.type} size={s.size} />
        </div>
      ))}
    </div>
  );
}
