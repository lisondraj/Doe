import type { Metadata } from "next";

import { BroaderDoeVisionMobileView } from "@/components/blog/BroaderDoeVisionMobileView";
import {
  BROADER_DOE_VISION_OPENING_LEDE,
  BROADER_DOE_VISION_PATH,
  BROADER_DOE_VISION_SUBHEADING,
  BROADER_DOE_VISION_TITLE,
} from "@/lib/blog/broader-doe-vision-article";
import { primarySiteOrigin } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

const pageTitle = `${BROADER_DOE_VISION_TITLE} · Doe`;

export const metadata: Metadata = {
  title: pageTitle,
  description: BROADER_DOE_VISION_OPENING_LEDE,
  alternates: {
    canonical: `${primarySiteOrigin()}${BROADER_DOE_VISION_PATH}`,
  },
};

export default function BroaderDoeVisionPage() {
  return <BroaderDoeVisionMobileView />;
}
