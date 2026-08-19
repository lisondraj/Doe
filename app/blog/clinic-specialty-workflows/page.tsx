import type { Metadata } from "next";

import { AboutStyleArticleRouter } from "@/components/blog/AboutStyleArticleRouter";
import {
  CLINIC_SPECIALTY_WORKFLOWS_ARTICLE,
  CLINIC_SPECIALTY_WORKFLOWS_EXCERPT,
  CLINIC_SPECIALTY_WORKFLOWS_PATH,
  CLINIC_SPECIALTY_WORKFLOWS_TITLE,
} from "@/lib/blog/clinic-specialty-workflows-article";
import { primarySiteOrigin } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

const pageTitle = `${CLINIC_SPECIALTY_WORKFLOWS_TITLE} · Doe`;

export const metadata: Metadata = {
  title: pageTitle,
  description: CLINIC_SPECIALTY_WORKFLOWS_EXCERPT,
  alternates: {
    canonical: `${primarySiteOrigin()}${CLINIC_SPECIALTY_WORKFLOWS_PATH}`,
  },
};

export default function ClinicSpecialtyWorkflowsPage() {
  return <AboutStyleArticleRouter article={CLINIC_SPECIALTY_WORKFLOWS_ARTICLE} />;
}
