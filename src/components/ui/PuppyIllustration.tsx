/* Cute chibi puppy illustration — inline SVG */
export default function PuppyIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 320 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Cute puppy illustration"
      role="img"
    >
      <defs>
        <radialGradient id="puppyGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd6ea" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fff5f9" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="furGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f5deb3" />
          <stop offset="100%" stopColor="#deb887" />
        </linearGradient>
        <linearGradient id="furDarkGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c8a87a" />
          <stop offset="100%" stopColor="#a0784a" />
        </linearGradient>
        <radialGradient id="puppyBlush" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffaac5" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#ffaac5" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="noseGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b4a6b" />
          <stop offset="100%" stopColor="#5a2a45" />
        </linearGradient>
        <linearGradient id="tongueGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff9cbd" />
          <stop offset="100%" stopColor="#f97bb8" />
        </linearGradient>
        <radialGradient id="eyeGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4a2a6a" />
          <stop offset="100%" stopColor="#1a0a2e" />
        </radialGradient>
        <filter id="puppyShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#f97bb8" floodOpacity="0.22" />
        </filter>
        <filter id="puppyGlowFilter">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="tailGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#deb887" />
          <stop offset="100%" stopColor="#c8a87a" />
        </linearGradient>
        <linearGradient id="collarGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f97bb8" />
          <stop offset="100%" stopColor="#e91e78" />
        </linearGradient>
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5deb3" />
          <stop offset="100%" stopColor="#e8c99a" />
        </linearGradient>
        <linearGradient id="bellyGrad" cx="50%" cy="50%" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff5e8" />
          <stop offset="100%" stopColor="#fde8c8" />
        </linearGradient>
      </defs>

      {/* Background glow */}
      <ellipse cx="160" cy="190" rx="140" ry="140" fill="url(#puppyGlow)" />

      {/* ── Shadow under body ── */}
      <ellipse cx="160" cy="318" rx="72" ry="10" fill="rgba(200,150,120,0.18)" />

      {/* ── Tail ── */}
      <path
        d="M228 220 Q260 180 252 150 Q248 138 240 142 Q248 168 220 212Z"
        fill="url(#tailGrad)"
        filter="url(#puppyShadow)"
      />
      {/* Tail tip */}
      <ellipse cx="246" cy="147" rx="12" ry="10" fill="#fff5e8" />

      {/* ── Body ── */}
      <ellipse cx="158" cy="240" rx="75" ry="68" fill="url(#bodyGrad)" filter="url(#puppyShadow)" />

      {/* Belly patch */}
      <ellipse cx="158" cy="255" rx="42" ry="46" fill="url(#bellyGrad)" />

      {/* ── Front legs / paws ── */}
      {/* Left leg */}
      <ellipse cx="106" cy="300" rx="20" ry="28" fill="url(#furGrad)" filter="url(#puppyShadow)" />
      <ellipse cx="106" cy="320" rx="22" ry="12" fill="#e8c99a" />
      {/* Paw toes */}
      <circle cx="96" cy="326" r="5" fill="#d4aa80" />
      <circle cx="106" cy="329" r="5.5" fill="#d4aa80" />
      <circle cx="116" cy="326" r="5" fill="#d4aa80" />

      {/* Right leg */}
      <ellipse cx="210" cy="300" rx="20" ry="28" fill="url(#furGrad)" filter="url(#puppyShadow)" />
      <ellipse cx="210" cy="320" rx="22" ry="12" fill="#e8c99a" />
      {/* Paw toes */}
      <circle cx="200" cy="326" r="5" fill="#d4aa80" />
      <circle cx="210" cy="329" r="5.5" fill="#d4aa80" />
      <circle cx="220" cy="326" r="5" fill="#d4aa80" />

      {/* ── Collar ── */}
      <rect x="110" y="186" width="100" height="18" rx="9" fill="url(#collarGrad)" />
      {/* Collar tag */}
      <ellipse cx="160" cy="205" rx="10" ry="8" fill="#ffe066" />
      <text x="160" y="208" textAnchor="middle" fontSize="7" fill="#c8960c" fontWeight="bold">♥</text>
      {/* Collar studs */}
      <circle cx="125" cy="195" r="4" fill="#ffe066" />
      <circle cx="195" cy="195" r="4" fill="#ffe066" />

      {/* ── Head ── */}
      <ellipse cx="160" cy="145" rx="78" ry="72" fill="url(#furGrad)" filter="url(#puppyShadow)" />

      {/* ── Floppy ears ── */}
      {/* Left ear */}
      <ellipse cx="96" cy="125" rx="30" ry="48" fill="url(#furDarkGrad)" transform="rotate(-18 96 125)" />
      {/* Left ear inner */}
      <ellipse cx="98" cy="130" rx="18" ry="34" fill="#f0c090" opacity="0.6" transform="rotate(-18 98 130)" />

      {/* Right ear */}
      <ellipse cx="224" cy="125" rx="30" ry="48" fill="url(#furDarkGrad)" transform="rotate(18 224 125)" />
      {/* Right ear inner */}
      <ellipse cx="222" cy="130" rx="18" ry="34" fill="#f0c090" opacity="0.6" transform="rotate(18 222 130)" />

      {/* Head fur patches */}
      <ellipse cx="128" cy="110" rx="28" ry="22" fill="url(#furDarkGrad)" opacity="0.6" transform="rotate(-10 128 110)" />
      <ellipse cx="192" cy="110" rx="28" ry="22" fill="url(#furDarkGrad)" opacity="0.5" transform="rotate(10 192 110)" />

      {/* ── Forehead tuft ── */}
      <path d="M148 82 Q160 68 172 82 Q166 74 160 72 Q154 74 148 82Z" fill="url(#furDarkGrad)" opacity="0.7" />

      {/* ── Eyes ── */}
      {/* Left eye white */}
      <ellipse cx="134" cy="148" rx="22" ry="24" fill="white" />
      {/* Left iris */}
      <ellipse cx="136" cy="151" rx="16" ry="18" fill="url(#eyeGrad)" />
      {/* Left pupil */}
      <ellipse cx="137" cy="152" rx="10" ry="12" fill="#0a0018" />
      {/* Left eye shine big */}
      <circle cx="141" cy="146" r="5.5" fill="white" opacity="0.95" />
      {/* Left eye shine small */}
      <circle cx="132" cy="156" r="2.5" fill="white" opacity="0.8" />

      {/* Right eye white */}
      <ellipse cx="186" cy="148" rx="22" ry="24" fill="white" />
      {/* Right iris */}
      <ellipse cx="184" cy="151" rx="16" ry="18" fill="url(#eyeGrad)" />
      {/* Right pupil */}
      <ellipse cx="183" cy="152" rx="10" ry="12" fill="#0a0018" />
      {/* Right eye shine big */}
      <circle cx="190" cy="146" r="5.5" fill="white" opacity="0.95" />
      {/* Right eye shine small */}
      <circle cx="179" cy="156" r="2.5" fill="white" opacity="0.8" />

      {/* ── Blush cheeks ── */}
      <ellipse cx="108" cy="165" rx="22" ry="14" fill="url(#puppyBlush)" />
      <ellipse cx="212" cy="165" rx="22" ry="14" fill="url(#puppyBlush)" />

      {/* ── Nose ── */}
      <ellipse cx="160" cy="174" rx="14" ry="10" fill="url(#noseGrad)" />
      {/* Nose shine */}
      <ellipse cx="155" cy="170" rx="4" ry="3" fill="white" opacity="0.5" />

      {/* ── Mouth ── */}
      <path d="M148 182 Q160 192 172 182" stroke="#8b4a6b" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* ── Tongue ── */}
      <ellipse cx="160" cy="192" rx="12" ry="10" fill="url(#tongueGrad)" />
      {/* Tongue line */}
      <line x1="160" y1="186" x2="160" y2="200" stroke="#e86aa0" strokeWidth="1.5" strokeLinecap="round" />

      {/* ── Decorative sparkles & hearts ── */}
      <g filter="url(#puppyGlowFilter)">
        {/* Top-left star */}
        <path d="M52 70 L54 62 L56 70 L64 72 L56 74 L54 82 L52 74 L44 72 Z" fill="#ffe066" />
        {/* Top-right star */}
        <path d="M256 55 L258 48 L260 55 L267 57 L260 59 L258 66 L256 59 L249 57 Z" fill="#ffa0c6" />
        {/* Bottom-right small star */}
        <path d="M272 220 L273.5 215 L275 220 L280 221.5 L275 223 L273.5 228 L272 223 L267 221.5 Z" fill="#c4b0ff" opacity="0.9" />
      </g>

      {/* Floating hearts */}
      <text x="44" y="155" fontSize="20" filter="url(#puppyGlowFilter)">💕</text>
      <text x="260" y="145" fontSize="16" filter="url(#puppyGlowFilter)">💖</text>
      <text x="50" y="240" fontSize="14" filter="url(#puppyGlowFilter)">❤️</text>
      <text x="262" y="255" fontSize="18" filter="url(#puppyGlowFilter)">💗</text>
      <text x="130" y="50" fontSize="12">✨</text>
      <text x="188" y="46" fontSize="10">⭐</text>
      <text x="275" y="185" fontSize="13">✨</text>
    </svg>
  );
}
