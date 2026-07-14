"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import styles from "./Envelope.module.css";

/* ══════════════════════════════════════════════════
   Types
══════════════════════════════════════════════════ */
interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  angle: number;
  dist: number;
  char: string;
}

const SPARKLE_CHARS = ["✨", "⭐", "💫", "🌟", "💕", "💖", "🌸", "💗"];

function createSparkles(count: number): Sparkle[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * 360 + Math.random() * 20;
    return {
      id:    i,
      x:     50,
      y:     45,
      size:  14 + Math.random() * 18,
      angle,
      dist:  80 + Math.random() * 120,
      char:  SPARKLE_CHARS[Math.floor(Math.random() * SPARKLE_CHARS.length)],
    };
  });
}

/* ══════════════════════════════════════════════════
   Sound placeholder
══════════════════════════════════════════════════ */
function playOpenSound() {
  /* Sound placeholder — drop an audio file at /sounds/envelope-open.mp3
     and uncomment the lines below to enable it. */
  // try {
  //   const audio = new Audio("/sounds/envelope-open.mp3");
  //   audio.volume = 0.45;
  //   audio.play().catch(() => {});
  // } catch { /* no-op */ }
  console.info("🎵 Envelope open sound (placeholder)");
}

/* ══════════════════════════════════════════════════
   Confetti helper (canvas-confetti)
══════════════════════════════════════════════════ */
async function fireConfetti() {
  try {
    const confetti = (await import("canvas-confetti")).default;
    const colors = ["#f97bb8", "#ffc8de", "#e91e78", "#ffe066", "#a98eff", "#4ade80", "#ffffff"];
    confetti({
      particleCount: 120,
      spread:        90,
      origin:        { y: 0.55 },
      colors,
      shapes:        ["circle", "square"],
    });
    setTimeout(() => {
      confetti({
        particleCount: 60,
        spread:        60,
        origin:        { x: 0.25, y: 0.5 },
        colors,
      });
    }, 250);
    setTimeout(() => {
      confetti({
        particleCount: 60,
        spread:        60,
        origin:        { x: 0.75, y: 0.5 },
        colors,
      });
    }, 450);
  } catch { /* canvas-confetti not available */ }
}

/* ══════════════════════════════════════════════════
   Animation Variants
══════════════════════════════════════════════════ */
const letterVariant: Variants = {
  closed: { y: 0, opacity: 0, scale: 0.92 },
  open:   {
    y: -140,
    opacity: 1,
    scale: 1,
    transition: { delay: 0.35, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] as [number,number,number,number] },
  },
};

const sparkleVariant: Variants = {
  hidden:  { scale: 0, opacity: 0 },
  visible: (custom: Sparkle) => ({
    scale: 1,
    opacity: [0, 1, 1, 0],
    x: Math.cos((custom.angle * Math.PI) / 180) * custom.dist,
    y: Math.sin((custom.angle * Math.PI) / 180) * custom.dist - 30,
    rotate: Math.random() * 360,
    transition: {
      duration: 1.1,
      delay:    0.1 + Math.random() * 0.2,
      ease:     "easeOut" as const,
    },
  }),
};

const waxSealVariant: Variants = {
  intact: { scale: 1, opacity: 1 },
  broken: {
    scale: [1, 1.2, 0],
    opacity: [1, 1, 0],
    rotate: [0, -15, 30],
    transition: { duration: 0.45, ease: "easeIn" as const },
  },
};

/* ══════════════════════════════════════════════════
   Envelope Component
══════════════════════════════════════════════════ */
export interface EnvelopeProps {
  /** Called after the opening animation completes */
  onOpen?: () => void;
  /** Disables interaction once opened */
  disabled?: boolean;
}

