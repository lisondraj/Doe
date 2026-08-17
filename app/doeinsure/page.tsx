import type { Metadata } from "next";

import { DoeInsureRouter } from "@/components/doeinsure/DoeInsureRouter";
import {
  DOEINSURE_PAGE_DESCRIPTION,
  DOEINSURE_PAGE_TITLE,
} from "@/lib/doeinsure/doeinsure-copy";
import { DOEINSURE_PATH, primarySiteOrigin } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${DOEINSURE_PAGE_TITLE} · Doe`,
  description: DOEINSURE_PAGE_DESCRIPTION,
  alternates: {
    canonical: `${primarySiteOrigin()}${DOEINSURE_PATH}`,
  },
};

export default function DoeInsurePage() {
  return <DoeInsureRouter />;
}
