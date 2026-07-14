import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Getting Your Surprise Ready... 🎀",
  description: "Wrapping something extra special just for you.",
};

export default function RevealLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
