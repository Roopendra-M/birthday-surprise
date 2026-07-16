"use client";

import { useEffect, useRef } from "react";
import styles from "./CursorEffects.module.css";

/* ══════════════════════════════════════════════════
   Types
══════════════════════════════════════════════════ */
interface Sparkle {
  x: number; y: number;
  vx: number; vy: number;
  opacity: number; size: number;
  color: string; born: number; life: number;
}

const COLORS  = ["#f97bb8","#e91e78","#a98eff","#ffe066","#ff9cbd","#c4b0ff","#4ade80"];
const HEARTS  = ["💕","💖","💗","❤️","💝","🌸","💫"];

/* ══════════════════════════════════════════════════
   CursorEffects — auto-disabled on touch devices
══════════════════════════════════════════════════ */
export default function CursorEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotRef    = useRef<HTMLDivElement>(null);
  const ringRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* ── Touch device guard ──
       (pointer: coarse) alone isn't enough — Windows laptops with
       trackpads report coarse touch support even without a touchscreen.
       Adding (hover: none) ensures we only bail on TRUE touch-only
       devices (phones/tablets) that have no hover capability at all. */
    const isTouch = window.matchMedia(
      "(pointer: coarse) and (hover: none)"
    ).matches;
    if (isTouch) return;

    /* ── Setup ── */
    document.documentElement.classList.add("custom-cursor");

    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext("2d")!;
    let sparkles: Sparkle[] = [];
    let rafId: number;
    let lastHeartMs   = 0;
    let lastSparkleMs = 0;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    /* ── Mouse move ── */
    const onMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;

      /* Direct DOM updates — no React re-render, no jank */
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${x - 5}px,${y - 5}px)`;
        dotRef.current.style.opacity   = "1";
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${x - 20}px,${y - 20}px)`;
        ringRef.current.style.opacity   = "1";
      }

      const now = Date.now();

      /* Sparkle trail (~22 fps throttle) */
      if (now - lastSparkleMs > 45) {
        lastSparkleMs = now;
        for (let i = 0; i < 3; i++) {
          const angle = Math.random() * Math.PI * 2;
          const spd   = 0.5 + Math.random() * 1.6;
          sparkles.push({
            x: x + (Math.random() - 0.5) * 10,
            y: y + (Math.random() - 0.5) * 10,
            vx: Math.cos(angle) * spd * 0.45,
            vy: Math.sin(angle) * spd * 0.45 - 0.9,
            opacity: 0.88,
            size: 2.5 + Math.random() * 4.5,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            born: now,
            life: 480 + Math.random() * 380,
          });
          if (sparkles.length > 120) sparkles.shift();
        }
      }

      /* Floating heart (one every 300 ms) */
      if (now - lastHeartMs > 300) {
        lastHeartMs = now;
        spawnHeart(x, y);
      }
    };

    /* ── Spawn floating heart (DOM element, auto-removed) ── */
    const spawnHeart = (x: number, y: number) => {
      const el   = document.createElement("span");
      const char = HEARTS[Math.floor(Math.random() * HEARTS.length)];
      const size = 13 + Math.random() * 14;
      const dx   = (Math.random() - 0.5) * 50;
      const dur  = 0.8 + Math.random() * 0.4;

      el.textContent = char;
      el.style.cssText = [
        "position:fixed",
        `left:${x}px`,
        `top:${y}px`,
        `font-size:${size}px`,
        "pointer-events:none",
        "z-index:9998",
        "user-select:none",
        `animation:heartFloat ${dur}s ease-out forwards`,
        `--dx:${dx}px`,
      ].join(";");

      document.body.appendChild(el);
      el.addEventListener("animationend", () => el.remove(), { once: true });
    };

    /* ── Click ripple ── */
    const onClick = (e: MouseEvent) => {
      const el = document.createElement("div");
      el.style.cssText = [
        "position:fixed",
        `left:${e.clientX}px`,
        `top:${e.clientY}px`,
        "width:0", "height:0",
        "border-radius:50%",
        "border:2.5px solid rgba(249,123,184,0.75)",
        "transform:translate(-50%,-50%)",
        "pointer-events:none",
        "z-index:9997",
        "animation:rippleOut 0.65s ease-out forwards",
      ].join(";");
      document.body.appendChild(el);
      el.addEventListener("animationend", () => el.remove(), { once: true });

      /* Second, larger ripple (pink-lavender) */
      const el2 = document.createElement("div");
      el2.style.cssText = [
        "position:fixed",
        `left:${e.clientX}px`,
        `top:${e.clientY}px`,
        "width:0", "height:0",
        "border-radius:50%",
        "border:2px solid rgba(169,142,255,0.55)",
        "transform:translate(-50%,-50%)",
        "pointer-events:none",
        "z-index:9996",
        "animation:rippleOut 0.9s ease-out 0.08s forwards",
      ].join(";");
      document.body.appendChild(el2);
      el2.addEventListener("animationend", () => el2.remove(), { once: true });
    };

    /* ── Cursor ring reacts to hovering interactive elements ── */
    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("button,a,[role='button'],input,select,textarea")) {
        ringRef.current?.classList.add(styles.ringHover);
        dotRef.current?.classList.add(styles.dotHover);
      }
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("button,a,[role='button'],input,select,textarea")) {
        ringRef.current?.classList.remove(styles.ringHover);
        dotRef.current?.classList.remove(styles.dotHover);
      }
    };

    /* Hide cursor elements when mouse leaves window */
    const onLeave = () => {
      if (dotRef.current)  dotRef.current.style.opacity  = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
    };

    /* ── Animation loop (canvas sparkles) ── */
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = Date.now();

      sparkles = sparkles.filter((s) => {
        const age   = now - s.born;
        const ratio = age / s.life;
        if (ratio >= 1) return false;

        s.x += s.vx;
        s.y += s.vy;

        ctx.save();
        ctx.globalAlpha = s.opacity * (1 - ratio);
        ctx.fillStyle   = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur  = 10;
        ctx.beginPath();
        ctx.arc(s.x, s.y, Math.max(0.5, s.size * (1 - ratio * 0.45)), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return true;
      });

      rafId = requestAnimationFrame(loop);
    };

    /* ── Attach listeners ── */
    window.addEventListener("mousemove",    onMove);
    window.addEventListener("click",        onClick);
    document.addEventListener("mouseover",  onOver);
    document.addEventListener("mouseout",   onOut);
    document.addEventListener("mouseleave", onLeave);
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove",    onMove);
      window.removeEventListener("click",        onClick);
      document.removeEventListener("mouseover",  onOver);
      document.removeEventListener("mouseout",   onOut);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize",       resize);
      cancelAnimationFrame(rafId);
      document.documentElement.classList.remove("custom-cursor");
    };
  }, []);

  return (
    <>
      {/* Canvas for sparkle trail */}
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      {/* Custom cursor dot (sharp, follows exactly) */}
      <div ref={dotRef}  className={styles.dot}  aria-hidden="true" />
      {/* Cursor ring (larger, transitions for trail-like lag) */}
      <div ref={ringRef} className={styles.ring} aria-hidden="true" />
    </>
  );
}
