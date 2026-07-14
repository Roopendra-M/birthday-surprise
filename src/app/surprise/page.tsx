import BackgroundEffects from "@/components/effects/BackgroundEffects";
import YesNoCard from "@/components/ui/YesNoCard";
import styles from "./surprise.module.css";

export default function SurprisePage() {
  return (
    <div className={styles.page}>
      {/* Animated background */}
      <BackgroundEffects />

      {/* Paper texture */}
      <div className={styles.paperTexture} aria-hidden="true" />

      {/* Radial glow */}
      <div className={styles.radialGlow} aria-hidden="true" />

      {/* Decorative corner blobs */}
      <div className={styles.blobTopLeft}  aria-hidden="true" />
      <div className={styles.blobBotRight} aria-hidden="true" />

      {/* Extra decorative blob top-right */}
      <div className={styles.blobTopRight} aria-hidden="true" />

      {/* Centered card */}
      <main className={styles.main} id="main-content">
        <YesNoCard />
      </main>
    </div>
  );
}
