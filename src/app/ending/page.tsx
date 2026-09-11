"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import BackgroundEffects from "@/components/effects/BackgroundEffects";
import HeroIllustration from "@/components/ui/HeroIllustration";
import styles from "./ending-page.module.css";

/* ══════════════════════════════════════════════════
   Confetti helper
══════════════════════════════════════════════════ */
async function fireEnding() {
  try {
    const c = (await import("canvas-confetti")).default;
    const col = ["#f97bb8","#ffc8de","#e91e78","#ffe066","#a98eff","#ffffff","#4ade80","#ff6090"];
    const defaults = { colors: col, zIndex: 999 };
    c({ ...defaults, particleCount: 80,  spread: 70,  origin: { y: 0.55 } });
    setTimeout(() => c({ ...defaults, particleCount: 50, angle: 60,  spread: 55, origin: { x: 0.0,  y: 0.6 } }), 280);
    setTimeout(() => c({ ...defaults, particleCount: 50, angle: 120, spread: 55, origin: { x: 1.0,  y: 0.6 } }), 460);
    setTimeout(() => c({ ...defaults, particleCount: 60, spread: 100, origin: { y: 0.4 }, shapes: ["star"], scalar: 1.4,
      colors: ["#FFD700","#FF69B4","#fff","#f97bb8"] }), 750);
  } catch { /* no-op */ }
}

/* ══════════════════════════════════════════════════
   Gallery data (real photos)
══════════════════════════════════════════════════ */
const PHOTO_FILES = [
  { src: "/photos/file_0000000022a071faa1310622e4732cd2.png", caption: "Our first chapter 💕",   filename: "photo1.png" },
  { src: "/photos/ChatGPT Image Aug 29, 2026, 11_06_34 PM.png", caption: "You & me 🌸",         filename: "photo2.png" },
  { src: "/photos/IMG_20260301_140042.jpg",                    caption: "Shopping dates 🛍️",   filename: "photo3.jpg" },
  { src: "/photos/IMG_20260301_140056.jpg",                    caption: "Together always ❤️", filename: "photo4.jpg" },
  { src: "/photos/IMG_20260307_204136.jpg",                    caption: "Night vibes ✨",       filename: "photo5.jpg" },
  { src: "/photos/SAVE_20260311_174458.jpg",                   caption: "Stuck in your eyes 👁️", filename: "photo6.jpg" },
  { src: "/photos/nothing.jpg",                               caption: "Beautiful you 🌺",    filename: "photo7.jpg" },
];