export default function Envelope({ onOpen, disabled = false }: EnvelopeProps) {
  const [isOpen,   setIsOpen]   = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const hasOpenedRef = useRef(false);

  const handleClick = useCallback(async () => {
    if (isOpen || disabled || hasOpenedRef.current) return;
    hasOpenedRef.current = true;

    playOpenSound();
    setIsOpen(true);
    setSparkles(createSparkles(16));

    await fireConfetti();

    setTimeout(() => {
      setSparkles([]);
      onOpen?.();
    }, 1600);
  }, [isOpen, disabled, onOpen]);

  return (
    <div className={styles.root} onClick={handleClick} role="button" tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleClick()}
      aria-label={isOpen ? "Envelope is open" : "Click to open the envelope"}
    >
      {/* ── Shadow blob ── */}
      <motion.div
        className={styles.shadow}
        animate={isOpen ? { scale: 1.35, opacity: 0.18 } : { scale: 1, opacity: 0.35 }}
        transition={{ duration: 0.6 }}
      />

      {/* ── Perspective wrapper for 3-D flap ── */}
      <motion.div
        className={styles.perspectiveWrap}
        whileHover={!isOpen ? { scale: 1.045, filter: "drop-shadow(0 12px 40px rgba(249,85,142,0.45))" } : {}}
        transition={{ duration: 0.3 }}
      >
        {/* Paper texture overlay */}
        <div className={styles.paperTexture} aria-hidden="true" />

        {/* ── Envelope body ── */}
        <div className={styles.body}>

          {/* Back of envelope (visible at top when open) */}
          <div className={styles.back} />

          {/* Bottom triangle fold */}
          <div className={styles.bottomFold} />

          {/* Left triangle fold */}
          <div className={styles.leftFold} />

          {/* Right triangle fold */}
          <div className={styles.rightFold} />

          {/* ── Letter (slides upward on open) ── */}
          <motion.div
            className={styles.letter}
            variants={letterVariant}
            initial="closed"
            animate={isOpen ? "open" : "closed"}
          >
            {/* Letter lines decoration */}
            <div className={styles.letterContent}>
              <div className={styles.letterHeart}>💕</div>
              <div className={styles.letterLine} />
              <div className={styles.letterLine} style={{ width: "75%" }} />
              <div className={styles.letterLine} style={{ width: "85%" }} />
              <div className={styles.letterLine} style={{ width: "60%" }} />
              <div className={styles.letterSignature}>With love ❤️</div>
            </div>
          </motion.div>

          {/* ── TOP FLAP (3-D rotates open) ── */}
          <motion.div
            className={styles.flap}
            style={{ transformPerspective: 700, transformOrigin: "top center" }}
            animate={isOpen ? { rotateX: -178 } : { rotateX: 0 }}
            transition={{ duration: 0.72, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Flap inner face (shows when open) */}
            <div className={styles.flapInner} />
          </motion.div>

          {/* ── Ribbon ── */}
          {!isOpen && (
            <motion.div
              className={styles.ribbonWrap}
              initial={{ opacity: 1 }}
              animate={isOpen ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Horizontal band */}
              <div className={styles.ribbonH} />
              {/* Vertical band */}
              <div className={styles.ribbonV} />
              {/* Bow left loop */}
              <div className={`${styles.bowLoop} ${styles.bowLeft}`} />
              {/* Bow right loop */}
              <div className={`${styles.bowLoop} ${styles.bowRight}`} />
              {/* Bow knot */}
              <div className={styles.bowKnot} />
            </motion.div>
          )}

          {/* ── Wax seal ── */}
          <motion.div
            className={styles.waxSealWrap}
            variants={waxSealVariant}
            animate={isOpen ? "broken" : "intact"}
          >
            {/* Wax seal SVG */}
            <svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true">
              <defs>
                <radialGradient id="waxGrad" cx="40%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#e91e78" />
                  <stop offset="100%" stopColor="#8b0045" />
                </radialGradient>
              </defs>
              {/* Outer scalloped ring */}
              {Array.from({ length: 12 }, (_, i) => {
                const angle = (i / 12) * Math.PI * 2;
                const x = 32 + Math.cos(angle) * 26;
                const y = 32 + Math.sin(angle) * 26;
                return <circle key={i} cx={x} cy={y} r="5.5" fill="url(#waxGrad)" />;
              })}
              {/* Main circle */}
              <circle cx="32" cy="32" r="22" fill="url(#waxGrad)" />
              {/* Shine */}
              <ellipse cx="26" cy="24" rx="6" ry="4" fill="white" opacity="0.22" transform="rotate(-30 26 24)" />
              {/* Monogram / emblem */}
              <text x="32" y="37" textAnchor="middle" fontSize="18" fontWeight="bold" fill="white" fontFamily="serif" opacity="0.9">♥</text>
            </svg>
          </motion.div>

        </div>{/* end .body */}

        {/* ── Sparkles burst ── */}
        <AnimatePresence>
          {sparkles.length > 0 && sparkles.map((s) => (
            <motion.span
              key={s.id}
              className={styles.sparkle}
              custom={s}
              variants={sparkleVariant}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              style={{ fontSize: s.size, left: `${s.x}%`, top: `${s.y}%` }}
            >
              {s.char}
            </motion.span>
          ))}
        </AnimatePresence>

      </motion.div>{/* end perspectiveWrap */}

      {/* ── Call-to-action label ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.p
            className={styles.cta}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ delay: 0.3 }}
          >
            Click to open ✨
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
