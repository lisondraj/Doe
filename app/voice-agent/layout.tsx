import type { Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#120c08",
};

export default function VoiceAgentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