/* ══════════════════════════════════════════════════
   Build the memories HTML — uses base64 photo data
══════════════════════════════════════════════════ */
function buildMemoriesHtml(photoDataMap: Record<string, string>): string {
  const cards = PHOTO_FILES.map((p, i) => {
    const b64 = photoDataMap[p.filename];
    const imgSrc = b64 ? `data:image/${p.filename.endsWith(".png") ? "png" : "jpeg"};base64,${b64}` : "";
    return `
    <div style="display:inline-block;margin:14px;padding:14px 14px 42px;background:white;border-radius:3px;
      box-shadow:0 4px 20px rgba(0,0,0,.12);transform:rotate(${(i % 3 - 1) * 3}deg);vertical-align:top;">
      <div style="width:180px;height:200px;overflow:hidden;border-radius:2px;">
        ${imgSrc ? `<img src="${imgSrc}" style="width:100%;height:100%;object-fit:cover;object-position:center top;display:block;"/>` : `<div style="width:180px;height:200px;background:linear-gradient(135deg,#ffd6ea,#f97bb8);display:flex;align-items:center;justify-content:center;font-size:3rem;">📸</div>`}
      </div>
      <p style="margin:10px 0 0;font-family:Georgia,serif;font-size:0.85rem;color:#5a3848;text-align:center;font-style:italic;">${p.caption}</p>
    </div>`;
  }).join("");

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<title>Our Special Memories 💕</title>
<style>
  body{margin:0;padding:40px 20px;background:linear-gradient(135deg,#fff5f9,#ffeef7,#f8e8ff);
    font-family:Georgia,serif;text-align:center;min-height:100vh;}
  h1{font-size:2.6rem;margin-bottom:6px;}
  h2{font-size:1.4rem;margin:50px 0 6px;letter-spacing:-0.02em;}
  .divider{display:inline-block;width:60px;height:3px;background:linear-gradient(90deg,#f97bb8,#a98eff);
    border-radius:9999px;margin:6px 0 28px;}
  p.sub{color:#b5607a;font-size:1rem;margin-bottom:0;font-style:italic;}
  footer{margin-top:60px;color:#d9879d;font-size:0.82rem;}
</style></head>
<body>
  <h1 style="color:#e91e78;">💕 Our Special Memories 💕</h1>
  <p class="sub">A little collection of joy, made with love just for you.</p>

  <h2 style="color:#e91e78;">📸 Memory Gallery</h2>
  <div class="divider"></div><br>
  <div style="max-width:960px;margin:0 auto;">${cards}</div>

  <footer>Made with ❤️ just for you · ${new Date().toLocaleDateString("en-IN", { year:"numeric", month:"long", day:"numeric" })}</footer>
</body></html>`;
}

/* ══════════════════════════════════════════════════
   Build the letter HTML
══════════════════════════════════════════════════ */
function buildLetterHtml(): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<title>A Letter For You 💌</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap');
  *{box-sizing:border-box;}
  body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
    background:linear-gradient(135deg,#fff5f9,#ffeef7,#f8e8ff);padding:40px 20px;font-family:'Patrick Hand',Georgia,serif;}
  .card{max-width:680px;width:100%;background:#fffdf8;border-radius:4px;
    box-shadow:0 8px 40px rgba(0,0,0,.13);padding:3rem 3rem 3rem 4.5rem;position:relative;
    background-image:repeating-linear-gradient(transparent 0px,transparent 31px,rgba(180,200,255,.13) 31px,rgba(180,200,255,.13) 32px);
    background-size:100% 32px;background-position:0 36px;}
  .card::before{content:"";position:absolute;left:3.8rem;top:0;bottom:0;width:2px;background:rgba(255,120,150,.25);}
  .letter{font-size:1.05rem;line-height:2;color:#3a2a35;white-space:pre-wrap;word-break:break-word;}
  .signature{margin-top:2rem;text-align:right;font-family:'Patrick Hand',Georgia,serif;}
  .yours{display:block;font-size:1rem;color:#9b6b80;text-decoration:line-through;text-decoration-thickness:2px;
    text-decoration-color:#c2557a;opacity:0.75;letter-spacing:0.04em;}
  .name{display:block;font-size:1.2rem;font-weight:700;color:#3a2a35;letter-spacing:0.03em;margin-top:2px;}
  h1{font-size:1.8rem;color:#e91e78;text-align:center;margin:0 0 2rem;font-family:'Patrick Hand',Georgia,serif;}
</style></head>
<body>
<div class="card">
  <h1>💌 A Letter For You</h1>
  <div class="letter">Hi Mouni... 💕

Firstly, thanks for everything. I'm a guy who is kind of boring, introverted, and not really good at expressing things blabla 😅. But nenu ala unna kuda, nuvvu naatho matladav. Sometimes, I honestly felt like maybe I'm something special to you.

Bangalore night walks… you and me. ❤️
Ippudu kaadhu, but starting stage lo mana kalisinappudu, daily talks… those little things still stay in my mind.

I always wanted to be with you, but somewhere I know that maybe I'm not the person who suits you. I never really knew how to say that.

I saw many eyes, but somehow I got stuck in yours.

Nen ninnu eppudu ignore chesthunna ani anukoku. Emo… malli matladadam start chestha. Kaani adi sudden ga stop aithe, ee sari nenu teeskolenu.

I don't know where we'll end up or what happens next. I just wanted to tell you what I genuinely feel, without making it complicated.

Always be happy, Mouni. ❤️</div>
  <div class="signature">
    <span class="yours">Yours</span>
    <span class="name">Roopendra</span>
  </div>
</div>
</body></html>`;
}

/* ══════════════════════════════════════════════════
   ZIP download helper — photos + letter + memories
══════════════════════════════════════════════════ */
async function downloadMemoriesZip(
  setProgress: (p: string) => void
): Promise<void> {
  setProgress("Loading…");

  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();
  const photosFolder = zip.folder("photos")!;

  /* Fetch all real photos and collect base64 for HTML embedding */
  const photoDataMap: Record<string, string> = {};
  for (let i = 0; i < PHOTO_FILES.length; i++) {
    const p = PHOTO_FILES[i];
    setProgress(`Downloading photo ${i + 1} of ${PHOTO_FILES.length}…`);
    try {
      const res = await fetch(p.src);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      /* Store in photos/ folder */
      photosFolder.file(p.filename, blob);
      /* Also convert to base64 for embedding in HTML */
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1] ?? "");
        };
        reader.readAsDataURL(blob);
      });
      photoDataMap[p.filename] = base64;
    } catch {
      /* photo unavailable — skip */
    }
  }

  /* Add memories HTML (with embedded photos) */
  zip.file("memories.html", buildMemoriesHtml(photoDataMap));

  /* Add the letter HTML */
  zip.file("letter.html", buildLetterHtml());

  /* Generate ZIP */
  setProgress("Packing ZIP…");
  const zipBlob = await zip.generateAsync(
    { type: "blob", compression: "DEFLATE", compressionOptions: { level: 1 } },
    (meta) => setProgress(`Packing… ${Math.round(meta.percent)}%`)
  );

  const url = URL.createObjectURL(zipBlob);
  const a   = document.createElement("a");
  a.href     = url;
  a.download = "our-birthday-memories.zip";
  a.click();
  URL.revokeObjectURL(url);
  setProgress("Done! ✅");
  setTimeout(() => setProgress(""), 2500);
}

