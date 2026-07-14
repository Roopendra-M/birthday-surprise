import BackgroundEffects from "@/components/effects/BackgroundEffects";
import PasswordCard from "@/components/ui/PasswordCard";
import styles from "./password.module.css";

export default function PasswordPage() {
  return (
    <div className={styles.page}>
      {/* Background effects (client-only, no SSR) */}
      <BackgroundEffects />

      {/* Paper texture */}
      <div className={styles.paperTexture} aria-hidden="true" />

      {/* Radial glow */}
      <div className={styles.radialGlow} aria-hidden="true" />

      {/* Decorative corner blobs */}
      <div className={styles.blobTopLeft}  aria-hidden="true" />
      <div className={styles.blobBotRight} aria-hidden="true" />

      {/* Centered card */}
      <main className={styles.main} id="main-content">
        <PasswordCard />
      </main>
    </div>
  );
}
