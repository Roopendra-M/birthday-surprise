"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import BackgroundEffects from "@/components/effects/BackgroundEffects";
import styles from "./gallery-page.module.css";

/* ══════════════════════════════════════════════════
   Gallery data
══════════════════════════════════════════════════ */
const MEMORIES = [
  { id: 1, emoji: "🎂", caption: "Birthday Wishes!", bg: "linear-gradient(135deg,#ffd6ea,#f97bb8)", rot: -3 },
  { id: 2, emoji: "🌸", caption: "Beautiful You",    bg: "linear-gradient(135deg,#ead5ff,#c4b0ff)", rot: 2  },
  { id: 3, emoji: "💕", caption: "With All My Love", bg: "linear-gradient(135deg,#fff5e8,#ffb870)", rot: -2 },
  { id: 4, emoji: "✨", caption: "You're a Star!",   bg: "linear-gradient(135deg,#fffbe8,#ffe066)", rot: 3  },
  { id: 5, emoji: "🎉", caption: "Let's Celebrate!", bg: "linear-gradient(135deg,#e8fff0,#6ee7b7)", rot: -1 },
  { id: 6, emoji: "🦋", caption: "Spreading Joy",    bg: "linear-gradient(135deg,#e8f5ff,#93c5fd)", rot: 2  },
  { id: 7, emoji: "🌈", caption: "All the Colors of You", bg: "linear-gradient(135deg,#ffeef7,#c4b0ff)", rot: -3 },
  { id: 8, emoji: "💫", caption: "Making Memories",  bg: "linear-gradient(135deg,#ffd6ea,#f97bb8)", rot: 1  },
];

type Direction = 1 | -1;

/* ══════════════════════════════════════════════════
   Variants
══════════════════════════════════════════════════ */
const slideV: Variants = {
  enter: (dir: Direction) => ({ x: dir > 0 ? 340 : -340, opacity: 0, scale: 0.88 }),
  center: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.45, ease: [0.34,1.56,0.64,1] as [number,number,number,number] } },
  exit:  (dir: Direction) => ({ x: dir > 0 ? -340 : 340, opacity: 0, scale: 0.88,
    transition: { duration: 0.35, ease: "easeIn" as const } }),
};

const lightboxV: Variants = {
  hidden:  { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: [0.34,1.56,0.64,1] as [number,number,number,number] } },
  exit:    { opacity: 0, scale: 0.85, transition: { duration: 0.25 } },
};

const overlayV: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit:    { opacity: 0, transition: { duration: 0.25 } },
};

/* ══════════════════════════════════════════════════
   EditableCaption
══════════════════════════════════════════════════ */
function EditableCaption({ caption, onChange }: { caption: string; onChange: (v: string) => void }) {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  return editing ? (
    <input ref={inputRef} className={styles.captionInput} value={caption}
      onChange={(e) => onChange(e.target.value)}
      onBlur={() => setEditing(false)}
      onKeyDown={(e) => e.key === "Enter" && setEditing(false)}
      aria-label="Edit caption"
    />
  ) : (
    <p className={styles.caption} onClick={() => setEditing(true)} title="Click to edit caption"
      style={{ cursor: "text" }}>
      {caption}&nbsp;<span style={{ fontSize: "0.6em", opacity: 0.5 }}>✏️</span>
    </p>
  );
}

