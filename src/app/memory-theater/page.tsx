"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import BackgroundEffects from "@/components/effects/BackgroundEffects";
import styles from "./memory-theater.module.css";

/* ══════════════════════════════════════════════════
   Config
══════════════════════════════════════════════════ */
const VIDEOS = [
  "/videos/video1.mp4",
  "/videos/video2.mp4",
  "/videos/video3.mp4",
  "/videos/video4.mp4",
] as const;

const TOTAL = VIDEOS.length;

/* ══════════════════════════════════════════════════
   Floating decorations config (stable, no random)
══════════════════════════════════════════════════ */
const DECORATIONS = [
  /* puppies */
  { emoji: "🐶", top: "8%",  left: "5%",  size: 28, dur: 5.5, delay: 0    },
  { emoji: "🐶", top: "72%", left: "88%", size: 24, dur: 6.2, delay: 1.4  },
  /* teddy bears */
  { emoji: "🧸", top: "18%", left: "91%", size: 30, dur: 6.8, delay: 0.8  },
  { emoji: "🧸", top: "80%", left: "4%",  size: 26, dur: 5.9, delay: 2.1  },
  /* flowers */
  { emoji: "🌸", top: "5%",  left: "28%", size: 22, dur: 4.8, delay: 0.3  },
  { emoji: "🌸", top: "90%", left: "55%", size: 20, dur: 5.2, delay: 1.7  },
  { emoji: "🌺", top: "38%", left: "2%",  size: 24, dur: 5.6, delay: 0.6  },
  /* clouds */
  { emoji: "☁️", top: "2%",  left: "50%", size: 32, dur: 7.5, delay: 1.0  },
  { emoji: "☁️", top: "15%", left: "70%", size: 28, dur: 8.0, delay: 2.5  },
  /* hearts */
  { emoji: "💕", top: "30%", left: "94%", size: 22, dur: 4.2, delay: 0.2  },
  { emoji: "💖", top: "60%", left: "92%", size: 20, dur: 4.8, delay: 1.1  },
  { emoji: "💗", top: "50%", left: "1%",  size: 26, dur: 5.0, delay: 0.9  },
  /* sparkles */
  { emoji: "✨", top: "12%", left: "15%", size: 20, dur: 3.8, delay: 0.5  },
  { emoji: "✨", top: "85%", left: "75%", size: 18, dur: 3.5, delay: 1.8  },
  { emoji: "⭐", top: "42%", left: "97%", size: 22, dur: 4.5, delay: 0.7  },
  /* butterflies */
  { emoji: "🦋", top: "22%", left: "82%", size: 26, dur: 5.8, delay: 1.5  },
  { emoji: "🦋", top: "68%", left: "3%",  size: 22, dur: 6.0, delay: 2.8  },
  /* stars */
  { emoji: "🌟", top: "55%", left: "6%",  size: 24, dur: 4.9, delay: 0.4  },
  { emoji: "💫", top: "7%",  left: "78%", size: 20, dur: 4.0, delay: 1.2  },
  /* balloons */
  { emoji: "🎈", top: "3%",  left: "40%", size: 28, dur: 6.5, delay: 0.1  },
  { emoji: "🎈", top: "88%", left: "20%", size: 26, dur: 7.0, delay: 2.0  },
  /* gift boxes */
  { emoji: "🎁", top: "25%", left: "7%",  size: 24, dur: 6.2, delay: 1.3  },
  { emoji: "🎁", top: "65%", left: "90%", size: 22, dur: 5.7, delay: 0.8  },
  /* ribbons */
  { emoji: "🎀", top: "95%", left: "42%", size: 26, dur: 5.3, delay: 1.9  },
  { emoji: "🎀", top: "10%", left: "60%", size: 22, dur: 5.0, delay: 0.6  },
] as const;

/* ══════════════════════════════════════════════════
   Confetti helper
══════════════════════════════════════════════════ */
async function fireTheaterConfetti() {
  try {
    const c = (await import("canvas-confetti")).default;
    const col = ["#f97bb8","#ffc8de","#e91e78","#ffe066","#a98eff","#ffffff","#ff6090"];
    const d = { colors: col, zIndex: 9998 };
    c({ ...d, particleCount: 90,  spread: 80,  origin: { y: 0.55 } });
    setTimeout(() => c({ ...d, particleCount: 60, angle: 60,  spread: 60, origin: { x: 0, y: 0.6 } }), 300);
    setTimeout(() => c({ ...d, particleCount: 60, angle: 120, spread: 60, origin: { x: 1, y: 0.6 } }), 500);
    setTimeout(() => c({ ...d, particleCount: 70, spread: 110, origin: { y: 0.4 },
      shapes: ["star"], scalar: 1.4,
      colors: ["#FFD700","#FF69B4","#fff","#f97bb8"] }), 800);
  } catch { /* no-op */ }
}

