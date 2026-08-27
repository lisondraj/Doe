import type { Metadata } from "next";

import { VoiceAgentView } from "@/components/voice-agent/VoiceAgentView";
import { primarySiteOrigin } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

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

export default function VoiceAgentPage() {
  return <VoiceAgentView />;
}
