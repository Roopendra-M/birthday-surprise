import type { Metadata } from "next";
import BackgroundEffects from "@/components/effects/BackgroundEffects";
import HandwrittenLetter from "@/components/ui/HandwrittenLetter";
import styles from "./letter-page.module.css";

export const metadata: Metadata = {
  title: "A Letter For You 💌",
  description: "A heartfelt handwritten message, just for you.",
};

export default function LetterPage() {
  return (
    <div className={styles.page}>
      <BackgroundEffects />
      <div className={styles.radialGlow}  aria-hidden="true" />
      <div className={styles.blobTL}      aria-hidden="true" />
      <div className={styles.blobBR}      aria-hidden="true" />

      <main className={styles.main} id="main-content">
        {/* Page heading */}
        <div className={styles.headingWrap}>
          <h1 className={styles.heading}>A letter just for you&nbsp;💌</h1>
          <p className={styles.subtitle}>Click the paper to skip • ✏️ Edit to personalise</p>
        </div>

        <HandwrittenLetter />
      </main>
    </div>
  );
}
