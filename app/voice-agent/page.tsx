import type { Metadata } from "next";

import { VoiceAgentView } from "@/components/voice-agent/VoiceAgentView";
import { primarySiteOrigin } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

const VOICE_AGENT_PATH = "/voice-agent";

export const metadata: Metadata = {
  title: "OSCE Voice Coach · Doe",
  description:
    "A voice-only OSCE exam prep coach — configure your station by voice, run a timed history, physical exam, or management & counseling station, then get a spoken debrief.",
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
