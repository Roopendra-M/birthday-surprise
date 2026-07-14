import type { Metadata } from "next";
export const metadata: Metadata = { title: "A Letter Just for You 💌", description: "A heartfelt handwritten letter." };
export default function LetterLayout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
