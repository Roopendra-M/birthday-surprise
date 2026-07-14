"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import dynamic from "next/dynamic";
import styles from "./reveal.module.css";

/* Client-only: PuppySwing uses GSAP which needs DOM */
const PuppySwing = dynamic(() => import("@/components/ui/PuppySwing"), { ssr: false });

/* ── Loading messages ───────────────────────────────────── */
const MESSAGES = [
  "Preparing something cute... 🎀",
  "Wrapping your surprise... 🎁",
  "Almost there... ✨",
  "Adding extra love ❤️",
];

const TOTAL_DURATION = 4000; // ms

/* ── Animation variants ─────────────────────────────────── */
const msgVariant: Variants = {
  enter: { opacity: 0, y: 14, scale: 0.96 },
  center: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.42, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0, y: -14, scale: 0.96,
    transition: { duration: 0.32, ease: "easeIn" as const },
  },
};

const pageInVariant: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
  exit:    { opacity: 0, transition: { duration: 0.5 } },
};

export default function RevealPage() {
  const router    = useRouter();
  const barRef    = useRef<HTMLDivElement>(null);
  const [msgIdx, setMsgIdx] = useState(0);
  const [done,   setDone]   = useState(false);

  /* ── GSAP loading bar ─────────────────────────────── */
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bar,
        { width: "0%" },
        {
          width: "100%",
          duration: TOTAL_DURATION / 1000,
          ease: "power1.inOut",
          onComplete: () => {
            setDone(true);
            setTimeout(() => router.push("/envelope"), 500);
          },
        }
      );
    });

    return () => ctx.revert();
  }, [router]);

  /* ── Rotate messages every 2 s ───────────────────── */
  useEffect(() => {
    if (done) return;
    const interval = setInterval(() => {
      setMsgIdx((i) => (i + 1) % MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [done]);

  return (
    <motion.div
      className={styles.page}
      variants={pageInVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* ── Pastel radial glow ── */}
      <div className={styles.radialGlow} aria-hidden="true" />

      {/* ── Decorative blobs ── */}
      <div className={styles.blobA} aria-hidden="true" />
      <div className={styles.blobB} aria-hidden="true" />
      <div className={styles.blobC} aria-hidden="true" />

      {/* ── Clouds ── */}
      <div className={styles.cloudLayer} aria-hidden="true">
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className={`${styles.cloud} ${styles[`cloud${n}` as keyof typeof styles]}`}>
            <div className={styles.cloudBubble} />
            <div className={`${styles.cloudBubble} ${styles.cloudBubbleMid}`} />
            <div className={`${styles.cloudBubble} ${styles.cloudBubbleR}`} />
          </div>
        ))}
      </div>

      {/* ── Stars (static sparkles) ── */}
      <div className={styles.starLayer} aria-hidden="true">
        {[
          { top: "8%",  left: "12%", size: 14, delay: 0 },
          { top: "14%", left: "82%", size: 11, delay: 0.6 },
          { top: "6%",  left: "55%", size: 9,  delay: 1.2 },
          { top: "22%", left: "92%", size: 13, delay: 0.3 },
          { top: "75%", left: "8%",  size: 12, delay: 0.9 },
          { top: "80%", left: "88%", size: 10, delay: 1.5 },
          { top: "50%", left: "4%",  size: 8,  delay: 0.7 },
          { top: "40%", left: "96%", size: 11, delay: 1.1 },
        ].map((s, i) => (
          <span
            key={i}
            className={styles.star}
            style={{
              top:                   s.top,
              left:                  s.left,
              fontSize:              s.size,
              animationDelay:        `${s.delay}s`,
            }}
          >✨</span>
        ))}
      </div>

      {/* ── Floating hearts ── */}
      <div className={styles.heartLayer} aria-hidden="true">
        {["💕", "💖", "💗", "❤️", "💝", "💞"].map((h, i) => (
          <span
            key={i}
            className={styles.floatHeart}
            style={{
              left:             `${10 + i * 14}%`,
              animationDelay:   `${i * 1.1}s`,
              animationDuration: `${5 + i * 0.8}s`,
              fontSize:         `${14 + (i % 3) * 6}px`,
            }}
          >
            {h}
          </span>
        ))}
      </div>

      {/* ── Main content ── */}
      <div className={styles.content}>

        {/* Puppy swinging */}
        <motion.div
          className={styles.puppyWrap}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <PuppySwing className={styles.puppySvg} />
        </motion.div>

        {/* Rotating message */}
        <div className={styles.messageWrap} aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.p
              key={msgIdx}
              className={styles.message}
              variants={msgVariant}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {MESSAGES[msgIdx]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Loading bar track */}
        <motion.div
          className={styles.barTrack}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div ref={barRef} className={styles.bar} />
          {/* Shimmer on bar */}
          <div className={styles.barShimmer} aria-hidden="true" />
        </motion.div>

        {/* Animated dots */}
        <motion.div
          className={styles.dots}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className={styles.dot}
              animate={{ y: [0, -10, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 0.7, delay: i * 0.18, repeat: Infinity }}
            />
          ))}
        </motion.div>

        {/* Percentage counter */}
        <motion.p
          className={styles.percent}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.5 }}
        >
          Loading...
        </motion.p>
      </div>
    </motion.div>
  );
}
