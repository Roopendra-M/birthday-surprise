"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import PuppyIllustration from "@/components/ui/PuppyIllustration";
import styles from "./YesNoCard.module.css";

/* ══════════════════════════════════════════════════
   Constants
══════════════════════════════════════════════════ */

/** Text shown on the NO button, cycling with each dodge */
const NO_TEXTS = [
  "No",
  "Really?",
  "Think again 😝",
  "Last chance",
  "Don't break my heart 🥺",
];

/** Min distance (px) at which NO button starts fleeing */
const FLEE_DISTANCE = 140;

/** YES button grows by this scale factor each time NO escapes */
const YES_GROW_FACTOR = 0.14;
const YES_MAX_SCALE   = 2.1;
const YES_MIN_SCALE   = 1.0;

/* ══════════════════════════════════════════════════
   Heart explosion particles
══════════════════════════════════════════════════ */
interface Heart {
  id: number;
  x: number;
  y: number;
  size: number;
  dx: number;
  dy: number;
  char: string;
  color: string;
  rotate: number;
}

const HEART_CHARS  = ["❤️", "💕", "💖", "💗", "💝", "💓", "💞", "🌸", "✨", "💫"];
const HEART_COLORS = ["#ff6090", "#f97bb8", "#e91e78", "#ffa0c6", "#ff4488", "#ffb3d1", "#ffe066"];

function createHearts(count: number): Heart[] {
  return Array.from({ length: count }, (_, i) => {
    const angle  = (Math.random() * 2 * Math.PI);
    const speed  = 120 + Math.random() * 220;
    return {
      id:     i,
      x:      50,
      y:      50,
      size:   18 + Math.random() * 32,
      dx:     Math.cos(angle) * speed,
      dy:     Math.sin(angle) * speed - 60,
      char:   HEART_CHARS[Math.floor(Math.random() * HEART_CHARS.length)],
      color:  HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
      rotate: Math.random() * 720 - 360,
    };
  });
}

/* ══════════════════════════════════════════════════
   Animation Variants
══════════════════════════════════════════════════ */
const pageVariant: Variants = {
  hidden:  { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] as [number,number,number,number] },
  },
  exit: {
    opacity: 0, scale: 1.08, y: -30,
    transition: { duration: 0.55, ease: "easeIn" as const },
  },
};

const successVariant: Variants = {
  hidden:  { opacity: 0, scale: 0.7 },
  visible: {
    opacity: 1, scale: 1,
    transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] as [number,number,number,number] },
  },
};

const puppyVariant: Variants = {
  idle: {},
  wiggle: {
    rotate: [0, -6, 6, -4, 4, 0],
    transition: { duration: 0.5, ease: "easeInOut" as const },
  },
  happy: {
    scale: [1, 1.12, 1.06, 1.1, 1],
    rotate: [0, -5, 5, -3, 0],
    transition: { duration: 0.6, ease: "easeInOut" as const },
  },
};

