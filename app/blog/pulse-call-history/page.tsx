import type { Metadata } from "next";

import { AboutStyleArticleRouter } from "@/components/blog/AboutStyleArticleRouter";
import {
  PULSE_CALL_HISTORY_ARTICLE,
  PULSE_CALL_HISTORY_EXCERPT,
  PULSE_CALL_HISTORY_PATH,
  PULSE_CALL_HISTORY_TITLE,
} from "@/lib/blog/pulse-call-history-article";
import { primarySiteOrigin } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

const pageTitle = `${PULSE_CALL_HISTORY_TITLE} · Doe`;

export const metadata: Metadata = {
  title: pageTitle,
  description: PULSE_CALL_HISTORY_EXCERPT,
  alternates: {
    canonical: `${primarySiteOrigin()}${PULSE_CALL_HISTORY_PATH}`,
  },
};

export default function PulseCallHistoryPage() {
  return <AboutStyleArticleRouter article={PULSE_CALL_HISTORY_ARTICLE} />;
}
