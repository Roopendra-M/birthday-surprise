import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Memory Theater 🎬",
  description: "A cinematic collection of our most cherished moments, playing just for you.",
};

export default function MemoryTheaterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
