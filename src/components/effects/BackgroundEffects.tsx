"use client";

/**
 * BackgroundEffects — Client Component wrapper
 *
 * Next.js 16 does NOT allow `ssr: false` with `next/dynamic` inside Server
 * Components. Dynamic imports that disable SSR must live in a Client Component.
 * This wrapper is that Client Component; Server-side pages simply render
 * <BackgroundEffects /> and the browser handles the rest.
 */

import dynamic from "next/dynamic";

const FloatingHearts = dynamic(
  () => import("@/components/effects/FloatingHearts"),
  { ssr: false }
);

const AnimatedStars = dynamic(
  () => import("@/components/effects/AnimatedStars"),
  { ssr: false }
);

export default function BackgroundEffects() {
  return (
    <>
      <FloatingHearts />
      <AnimatedStars />
    </>
  );
}
