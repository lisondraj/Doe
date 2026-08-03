import type { Metadata } from "next";

import { AboutStyleArticleRouter } from "@/components/blog/AboutStyleArticleRouter";
import {
  INTRODUCING_PULSE_ARTICLE,
  INTRODUCING_PULSE_EXCERPT,
  INTRODUCING_PULSE_PATH,
  INTRODUCING_PULSE_TITLE,
} from "@/lib/blog/introducing-pulse-article";
import { primarySiteOrigin } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

const pageTitle = `${INTRODUCING_PULSE_TITLE} · Doe`;

export const metadata: Metadata = {
  title: pageTitle,
  description: INTRODUCING_PULSE_EXCERPT,
  alternates: {
    canonical: `${primarySiteOrigin()}${INTRODUCING_PULSE_PATH}`,
  },
};

export default function IntroducingPulsePage() {
  return <AboutStyleArticleRouter article={INTRODUCING_PULSE_ARTICLE} />;
}