/* ══════════════════════════════════════════════════
   GalleryPage
══════════════════════════════════════════════════ */
export default function GalleryPage() {
  const router = useRouter();
  const [index,       setIndex]       = useState(0);
  const [direction,   setDirection]   = useState<Direction>(1);
  const [captions,    setCaptions]    = useState(() => MEMORIES.map((m) => m.caption));
  const [lightbox,    setLightbox]    = useState(false);
  const touchStartRef = useRef(0);

  const go = useCallback((dir: Direction) => {
    setDirection(dir);
    setIndex((i) => (i + dir + MEMORIES.length) % MEMORIES.length);
  }, []);

  const replay = useCallback(() => {
    setDirection(-1);
    setIndex(0);
  }, []);

  /* Keyboard navigation */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightbox && e.key === "Escape") { setLightbox(false); return; }
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft")  go(-1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [go, lightbox]);

  /* Touch swipe */
  const onTouchStart = (e: React.TouchEvent) => { touchStartRef.current = e.touches[0].clientX; };
  const onTouchEnd   = (e: React.TouchEvent) => {
    const diff = touchStartRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) go(diff > 0 ? 1 : -1);
  };

  const mem = MEMORIES[index];

  return (
    <div className={styles.page}>
      <BackgroundEffects />
      <div className={styles.radialGlow} aria-hidden="true" />
      <div className={styles.blobTL}     aria-hidden="true" />
      <div className={styles.blobBR}     aria-hidden="true" />

      {/* Paper decoration strips */}
      <div className={styles.paperStrip} style={{ top: 0, left: 0, transform: "rotate(-2deg)" }} aria-hidden="true" />
      <div className={styles.paperStrip} style={{ bottom: 0, right: 0, transform: "rotate(2deg)" }} aria-hidden="true" />

      <main className={styles.main} id="main-content">
        {/* Heading */}
        <motion.div className={styles.headingWrap}
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}>
          <h1 className={styles.heading}>Memory Gallery&nbsp;📸</h1>
          <p className={styles.subtitle}>
            {index + 1} / {MEMORIES.length} &nbsp;·&nbsp; Click photo to preview &nbsp;·&nbsp; Swipe or use arrows
          </p>
        </motion.div>

        {/* ── Large card ── */}
        <div className={styles.cardOuter}
          onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>

          {/* Glassmorphism card */}
          <div className={styles.glassCard}>
            {/* Paper corner stickers */}
            <span className={styles.corner} style={{ top: 8, left: 8 }}>🌸</span>
            <span className={styles.corner} style={{ top: 8, right: 8 }}>💕</span>
            <span className={styles.corner} style={{ bottom: 8, left: 8 }}>✨</span>
            <span className={styles.corner} style={{ bottom: 8, right: 8 }}>⭐</span>

            {/* Animated polaroid */}
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={index}
                className={styles.polaroidWrap}
                custom={direction}
                variants={slideV}
                initial="enter"
                animate="center"
                exit="exit"
                onClick={() => setLightbox(true)}
                role="button"
                aria-label={`View memory: ${captions[index]}`}
                style={{ rotate: mem.rot }}
              >
                {/* Tape */}
                <div className={styles.tape} />
                {/* Photo area */}
                <div className={styles.photo} style={{ background: mem.bg }}>
                  <span className={styles.photoEmoji}>{mem.emoji}</span>
                  {/* Hover zoom label */}
                  <div className={styles.zoomHint} aria-hidden="true">🔍 Preview</div>
                </div>
                {/* Caption */}
                <EditableCaption
                  caption={captions[index]}
                  onChange={(v) => setCaptions((c) => c.map((x, i) => (i === index ? v : x)))}
                />
              </motion.div>
            </AnimatePresence>

            {/* Dot indicators */}
            <div className={styles.dots} aria-label="Gallery progress">
              {MEMORIES.map((_, i) => (
                <button key={i} className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
                  onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
                  aria-label={`Go to memory ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Navigation buttons ── */}
        <div className={styles.navRow}>
          <motion.button className={styles.navBtn} onClick={() => go(-1)}
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
            aria-label="Previous memory">
            ← Previous
          </motion.button>

          <motion.button className={styles.replayBtn} onClick={replay}
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
            aria-label="Replay from first">
            🔄 Replay
          </motion.button>

          <motion.button className={styles.navBtn} onClick={() => go(1)}
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
            aria-label="Next memory">
            Next →
          </motion.button>
        </div>

        {/* ── Continue to ending ── */}
        <motion.button
          className={styles.continueBtn}
          onClick={() => router.push("/feelings")}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}>
          <span className={styles.continueBtnShimmer} aria-hidden="true" />
          Share Your Feelings&nbsp;❤️
        </motion.button>
      </main>

      {/* ══ Lightbox ══ */}
      <AnimatePresence>
        {lightbox && (
          <>
            <motion.div className={styles.overlay}
              variants={overlayV} initial="hidden" animate="visible" exit="exit"
              onClick={() => setLightbox(false)} aria-label="Close preview" role="button" />

            <motion.div className={styles.lightbox}
              variants={lightboxV} initial="hidden" animate="visible" exit="exit"
              role="dialog" aria-label={`Memory preview: ${captions[index]}`}>
              <button className={styles.closeBtn} onClick={() => setLightbox(false)} aria-label="Close">✕</button>
              {/* Large photo */}
              <div className={styles.lightboxPhoto} style={{ background: mem.bg }}>
                <span className={styles.lightboxEmoji}>{mem.emoji}</span>
              </div>
              <p className={styles.lightboxCaption}>{captions[index]}</p>
              {/* Lightbox prev/next */}
              <div className={styles.lightboxNav}>
                <button className={styles.lbNavBtn} onClick={() => go(-1)} aria-label="Previous">←</button>
                <span className={styles.lbCounter}>{index + 1} / {MEMORIES.length}</span>
                <button className={styles.lbNavBtn} onClick={() => go(1)}  aria-label="Next">→</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
