import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Bellair Laser Clinic · Agent page | Doe",
  description: "Bellair Laser Clinic's agent-readable page, built by Doe from bellairlaserclinic.ca. Claim it to turn it on for personal agents.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#3A2516",
};

export default function IndexConvert2Layout({ children }: { children: ReactNode }) {
  return children;
}
