import type { Metadata } from "next";

import { DoeHealthCareersPage } from "@/components/doehealth-careers/DoeHealthCareersPage";
import { doehealthDesk2InitialVariant } from "@/lib/doehealthdesk2/doehealthdesk2-initial-variant";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Doe | Founding Team",
  description: "We're building Doe's founding team and gathering interest. Tell us the role you'd want, and we'll reach out as it opens.",
  robots: { index: false, follow: false },
};

/** /jobs: /careers as an indication of interest for Doe's founding team. */
export default function JobsRoute() {
  return <DoeHealthCareersPage initialVariant={doehealthDesk2InitialVariant()} jobs />;
}
