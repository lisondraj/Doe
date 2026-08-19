import type { Metadata } from "next";

import { ClinicSpecialtyWorkflowsArticle } from "@/components/blog/ClinicSpecialtyWorkflowsArticle";
import { primarySiteOrigin } from "@/lib/site-domains";

const path = "/blog/clinic-specialty-workflows";
const title = "Built for the way each clinic practices · Doe";
const description =
  "How Doe is being built for diagnostic imaging, endocrine and weight management, aesthetic care, home care, concierge medicine, and other specialty clinic workflows.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: `${primarySiteOrigin()}${path}`,
  },
};

export default function ClinicSpecialtyWorkflowsPage() {
  return <ClinicSpecialtyWorkflowsArticle />;
}
