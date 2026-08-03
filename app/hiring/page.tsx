import type { Metadata } from "next";

import { AboutStyleBlankPageRouter } from "@/components/about/AboutStyleBlankPageRouter";
import { ABOUT_STYLE_BLANK_PAGE_LABELS } from "@/lib/about/about-style-blank-pages";
import { HIRING_PATH, primarySiteOrigin } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

const pageTitle = `${ABOUT_STYLE_BLANK_PAGE_LABELS[HIRING_PATH]} · Doe`;

export const metadata: Metadata = {
  title: pageTitle,
  description: "Careers at Doe.",
  alternates: {
    canonical: `${primarySiteOrigin()}${HIRING_PATH}`,
  },
};

export default function HiringPage() {
  return <AboutStyleBlankPageRouter ariaLabel={ABOUT_STYLE_BLANK_PAGE_LABELS[HIRING_PATH]} />;
}
