import type { Metadata } from "next";

import { DoeHealthPricingPage } from "@/components/doehealth-pricing/DoeHealthPricingPage";
import { doehealthDesk2InitialVariant } from "@/lib/doehealthdesk2/doehealthdesk2-initial-variant";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Doe | Pricing",
  description: "Plans for solo providers, clinics, and multi-location groups, priced to the size of your practice.",
};

export default function PricingRoute() {
  return <DoeHealthPricingPage initialVariant={doehealthDesk2InitialVariant()} />;
}
