import type { Metadata } from "next";

import { AboutStyleArticleRouter } from "@/components/blog/AboutStyleArticleRouter";
import {
  BLENDED_INTELLIGENCE_ARTICLE,
  BLENDED_INTELLIGENCE_EXCERPT,
  BLENDED_INTELLIGENCE_PATH,
  BLENDED_INTELLIGENCE_TITLE,
} from "@/lib/blog/blended-intelligence-article";
import { primarySiteOrigin } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

const pageTitle = `${BLENDED_INTELLIGENCE_TITLE} · Doe`;

export const metadata: Metadata = {
  title: pageTitle,
  description: BLENDED_INTELLIGENCE_EXCERPT,
  alternates: {
    canonical: `${primarySiteOrigin()}${BLENDED_INTELLIGENCE_PATH}`,
  },
};

export default function BlendedIntelligencePage() {
  return <AboutStyleArticleRouter article={BLENDED_INTELLIGENCE_ARTICLE} />;
}
