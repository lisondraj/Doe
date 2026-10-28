import type { Metadata } from "next";

import { ServicesPage } from "@/components/services/ServicesPage";
import { doehealthDesk2InitialVariant } from "@/lib/doehealthdesk2/doehealthdesk2-initial-variant";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Doe | Services",
  description: "Doe for the service economy: contractors, cleaning, yard work, auto and every trade in between.",
  robots: { index: false, follow: false },
};

export default function ServicesRoute() {
  return <ServicesPage initialVariant={doehealthDesk2InitialVariant()} />;
}
