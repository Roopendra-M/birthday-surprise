/**
 * Centralized Framer Motion animation variants.
 * Import where needed – avoids redefining the same variants across components.
 *
 * NOTE: All transition.type values use "as const" to satisfy Framer Motion v12's
 * AnimationGeneratorType literal requirement inside Variants.
 */

import type { Variants, Transition } from "framer-motion";

/* ── Helpers ─────────────────────────────────────────────── */
const spring = (opts: Omit<Transition, "type"> = {}): Transition =>
  ({ type: "spring", ...opts } as Transition);

const tween = (opts: Omit<Transition, "type"> = {}): Transition =>
  ({ type: "tween", ...opts } as Transition);

/* ── Fade variants ───────────────────────────────────────── */
export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: tween({ duration: 0.5, ease: "easeOut" }) },
  exit:    { opacity: 0, transition: tween({ duration: 0.25 }) },
};

export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: tween({ duration: 0.6, ease: "easeOut" }) },
  exit:    { opacity: 0, y: 20, transition: tween({ duration: 0.25 }) },
};

export const fadeDown: Variants = {
  hidden:  { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: tween({ duration: 0.6, ease: "easeOut" }) },
  exit:    { opacity: 0, y: -20, transition: tween({ duration: 0.25 }) },
};

export const fadeLeft: Variants = {
  hidden:  { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: tween({ duration: 0.6, ease: "easeOut" }) },
};

export const fadeRight: Variants = {
  hidden:  { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: tween({ duration: 0.6, ease: "easeOut" }) },
};

/* ── Scale variants ──────────────────────────────────────── */
export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: spring({ stiffness: 350, damping: 25 }),
  },
  exit: { opacity: 0, scale: 0.9, transition: tween({ duration: 0.2 }) },
};

export const scaleInBounce: Variants = {
  hidden:  { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: spring({ stiffness: 260, damping: 16 }),
  },
};

/* ── Stagger container ───────────────────────────────────── */
export const staggerContainer: Variants = {
  hidden:  {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

export const staggerContainerFast: Variants = {
  hidden:  {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

/* ── Slide variants ──────────────────────────────────────── */
export const slideUp: Variants = {
  hidden:  { opacity: 0, y: "100%" },
  visible: {
    opacity: 1,
    y: "0%",
    transition: spring({ stiffness: 300, damping: 30 }),
  },
  exit: {
    opacity: 0,
    y: "100%",
    transition: tween({ duration: 0.25, ease: "easeIn" }),
  },
};

export const slideInFromLeft: Variants = {
  hidden:  { opacity: 0, x: "-100%" },
  visible: {
    opacity: 1,
    x: "0%",
    transition: spring({ stiffness: 280, damping: 28 }),
  },
  exit: { opacity: 0, x: "-100%", transition: tween({ duration: 0.2 }) },
};

/* ── Flip ────────────────────────────────────────────────── */
export const flipX: Variants = {
  hidden:  { opacity: 0, rotateX: 90 },
  visible: {
    opacity: 1,
    rotateX: 0,
    transition: spring({ stiffness: 300, damping: 22 }),
  },
};

/* ── Shared transition presets ───────────────────────────── */
export const springTransition: Transition = spring({ stiffness: 380, damping: 30 });
export const smoothTransition: Transition = tween({ duration: 0.45, ease: "easeOut" });
export const bouncyTransition: Transition = spring({ stiffness: 260, damping: 16 });
