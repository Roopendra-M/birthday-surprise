export default function LockIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Cute lock illustration"
      role="img"
    >
      <defs>
        <linearGradient id="lockBodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffc8de" />
          <stop offset="100%" stopColor="#f97bb8" />
        </linearGradient>
        <linearGradient id="lockShackleGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffaed4" />
          <stop offset="100%" stopColor="#e91e78" />
        </linearGradient>
        <linearGradient id="keyHoleGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff0f5" />
          <stop offset="100%" stopColor="#ffd6ea" />
        </linearGradient>
        <linearGradient id="starGradLock" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffe066" />
          <stop offset="100%" stopColor="#ffb347" />
        </linearGradient>
        <radialGradient id="glowLock" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb3d1" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ffb3d1" stopOpacity="0" />
        </radialGradient>
        <filter id="lockShadow">
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#f97bb8" floodOpacity="0.3" />
        </filter>
        <filter id="sparkleGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background glow */}
      <ellipse cx="100" cy="130" rx="80" ry="70" fill="url(#glowLock)" />

      {/* Shackle (the arch on top) */}
      <path
        d="M62 105 L62 78 A38 38 0 0 1 138 78 L138 105"
        stroke="url(#lockShackleGrad)"
        strokeWidth="16"
        strokeLinecap="round"
        fill="none"
        filter="url(#lockShadow)"
      />
      {/* Shackle inner shine */}
      <path
        d="M68 105 L68 80 A32 32 0 0 1 90 52"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Lock body */}
      <rect
        x="44"
        y="100"
        width="112"
        height="92"
        rx="22"
        fill="url(#lockBodyGrad)"
        filter="url(#lockShadow)"
      />

      {/* Body shine highlight */}
      <ellipse cx="80" cy="118" rx="22" ry="8" fill="white" opacity="0.25" transform="rotate(-15 80 118)" />

      {/* Body decorative stripes */}
      <rect x="44" y="150" width="112" height="3" rx="1.5" fill="rgba(255,255,255,0.2)" />
      <rect x="44" y="158" width="112" height="3" rx="1.5" fill="rgba(255,255,255,0.15)" />

      {/* Key hole outer */}
      <circle cx="100" cy="136" r="16" fill="url(#keyHoleGrad)" />
      {/* Key hole inner circle */}
      <circle cx="100" cy="132" r="8" fill="#e91e78" opacity="0.7" />
      {/* Key hole slot */}
      <rect x="96.5" y="138" width="7" height="12" rx="3.5" fill="#e91e78" opacity="0.7" />
      {/* Key hole shine */}
      <circle cx="97" cy="130" r="2.5" fill="white" opacity="0.6" />

      {/* Cute face on lock */}
      {/* Eyes */}
      <ellipse cx="84" cy="118" rx="4" ry="5" fill="white" />
      <ellipse cx="116" cy="118" rx="4" ry="5" fill="white" />
      <circle cx="85" cy="119" r="2.5" fill="#6b2046" />
      <circle cx="117" cy="119" r="2.5" fill="#6b2046" />
      <circle cx="86" cy="118" r="1" fill="white" opacity="0.9" />
      <circle cx="118" cy="118" r="1" fill="white" opacity="0.9" />

      {/* Blush */}
      <ellipse cx="76" cy="125" rx="9" ry="5" fill="#ff9cbd" opacity="0.5" />
      <ellipse cx="124" cy="125" rx="9" ry="5" fill="#ff9cbd" opacity="0.5" />

      {/* Decorative sparkles around lock */}
      {/* Top left star */}
      <g filter="url(#sparkleGlow)">
        <path
          d="M32 48 L34 40 L36 48 L44 50 L36 52 L34 60 L32 52 L24 50 Z"
          fill="url(#starGradLock)"
        />
      </g>

      {/* Top right star */}
      <g filter="url(#sparkleGlow)">
        <path
          d="M160 36 L162 29 L164 36 L171 38 L164 40 L162 47 L160 40 L153 38 Z"
          fill="#ffc8de"
        />
      </g>

      {/* Bottom left small star */}
      <path
        d="M28 160 L29.5 155 L31 160 L36 161.5 L31 163 L29.5 168 L28 163 L23 161.5 Z"
        fill="#c4b0ff"
        opacity="0.8"
      />

      {/* Bottom right heart */}
      <text x="154" y="175" fontSize="18" filter="url(#sparkleGlow)">💕</text>

      {/* Tiny hearts floating */}
      <text x="18" y="100" fontSize="12">💗</text>
      <text x="168" y="110" fontSize="11">💖</text>
      <text x="52" y="36" fontSize="10">✨</text>
      <text x="140" y="58" fontSize="10">⭐</text>
      <text x="30" y="200" fontSize="10">🌸</text>
      <text x="158" y="196" fontSize="10">✨</text>
    </svg>
  );
}
