import type { Metadata } from "next";

import { AboutStyleArticleRouter } from "@/components/blog/AboutStyleArticleRouter";
import {
  FEDERATED_CLINIC_INTELLIGENCE_ARTICLE,
  FEDERATED_CLINIC_INTELLIGENCE_EXCERPT,
  FEDERATED_CLINIC_INTELLIGENCE_PATH,
  FEDERATED_CLINIC_INTELLIGENCE_TITLE,
} from "@/lib/blog/federated-clinic-intelligence-article";
import { primarySiteOrigin } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

const pageTitle = `${FEDERATED_CLINIC_INTELLIGENCE_TITLE} · Doe`;

export const metadata: Metadata = {
  title: pageTitle,
  description: FEDERATED_CLINIC_INTELLIGENCE_EXCERPT,
  alternates: {
    canonical: `${primarySiteOrigin()}${FEDERATED_CLINIC_INTELLIGENCE_PATH}`,
  },
};

export default function FederatedClinicIntelligencePage() {
  return <AboutStyleArticleRouter article={FEDERATED_CLINIC_INTELLIGENCE_ARTICLE} />;
}
