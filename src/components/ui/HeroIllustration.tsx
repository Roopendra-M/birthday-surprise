/* Cute chibi illustration — inline SVG */
export default function HeroIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 460"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Cute girl holding a birthday gift"
      role="img"
    >
      <defs>
        {/* Gradients */}
        <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd6ea" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#fff5f9" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="giftGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffb3d1" />
          <stop offset="100%" stopColor="#f97bb8" />
        </linearGradient>
        <linearGradient id="giftLidGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffc8de" />
          <stop offset="100%" stopColor="#ff9cbd" />
        </linearGradient>
        <linearGradient id="ribbonGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffe066" />
          <stop offset="100%" stopColor="#ffb347" />
        </linearGradient>
        <linearGradient id="dressGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffd6ea" />
          <stop offset="100%" stopColor="#ffa0c6" />
        </linearGradient>
        <linearGradient id="hairGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c8956c" />
          <stop offset="100%" stopColor="#a0693a" />
        </linearGradient>
        <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde8cc" />
          <stop offset="100%" stopColor="#f5c98a" />
        </linearGradient>
        <radialGradient id="blushGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffaac5" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#ffaac5" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cloudGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#fff0f5" />
        </linearGradient>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#f97bb8" floodOpacity="0.25" />
        </filter>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background glow circle */}
      <ellipse cx="200" cy="230" rx="170" ry="170" fill="url(#bgGlow)" />

      {/* Cloud / platform */}
      <ellipse cx="200" cy="390" rx="90" ry="18" fill="url(#cloudGrad)" opacity="0.8" filter="url(#softShadow)" />
      <ellipse cx="175" cy="382" rx="38" ry="20" fill="white" opacity="0.9" />
      <ellipse cx="215" cy="378" rx="32" ry="22" fill="white" opacity="0.9" />
      <ellipse cx="245" cy="384" rx="28" ry="16" fill="white" opacity="0.9" />

      {/* ── Gift box ── */}
      {/* Box body */}
      <rect x="110" y="248" width="130" height="108" rx="12" fill="url(#giftGrad)" filter="url(#softShadow)" />
      {/* Shine */}
      <rect x="118" y="256" width="30" height="10" rx="5" fill="white" opacity="0.35" />
      {/* Box lid */}
      <rect x="104" y="230" width="142" height="26" rx="10" fill="url(#giftLidGrad)" />
      {/* Ribbon vertical on box body */}
      <rect x="168" y="248" width="14" height="108" rx="4" fill="url(#ribbonGrad)" opacity="0.9" />
      {/* Ribbon horizontal on box body */}
      <rect x="110" y="282" width="130" height="14" rx="4" fill="url(#ribbonGrad)" opacity="0.9" />
      {/* Ribbon on lid */}
      <rect x="168" y="230" width="14" height="26" rx="4" fill="url(#ribbonGrad)" />

      {/* Bow loops */}
      <ellipse cx="162" cy="228" rx="22" ry="14" fill="url(#ribbonGrad)" transform="rotate(-25 162 228)" />
      <ellipse cx="188" cy="226" rx="22" ry="14" fill="url(#ribbonGrad)" transform="rotate(25 188 226)" />
      {/* Bow center knot */}
      <ellipse cx="175" cy="228" rx="10" ry="9" fill="#ffe066" />
      <ellipse cx="175" cy="228" rx="6" ry="5" fill="#ffcf40" />

      {/* Gift tag */}
      <rect x="135" y="294" width="46" height="32" rx="6" fill="white" opacity="0.9" />
      <text x="158" y="308" textAnchor="middle" fontFamily="var(--font-patrick), cursive" fontSize="7" fill="#e91e78" fontWeight="bold">Happy</text>
      <text x="158" y="318" textAnchor="middle" fontFamily="var(--font-patrick), cursive" fontSize="7" fill="#e91e78" fontWeight="bold">Birthday</text>

      {/* ── Girl character ── */}

      {/* Body / dress */}
      <ellipse cx="205" cy="290" rx="42" ry="50" fill="url(#dressGrad)" filter="url(#softShadow)" />
      {/* Dress details - ruffles */}
      <ellipse cx="205" cy="330" rx="50" ry="14" fill="#ffc8de" opacity="0.8" />
      <ellipse cx="205" cy="338" rx="44" ry="10" fill="white" opacity="0.5" />
      {/* Dress collar */}
      <ellipse cx="205" cy="258" rx="22" ry="10" fill="white" opacity="0.6" />
      {/* Dress bow */}
      <ellipse cx="196" cy="260" rx="10" ry="6" fill="#f97bb8" transform="rotate(-20 196 260)" />
      <ellipse cx="214" cy="260" rx="10" ry="6" fill="#f97bb8" transform="rotate(20 214 260)" />
      <circle cx="205" cy="260" r="5" fill="#e91e78" />

      {/* Arms */}
      {/* Left arm (holding gift left side) */}
      <ellipse cx="158" cy="285" rx="14" ry="30" fill="url(#skinGrad)" transform="rotate(-15 158 285)" />
      {/* Right arm (holding gift right side) */}
      <ellipse cx="250" cy="285" rx="14" ry="30" fill="url(#skinGrad)" transform="rotate(15 250 285)" />

      {/* Legs */}
      <rect x="185" y="335" width="14" height="40" rx="7" fill="url(#skinGrad)" />
      <rect x="207" y="335" width="14" height="40" rx="7" fill="url(#skinGrad)" />
      {/* Shoes */}
      <ellipse cx="192" cy="376" rx="12" ry="7" fill="#e91e78" />
      <ellipse cx="214" cy="376" rx="12" ry="7" fill="#e91e78" />
      {/* Socks */}
      <rect x="183" y="355" width="18" height="14" rx="4" fill="white" opacity="0.9" />
      <rect x="205" y="355" width="18" height="14" rx="4" fill="white" opacity="0.9" />

      {/* Head */}
      <ellipse cx="205" cy="205" rx="50" ry="52" fill="url(#skinGrad)" filter="url(#softShadow)" />

      {/* Hair — back layers */}
      <ellipse cx="205" cy="185" rx="52" ry="46" fill="url(#hairGrad)" />
      {/* Pigtails */}
      <ellipse cx="155" cy="195" rx="18" ry="28" fill="url(#hairGrad)" transform="rotate(-20 155 195)" />
      <ellipse cx="255" cy="195" rx="18" ry="28" fill="url(#hairGrad)" transform="rotate(20 255 195)" />

      {/* Hair front bangs */}
      <path d="M162 175 Q168 148 205 145 Q242 148 248 175 Q238 162 218 165 Q205 163 192 165 Q172 162 162 175Z" fill="url(#hairGrad)" />

      {/* Hair ribbons / flowers */}
      <circle cx="155" cy="168" r="10" fill="#f97bb8" />
      <circle cx="155" cy="168" r="6" fill="#ffe066" />
      <circle cx="255" cy="168" r="10" fill="#a98eff" />
      <circle cx="255" cy="168" r="6" fill="#ffe066" />

      {/* Face — eyes */}
      {/* Left eye */}
      <ellipse cx="187" cy="208" rx="11" ry="13" fill="white" />
      <ellipse cx="187" cy="210" rx="8" ry="9" fill="#5b3a8e" />
      <ellipse cx="187" cy="210" rx="5" ry="6" fill="#2d1a5a" />
      <circle cx="190" cy="207" r="3" fill="white" opacity="0.9" />
      <circle cx="185" cy="213" r="1.5" fill="white" opacity="0.7" />

      {/* Right eye */}
      <ellipse cx="223" cy="208" rx="11" ry="13" fill="white" />
      <ellipse cx="223" cy="210" rx="8" ry="9" fill="#5b3a8e" />
      <ellipse cx="223" cy="210" rx="5" ry="6" fill="#2d1a5a" />
      <circle cx="226" cy="207" r="3" fill="white" opacity="0.9" />
      <circle cx="221" cy="213" r="1.5" fill="white" opacity="0.7" />

      {/* Eyelashes */}
      <line x1="178" y1="198" x2="175" y2="193" stroke="#6b2046" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="183" y1="196" x2="182" y2="191" stroke="#6b2046" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="188" y1="196" x2="188" y2="191" stroke="#6b2046" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="214" y1="196" x2="214" y2="191" stroke="#6b2046" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="219" y1="196" x2="220" y2="191" stroke="#6b2046" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="225" y1="198" x2="227" y2="193" stroke="#6b2046" strokeWidth="1.5" strokeLinecap="round" />

      {/* Blush cheeks */}
      <ellipse cx="172" cy="220" rx="18" ry="11" fill="url(#blushGrad)" />
      <ellipse cx="238" cy="220" rx="18" ry="11" fill="url(#blushGrad)" />

      {/* Nose */}
      <ellipse cx="205" cy="222" rx="3" ry="2" fill="#f0a090" opacity="0.6" />

      {/* Smile */}
      <path d="M193 232 Q205 242 217 232" stroke="#e91e78" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Teeth */}
      <path d="M196 233 Q205 240 214 233" fill="white" opacity="0.8" />

      {/* ── Floating hearts & sparkles around character ── */}
      {/* Hearts */}
      <text x="82" y="175" fontSize="22" filter="url(#glow)">💕</text>
      <text x="298" y="165" fontSize="18" filter="url(#glow)">💖</text>
      <text x="68" y="310" fontSize="16" filter="url(#glow)">❤️</text>
      <text x="305" y="295" fontSize="20" filter="url(#glow)">💗</text>
      <text x="140" y="132" fontSize="14" filter="url(#glow)">🌸</text>
      <text x="260" y="128" fontSize="14" filter="url(#glow)">🌺</text>

      {/* Sparkles */}
      <text x="308" y="230" fontSize="16">✨</text>
      <text x="74" y="240" fontSize="14">✨</text>
      <text x="168" y="110" fontSize="12">⭐</text>
      <text x="225" y="108" fontSize="10">💫</text>
      <text x="95" y="140" fontSize="10">⭐</text>
      <text x="290" y="140" fontSize="12">💫</text>

      {/* Stars near bow */}
      <path d="M90 200 L92 193 L94 200 L101 200 L95 205 L97 212 L91 207 L85 212 L87 205 L81 200 Z" fill="#ffe066" opacity="0.9" />
      <path d="M305 210 L307 204 L309 210 L315 210 L310 215 L312 221 L306 217 L300 221 L302 215 L297 210 Z" fill="#ffa0c6" opacity="0.9" />
    </svg>
  );
}
