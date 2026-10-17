import type { Metadata } from "next";

import { EarlyPreviewPage } from "@/components/earlypreview/EarlyPreviewPage";
import { doehealthDesk2InitialVariant } from "@/lib/doehealthdesk2/doehealthdesk2-initial-variant";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Early Preview · Doe",
  description: "An early look at Doe for clinics and their patients' personal agents.",
};

export default function EarlyPreviewRoute() {
  return <EarlyPreviewPage initialVariant={doehealthDesk2InitialVariant()} />;
}
