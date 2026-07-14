import type { Metadata } from "next";
export const metadata: Metadata = { title: "Memory Gallery 📸", description: "A gallery of beautiful memories." };
export default function GalleryLayout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
