import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import type { ReactNode } from "react";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-dm-sans" });

export const metadata: Metadata = {
  title: "Ford Plastic Surgery · Agent page | Doe",
  description: "Ford Plastic Surgery's agent-readable page, built by Doe from fordplasticsurgery.com. Claim it to switch it on for personal agents.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#FFFCF1",
};

export default function IndexConvertLayout({ children }: { children: ReactNode }) {
  return <div className={dmSans.variable}>{children}</div>;
}
