import type { Metadata } from "next";

import { AboutStyleBlankPageRouter } from "@/components/about/AboutStyleBlankPageRouter";
import { ABOUT_STYLE_BLANK_PAGE_LABELS } from "@/lib/about/about-style-blank-pages";
import { PITCHDECK_PATH, primarySiteOrigin } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

const pageTitle = `${ABOUT_STYLE_BLANK_PAGE_LABELS[PITCHDECK_PATH]} · Doe`;

export const metadata: Metadata = {
  title: pageTitle,
  description: "Doe pitch deck.",
  alternates: {
    canonical: `${primarySiteOrigin()}${PITCHDECK_PATH}`,
  },
};

export default function PitchDeckPage() {
  return <AboutStyleBlankPageRouter ariaLabel={ABOUT_STYLE_BLANK_PAGE_LABELS[PITCHDECK_PATH]} />;
}