/* Share */
async function handleShare() {
  if (navigator.share) {
    try {
      await navigator.share({ title: "A Little Surprise 💕", text: "Check out this special birthday surprise!", url: window.location.origin });
    } catch { /* cancelled */ }
  } else {
    await navigator.clipboard.writeText(window.location.origin).catch(() => {});
    alert("Link copied to clipboard! 💕 Share it with someone special.");
  }
}

/* ══════════════════════════════════════════════════
   Animated star positions (stable across renders)
══════════════════════════════════════════════════ */
const STARS = [
  { top: "8%",  left: "10%", size: 28, delay: 0 },
  { top: "12%", left: "82%", size: 22, delay: 0.4 },
  { top: "6%",  left: "52%", size: 18, delay: 0.8 },
  { top: "20%", left: "92%", size: 24, delay: 0.2 },
  { top: "78%", left: "8%",  size: 20, delay: 1.0 },
  { top: "82%", left: "88%", size: 26, delay: 0.6 },
  { top: "45%", left: "3%",  size: 16, delay: 1.3 },
  { top: "38%", left: "95%", size: 19, delay: 0.9 },
  { top: "62%", left: "6%",  size: 14, delay: 0.5 },
  { top: "70%", left: "91%", size: 21, delay: 1.1 },
];

const HEARTS = ["💕","💖","💗","❤️","💝","💞","🌸","✨"];

