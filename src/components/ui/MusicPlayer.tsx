"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./MusicPlayer.module.css";

/* ══════════════════════════════════════════════════
   Config — place your music file at this path:
   public/music/background.mp3
══════════════════════════════════════════════════ */
const MUSIC_SRC  = "/music/background.mp3";
const SONG_TITLE = "🎵 Birthday Surprise — Special Edition";
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

  /* ── Init audio element ── */
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    audio.preload  = "metadata";
    audio.volume = volume;
    audio.muted  = muted;
    audio.loop   = loop;

    audio.addEventListener("canplay", () => setLoaded(true));
    audio.addEventListener("play",    () => setPlaying(true));
    audio.addEventListener("pause",   () => setPlaying(false));
    audio.addEventListener("ended",   () => { if (!audio.loop) setPlaying(false); });

    /* Load the file last — this triggers the canplay event if the file exists */
    audio.src = MUSIC_SRC;
    audio.load();

    return () => {
      audio.pause();
      audio.src = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- volume/muted/loop read once via lazy initializers
  }, []);

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
        /* Autoplay blocked by browser — user interaction required.
           The button IS a user interaction so this should succeed. */
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
    const a = audioRef.current;
    if (!a) return;
    const next = !a.loop;
    a.loop = next;
    setLoop(next);
    persist({ loop: next });
  }, [persist]);

  const effectiveVolume = muted ? 0 : volume;

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
              <div className={styles.marquee}>
                <span className={styles.marqueeInner}>{SONG_TITLE}&nbsp;&nbsp;&nbsp;{SONG_TITLE}</span>
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
                className={styles.ctrlBtn}
                onClick={togglePlay}
                aria-label={playing ? "Pause" : "Play"}
                title={playing ? "Pause" : "Play"}
              >
                {playing ? "⏸" : "▶"}
              </button>

              <button
                className={styles.ctrlBtn}
                onClick={toggleMute}
                aria-label={muted ? "Unmute" : "Mute"}
                title={muted ? "Unmute" : "Mute"}
              >
                {effectiveVolume === 0 ? "🔇" : effectiveVolume < 0.4 ? "🔉" : "🔊"}
              </button>

              <button
                className={`${styles.ctrlBtn} ${loop ? styles.ctrlBtnOn : ""}`}
                onClick={toggleLoop}
                aria-label={loop ? "Disable loop" : "Enable loop"}
                title="Toggle loop"
              >
                🔁
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
                📂 Add your music to&nbsp;<code>/public/music/background.mp3</code>
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