/* ══════════════════════════════════════════════════
   MemoryTheaterPage
══════════════════════════════════════════════════ */
export default function MemoryTheaterPage() {
  const router = useRouter();

  /* ── state ── */
  const [currentIdx, setCurrentIdx] = useState(0);
  const [playing,    setPlaying]    = useState(true);
  const [muted,      setMuted]      = useState(false);
  const [progress,   setProgress]   = useState(0); // 0–100
  const [fadeClass,  setFadeClass]  = useState<"videoFadeIn" | "videoFadeOut">("videoFadeIn");
  const [showDone,   setShowDone]   = useState(false);
  const [hasError,   setHasError]   = useState(false);

  /* ── refs ── */
  const videoRef    = useRef<HTMLVideoElement>(null);
  const nextVideoRef = useRef<HTMLVideoElement>(null); // hidden preload element
  const transitioning = useRef(false);

  /* ── Pause background music on mount, resume on unmount ── */
  useEffect(() => {
    // Small delay to ensure MusicPlayer has registered its API
    const t = setTimeout(() => { window.__musicPlayer?.pause(); }, 300);
    return () => {
      clearTimeout(t);
      window.__musicPlayer?.resume();
    };
  }, []);

  /* ── Preload next video ── */
  useEffect(() => {
    const next = currentIdx + 1;
    if (next < TOTAL && nextVideoRef.current) {
      nextVideoRef.current.src = VIDEOS[next];
      nextVideoRef.current.load();
    }
  }, [currentIdx]);

  /* ── Update progress bar ── */
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const onTimeUpdate = () => {
      if (vid.duration > 0) {
        setProgress((vid.currentTime / vid.duration) * 100);
      }
    };
    vid.addEventListener("timeupdate", onTimeUpdate);
    return () => vid.removeEventListener("timeupdate", onTimeUpdate);
  }, [currentIdx]);

  /* ── Progress bar click to seek ── */
  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const vid = videoRef.current;
      if (!vid || !vid.duration) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      vid.currentTime = ratio * vid.duration;
    },
    []
  );

  /* ── Transition to next video with crossfade ── */
  const goToNext = useCallback(
    (forced = false) => {
      if (transitioning.current && !forced) return;
      transitioning.current = true;
      setFadeClass("videoFadeOut");

      setTimeout(() => {
        setCurrentIdx((prev) => {
          const next = prev + 1;
          if (next >= TOTAL) {
            // All videos finished
            transitioning.current = false;
            setShowDone(true);
            fireTheaterConfetti();
            window.__musicPlayer?.resume();
            setTimeout(() => router.push("/gallery"), 4000);
            return prev;
          }
          return next;
        });
        setProgress(0);
        setFadeClass("videoFadeIn");
        transitioning.current = false;
      }, 500); // matches fade transition
    },
    [router]
  );

  /* ── Auto-play when currentIdx changes ── */
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || showDone) return;
    vid.currentTime = 0;
    vid.muted = muted;
    const playPromise = vid.play();
    playPromise?.catch(() => setPlaying(false));
    setPlaying(true);
    setHasError(false);

    const onEnded = () => goToNext();
    const onError = () => setHasError(true);
    vid.addEventListener("ended", onEnded);
    vid.addEventListener("error", onError);
    return () => {
      vid.removeEventListener("ended", onEnded);
      vid.removeEventListener("error", onError);
    };
  }, [currentIdx, goToNext, muted, showDone]);

  /* ── Controls ── */
  const togglePlay = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (playing) { vid.pause(); setPlaying(false); }
    else { vid.play().catch(() => {}); setPlaying(true); }
  }, [playing]);

  const toggleMute = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const next = !vid.muted;
    vid.muted = next;
    setMuted(next);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      vid.requestFullscreen().catch(() => {});
    }
  }, []);

  const replayCurrent = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.currentTime = 0;
    vid.play().catch(() => {});
    setPlaying(true);
  }, []);

  const skipCurrent = useCallback(() => {
    goToNext(true);
  }, [goToNext]);

  /* ── Decorations (memoized) ── */
  const decorations = useMemo(
    () =>
      DECORATIONS.map((d, i) => (
        <span
          key={i}
          className={styles.decor}
          aria-hidden="true"
          style={{
            top: d.top,
            left: d.left,
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

  /* ── Render ── */
  return (
    <div className={styles.page}>
      <BackgroundEffects />
      <div className={styles.radialGlow} aria-hidden="true" />
      <div className={styles.blobTL}     aria-hidden="true" />
      <div className={styles.blobBR}     aria-hidden="true" />
      <div className={styles.blobTC}     aria-hidden="true" />

      {/* Floating decorations */}
      <div className={styles.decorLayer} aria-hidden="true">
        {decorations}
      </div>

      {/* ── Main ── */}
      <main className={styles.main} id="main-content">
        {/* Heading */}
        <motion.div
          className={styles.headingWrap}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <h1 className={styles.heading}>Memory Theater&nbsp;🎬</h1>
          <AnimatePresence mode="wait">
            <motion.p
              key={currentIdx}
              className={styles.counter}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
            >
              Playing&nbsp;
              <strong>{currentIdx + 1}</strong>
              &nbsp;of&nbsp;
              <strong>{TOTAL}</strong>
              &nbsp;·&nbsp;sit back and enjoy&nbsp;🍿
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* ── Video Player Card ── */}
        <motion.div
          className={styles.playerOuter}
          initial={{ opacity: 0, scale: 0.93, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.34, 1.56, 0.64, 1] }}
        >
          {/* Pink glow ring */}
          <div className={styles.playerGlow} aria-hidden="true" />

          {/* Glass card */}
          <div className={styles.playerCard}>
            {/* Video area */}
            <div
              className={styles.videoWrapper}
              onClick={togglePlay}
              role="button"
              aria-label={playing ? "Pause video" : "Play video"}
              title={playing ? "Pause" : "Play"}
            >
              {/* Hidden preloader for next video */}
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video ref={nextVideoRef} style={{ display: "none" }} preload="auto" />

              {/* Main video */}
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video
                ref={videoRef}
                key={currentIdx}
                src={VIDEOS[currentIdx]}
                className={`${styles.videoEl} ${styles[fadeClass]}`}
                playsInline
                preload="auto"
                muted={muted}
                aria-label={`Memory video ${currentIdx + 1} of ${TOTAL}`}
              />

              {/* Error / placeholder overlay */}
              {hasError && (
                <div className={styles.videoPlaceholder}>
                  <span className={styles.placeholderEmoji}>🎬</span>
                  <span>
                    Replace&nbsp;
                    <code>public/videos/video{currentIdx + 1}.mp4</code>
                    &nbsp;with your video
                  </span>
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div
              className={styles.progressBar}
              onClick={handleProgressClick}
              role="slider"
              aria-label="Video progress"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Controls */}
            <div className={styles.controls}>
              {/* Left group: play / skip / replay */}
              <div className={styles.ctrlGroup}>
                <button
                  id="mt-play-btn"
                  className={styles.ctrlBtn}
                  onClick={togglePlay}
                  aria-label={playing ? "Pause" : "Play"}
                  title={playing ? "Pause" : "Play"}
                >
                  {playing ? "⏸" : "▶"}
                </button>

                <button
                  id="mt-replay-btn"
                  className={styles.ctrlBtn}
                  onClick={replayCurrent}
                  aria-label="Replay current video"
                  title="Replay current video"
                >
                  🔄
                </button>

                {currentIdx < TOTAL - 1 && (
                  <button
                    id="mt-skip-btn"
                    className={styles.ctrlBtn}
                    onClick={skipCurrent}
                    aria-label="Skip to next video"
                    title="Skip to next video"
                  >
                    ⏭
                  </button>
                )}

                <div className={styles.ctrlSep} />

                <button
                  id="mt-mute-btn"
                  className={styles.ctrlBtn}
                  onClick={toggleMute}
                  aria-label={muted ? "Unmute" : "Mute"}
                  title={muted ? "Unmute" : "Mute"}
                >
                  {muted ? "🔇" : "🔊"}
                </button>
              </div>

              {/* Right group: fullscreen */}
              <div className={styles.ctrlGroup}>
                <button
                  id="mt-fullscreen-btn"
                  className={`${styles.ctrlBtn} ${styles.ctrlBtnWide}`}
                  onClick={toggleFullscreen}
                  aria-label="Toggle fullscreen"
                  title="Fullscreen"
                >
                  ⛶ Fullscreen
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* ── "All done" confetti screen ── */}
      <AnimatePresence>
        {showDone && (
          <motion.div
            className={styles.confettiMsg}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            role="status"
            aria-live="polite"
          >
            <div className={styles.confettiHeart}>❤️</div>
            <h2 className={styles.confettiHeading}>
              That&apos;s a Wrap!&nbsp;🎬✨
            </h2>
            <p className={styles.confettiSub}>
              Every moment with you is a treasure.
              <br />
              Taking you to the gallery now&hellip;
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
