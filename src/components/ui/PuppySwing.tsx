"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * PuppySwing — cute chibi puppy sitting on a swing, animated with GSAP.
 * The entire swing+puppy group pendulums around the hook at the top.
 */
export default function PuppySwing({ className = "" }: { className?: string }) {
  const groupRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!groupRef.current) return;

    const ctx = gsap.context(() => {
      // Start at a slight angle then swing both ways
      gsap.set(groupRef.current, { rotation: -22, svgOrigin: "160 18" });

      gsap.timeline({ repeat: -1 })
        .to(groupRef.current, {
          rotation: 22,
          svgOrigin: "160 18",
          duration: 1.25,
          ease: "sine.inOut",
        })
        .to(groupRef.current, {
          rotation: -22,
          svgOrigin: "160 18",
          duration: 1.25,
          ease: "sine.inOut",
        });
    });

    return () => ctx.revert();
  }, []);

  return (
    <svg
      className={className}
      viewBox="0 0 320 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Cute puppy swinging on a swing"
      role="img"
    >
      <defs>
        {/* ── Gradients ── */}
        <linearGradient id="swFurGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f5deb3" />
          <stop offset="100%" stopColor="#deb887" />
        </linearGradient>
        <linearGradient id="swFurDark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c8a87a" />
          <stop offset="100%" stopColor="#a0784a" />
        </linearGradient>
        <radialGradient id="swBlush" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffaac5" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#ffaac5" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="swNose" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b4a6b" />
          <stop offset="100%" stopColor="#5a2a45" />
        </linearGradient>
        <linearGradient id="swTongue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff9cbd" />
          <stop offset="100%" stopColor="#f97bb8" />
        </linearGradient>
        <radialGradient id="swEye" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4a2a6a" />
          <stop offset="100%" stopColor="#1a0a2e" />
        </radialGradient>
        <linearGradient id="swPlank" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c8956c" />
          <stop offset="100%" stopColor="#a0683a" />
        </linearGradient>
        <linearGradient id="swCollar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f97bb8" />
          <stop offset="100%" stopColor="#e91e78" />
        </linearGradient>
        <linearGradient id="swHook" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c4b0ff" />
          <stop offset="100%" stopColor="#a98eff" />
        </linearGradient>
        <filter id="swShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#f97bb8" floodOpacity="0.2" />
        </filter>
        <filter id="swGlow">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Static hook bar at top ── */}
      <rect x="130" y="10" width="60" height="8" rx="4" fill="url(#swHook)" />
      <circle cx="160" cy="18" r="6" fill="#c4b0ff" />

      {/* ══════════════════════════════════════════
          SWING GROUP — GSAP animates this whole group
      ══════════════════════════════════════════ */}
      <g ref={groupRef}>

        {/* ── Ropes ── */}
        <line x1="160" y1="18" x2="110" y2="240" stroke="#c8a87a" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="160" y1="18" x2="210" y2="240" stroke="#c8a87a" strokeWidth="3.5" strokeLinecap="round" />

        {/* ── Seat / plank ── */}
        <rect x="94" y="238" width="132" height="18" rx="9" fill="url(#swPlank)" filter="url(#swShadow)" />
        {/* Plank grain lines */}
        <line x1="118" y1="241" x2="118" y2="253" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="140" y1="241" x2="140" y2="253" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="162" y1="241" x2="162" y2="253" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="184" y1="241" x2="184" y2="253" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" strokeLinecap="round" />
        {/* Rope knots at seat */}
        <circle cx="110" cy="247" r="6" fill="#b8876a" />
        <circle cx="210" cy="247" r="6" fill="#b8876a" />

        {/* ── Puppy body ── */}
        {/* Body */}
        <ellipse cx="160" cy="200" rx="36" ry="42" fill="url(#swFurGrad)" filter="url(#swShadow)" />
        {/* Belly patch */}
        <ellipse cx="160" cy="210" rx="22" ry="28" fill="#fff5e8" opacity="0.85" />

        {/* Tail (wagging to right) */}
        <path d="M194 190 Q218 165 214 148 Q210 138 204 142 Q210 162 188 185Z"
          fill="url(#swFurGrad)" />
        <ellipse cx="210" cy="146" rx="9" ry="7" fill="#fff5e8" />

        {/* Front paws resting on plank */}
        {/* Left paw */}
        <ellipse cx="130" cy="236" rx="15" ry="10" fill="url(#swFurGrad)" />
        <ellipse cx="130" cy="240" rx="16" ry="7" fill="#e8c99a" />
        <circle cx="122" cy="243" r="4" fill="#d4aa80" />
        <circle cx="130" cy="245" r="4.5" fill="#d4aa80" />
        <circle cx="138" cy="243" r="4" fill="#d4aa80" />
        {/* Right paw */}
        <ellipse cx="190" cy="236" rx="15" ry="10" fill="url(#swFurGrad)" />
        <ellipse cx="190" cy="240" rx="16" ry="7" fill="#e8c99a" />
        <circle cx="182" cy="243" r="4" fill="#d4aa80" />
        <circle cx="190" cy="245" r="4.5" fill="#d4aa80" />
        <circle cx="198" cy="243" r="4" fill="#d4aa80" />

        {/* Collar */}
        <rect x="128" y="162" width="64" height="14" rx="7" fill="url(#swCollar)" />
        <ellipse cx="160" cy="170" rx="8" ry="6" fill="#ffe066" />
        <text x="160" y="173" textAnchor="middle" fontSize="6" fill="#c8960c" fontWeight="bold">♥</text>
        <circle cx="138" cy="169" r="3" fill="#ffe066" />
        <circle cx="182" cy="169" r="3" fill="#ffe066" />

        {/* ── Head ── */}
        <ellipse cx="160" cy="128" rx="58" ry="55" fill="url(#swFurGrad)" filter="url(#swShadow)" />

        {/* Floppy ears */}
        {/* Left ear */}
        <ellipse cx="112" cy="110" rx="24" ry="40" fill="url(#swFurDark)" transform="rotate(-18 112 110)" />
        <ellipse cx="114" cy="115" rx="14" ry="27" fill="#f0c090" opacity="0.55" transform="rotate(-18 114 115)" />
        {/* Right ear */}
        <ellipse cx="208" cy="110" rx="24" ry="40" fill="url(#swFurDark)" transform="rotate(18 208 110)" />
        <ellipse cx="206" cy="115" rx="14" ry="27" fill="#f0c090" opacity="0.55" transform="rotate(18 206 115)" />

        {/* Head fur patches */}
        <ellipse cx="132" cy="95" rx="22" ry="18" fill="url(#swFurDark)" opacity="0.5" transform="rotate(-10 132 95)" />
        <ellipse cx="188" cy="95" rx="22" ry="18" fill="url(#swFurDark)" opacity="0.45" transform="rotate(10 188 95)" />

        {/* Forehead tuft */}
        <path d="M150 68 Q160 55 170 68 Q164 61 160 59 Q156 61 150 68Z" fill="url(#swFurDark)" opacity="0.65" />

        {/* ── Eyes (big cute) ── */}
        {/* Left */}
        <ellipse cx="138" cy="130" rx="18" ry="20" fill="white" />
        <ellipse cx="140" cy="133" rx="13" ry="15" fill="url(#swEye)" />
        <ellipse cx="141" cy="134" rx="8" ry="10" fill="#080014" />
        <circle cx="146" cy="127" r="5" fill="white" opacity="0.95" />
        <circle cx="136" cy="138" r="2" fill="white" opacity="0.8" />
        {/* Right */}
        <ellipse cx="182" cy="130" rx="18" ry="20" fill="white" />
        <ellipse cx="180" cy="133" rx="13" ry="15" fill="url(#swEye)" />
        <ellipse cx="179" cy="134" rx="8" ry="10" fill="#080014" />
        <circle cx="187" cy="127" r="5" fill="white" opacity="0.95" />
        <circle cx="175" cy="138" r="2" fill="white" opacity="0.8" />

        {/* Eyebrows (gentle happy arch) */}
        <path d="M126 115 Q138 109 150 115" stroke="#a07848" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M170 115 Q182 109 194 115" stroke="#a07848" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Blush cheeks */}
        <ellipse cx="112" cy="148" rx="20" ry="12" fill="url(#swBlush)" />
        <ellipse cx="208" cy="148" rx="20" ry="12" fill="url(#swBlush)" />

        {/* Nose */}
        <ellipse cx="160" cy="155" rx="12" ry="8.5" fill="url(#swNose)" />
        <ellipse cx="155" cy="151" rx="3.5" ry="2.5" fill="white" opacity="0.45" />

        {/* Happy open mouth + tongue */}
        <path d="M146 164 Q160 177 174 164" stroke="#8b4a6b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <ellipse cx="160" cy="174" rx="10" ry="9" fill="url(#swTongue)" />
        <line x1="160" y1="168" x2="160" y2="182" stroke="#e86aa0" strokeWidth="1.5" strokeLinecap="round" />

        {/* ── Floating sparkles near swing ── */}
        <g filter="url(#swGlow)">
          <path d="M54 155 L56 148 L58 155 L65 157 L58 159 L56 166 L54 159 L47 157 Z" fill="#ffe066" opacity="0.9" />
          <path d="M252 120 L254 113 L256 120 L263 122 L256 124 L254 131 L252 124 L245 122 Z" fill="#ffa0c6" opacity="0.85" />
          <path d="M62 230 L63.5 225 L65 230 L70 231.5 L65 233 L63.5 238 L62 233 L57 231.5 Z" fill="#c4b0ff" opacity="0.8" />
        </g>
        <text x="48" y="110" fontSize="18" filter="url(#swGlow)">💕</text>
        <text x="252" y="185" fontSize="14" filter="url(#swGlow)">💖</text>
        <text x="70" y="270" fontSize="13" filter="url(#swGlow)">✨</text>
        <text x="235" y="270" fontSize="13" filter="url(#swGlow)">⭐</text>
      </g>
    </svg>
  );
}
