import type { Metadata } from "next";
import BackgroundEffects from "@/components/effects/BackgroundEffects";
import GiftBox from "@/components/ui/GiftBox";
import styles from "./gift-page.module.css";

export const metadata: Metadata = {
  title: "Your Gift Awaits 🎁",
  description: "A special gift, wrapped with love — click to open!",
};

export default function GiftPage() {
  return (
    <div className={styles.page}>
      <BackgroundEffects />
      <div className={styles.radialGlow} aria-hidden="true" />
      <div className={styles.blobTL}     aria-hidden="true" />
      <div className={styles.blobBR}     aria-hidden="true" />

      <main className={styles.main} id="main-content">
        <div className={styles.headingWrap}>
          <h1 className={styles.heading}>There&apos;s a gift for you!&nbsp;🎁</h1>
          <p className={styles.subtitle}>Hover to feel the excitement • Click to unwrap</p>
        </div>

        <GiftBox />
      </main>
    </div>
  );
}
