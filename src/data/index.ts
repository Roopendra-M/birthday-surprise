import type { SiteMetadata } from "@/types";

/**
 * Global site configuration.
 * Centralise all hard-coded data here so page components
 * stay clean and all copy can be updated in one place.
 */
export const siteConfig: SiteMetadata = {
  title:       "Surprise Website",
  description: "A beautiful, heartfelt surprise crafted just for you.",
  keywords:    ["surprise", "birthday", "celebration", "special", "love"],
};

/** Animation timing constants (ms) */
export const TIMINGS = {
  FAST:   150,
  NORMAL: 300,
  SLOW:   600,
  SLOWER: 1000,
} as const;

/** Responsive breakpoints (px) — mirrors Tailwind defaults */
export const BREAKPOINTS = {
  sm:  640,
  md:  768,
  lg:  1024,
  xl:  1280,
  xxl: 1536,
} as const;
