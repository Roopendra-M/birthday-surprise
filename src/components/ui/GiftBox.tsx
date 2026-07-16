"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import styles from "./GiftBox.module.css";

/* ══════════════════════════════════════════════════
   Types & helpers
══════════════════════════════════════════════════ */
type GiftState = "idle" | "opening" | "open";

interface Particle { id: number; char: string; dx: number; dy: number; rotate: number; size: number; }
const CHARS = ["💕","💖","✨","⭐","💫","🌸","🎊","🎉","💗","🌟","💝"];

function makeParticles(n: number): Particle[] {
  return Array.from({ length: n }, (_, i) => {
    const angle = (i / n) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
    const speed = 100 + Math.random() * 180;
    return {
      id: i, char: CHARS[i % CHARS.length],
      dx: Math.cos(angle) * speed, dy: Math.sin(angle) * speed - 80,
      rotate: Math.random() * 720 - 360, size: 16 + Math.random() * 22,
    };
  });
}

function playGiftSound() {
  /* Sound placeholder — drop audio at /sounds/gift-open.mp3 and uncomment:
  try { const a = new Audio("/sounds/gift-open.mp3"); a.volume=0.5; a.play().catch(()=>{}); } catch {} */
  console.info("🎵 Gift open sound (placeholder)");
}

async function fireConfetti() {
  try {
    const c = (await import("canvas-confetti")).default;
    const col = ["#f97bb8","#ffc8de","#e91e78","#ffe066","#a98eff","#ffffff","#4ade80"];
    c({ particleCount: 100, spread: 90, origin: { y: 0.5 }, colors: col });
    setTimeout(() => c({ particleCount: 50, angle: 60,  spread: 60, origin: { x: 0.05, y: 0.5 }, colors: col }), 350);
    setTimeout(() => c({ particleCount: 50, angle: 120, spread: 60, origin: { x: 0.95, y: 0.5 }, colors: col }), 550);
    setTimeout(() => c({ particleCount: 70, spread: 110, origin: { y: 0.35 }, shapes: ["star"], scalar: 1.3,
      colors: ["#FFD700","#FF69B4","#ffffff","#f97bb8"] }), 850);
  } catch { /* no-op */ }
}

/* ══════════════════════════════════════════════════
   Framer Motion variants
══════════════════════════════════════════════════ */
const bowV: Variants = {
  idle:    { scale: 1, rotate: 0, opacity: 1, y: 0 },
  opening: { scale: 0, rotate: 540, opacity: 0, y: -20,
    transition: { duration: 0.45, ease: "easeIn" as const } },
};
const ribbonV: Variants = {
  idle:    { opacity: 1 },
  opening: { opacity: 0, transition: { duration: 0.35, delay: 0.15 } },
};
const lidV: Variants = {
  idle:    { y: 0, rotate: 0, opacity: 1 },
  opening: { y: -170, rotate: -18, opacity: 1,
    transition: { delay: 0.38, duration: 0.72, ease: [0.34,1.56,0.64,1] as [number,number,number,number] } },
};
const particleV: Variants = {
  hidden:  { opacity: 0, scale: 0, x: 0, y: 0, rotate: 0 },
  visible: (p: Particle) => ({
    opacity: [0, 1, 1, 0], scale: [0, 1.3, 1, 0.6],
    x: p.dx, y: p.dy, rotate: p.rotate,
    transition: { duration: 1.45, delay: 0.45 + Math.random() * 0.25, ease: "easeOut" as const },
  }),
};
const contentV: Variants = {
  hidden:  { opacity: 0, scale: 0.5, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0,
    transition: { delay: 1.0, duration: 0.65, ease: [0.34,1.56,0.64,1] as [number,number,number,number] } },
};
const glowV: Variants = {
  idle:    { scale: 1, opacity: 0.28 },
  opening: { scale: 1.5, opacity: 0.55, transition: { delay: 0.5, duration: 1 } },
};

