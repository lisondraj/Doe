import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  /** Link previews need absolute image URLs. */
  metadataBase: new URL("https://doehealth.care"),
  title: "Doe | Dr. Brooks' Migraine Clinic",
  description: "Botox for chronic migraine in Toronto. Personal agents book directly through Doe.",
  openGraph: {
    siteName: "Doe",
    title: "Doe | Dr. Brooks' Migraine Clinic",
    description: "Botox for chronic migraine in Toronto. Personal agents book directly through Doe.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#3A2516",
};

export default function DemoLayout({ children }: { children: ReactNode }) {
  return children;
}
