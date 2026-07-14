"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import LockIllustration from "@/components/ui/LockIllustration";
import styles from "./PasswordCard.module.css";

/* ── Constants ──────────────────────────────────────────── */
// Set your secret password here (or load from env)
const SECRET_PASSWORD = process.env.NEXT_PUBLIC_SECRET_PASSWORD ?? "iloveyou";

const WRONG_MESSAGES = [
  "Nope 😝",
  "Try again ❤️",
  "Not quite! 🙈",
  "Hmm, wrong one 💭",
  "So close... maybe? 😂",
  "Nice try, cutie 😜",
  "Keep guessing 💕",
  "That's not it 🌸",
];

/* ── Animation variants ─────────────────────────────────── */
const cardVariant: Variants = {
  hidden:   { opacity: 0, y: 60, scale: 0.9 },
  visible:  {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] as [number,number,number,number] },
  },
  exit: {
    opacity: 0, scale: 1.1, y: -40,
    transition: { duration: 0.5, ease: "easeIn" as const },
  },
};

const shakeVariant: Variants = {
  shake: {
    x: [0, -14, 14, -10, 10, -6, 6, -3, 3, 0],
    transition: { duration: 0.55, ease: "easeInOut" as const },
  },
};


/* ── Ripple helper ──────────────────────────────────────── */
interface Ripple { id: number; x: number; y: number; }

/* ── Component ──────────────────────────────────────────── */
export default function PasswordCard() {
  const router = useRouter();

  const [value, setValue]       = useState("");
  const [status, setStatus]     = useState<"idle" | "loading" | "wrong" | "success">("idle");
  const [wrongMsg, setWrongMsg] = useState("");
  const [ripples, setRipples]   = useState<Ripple[]>([]);
  const [shakeKey, setShakeKey] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const rippleIdRef = useRef(0);

  /* Ripple on button click */
  const addRipple = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - btn.left;
    const y = e.clientY - btn.top;
    const id = ++rippleIdRef.current;
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 700);
  }, []);

  /* Submit handler */
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (status === "loading" || status === "success") return;
      if (!value.trim()) {
        inputRef.current?.focus();
        return;
      }

      setStatus("loading");

      // Simulate a tiny async check (feels more intentional)
      await new Promise((r) => setTimeout(r, 800));

      if (value.trim().toLowerCase() === SECRET_PASSWORD.toLowerCase()) {
        setStatus("success");
        // Navigate after success animation
        setTimeout(() => router.push("/surprise"), 1400);
      } else {
        const msg = WRONG_MESSAGES[Math.floor(Math.random() * WRONG_MESSAGES.length)];
        setWrongMsg(msg);
        setStatus("wrong");
        setShakeKey((k) => k + 1);
        // Reset after shake so they can try again
        setTimeout(() => {
          if (setStatus) setStatus("idle");
          setValue("");
          inputRef.current?.focus();
        }, 1600);
      }
    },
    [value, status, router]
  );

  const isWrong   = status === "wrong";
  const isSuccess = status === "success";
  const isLoading = status === "loading";

  return (
    <AnimatePresence mode="wait">
      {!isSuccess ? (
        <motion.div
          key="card"
          className={`${styles.card} ${isWrong ? styles.cardWrong : ""} ${isSuccess ? styles.cardSuccess : ""}`}
          variants={cardVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* ── Inner shake wrapper ── */}
          <motion.div
            key={shakeKey}
            variants={shakeVariant}
            animate={isWrong ? "shake" : ""}
            className={styles.inner}
          >
            {/* Glass shimmer overlay */}
            <div className={styles.glassShimmer} aria-hidden="true" />

            {/* Illustration */}
            <motion.div
              className={styles.illustration}
              animate={
                isSuccess
                  ? { rotate: [0, -10, 10, -8, 8, 0], scale: [1, 1.1, 1] }
                  : isWrong
                  ? { rotate: [-5, 5, -5, 5, 0] }
                  : { y: [0, -8, 0] }
              }
              transition={
                isSuccess
                  ? { duration: 0.6 }
                  : isWrong
                  ? { duration: 0.4 }
                  : { duration: 3.5, ease: "easeInOut", repeat: Infinity }
              }
            >
              <LockIllustration className={styles.lockSvg} />
            </motion.div>

            {/* Heading */}
            <motion.h1
              className={styles.heading}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              A little surprise for you&nbsp;💌
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className={styles.subtitle}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
            >
              Enter the secret password
            </motion.p>

            {/* Form */}
            <motion.form
              className={styles.form}
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
            >
              {/* Input wrapper */}
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon} aria-hidden="true">🔑</span>
                <input
                  ref={inputRef}
                  id="password-input"
                  type="password"
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value);
                    if (status === "wrong") setStatus("idle");
                  }}
                  placeholder="Enter password"
                  className={`${styles.input} ${isWrong ? styles.inputWrong : ""} ${isSuccess ? styles.inputSuccess : ""}`}
                  disabled={isLoading || isSuccess}
                  autoComplete="off"
                  aria-label="Password input"
                  aria-describedby={isWrong ? "wrong-message" : undefined}
                />
              </div>

              {/* Wrong message */}
              <AnimatePresence mode="wait">
                {isWrong && (
                  <motion.p
                    id="wrong-message"
                    key={wrongMsg}
                    className={styles.wrongMessage}
                    initial={{ opacity: 0, y: -8, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.25 }}
                    role="alert"
                    aria-live="assertive"
                  >
                    {wrongMsg}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Submit button */}
              <motion.button
                id="submit-password-btn"
                type="submit"
                className={`${styles.button} ${isLoading ? styles.buttonLoading : ""} ${isSuccess ? styles.buttonSuccess : ""}`}
                whileHover={!isLoading && !isSuccess ? { scale: 1.05 } : {}}
                whileTap={!isLoading && !isSuccess ? { scale: 0.97 } : {}}
                onClick={addRipple}
                disabled={isLoading || isSuccess}
                aria-label="Check password"
              >
                {/* Ripples */}
                {ripples.map((r) => (
                  <span
                    key={r.id}
                    className={styles.ripple}
                    style={{ left: r.x, top: r.y }}
                    aria-hidden="true"
                  />
                ))}

                {/* Button shimmer */}
                {!isLoading && <span className={styles.btnShimmer} aria-hidden="true" />}

                {/* Button content */}
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.span
                      key="loading"
                      className={styles.btnContent}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <span className={styles.spinner} aria-hidden="true" />
                      <span>Checking...</span>
                    </motion.span>
                  ) : isSuccess ? (
                    <motion.span
                      key="success"
                      className={styles.btnContent}
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <span>✓</span>
                      <span>Opening...</span>
                    </motion.span>
                  ) : (
                    <motion.span
                      key="idle"
                      className={styles.btnContent}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <span>💕</span>
                      <span>Unlock</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.form>

            {/* Hint footer */}
            <motion.p
              className={styles.hint}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              psst… it&apos;s something I always say 🤫
            </motion.p>
          </motion.div>
        </motion.div>
      ) : (
        /* ── Success state card ── */
        <motion.div
          key="success-card"
          className={`${styles.card} ${styles.cardSuccess}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <div className={styles.successContent}>
            <motion.div
              className={styles.successIcon}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 10 }}
            >
              ✓
            </motion.div>
            <motion.h2
              className={styles.successHeading}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              You got it! 🎉
            </motion.h2>
            <motion.p
              className={styles.successSubtitle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Opening your surprise...&nbsp;💕
            </motion.p>
            <motion.div
              className={styles.successDots}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className={styles.dot}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
