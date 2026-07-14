"use client";

import { motion, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import HeroIllustration from "@/components/ui/HeroIllustration";
import styles from "./HeroSection.module.css";

/* ── animation variants ─────────────────────────────────── */
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const fadeUpVariant: Variants = {
  hidden:  { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] as [number,number,number,number] },
  },
};

const illustrationVariant: Variants = {
  hidden:  { opacity: 0, scale: 0.75, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.34, 1.56, 0.64, 1] as [number,number,number,number] },
  },
};

const buttonVariant: Variants = {
  hidden:  { opacity: 0, scale: 0.7 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] as [number,number,number,number], delay: 0.1 },
  },
};

/* ── decorative pill tag ────────────────────────────────── */
const tagVariant: Variants = {
  hidden:  { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function HeroSection() {
  const router = useRouter();

  return (
    <section className={styles.hero} id="hero" aria-label="Hero section">
      {/* Paper texture overlay */}
      <div className={styles.paperTexture} aria-hidden="true" />

      {/* Radial gradient spotlight */}
      <div className={styles.spotlight} aria-hidden="true" />

      {/* Main content container */}
      <div className={styles.container}>
        <motion.div
          className={styles.inner}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* ── Left: Text content ── */}
          <div className={styles.textSide}>
            {/* Tag */}
            <motion.div variants={tagVariant} className={styles.tag}>
              <span className={styles.tagDot} />
              <span>A little something special&nbsp;✨</span>
            </motion.div>

            {/* Heading */}
            <motion.h1 variants={fadeUpVariant} className={styles.heading}>
              I made something
              <span className={styles.headingHighlight}>
                {" "}special
              </span>
              <br />
              for you&nbsp;
              <motion.span
                className={styles.heartEmoji}
                animate={{ scale: [1, 1.3, 1, 1.2, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1 }}
              >
                ❤️
              </motion.span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p variants={fadeUpVariant} className={styles.subtitle}>
              A little world of love, laughter, and memories — just for you.
              <br />
              Press start and let the magic begin&nbsp;🌸
            </motion.p>

            {/* CTA button */}
            <motion.div variants={buttonVariant}>
              <motion.button
                id="start-button"
                className={styles.startButton}
                onClick={() => router.push("/password")}
                whileHover={{
                  scale: 1.06,
                  boxShadow: "0 16px 48px rgba(233,30,120,0.5), 0 4px 16px rgba(233,30,120,0.3)",
                }}
                whileTap={{ scale: 0.96 }}
                aria-label="Start the surprise experience"
              >
                <span className={styles.buttonShimmer} aria-hidden="true" />
                <span className={styles.buttonContent}>
                  <span className={styles.buttonIcon}>🎁</span>
                  <span className={styles.buttonText}>Start</span>
                  <motion.span
                    className={styles.buttonArrow}
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  >
                    ✨
                  </motion.span>
                </span>
              </motion.button>
            </motion.div>

            {/* Footer note */}
            <motion.p variants={fadeUpVariant} className={styles.footNote}>
              Made with&nbsp;
              <motion.span
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                style={{ display: "inline-block" }}
              >
                💕
              </motion.span>
              &nbsp;just for you
            </motion.p>
          </div>

          {/* ── Right: Illustration ── */}
          <motion.div
            className={styles.illustrationSide}
            variants={illustrationVariant}
          >
            {/* Glow behind illustration */}
            <div className={styles.illustrationGlow} aria-hidden="true" />

            {/* Floating illustration */}
            <motion.div
              className={styles.illustrationWrapper}
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
            >
              <div className={styles.glassBubble} aria-hidden="true" />
              <HeroIllustration className={styles.illustration} />
            </motion.div>

            {/* Floating badge cards */}
            <motion.div
              className={`${styles.badge} ${styles.badgeLeft}`}
              animate={{ y: [0, -8, 0], rotate: [-2, 2, -2] }}
              transition={{ duration: 3.5, ease: "easeInOut", repeat: Infinity }}
            >
              <span className={styles.badgeIcon}>🎂</span>
              <span className={styles.badgeLabel}>Made with love</span>
            </motion.div>

            <motion.div
              className={`${styles.badge} ${styles.badgeRight}`}
              animate={{ y: [0, -10, 0], rotate: [2, -2, 2] }}
              transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, delay: 0.6 }}
            >
              <span className={styles.badgeIcon}>💌</span>
              <span className={styles.badgeLabel}>Just for you</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom wave */}
      <div className={styles.wave} aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" fill="none">
          <path
            d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
            fill="rgba(255,255,255,0.5)"
          />
        </svg>
      </div>
    </section>
  );
}
