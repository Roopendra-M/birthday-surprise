"use client";

import { useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import BackgroundEffects from "@/components/effects/BackgroundEffects";
import HeroIllustration from "@/components/ui/HeroIllustration";
import styles from "./ending-page.module.css";

/* ══════════════════════════════════════════════════
   Confetti helper
══════════════════════════════════════════════════ */
async function fireEnding() {
  try {
    const c = (await import("canvas-confetti")).default;
    const col = ["#f97bb8","#ffc8de","#e91e78","#ffe066","#a98eff","#ffffff","#4ade80","#ff6090"];
    const defaults = { colors: col, zIndex: 999 };
    c({ ...defaults, particleCount: 80,  spread: 70,  origin: { y: 0.55 } });
    setTimeout(() => c({ ...defaults, particleCount: 50, angle: 60,  spread: 55, origin: { x: 0.0,  y: 0.6 } }), 280);
    setTimeout(() => c({ ...defaults, particleCount: 50, angle: 120, spread: 55, origin: { x: 1.0,  y: 0.6 } }), 460);
    setTimeout(() => c({ ...defaults, particleCount: 60, spread: 100, origin: { y: 0.4 }, shapes: ["star"], scalar: 1.4,
      colors: ["#FFD700","#FF69B4","#fff","#f97bb8"] }), 750);
  } catch { /* no-op */ }
}

/* Download memories as an HTML file */
const MEMORIES = [
  { emoji: "🎂", caption: "Birthday Wishes!",     bg: "linear-gradient(135deg,#ffd6ea,#f97bb8)" },
  { emoji: "🌸", caption: "Beautiful You",         bg: "linear-gradient(135deg,#ead5ff,#c4b0ff)" },
  { emoji: "💕", caption: "With All My Love",      bg: "linear-gradient(135deg,#fff5e8,#ffb870)" },
  { emoji: "✨", caption: "You're a Star!",        bg: "linear-gradient(135deg,#fffbe8,#ffe066)" },
  { emoji: "🎉", caption: "Let's Celebrate!",      bg: "linear-gradient(135deg,#e8fff0,#6ee7b7)" },
  { emoji: "🦋", caption: "Spreading Joy",         bg: "linear-gradient(135deg,#e8f5ff,#93c5fd)" },
  { emoji: "🌈", caption: "All the Colors of You", bg: "linear-gradient(135deg,#ffeef7,#c4b0ff)" },
  { emoji: "💫", caption: "Making Memories",       bg: "linear-gradient(135deg,#ffd6ea,#f97bb8)" },
];

function downloadMemories() {
  const cards = MEMORIES.map((m, i) => `
    <div style="display:inline-block;margin:14px;padding:14px 14px 36px;background:white;border-radius:3px;
      box-shadow:0 4px 20px rgba(0,0,0,.12);transform:rotate(${(i % 3 - 1) * 3}deg);">
      <div style="width:140px;height:140px;background:${m.bg};display:flex;align-items:center;justify-content:center;font-size:3.5rem;">${m.emoji}</div>
      <p style="margin:8px 0 0;font-family:Georgia,serif;font-size:0.85rem;color:#5a3848;text-align:center;font-style:italic;">${m.caption}</p>
    </div>`).join("");

  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Special Memories 💕</title></head>
<body style="margin:0;padding:40px 20px;background:linear-gradient(135deg,#fff5f9,#ffeef7,#f8e8ff);font-family:Georgia,serif;text-align:center;min-height:100vh;">
  <h1 style="color:#e91e78;font-size:2.8rem;margin-bottom:8px;">💕 Special Memories 💕</h1>
  <p style="color:#b5607a;font-size:1rem;margin-bottom:40px;">A little collection of joy, made with love.</p>
  <div style="max-width:900px;margin:0 auto;">${cards}</div>
  <footer style="margin-top:60px;color:#d9879d;font-size:0.85rem;">Made with ❤️ just for you</footer>
</body></html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = "my-birthday-memories.html";
  a.click(); URL.revokeObjectURL(url);
}

/* Share */
async function handleShare() {
  if (navigator.share) {
    try {
      await navigator.share({ title: "A Little Surprise 💕", text: "Check out this special birthday surprise!", url: window.location.origin });
    } catch { /* cancelled */ }
  } else {
    await navigator.clipboard.writeText(window.location.origin).catch(() => {});
    alert("Link copied to clipboard! 💕 Share it with someone special.");
  }
}

/* ══════════════════════════════════════════════════
   Animated star positions (stable across renders)
══════════════════════════════════════════════════ */
const STARS = [
  { top: "8%",  left: "10%", size: 28, delay: 0 },
  { top: "12%", left: "82%", size: 22, delay: 0.4 },
  { top: "6%",  left: "52%", size: 18, delay: 0.8 },
  { top: "20%", left: "92%", size: 24, delay: 0.2 },
  { top: "78%", left: "8%",  size: 20, delay: 1.0 },
  { top: "82%", left: "88%", size: 26, delay: 0.6 },
  { top: "45%", left: "3%",  size: 16, delay: 1.3 },
  { top: "38%", left: "95%", size: 19, delay: 0.9 },
  { top: "62%", left: "6%",  size: 14, delay: 0.5 },
  { top: "70%", left: "91%", size: 21, delay: 1.1 },
];

const HEARTS = ["💕","💖","💗","❤️","💝","💞","🌸","✨"];

/* ══════════════════════════════════════════════════
   Component
══════════════════════════════════════════════════ */
export default function EndingPage() {
  const router  = useRouter();
  const firedRef = useRef(false);

  /* Initial confetti burst + recurring */
  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    fireEnding();
    const id = setInterval(fireEnding, 5000);
    return () => clearInterval(id);
  }, []);

  const replay = useCallback(() => router.push("/password"), [router]);

  return (
    <div className={styles.page}>
      <BackgroundEffects />
      <div className={styles.radialGlow} aria-hidden="true" />
      <div className={styles.blobTL}     aria-hidden="true" />
      <div className={styles.blobBR}     aria-hidden="true" />
      <div className={styles.blobTC}     aria-hidden="true" />

      {/* ── Animated stars ── */}
      <div className={styles.starField} aria-hidden="true">
        {STARS.map((s, i) => (
          <motion.span key={i} className={styles.star}
            style={{ top: s.top, left: s.left, fontSize: s.size }}
            initial={{ opacity: 0, scale: 0, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.3 + s.delay, duration: 0.55, ease: [0.34,1.56,0.64,1] }}
          >
            ⭐
          </motion.span>
        ))}
      </div>

      {/* ── Floating hearts layer ── */}
      <div className={styles.heartLayer} aria-hidden="true">
        {HEARTS.map((h, i) => (
          <span key={i} className={styles.floatHeart}
            style={{ left: `${6 + i * 11}%`, animationDelay: `${i * 1.2}s`,
              animationDuration: `${4.5 + i * 0.7}s`, fontSize: `${14 + (i % 3) * 7}px` }}>
            {h}
          </span>
        ))}
      </div>

      {/* ── Main content ── */}
      <main className={styles.main} id="main-content">

        {/* Large heading */}
        <motion.div className={styles.headingWrap}
          initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.34,1.56,0.64,1] }}>
          <h1 className={styles.heading}>
            Hope you liked it&nbsp;❤️
          </h1>
          <motion.p className={styles.subtitle}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
            Made especially for you, with all the love in the world 💕
          </motion.p>
        </motion.div>

        {/* Cute illustration */}
        <motion.div className={styles.illustrationWrap}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.75, ease: [0.34,1.56,0.64,1] }}>
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 3.5, ease: "easeInOut", repeat: Infinity }}>
            <HeroIllustration className={styles.illustration} />
          </motion.div>
        </motion.div>

        {/* ── Action buttons ── */}
        <motion.div className={styles.btnRow}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.55 }}>

          {/* Replay */}
          <motion.button className={styles.primaryBtn} onClick={replay}
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
            <span className={styles.btnShimmer} aria-hidden="true" />
            🔄&nbsp;Replay
          </motion.button>

          {/* Share */}
          <motion.button className={styles.secondaryBtn} onClick={handleShare}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
            📤&nbsp;Share
          </motion.button>

          {/* Download Memories */}
          <motion.button className={styles.secondaryBtn} onClick={downloadMemories}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
            💾&nbsp;Download Memories
          </motion.button>
        </motion.div>

        {/* Confetti note */}
        <motion.p className={styles.note}
          initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 0.8 }}>
          ✨ Confetti fires every 5 seconds — enjoy the celebration!
        </motion.p>
      </main>

      {/* ── Footer ── */}
      <motion.footer className={styles.footer}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
        <span>Made with&nbsp;</span>
        <motion.span
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1, ease: "easeInOut", repeat: Infinity }}>
          ❤️
        </motion.span>
        <span>&nbsp;just for you</span>
      </motion.footer>
    </div>
  );
}