/* ══════════════════════════════════════════════════
   GiftBox Component
══════════════════════════════════════════════════ */
export default function GiftBox() {
  const router = useRouter();
  const [state,     setState]     = useState<GiftState>("idle");
  const [particles, setParticles] = useState<Particle[]>([]);

  const handleClick = useCallback(async () => {
    if (state !== "idle") return;
    playGiftSound();
    setState("opening");
    setParticles(makeParticles(28));
    await fireConfetti();
    setTimeout(() => {
      setState("open");
      // Navigate to memory-theater after a moment of celebration
      setTimeout(() => router.push("/memory-theater"), 2500);
    }, 1350);
  }, [state, router]);

  return (
    <div className={styles.wrapper}>
      {/* Radial glow */}
      <motion.div className={styles.glow} variants={glowV} animate={state !== "idle" ? "opening" : "idle"} />

      {/* Burst particles */}
      <div className={styles.particleField} aria-hidden="true">
        <AnimatePresence>
          {particles.map((p) => (
            <motion.span key={p.id} className={styles.particle}
              custom={p} variants={particleV} initial="hidden" animate="visible" exit={{ opacity: 0 }}
              style={{ fontSize: p.size }}>
              {p.char}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      {/* ══ Gift container ══ */}
      <motion.div
        className={styles.gift}
        onClick={handleClick}
        whileHover={state === "idle" ? { y: [0, -16, 0], transition: { duration: 0.65, ease: "easeInOut", repeat: Infinity } } : {}}
        role="button" tabIndex={0} aria-label={state === "idle" ? "Click to open your gift!" : "Gift is open!"}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleClick()}
        style={{ cursor: state === "idle" ? "pointer" : "default" }}
      >
        {/* ── LID ── */}
        <motion.div className={styles.lid} variants={lidV} animate={state !== "idle" ? "opening" : "idle"}>
          <div className={styles.lidFace}>
            {/* Ribbon on lid */}
            <motion.div className={`${styles.ribbon} ${styles.ribbonLidV}`} variants={ribbonV} animate={state !== "idle" ? "opening" : "idle"} />
            <motion.div className={`${styles.ribbon} ${styles.ribbonLidH}`} variants={ribbonV} animate={state !== "idle" ? "opening" : "idle"} />

            {/* Bow */}
            <motion.div className={styles.bowWrap} variants={bowV} animate={state !== "idle" ? "opening" : "idle"}>
              <div className={styles.bowLoopL} />
              <div className={styles.bowLoopR} />
              <div className={styles.bowKnot} />
              <div className={styles.bowTailL} />
              <div className={styles.bowTailR} />
            </motion.div>

            {/* Lid shine */}
            <div className={styles.lidShine} />
          </div>
          <div className={styles.lidBottom} />
        </motion.div>

        {/* ── BOX BODY ── */}
        <div className={styles.body}>
          <div className={styles.bodyFace}>
            {/* Ribbon on body */}
            <motion.div className={`${styles.ribbon} ${styles.ribbonBodyV}`} variants={ribbonV} animate={state !== "idle" ? "opening" : "idle"} />
            <motion.div className={`${styles.ribbon} ${styles.ribbonBodyH}`} variants={ribbonV} animate={state !== "idle" ? "opening" : "idle"} />
            {/* Shine */}
            <div className={styles.bodyShine} />

            {/* Inner content shown when open */}
            <AnimatePresence>
              {state === "open" && (
                <motion.div className={styles.boxContent}
                  variants={contentV} initial="hidden" animate="visible">
                  <div className={styles.contentText}>🎉💕✨</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className={styles.bodySide} />
          <div className={styles.bodyBottom} />
        </div>
      </motion.div>

      {/* CTA / success */}
      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.p key="cta" className={styles.cta}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            Click the gift to open it!&nbsp;🎁
          </motion.p>
        )}
        {state === "opening" && (
          <motion.p key="opening" className={styles.opening}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            ✨ Opening…
          </motion.p>
        )}
        {state === "open" && (
          <motion.p key="open" className={styles.opened}
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ ease: [0.34,1.56,0.64,1] }} exit={{ opacity: 0 }}>
            🎊 You opened your gift! 🎊
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
