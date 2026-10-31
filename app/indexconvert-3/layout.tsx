import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Complete Dental Care · Agent page | Doe",
  description: "Complete Dental Care's agent-readable page, built by Doe from completedentalcareaz.com. Claim it to turn it on for personal agents.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#3A2516",
};

export default function IndexConvert3Layout({ children }: { children: ReactNode }) {
  return children;
}
