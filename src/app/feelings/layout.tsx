import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "One Last Thing... ❤️",
  description: "A little space to share what's in your heart.",
};

export default function FeelingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