/* ══════════════════════════════════════════════════
   Component
══════════════════════════════════════════════════ */
export default function EndingPage() {
  const router   = useRouter();
  const firedRef = useRef(false);

  /* Download state */
  const [dlProgress, setDlProgress] = useState("");
  const isDownloading = dlProgress !== "" && dlProgress !== "Done! ✅";

  /* Initial confetti burst + recurring */
  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    fireEnding();
    const id = setInterval(fireEnding, 5000);
    return () => clearInterval(id);
  }, []);

  const replay   = useCallback(() => router.push("/password"), [router]);
  const handleDl = useCallback(() => {
    if (isDownloading) return;
    downloadMemoriesZip(setDlProgress).catch(() => setDlProgress(""));
  }, [isDownloading]);

  return (
    <div className={styles.page}>
      <BackgroundEffects />
      <div className={styles.radialGlow} aria-hidden="true" />
      <div className={styles.blobTL}     aria-hidden="true" />
      <div className={styles.blobBR}     aria-hidden="true" />
      <div className={styles.blobTC}     aria-hidden="true" />

      {/* ── Animated stars ── */}
      <div className={styles.starField} aria-hidden="true">
        {STARS.map((s, i) => (
          <motion.span key={i} className={styles.star}
            style={{ top: s.top, left: s.left, fontSize: s.size }}
            initial={{ opacity: 0, scale: 0, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.3 + s.delay, duration: 0.55, ease: [0.34,1.56,0.64,1] }}
          >
            ⭐
          </motion.span>
        ))}
      </div>

      {/* ── Floating hearts layer ── */}
      <div className={styles.heartLayer} aria-hidden="true">
        {HEARTS.map((h, i) => (
          <span key={i} className={styles.floatHeart}
            style={{ left: `${6 + i * 11}%`, animationDelay: `${i * 1.2}s`,
              animationDuration: `${4.5 + i * 0.7}s`, fontSize: `${14 + (i % 3) * 7}px` }}>
            {h}
          </span>
        ))}
      </div>

      {/* ── Main content ── */}
      <main className={styles.main} id="main-content">

        {/* Large heading */}
        <motion.div className={styles.headingWrap}
          initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.34,1.56,0.64,1] }}>
          <h1 className={styles.heading}>
            Hope you liked it&nbsp;❤️
          </h1>
          <motion.p className={styles.subtitle}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
            Made especially for you, with all the love in the world 💕
          </motion.p>
        </motion.div>

        {/* Cute illustration */}
        <motion.div className={styles.illustrationWrap}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.75, ease: [0.34,1.56,0.64,1] }}>
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 3.5, ease: "easeInOut", repeat: Infinity }}>
            <HeroIllustration className={styles.illustration} />
          </motion.div>
        </motion.div>

        {/* ── Action buttons ── */}
        <motion.div className={styles.btnRow}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.55 }}>

          {/* Replay */}
          <motion.button className={styles.primaryBtn} onClick={replay}
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
            <span className={styles.btnShimmer} aria-hidden="true" />
            🔄&nbsp;Replay
          </motion.button>

          {/* Share */}
          <motion.button className={styles.secondaryBtn} onClick={handleShare}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
            📤&nbsp;Share
          </motion.button>

          {/* Download Memories ZIP */}
          <motion.button
            className={styles.secondaryBtn}
            onClick={handleDl}
            disabled={isDownloading}
            whileHover={isDownloading ? {} : { scale: 1.05 }}
            whileTap={isDownloading ? {}  : { scale: 0.96 }}
            aria-label="Download all memories as ZIP"
            style={{ minWidth: "180px", opacity: isDownloading ? 0.75 : 1 }}
          >
            {isDownloading ? (
              <>⏳&nbsp;{dlProgress}</>
            ) : dlProgress === "Done! ✅" ? (
              <>✅&nbsp;Downloaded!</>
            ) : (
              <>💾&nbsp;Download Memories</>
            )}
          </motion.button>
        </motion.div>

        {/* Confetti note */}
        <motion.p className={styles.note}
          initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 0.8 }}>
          ✨ Confetti fires every 5 seconds — enjoy the celebration!
        </motion.p>
      </main>

      {/* ── Footer ── */}
      <motion.footer className={styles.footer}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
        <span>Made with&nbsp;</span>
        <motion.span
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1, ease: "easeInOut", repeat: Infinity }}>
          ❤️
        </motion.span>
        <span>&nbsp;just for you</span>
      </motion.footer>
    </div>
  );
}
