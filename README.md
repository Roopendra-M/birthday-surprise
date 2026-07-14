# 💕 Birthday Surprise Website

A premium, interactive birthday surprise experience built with **Next.js 16**, **Framer Motion**, and **GSAP**. Features 9 beautifully crafted pages that guide someone through an unforgettable birthday journey.

---

## ✨ Features

| Page | Route | Description |
|------|-------|-------------|
| Password Screen | `/password` | Glassmorphism card with animated lock, shake-on-wrong, success glow |
| Yes / No | `/surprise` | Dodging NO button, growing YES button, heart explosion on confirm |
| Loading Screen | `/reveal` | GSAP puppy swing, rotating messages, animated loading bar |
| Envelope | `/envelope` | 3D flap opening, wax seal, ribbon, canvas-confetti burst |
| Letter | `/letter` | Typewriter animation, editable text, polaroid photos, flower stickers |
| Gift Box | `/gift` | Bow spin-off, lid pop, particle burst, fireworks |
| Gallery | `/gallery` | Carousel with polaroids, lightbox, editable captions, swipe support |
| Ending | `/ending` | Animated gradient heading, stars, confetti every 5s, download memories |

### 🎵 Global Features
- **Music Player** — Floating FAB with animated equalizer, play/pause/mute/volume/loop, localStorage persistence
- **Premium Cursor Effects** — Custom dot + ring cursor, sparkle trail (canvas RAF), floating hearts, double-ripple on click, hover glow on buttons — **auto-disabled on touch devices**

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Animations:** [Framer Motion](https://www.framer.com/motion/) + [GSAP](https://gsap.com/)
- **Confetti:** [canvas-confetti](https://github.com/catdad/canvas-confetti)
- **Styling:** Vanilla CSS Modules + CSS Custom Properties design system
- **Fonts:** Baloo 2, Patrick Hand, Poppins (via Google Fonts)
- **Language:** TypeScript

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Clone or download the project
cd surprise-website

# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at **http://localhost:3000**

### Production Build

```bash
npm run build
npm run start
```

---

## 🎵 Adding Background Music

1. Drop your MP3 file at:
   ```
   public/music/background.mp3
   ```
2. The music player will automatically detect it.
3. Rename the song title in `src/components/ui/MusicPlayer.tsx`:
   ```ts
   const SONG_TITLE = "🎵 Your Song Title Here";
   ```

> **Note:** Browsers block autoplay until the user interacts with the page. The music player respects this — the user must click the 🎵 button to start playback.

---

## 🎨 Customisation

### Changing the Password
Edit `src/components/ui/PasswordCard.tsx`:
```ts
const CORRECT_PASSWORD = "yourpassword";
```

### Editing the Letter
The letter is fully editable in-browser — click the ✏️ Edit button. To change the default, edit `src/components/ui/HandwrittenLetter.tsx`:
```ts
const DEFAULT_LETTER = `Dear Special One, ...`;
```

### Changing Gallery Images
The gallery uses emoji placeholders. To use real photos, replace the `emoji` + `bg` fields in `src/app/gallery/page.tsx`:
```ts
const MEMORIES = [
  { id: 1, emoji: "🎂", caption: "Birthday Wishes!", bg: "...", rot: -3 },
  // ...
];
```

### Design Tokens
All colours, shadows, and animations are centralized in:
- `src/styles/tokens.css` — colour palette, spacing, radii, shadows
- `src/styles/animations.css` — shared animation keyframes
- `src/styles/utilities.css` — shared utility classes

---

## 🌐 Environment Variables

Create a `.env.local` file:

```env
# Used for OpenGraph absolute image URLs
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

---

## 📱 Responsiveness & Accessibility

- ✅ Fully responsive — tested on mobile, tablet, desktop
- ✅ Custom cursor **automatically disabled** on touch devices
- ✅ Skip-to-main-content link for keyboard users
- ✅ ARIA labels on all interactive elements
- ✅ Keyboard navigation (arrow keys in gallery, Escape closes lightbox)
- ✅ Reduced motion respected via `prefers-reduced-motion`
- ✅ Semantic HTML with proper heading hierarchy

---

## 📂 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── password/           # Password screen
│   ├── surprise/           # Yes/No page
│   ├── reveal/             # Loading screen
│   ├── envelope/           # Envelope reveal
│   ├── letter/             # Handwritten letter
│   ├── gift/               # Gift box
│   ├── gallery/            # Memory gallery
│   ├── ending/             # Grand finale
│   ├── layout.tsx          # Root layout (fonts, metadata, global effects)
│   └── globals.css         # Global styles
├── components/
│   ├── effects/            # BackgroundEffects, AnimatedStars, FloatingHearts,
│   │                       # CursorEffects, GlobalEffects
│   └── ui/                 # PasswordCard, Envelope, GiftBox, MusicPlayer,
│                           # HandwrittenLetter, HeroIllustration, YesNoCard…
├── hooks/                  # useIsMounted, useReducedMotion, useWindowSize…
├── styles/                 # tokens.css, animations.css, utilities.css
└── utils/                  # helpers.ts
public/
├── music/                  # background.mp3 (add yours here)
└── og-image.png            # OpenGraph social banner
```

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel --prod
```

Set `NEXT_PUBLIC_SITE_URL` to your production domain in the Vercel dashboard.

### Other Platforms

```bash
npm run build     # Creates .next/
npm run start     # Serves at :3000
```

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## ❤️ Made With Love

This project was crafted with Framer Motion magic, GSAP animations, and a whole lot of ❤️.

*"The best gifts are the ones that make someone smile."*
