"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import BackgroundEffects from "@/components/effects/BackgroundEffects";
import Envelope from "@/components/ui/Envelope";
import styles from "./envelope-page.module.css";

export default function EnvelopePage() {
  const router = useRouter();
  const [opened, setOpened] = useState(false);

  const handleOpen = () => {
    setOpened(true);
    setTimeout(() => router.push("/letter"), 2200);
  };

  return (
    <div className={styles.page}>
      <BackgroundEffects />

      {/* Radial glow */}
      <div className={styles.radialGlow} aria-hidden="true" />

      {/* Decorative blobs */}
      <div className={styles.blobTopLeft}  aria-hidden="true" />
      <div className={styles.blobBotRight} aria-hidden="true" />

      <main className={styles.main} id="main-content">

        {/* Heading */}
        <motion.div
          className={styles.headingWrap}
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <motion.h1 className={styles.heading}>
            {!opened
              ? <>Your surprise is waiting&nbsp;💌</>
              : <>You opened it!&nbsp;🎉</>
            }
          </motion.h1>
          <AnimatePresence mode="wait">
            {!opened ? (
              <motion.p
                key="subtitle-closed"
                className={styles.subtitle}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.2 }}
              >
                Something very special is inside&nbsp;✨
              </motion.p>
            ) : (
              <motion.p
                key="subtitle-open"
                className={styles.subtitle}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                Made with all my love, just for you&nbsp;💕
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Envelope */}
        <motion.div
          className={styles.envelopeWrap}
          initial={{ opacity: 0, y: 50, scale: 0.88 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.75, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <Envelope onOpen={handleOpen} />
        </motion.div>

        {/* Post-open message */}
        <AnimatePresence>
          {opened && (
            <motion.div
              className={styles.openedMsg}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <span className={styles.openedEmoji}>🎁</span>
              <p className={styles.openedText}>
                The next part of your surprise is coming...
              </p>
              <motion.div
                className={styles.openedDots}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className={styles.openedDot}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 0.65, delay: i * 0.18, repeat: Infinity }}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
