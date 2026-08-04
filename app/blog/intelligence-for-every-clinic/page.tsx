import type { Metadata } from "next";

import { AboutStyleArticleRouter } from "@/components/blog/AboutStyleArticleRouter";
import {
  INTELLIGENCE_FOR_EVERY_CLINIC_ARTICLE,
  INTELLIGENCE_FOR_EVERY_CLINIC_EXCERPT,
  INTELLIGENCE_FOR_EVERY_CLINIC_PATH,
  INTELLIGENCE_FOR_EVERY_CLINIC_TITLE,
} from "@/lib/blog/intelligence-for-every-clinic-article";
import { primarySiteOrigin } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

const pageTitle = `${INTELLIGENCE_FOR_EVERY_CLINIC_TITLE} · Doe`;

export const metadata: Metadata = {
  title: pageTitle,
  description: INTELLIGENCE_FOR_EVERY_CLINIC_EXCERPT,
  alternates: {
    canonical: `${primarySiteOrigin()}${INTELLIGENCE_FOR_EVERY_CLINIC_PATH}`,
  },
};

export default function IntelligenceForEveryClinicPage() {
  return <AboutStyleArticleRouter article={INTELLIGENCE_FOR_EVERY_CLINIC_ARTICLE} />;
}
