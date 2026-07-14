"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import styles from "./HandwrittenLetter.module.css";

/* ── Default letter text ─────────────────────────────────── */
const DEFAULT_LETTER = `Dear Special One, 💕

Today is YOUR day — a day the whole world is brighter simply because you're in it. ✨

You deserve every beautiful moment, every laugh, and every little thing that makes your heart smile.

You are so loved — more than words could ever say. From the way you light up a room to the kindness you show every single day...

Here's to YOU — and this magical celebration! 🎂

May all your wishes come true, and may this year bring you more joy than ever before. 🌟

With all the love in my heart,
Always yours ❤️`;

/* ── Polaroid data ───────────────────────────────────────── */
const PHOTOS = [
  { emoji: "🎂", caption: "Birthday wishes!", bg: "linear-gradient(135deg,#ffd6ea,#f97bb8)", rot: -4 },
  { emoji: "🌸", caption: "Beautiful moments", bg: "linear-gradient(135deg,#ead5ff,#c4b0ff)", rot: 3  },
  { emoji: "💕", caption: "With all my love",  bg: "linear-gradient(135deg,#fff5e8,#ffd09a)", rot: -2 },
];

const TYPEWRITER_SPEED = 22; // ms per character

export default function HandwrittenLetter() {
  const router  = useRouter();
  const [text,      setText]      = useState("");
  const [fullText]                 = useState(DEFAULT_LETTER);
  const [editing,   setEditing]   = useState(false);
  const [editText,  setEditText]  = useState(DEFAULT_LETTER);
  const [done,      setDone]      = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const indexRef    = useRef(0);

  /* ── Typewriter effect ─────────────────────────────────── */
  const startTypewriter = useCallback((src: string) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    indexRef.current = 0;
    setText("");
    setDone(false);

    intervalRef.current = setInterval(() => {
      indexRef.current += 1;
      setText(src.slice(0, indexRef.current));
      if (indexRef.current >= src.length) {
        clearInterval(intervalRef.current!);
        setDone(true);
      }
    }, TYPEWRITER_SPEED);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- typewriter resets state intentionally on text change
    startTypewriter(fullText);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [fullText, startTypewriter]);

  /* ── Toggle edit mode ──────────────────────────────────── */
  const toggleEdit = () => {
    if (editing) {
      // Save and replay typewriter
      if (intervalRef.current) clearInterval(intervalRef.current);
      setText("");
      setDone(false);
      setTimeout(() => startTypewriter(editText), 50);
    }
    setEditing((e) => !e);
  };

  /* ── Skip typewriter on click ──────────────────────────── */
  const skipTypewriter = () => {
    if (done || editing) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setText(editText);
    setDone(true);
  };

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
    >
      {/* ── Paper sheet ── */}
      <div className={styles.paper} onClick={skipTypewriter} style={{ cursor: done ? "default" : "pointer" }}>

        {/* Edit / Done button */}
        <button className={styles.editBtn} onClick={(e) => { e.stopPropagation(); toggleEdit(); }}>
          {editing ? "✓ Done" : "✏️ Edit"}
        </button>

        {/* Flower & heart stickers */}
        <span className={styles.sticker} style={{ top: -18, left: 18, fontSize: 28 }}>🌸</span>
        <span className={styles.sticker} style={{ top: -14, right: 52, fontSize: 22 }}>🌺</span>
        <span className={styles.sticker} style={{ bottom: 12, left: -8,  fontSize: 20 }}>🌼</span>
        <span className={styles.sticker} style={{ top:  60, left:  14,  fontSize: 16 }}>💕</span>
        <span className={styles.sticker} style={{ top: 130, left:  10,  fontSize: 14 }}>❤️</span>
        <span className={styles.sticker} style={{ bottom: 60, right: 12, fontSize: 18 }}>💖</span>
        <span className={styles.sticker} style={{ top:  20, right: 12,  fontSize: 15 }}>✨</span>

        {/* Letter content */}
        {editing ? (
          <textarea
            className={styles.textarea}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            aria-label="Edit your letter"
            spellCheck
          />
        ) : (
          <div className={styles.letterText} aria-live="polite">
            {text}
            {!done && <span className={styles.cursor} aria-hidden="true" />}
          </div>
        )}
      </div>

      {/* ── Polaroid images ── */}
      <div className={styles.polaroidRow}>
        {PHOTOS.map((p, i) => (
          <motion.div
            key={i}
            className={styles.polaroid}
            style={{ rotate: p.rot }}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
          >
            {/* Tape */}
            <div className={styles.tape} style={{ transform: `translateX(-50%) rotate(${-p.rot + 2}deg)` }} />
            {/* Photo */}
            <div className={styles.polaroidPhoto} style={{ background: p.bg }}>
              {p.emoji}
            </div>
            <div className={styles.polaroidCaption}>{p.caption}</div>
          </motion.div>
        ))}
      </div>

      {/* ── Continue button ── */}
      <AnimatePresence>
        {done && !editing && (
          <motion.button
            className={styles.continueBtn}
            onClick={() => router.push("/gift")}
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <span className={styles.continueBtnShimmer} aria-hidden="true" />
            Continue&nbsp;→&nbsp;🎁
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
