"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import styles from "./HandwrittenLetter.module.css";

/* ── Default letter text ─────────────────────────────────── */
const DEFAULT_LETTER = `Hi Mouni 🤍...

Firstly, thanks for everything. Nenu konchem boring, introvert type... ekkuva mandi tho easy ga mingle avvanu, naa feelings kuda proper ga express cheyyalenu 😅. Kaani nenu ala unna kuda, nuvvu naatho matladav. Sometimes, I genuinely felt like maybe I’m something special to you.

Ee madhya nuvvu chaala gurthosthunnav. Em special reason kuda ledu... just ala, random ga edho oka time lo mana conversations gurthosthayi. Mana daggara unna aa small moments anni miss avuthunna.

Bangalore lo manam ala walks ki vellam kadha... nuvvu, nenu ala walk chesthu edho random topics maatladukunevallam. Honestly, adi naaku chaala special 🌃. Appudu avi normal moments la anipinchayi, but ippudu gurthu cheskunte chaala baaga anipisthundi.

Starting lo manam daily maatladukunevallam kadha... aa phase kuda chaala miss avuthunna.

And one more thing... nenu ninnu chaala saarlu ibbandhi pettanu. Daaniki really sorry 🙃. Ninnu hurt cheyyalani or ibbandhi pettalani eppudu intention kaadu. Konni sarlu naa feelings ni ela handle cheyyalo, ela cheppalo naake teliyaka ala jarigipoyindi.

Nen ninnu ignore chesthunna ani eppudu anukoku. Konni sarlu nene silent aipotha, anthe.

Honestly, I always wanted to be with you. Kaani life lo konni things mana control lo undavu kadha.

Nuvvu eppudu ilane chinna pillala allari chesthu, happy ga undu 😂. And please, ninnu nuvvu eppudu restrict cheskoku. Neeku nachinattu undu, neeku nachina things cheyyi.

Mana madhya em jarigina, manam kalisi spend chesina aa small moments naaku eppudu special gaane untayi.

Take care, Mouni. 🤍
Always be happy.`;

/* ── Polaroid data ───────────────────────────────────────── */
const PHOTOS = [
  { src: "/photos/file_0000000022a071faa1310622e4732cd2.png", caption: "Our memories 💕", rot: -4 },
  { src: "/photos/SAVE_20260311_174458.jpg", caption: "Together always ❤️", rot: 3 },
  { src: "/photos/IMG_20260307_204136.jpg", caption: "Night vibes 🌙", rot: -2 },
];

const TYPEWRITER_SPEED = 22; // ms per character

export default function HandwrittenLetter() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [fullText] = useState(DEFAULT_LETTER);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(DEFAULT_LETTER);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const indexRef = useRef(0);

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
        <span className={styles.sticker} style={{ bottom: 12, left: -8, fontSize: 20 }}>🌼</span>
        <span className={styles.sticker} style={{ top: 60, left: 14, fontSize: 16 }}>💕</span>
        <span className={styles.sticker} style={{ top: 130, left: 10, fontSize: 14 }}>❤️</span>
        <span className={styles.sticker} style={{ bottom: 60, right: 12, fontSize: 18 }}>💖</span>
        <span className={styles.sticker} style={{ top: 20, right: 12, fontSize: 15 }}>✨</span>

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
            {/* Real photo */}
            <div className={styles.polaroidPhoto}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt={p.caption} className={styles.polaroidImg} />
            </div>
            <div className={styles.polaroidCaption}>{p.caption}</div>
          </motion.div>
        ))}
      </div>

      {/* ── Roopendra's signature ── */}
      <div className={styles.signatureBlock}>
        <span className={styles.signatureYours}>Yours</span>
        <span className={styles.signatureName}>Roopendra</span>
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
