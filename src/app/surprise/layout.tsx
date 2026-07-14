import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Do You Want To See Your Surprise? 🎁",
  description: "A little question before the big reveal...",
};

export default function SurpriseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
