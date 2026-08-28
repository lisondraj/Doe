import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { primarySiteOrigin } from "@/lib/site-domains";

const VOICE_AGENT_PATH = "/voice-agent";

export const metadata: Metadata = {
  title: "OSCE Voice Coach · Doe",
  description:
    "A voice-only OSCE exam prep coach — practice a timed station, or start a learning session on history, DDX, investigations, management, and examiner questions.",
  alternates: {
    canonical: `${primarySiteOrigin()}${VOICE_AGENT_PATH}`,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#120c08",
};

export default function VoiceAgentLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
