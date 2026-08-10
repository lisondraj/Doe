import type { Metadata } from "next";

import { PremedRouter } from "@/components/premed/PremedRouter";
import {
  BROADER_DOE_VISION_OPENING_LEDE,
} from "@/lib/blog/broader-doe-vision-article";
import {
  PREMED_PAGE_TITLE,
} from "@/lib/premed/premed-copy";
import { premedPageUrl } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

const pageTitle = `${PREMED_PAGE_TITLE} · Doe`;

export const metadata: Metadata = {
  title: pageTitle,
  description: BROADER_DOE_VISION_OPENING_LEDE,
  alternates: {
    canonical: premedPageUrl(),
  },
};

export default function PremedPage() {
  return <PremedRouter />;
}
