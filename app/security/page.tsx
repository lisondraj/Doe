import type { Metadata } from "next";

import { DoeHealthSecurityPage } from "@/components/doehealth-security/DoeHealthSecurityPage";
import { doehealthDesk2InitialVariant } from "@/lib/doehealthdesk2/doehealthdesk2-initial-variant";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Security · Doe",
  description: "How Doe protects the calls, records, and access your clinic depends on.",
};

export default function SecurityRoute() {
  return <DoeHealthSecurityPage initialVariant={doehealthDesk2InitialVariant()} />;
}
