import type { Metadata } from "next";

import { DoeHealthCareersPage } from "@/components/doehealth-careers/DoeHealthCareersPage";
import { doehealthDesk2InitialVariant } from "@/lib/doehealthdesk2/doehealthdesk2-initial-variant";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Doe Careers | Open Roles",
  description:
    "Open roles at Doe, the infrastructure for personal agents and healthcare organizations, with AI tools built for providers in every discipline.",
};

export default function CareersRoute() {
  return <DoeHealthCareersPage initialVariant={doehealthDesk2InitialVariant()} />;
}
