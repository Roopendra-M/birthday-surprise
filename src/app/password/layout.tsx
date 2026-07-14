import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "A Little Surprise For You 💌",
  description: "Enter the secret password to unlock your surprise.",
};

export default function PasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
