import type { Metadata } from "next";

import { ClinicSpecialtyWorkflowsArticle } from "@/components/blog/ClinicSpecialtyWorkflowsArticle";
import {
  CLINIC_SPECIALTY_WORKFLOWS_DESCRIPTION,
  CLINIC_SPECIALTY_WORKFLOWS_PATH,
  CLINIC_SPECIALTY_WORKFLOWS_TITLE,
} from "@/lib/blog/clinic-specialty-workflows-article";
import { primarySiteOrigin } from "@/lib/site-domains";

export const metadata: Metadata = {
  title: `${CLINIC_SPECIALTY_WORKFLOWS_TITLE} · Doe`,
  description: CLINIC_SPECIALTY_WORKFLOWS_DESCRIPTION,
  alternates: {
    canonical: `${primarySiteOrigin()}${CLINIC_SPECIALTY_WORKFLOWS_PATH}`,
  },
};

export default function ClinicSpecialtyWorkflowsPage() {
  return <ClinicSpecialtyWorkflowsArticle />;
}
