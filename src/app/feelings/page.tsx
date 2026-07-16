"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import BackgroundEffects from "@/components/effects/BackgroundEffects";
import styles from "./feelings-page.module.css";

/* ══════════════════════════════════════════════════
   Floating decorations config
══════════════════════════════════════════════════ */
const DECORS = [
  /* Hearts */
  { emoji: "💕", top: "6%",  left: "5%",  size: 26, dur: 5.2, delay: 0    },
  { emoji: "💖", top: "15%", left: "88%", size: 24, dur: 5.8, delay: 1.2  },
  { emoji: "💗", top: "72%", left: "4%",  size: 22, dur: 4.9, delay: 0.7  },
  { emoji: "❤️", top: "80%", left: "90%", size: 28, dur: 6.1, delay: 2.0  },
  { emoji: "💝", top: "45%", left: "96%", size: 20, dur: 4.5, delay: 1.5  },
  { emoji: "💞", top: "55%", left: "2%",  size: 24, dur: 5.5, delay: 0.9  },
  /* Flowers */
  { emoji: "🌸", top: "3%",  left: "30%", size: 24, dur: 5.0, delay: 0.4  },
  { emoji: "🌸", top: "92%", left: "60%", size: 22, dur: 5.3, delay: 1.8  },
  { emoji: "🌺", top: "35%", left: "1%",  size: 26, dur: 5.7, delay: 0.6  },
  { emoji: "🌼", top: "88%", left: "12%", size: 22, dur: 4.8, delay: 2.3  },
  /* Clouds */
  { emoji: "☁️", top: "1%",  left: "52%", size: 34, dur: 7.5, delay: 1.0  },
  { emoji: "☁️", top: "18%", left: "72%", size: 28, dur: 8.2, delay: 2.6  },
  /* Sparkles */
  { emoji: "✨", top: "10%", left: "18%", size: 20, dur: 3.8, delay: 0.5  },
  { emoji: "✨", top: "82%", left: "78%", size: 18, dur: 3.5, delay: 1.7  },
  { emoji: "⭐", top: "40%", left: "98%", size: 22, dur: 4.3, delay: 0.8  },
  { emoji: "🌟", top: "62%", left: "5%",  size: 24, dur: 5.0, delay: 0.3  },
  /* Ribbon */
  { emoji: "🎀", top: "95%", left: "45%", size: 26, dur: 5.4, delay: 1.9  },
  { emoji: "🎀", top: "8%",  left: "65%", size: 22, dur: 4.9, delay: 0.7  },
] as const;

/* Drifting hearts from bottom */
const DRIFT_HEARTS = ["💕", "💖", "💗", "❤️", "💝", "🌸", "✨", "💞"];

/* ══════════════════════════════════════════════════
   Confetti helper
══════════════════════════════════════════════════ */
async function fireSuccessConfetti() {
  try {
    const c = (await import("canvas-confetti")).default;
    const col = ["#f97bb8","#ffc8de","#e91e78","#ffe066","#a98eff","#ffffff"];
    const d = { colors: col, zIndex: 9997 };
    c({ ...d, particleCount: 80,  spread: 75,  origin: { y: 0.6 } });
    setTimeout(() => c({ ...d, particleCount: 50, angle: 60,  spread: 55, origin: { x: 0, y: 0.6 } }), 280);
    setTimeout(() => c({ ...d, particleCount: 50, angle: 120, spread: 55, origin: { x: 1, y: 0.6 } }), 460);
    setTimeout(() => c({ ...d, particleCount: 60, spread: 100, origin: { y: 0.4 },
      shapes: ["star"], scalar: 1.3,
      colors: ["#FFD700","#FF69B4","#fff","#f97bb8"] }), 750);
  } catch { /* no-op */ }
}