/* ══════════════════════════════════════════════════
   YesNoCard Component
══════════════════════════════════════════════════ */
export default function YesNoCard() {
  const router = useRouter();

  const [noIndex,     setNoIndex]    = useState(0);
  const [noPos,       setNoPos]      = useState({ x: 0, y: 0 });
  const [yesScale,    setYesScale]   = useState(YES_MIN_SCALE);
  const [status,      setStatus]     = useState<"idle" | "success">("idle");
  const [hearts,      setHearts]     = useState<Heart[]>([]);
  const [puppyState,  setPuppyState] = useState<"idle" | "wiggle" | "happy">("idle");
  const [noFlashed,   setNoFlashed]  = useState(false);
  const [dodgeCount,  setDodgeCount] = useState(0);

  const noRef          = useRef<HTMLButtonElement>(null);
  const containerRef   = useRef<HTMLDivElement>(null);
  const noIndexRef     = useRef(0);
  const yesScaleRef    = useRef(YES_MIN_SCALE);
  const dodgeCountRef  = useRef(0);

  /* ── Flee logic ─────────────────────────────────── */
  const flee = useCallback(() => {
    const btn       = noRef.current;
    const container = containerRef.current;
    if (!btn || !container) return;

    const btnRect  = btn.getBoundingClientRect();
    const conRect  = container.getBoundingClientRect();
    const btnW     = btnRect.width;
    const btnH     = btnRect.height;
    const safeMargin = 16;

    const maxX = conRect.width  - btnW  - safeMargin;
    const maxY = conRect.height - btnH  - safeMargin;

    // Pick a random position away from where it currently is
    const currentX = noPos.x;
    const currentY = noPos.y;

    let newX: number, newY: number;
    let attempts = 0;
    do {
      newX = safeMargin + Math.random() * maxX;
      newY = safeMargin + Math.random() * maxY;
      attempts++;
    } while (
      attempts < 12 &&
      Math.abs(newX - currentX) < 80 &&
      Math.abs(newY - currentY) < 80
    );

    setNoPos({ x: newX, y: newY });

    // Cycle NO text
    const nextIdx = Math.min(noIndexRef.current + 1, NO_TEXTS.length - 1);
    noIndexRef.current = nextIdx;
    setNoIndex(nextIdx);
    dodgeCountRef.current += 1;
    setDodgeCount(dodgeCountRef.current);

    // Grow YES button
    const nextScale = Math.min(yesScaleRef.current + YES_GROW_FACTOR, YES_MAX_SCALE);
    yesScaleRef.current = nextScale;
    setYesScale(nextScale);

    // Flash NO button
    setNoFlashed(true);
    setTimeout(() => setNoFlashed(false), 400);

    // Wiggle puppy
    setPuppyState("wiggle");
    setTimeout(() => setPuppyState("idle"), 600);
  }, [noPos.x, noPos.y]);

  /* Pointer-proximity detection for NO button */
  const handleContainerPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (status !== "idle") return;
      const btn = noRef.current;
      if (!btn) return;

      const btnRect = btn.getBoundingClientRect();
      const btnCX   = btnRect.left + btnRect.width  / 2;
      const btnCY   = btnRect.top  + btnRect.height / 2;
      const dist    = Math.hypot(e.clientX - btnCX, e.clientY - btnCY);

      if (dist < FLEE_DISTANCE) {
        flee();
      }
    },
    [status, flee]
  );

  /* Touch support — check distance on touchmove too */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouch = (e: TouchEvent) => {
      if (status !== "idle" || !noRef.current) return;
      const touch   = e.touches[0];
      const btnRect = noRef.current.getBoundingClientRect();
      const btnCX   = btnRect.left + btnRect.width  / 2;
      const btnCY   = btnRect.top  + btnRect.height / 2;
      const dist    = Math.hypot(touch.clientX - btnCX, touch.clientY - btnCY);
      if (dist < FLEE_DISTANCE) flee();
    };

    container.addEventListener("touchmove", handleTouch, { passive: true });
    return () => container.removeEventListener("touchmove", handleTouch);
  }, [status, flee]);

  /* ── YES clicked ────────────────────────────────── */
  const handleYes = useCallback(() => {
    if (status !== "idle") return;
    setStatus("success");
    setPuppyState("happy");
    setHearts(createHearts(48));
    setTimeout(() => router.push("/reveal"), 2600);
  }, [status, router]);

  /* ── NO directly clicked (fallback for touch) ── */
  const handleNoClick = useCallback(() => {
    if (status !== "idle") return;
    flee();
  }, [status, flee]);

  /* ══════════════════════════════════════════════════
     Render
  ══════════════════════════════════════════════════ */
  return (
    <AnimatePresence mode="wait">
      {status === "idle" ? (
        <motion.div
          key="card"
          className={styles.card}
          variants={pageVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Glass shimmer */}
          <div className={styles.shimmer} aria-hidden="true" />

          {/* Puppy */}
          <motion.div
            className={styles.puppyWrap}
            variants={puppyVariant}
            animate={puppyState}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3.5, ease: "easeInOut", repeat: Infinity }}
            >
              <PuppyIllustration className={styles.puppySvg} />
            </motion.div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            className={styles.heading}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.55 }}
          >
            Do you want to see your surprise?
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            I promise it&apos;s extra special&nbsp;💌
          </motion.p>

          {/* ── Button arena (relative positioned for absolute NO btn) ── */}
          <motion.div
            ref={containerRef}
            className={styles.arena}
            onPointerMove={handleContainerPointerMove}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {/* YES button */}
            <motion.button
              id="yes-button"
              className={styles.yesBtn}
              style={{ scale: yesScale }}
              whileHover={{ scale: yesScale * 1.06 }}
              whileTap={{ scale: yesScale * 0.94 }}
              onClick={handleYes}
              aria-label="Yes, show the surprise"
              transition={{ type: "spring", stiffness: 280, damping: 20 }}
            >
              <span className={styles.yesBtnShimmer} aria-hidden="true" />
              <span className={styles.yesBtnContent}>
                <span>💕</span>
                <span>YES!</span>
              </span>
            </motion.button>

            {/* NO button — absolutely positioned, teleports away */}
            <motion.button
              ref={noRef}
              id="no-button"
              className={`${styles.noBtn} ${noFlashed ? styles.noBtnFlash : ""}`}
              animate={{ x: noPos.x, y: noPos.y }}
              transition={{ type: "spring", stiffness: 420, damping: 26 }}
              onClick={handleNoClick}
              onPointerEnter={flee}
              aria-label="No button"
              aria-live="polite"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={noIndex}
                  initial={{ opacity: 0, y: -8, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.85 }}
                  transition={{ duration: 0.2 }}
                >
                  {NO_TEXTS[noIndex]}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </motion.div>

          {/* Dodge counter hint */}
          <AnimatePresence>
            {dodgeCount >= 2 && (
              <motion.p
                className={styles.hint}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                psst… you can&apos;t catch it 😄
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* ── Success card ── */
        <motion.div
          key="success"
          className={styles.successCard}
          variants={successVariant}
          initial="hidden"
          animate="visible"
        >
          {/* Heart explosion */}
          <div className={styles.heartBurst} aria-hidden="true">
            {hearts.map((h) => (
              <motion.span
                key={h.id}
                className={styles.burstHeart}
                style={{ fontSize: h.size, color: h.color, left: "50%", top: "50%" }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0.4, rotate: 0 }}
                animate={{
                  x:       h.dx,
                  y:       h.dy,
                  opacity: [1, 1, 0],
                  scale:   [0.4, 1.3, 0.8],
                  rotate:  h.rotate,
                }}
                transition={{ duration: 1.4, ease: "easeOut" as const }}
              >
                {h.char}
              </motion.span>
            ))}
          </div>

          {/* Puppy happy dance */}
          <motion.div
            className={styles.puppyWrap}
            animate={{ rotate: [0, -8, 8, -6, 6, 0], scale: [1, 1.12, 1.08, 1.1, 1] }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <PuppyIllustration className={styles.puppySvg} />
          </motion.div>

          <motion.div
            className={styles.successIcon}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 220, damping: 10 }}
          >
            🎉
          </motion.div>

          <motion.h2
            className={styles.successHeading}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Yay! I knew it&nbsp;💕
          </motion.h2>

          <motion.p
            className={styles.successSubtitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Getting your surprise ready...&nbsp;✨
          </motion.p>

          <motion.div
            className={styles.dots}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className={styles.dot}
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 0.65, delay: i * 0.18, repeat: Infinity }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
