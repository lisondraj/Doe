import type { Metadata } from "next";

import { DoeHealthProductNavPage } from "@/components/doehealth-product-nav/DoeHealthProductNavPage";
import { doehealthDesk2InitialVariant } from "@/lib/doehealthdesk2/doehealthdesk2-initial-variant";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Doe Product",
  description: "The Doe product for clinics and their patients' personal agents.",
};

export default function ProductNavRoute() {
  return <DoeHealthProductNavPage initialVariant={doehealthDesk2InitialVariant()} />;
}
