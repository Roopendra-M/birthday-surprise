"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./MusicPlayer.module.css";

/* ══════════════════════════════════════════════════
   Config — Playlist of birthday songs
   ══════════════════════════════════════════════════ */
const PLAYLIST = [
  {
    src: "/music/WhatsApp Audio 2026-07-15 at 9.31.25 AM.mpeg",
    title: "✨ Birthday Melody — Magic Vibes",
  },
  {
    src: "/music/WhatsApp Audio 2026-07-15 at 9.31.26 AM.mpeg",
    title: "🎈 Celebration Beats — Party Groove",
  },
  {
    src: "/music/WhatsApp Audio 2026-07-15 at 9.31.27 AM.mpeg",
    title: "🌸 Sweet Wishes — Loving Acoustic",
  },
];

const EQ_DELAYS  = [0, 0.22, 0.44, 0.11, 0.33]; // per-bar animation stagger

interface SavedState { volume: number; loop: boolean; muted: boolean; }
const DEFAULTS: SavedState = { volume: 0.65, loop: true, muted: false };
const STORAGE_KEY = "musicPlayerState";

/* ══════════════════════════════════════════════════
   MusicPlayer
   ══════════════════════════════════════════════════ */
export default function MusicPlayer() {
  const audioRef   = useRef<HTMLAudioElement | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [playing,  setPlaying]  = useState(false);
  const [loaded,   setLoaded]   = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  // Lazy initialisers — read localStorage once, safe because ssr:false
  const [volume,  setVolume] = useState<number>(() => {
    try { return (JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as Partial<SavedState>).volume ?? DEFAULTS.volume; }
    catch { return DEFAULTS.volume; }
  });
  const [muted, setMuted] = useState<boolean>(() => {
    try { return (JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as Partial<SavedState>).muted ?? DEFAULTS.muted; }
    catch { return DEFAULTS.muted; }
  });
  const [loop, setLoop] = useState<boolean>(() => {
    try { return (JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as Partial<SavedState>).loop ?? DEFAULTS.loop; }
    catch { return DEFAULTS.loop; }
  });

  const trackIndexRef = useRef(0);
  const loopRef = useRef(loop);
  const playingRef = useRef(playing);

  useEffect(() => {
    trackIndexRef.current = currentTrackIndex;
  }, [currentTrackIndex]);

  useEffect(() => {
    loopRef.current = loop;
  }, [loop]);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  const playNext = useCallback((manual = false) => {
    const a = audioRef.current;
    if (!a) return;

    let nextIndex = trackIndexRef.current + 1;
    if (nextIndex >= PLAYLIST.length) {
      if (loopRef.current || manual) {
        nextIndex = 0;
      } else {
        setPlaying(false);
        return;
      }
    }

    setLoaded(false);
    setCurrentTrackIndex(nextIndex);
    a.src = PLAYLIST[nextIndex].src;
    a.load();
    a.play().catch(() => {
      setPlaying(false);
    });
  }, []);

  const playPrev = useCallback((manual = false) => {
    const a = audioRef.current;
    if (!a) return;

    let prevIndex = trackIndexRef.current - 1;
    if (prevIndex < 0) {
      prevIndex = PLAYLIST.length - 1;
    }

    setLoaded(false);
    setCurrentTrackIndex(prevIndex);
    a.src = PLAYLIST[prevIndex].src;
    a.load();
    a.play().catch(() => {
      setPlaying(false);
    });
  }, []);

  /* ── Init audio element ── */
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    audio.preload  = "metadata";
    audio.volume = volume;
    audio.muted  = muted;
    audio.loop   = false; // Managed manually for playlist progression

    const handleCanPlay = () => setLoaded(true);
    const handlePlay = () => setPlaying(true);
    const handlePause = () => {
      const a = audioRef.current;
      // If the song naturally ended or is about to end, ignore the pause event.
      // playNext will handle transitioning to the next track.
      if (a && (a.ended || a.currentTime >= a.duration - 0.3)) {
        return;
      }
      setPlaying(false);
    };
    const handleEnded = () => {
      playNext(false);
    };

    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("play",    handlePlay);
    audio.addEventListener("pause",   handlePause);
    audio.addEventListener("ended",   handleEnded);

    /* Load the first track */
    audio.src = PLAYLIST[trackIndexRef.current].src;
    audio.load();

    // Workaround for browser autoplay restrictions
    let hasStarted = false;
    const startAutoplay = () => {
      if (hasStarted) return;
      audio.play()
        .then(() => {
          hasStarted = true;
          cleanupAutoplay();
        })
        .catch(() => {
          // Blocked or failed, keep waiting for interaction
        });
    };

    const cleanupAutoplay = () => {
      window.removeEventListener("click", startAutoplay);
      window.removeEventListener("touchstart", startAutoplay);
      window.removeEventListener("keydown", startAutoplay);
    };

    // Try playing immediately
    startAutoplay();

    // Listen for the first user interaction if immediate autoplay is blocked
    if (!hasStarted) {
      window.addEventListener("click", startAutoplay);
      window.addEventListener("touchstart", startAutoplay);
      window.addEventListener("keydown", startAutoplay);
    }

    return () => {
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("play",    handlePlay);
      audio.removeEventListener("pause",   handlePause);
      audio.removeEventListener("ended",   handleEnded);
      cleanupAutoplay();
      audio.pause();
      audio.src = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- volume/muted/loop read once via lazy initializers
  }, [playNext]);

  /* ── Persist helpers ── */
  const persist = useCallback((patch: Partial<SavedState>) => {
    try {
      const current: SavedState = { volume, muted, loop, ...patch };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch { /* no-op */ }
  }, [volume, muted, loop]);

  /* ── Controls ── */
  const togglePlay = useCallback(async () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
    } else {
      try {
        await a.play();
      } catch {
        /* Autoplay blocked by browser */
      }
    }
  }, [playing]);

  const toggleMute = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    const next = !a.muted;
    a.muted = next;
    setMuted(next);
    persist({ muted: next });
  }, [persist]);

  const onVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    const a = audioRef.current;
    if (!a) return;
    a.volume = v;
    if (v > 0 && a.muted) { a.muted = false; setMuted(false); }
    setVolume(v);
    persist({ volume: v, muted: v === 0 });
  }, [persist]);

  const toggleLoop = useCallback(() => {
    const next = !loop;
    setLoop(next);
    persist({ loop: next });
  }, [loop, persist]);

  const effectiveVolume = muted ? 0 : volume;

  const currentTitle = PLAYLIST[currentTrackIndex].title;

  return (
    <div className={styles.root}>
      {/* ── Expanded panel ── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className={styles.panel}
            initial={{ opacity: 0, y: 18, scale: 0.90 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{   opacity: 0, y: 18,  scale: 0.90 }}
            transition={{ duration: 0.32, ease: [0.34, 1.56, 0.64, 1] }}
            role="dialog"
            aria-label="Music player"
          >
            {/* Song title marquee */}
            <div className={styles.titleWrap}>
              <div className={styles.marquee} key={currentTrackIndex}>
                <span className={styles.marqueeInner}>
                  {currentTitle}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{currentTitle}
                </span>
              </div>
            </div>

            {/* Animated equalizer */}
            <div className={styles.equalizer} aria-hidden="true">
              {EQ_DELAYS.map((d, i) => (
                <div
                  key={i}
                  className={`${styles.eqBar} ${playing && !muted ? styles.eqBarActive : ""}`}
                  style={{ animationDelay: `${d}s` }}
                />
              ))}
            </div>

            {/* Control buttons */}
            <div className={styles.controls}>
              <button
                className={`${styles.ctrlBtn} ${loop ? styles.ctrlBtnOn : ""}`}
                onClick={toggleLoop}
                aria-label={loop ? "Disable playlist loop" : "Enable playlist loop"}
                title="Toggle playlist loop"
              >
                🔁
              </button>

              <button
                className={styles.ctrlBtn}
                onClick={() => playPrev(true)}
                aria-label="Previous track"
                title="Previous track"
              >
                ⏮
              </button>

              <button
                className={`${styles.ctrlBtn} ${styles.playBtn}`}
                onClick={togglePlay}
                aria-label={playing ? "Pause" : "Play"}
                title={playing ? "Pause" : "Play"}
              >
                {playing ? "⏸" : "▶"}
              </button>

              <button
                className={styles.ctrlBtn}
                onClick={() => playNext(true)}
                aria-label="Next track"
                title="Next track"
              >
                ⏭
              </button>

              <button
                className={styles.ctrlBtn}
                onClick={toggleMute}
                aria-label={muted ? "Unmute" : "Mute"}
                title={muted ? "Unmute" : "Mute"}
              >
                {effectiveVolume === 0 ? "🔇" : effectiveVolume < 0.4 ? "🔉" : "🔊"}
              </button>
            </div>

            {/* Volume slider */}
            <div className={styles.volRow}>
              <span aria-hidden="true" className={styles.volIcon}>🔉</span>
              <input
                className={styles.slider}
                type="range" min={0} max={1} step={0.05}
                value={effectiveVolume}
                onChange={onVolumeChange}
                aria-label="Volume"
              />
              <span aria-hidden="true" className={styles.volIcon}>🔊</span>
            </div>

            {/* Hint if file not yet found */}
            {!loaded && (
              <p className={styles.hint}>
                📂 Loading track audio...
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating toggle button ── */}
      <motion.button
        className={`${styles.fab} ${playing ? styles.fabPlaying : ""}`}
        onClick={() => setExpanded((v) => !v)}
        whileHover={{ scale: 1.10 }}
        whileTap={{ scale: 0.90 }}
        aria-label={expanded ? "Close music player" : "Open music player"}
        title="Music"
      >
        {/* Mini equalizer visible on FAB when playing & collapsed */}
        {playing && !expanded && (
          <div className={styles.fabEq} aria-hidden="true">
            {[0, 0.15, 0.3].map((d, i) => (
              <div key={i} className={`${styles.fabEqBar} ${styles.eqBarActive}`}
                style={{ animationDelay: `${d}s` }} />
            ))}
          </div>
        )}

        {/* Note icon (shown when not playing) */}
        {!playing && <span className={styles.noteIcon} aria-hidden="true">🎵</span>}

        {/* Pulse ring */}
        {playing && <span className={styles.pulseRing} aria-hidden="true" />}
      </motion.button>
    </div>
  );
}
