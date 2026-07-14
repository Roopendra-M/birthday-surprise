"use client";

/**
 * GlobalEffects — Client Component wrapper for site-wide effects.
 *
 * Uses `ssr: false` for all imports because these components depend on:
 *  - window / document (CursorEffects)
 *  - HTMLAudioElement   (MusicPlayer)
 *
 * This wrapper lives in the root layout so effects are present on every page.
 */

import dynamic from "next/dynamic";

const MusicPlayer = dynamic(
  () => import("@/components/ui/MusicPlayer"),
  { ssr: false }
);

const CursorEffects = dynamic(
  () => import("@/components/effects/CursorEffects"),
  { ssr: false }
);

export default function GlobalEffects() {
  return (
    <>
      <MusicPlayer />
      <CursorEffects />
    </>
  );
}
