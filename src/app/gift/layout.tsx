import type { Metadata } from "next";
export const metadata: Metadata = { title: "Your Gift Awaits 🎁", description: "A pink gift wrapped with love." };
export default function GiftLayout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
