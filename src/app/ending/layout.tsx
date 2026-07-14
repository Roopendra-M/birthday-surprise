import type { Metadata } from "next";
export const metadata: Metadata = { title: "Hope you liked it ❤️", description: "A special ending to a magical surprise." };
export default function EndingLayout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
