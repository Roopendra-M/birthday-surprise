import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Surprise Awaits 💌",
  description: "A very special surprise wrapped with love just for you.",
};

export default function EnvelopeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
