import type { Metadata, Viewport } from "next";
import { Baloo_2, Patrick_Hand, Poppins } from "next/font/google";
import GlobalEffects from "@/components/effects/GlobalEffects";
import "./globals.css";

/* ── Fonts ──────────────────────────────────────────────── */
const baloo2 = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const patrickHand = Patrick_Hand({
  variable: "--font-patrick",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

/* ── Viewport ───────────────────────────────────────────── */
export const viewport: Viewport = {
  themeColor: "#f97bb8",
  width: "device-width",
  initialScale: 1,
};

/* ── Metadata ───────────────────────────────────────────── */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: "A Little Surprise For You 💕",
    template: "%s | Surprise 💕",
  },
  description:
    "Something magical is waiting for you. A beautiful, interactive birthday surprise experience made with love.",
  keywords: ["surprise", "birthday", "celebration", "special", "love", "gift", "envelope"],
  authors: [{ name: "Made with ❤️" }],
  robots: { index: false, follow: false },

  /* ── OpenGraph ── */
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "A Little Surprise",
    title: "A Little Surprise For You 💕",
    description:
      "Something magical is waiting for you. Open your gift with love.",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "A Little Surprise For You — Birthday celebration banner",
      },
    ],
  },

  /* ── Twitter / X ── */
  twitter: {
    card: "summary_large_image",
    title: "A Little Surprise For You 💕",
    description: "Something magical is waiting for you. Open your gift with love.",
    images: [`${SITE_URL}/og-image.png`],
  },

  /* ── Icons ── */
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

/* ── Root Layout ────────────────────────────────────────── */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={[
        baloo2.variable,
        patrickHand.variable,
        poppins.variable,
        "h-full antialiased",
      ].join(" ")}
    >
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>


        {children}

        {/* Global site-wide effects: music player + premium cursor */}
        <GlobalEffects />
      </body>
    </html>
  );
}