/* ══════════════════════════════════════════════════
   FeelingsPage
══════════════════════════════════════════════════ */
export default function FeelingsPage() {
  const router = useRouter();
  const [message,   setMessage]   = useState("");
  const [loading,   setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ripple,    setRipple]    = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  /* ── Memoised decorations ── */
  const decorations = useMemo(
    () =>
      DECORS.map((d, i) => (
        <span
          key={i}
          className={styles.decor}
          aria-hidden="true"
          style={{
            top: d.top, left: d.left,
            fontSize: d.size,
            animationDuration: `${d.dur}s`,
            animationDelay: `${d.delay}s`,
          }}
        >
          {d.emoji}
        </span>
      )),
    []
  );

  const driftHearts = useMemo(
    () =>
      DRIFT_HEARTS.map((h, i) => (
        <span
          key={i}
          className={styles.driftHeart}
          aria-hidden="true"
          style={{
            left: `${6 + i * 11}%`,
            fontSize: `${14 + (i % 3) * 8}px`,
            animationDuration: `${5 + i * 0.8}s`,
            animationDelay: `${i * 1.3}s`,
          }}
        >
          {h}
        </span>
      )),
    []
  );

  /* ── Submit handler ── */
  const handleSubmit = useCallback(async () => {
    if (loading || submitted) return;
    const trimmed = message.trim();
    if (!trimmed) {
      if (btnRef.current) {
        btnRef.current.animate(
          [{ transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "translateX(0)" }],
          { duration: 300, iterations: 2 }
        );
      }
      return;
    }

    /* Ripple effect */
    setRipple(true);
    setTimeout(() => setRipple(false), 600);

    setLoading(true);
    try {
      const res = await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      if (!res.ok) throw new Error("Server error");
      setSubmitted(true);
      await fireSuccessConfetti();
    } catch {
      /* Still show success — message was worth sending regardless */
      setSubmitted(true);
      await fireSuccessConfetti();
    } finally {
      setLoading(false);
    }
  }, [loading, submitted, message]);

  /* ── Page variants ── */
  const pageVariants = {
    hidden:  { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.34,1.56,0.64,1] as [number,number,number,number] } },
  };

  return (
    <div className={styles.page}>
      <BackgroundEffects />
      <div className={styles.radialGlow}  aria-hidden="true" />
      <div className={styles.blobTL}      aria-hidden="true" />
      <div className={styles.blobBR}      aria-hidden="true" />
      <div className={styles.blobTC}      aria-hidden="true" />
      <div className={styles.spotlight}   aria-hidden="true" />

      {/* Floating decorations */}
      <div className={styles.decorLayer} aria-hidden="true">
        {decorations}
        {driftHearts}
      </div>

      {/* ── Main ── */}
      <main className={styles.main} id="main-content">

        {/* Mascots */}
        <motion.div
          className={styles.mascotsRow}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.34,1.56,0.64,1] }}
        >
          <span className={styles.mascot} role="img" aria-label="Puppy">🐶</span>
          <span className={styles.mascot} role="img" aria-label="Teddy bear">🧸</span>
        </motion.div>

        {/* Heading */}
        <motion.div
          className={styles.headingWrap}
          variants={pageVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className={styles.heading}>One last thing...&nbsp;❤️</h1>
          <div className={styles.subtitleWrap}>
            <span className={styles.subtitleLine}>
              I&apos;ve shared a little piece of my heart with you.
            </span>
            <span className={styles.subtitleLine} style={{ animationDelay: "0.2s" }}>
              Now I&apos;d love to know...
            </span>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            /* ── Form ── */
            <motion.div
              key="form"
              style={{ display: "contents" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Emotional question */}
              <motion.p
                className={styles.question}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.55 }}
              >
                After seeing everything&hellip;<br />
                How do you feel about me?&nbsp;❤️
              </motion.p>

              {/* Handwritten letter textarea */}
              <motion.div
                className={styles.letterCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6, ease: [0.34,1.56,0.64,1] }}
              >
                {/* Paper decorations */}
                <div className={styles.paperFold + " " + styles.paperFoldTR} />
                <div className={styles.paperFold + " " + styles.paperFoldBL} />
                <span className={styles.letterRibbon} aria-hidden="true">🎀</span>

                <textarea
                  id="feelings-textarea"
                  className={styles.textarea}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write anything that comes from your heart..."
                  rows={7}
                  aria-label="Your feelings"
                  disabled={loading}
                />
              </motion.div>

              {/* Send button */}
              <motion.button
                ref={btnRef}
                id="feelings-submit-btn"
                className={styles.submitBtn}
                onClick={handleSubmit}
                disabled={loading || submitted}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.55 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                aria-label="Send my feelings"
              >
                <span className={styles.btnShimmer} aria-hidden="true" />
                {ripple && <span className={styles.ripple} aria-hidden="true" />}
                {loading ? (
                  <>
                    <span className={styles.spinner} aria-hidden="true" />
                    Sending&hellip;
                  </>
                ) : (
                  <>Send My Feelings&nbsp;❤️</>
                )}
              </motion.button>
            </motion.div>
          ) : (
            /* ── Success card ── */
            <motion.div
              key="success"
              className={styles.successWrap}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.34,1.56,0.64,1] }}
            >
              <div className={styles.successGlow} aria-hidden="true" />
              <div className={styles.successCard} role="status" aria-live="polite">
                <div className={styles.successHeart} aria-hidden="true">❤️</div>
                <p className={styles.successTitle}>
                  Your words have been safely kept in my heart forever&nbsp;❤️
                </p>
                <p className={styles.successSub}>
                  Thank you for taking this journey with me.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <motion.footer
        className={styles.footer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.button
          className={styles.endingLink}
          onClick={() => router.push("/ending")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
        >
          🎉 Continue to Ending
        </motion.button>
        <span className={styles.footerSep}>·</span>
        <span>Made with&nbsp;</span>
        <motion.span
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1, ease: "easeInOut", repeat: Infinity }}
        >
          ❤️
        </motion.span>
        <span>&nbsp;just for you</span>
      </motion.footer>
    </div>
  );
}
