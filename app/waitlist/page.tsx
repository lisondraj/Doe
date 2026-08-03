import type { Metadata } from "next";

import { AboutStyleBlankPageRouter } from "@/components/about/AboutStyleBlankPageRouter";
import { ABOUT_STYLE_BLANK_PAGE_LABELS } from "@/lib/about/about-style-blank-pages";
import { primarySiteOrigin, WAITLIST_PATH } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

const pageTitle = `${ABOUT_STYLE_BLANK_PAGE_LABELS[WAITLIST_PATH]} · Doe`;

export const metadata: Metadata = {
  title: pageTitle,
  description: "Join the Doe waitlist.",
  alternates: {
    canonical: `${primarySiteOrigin()}${WAITLIST_PATH}`,
  },
};

export default function WaitlistPage() {
  return <AboutStyleBlankPageRouter ariaLabel={ABOUT_STYLE_BLANK_PAGE_LABELS[WAITLIST_PATH]} />;
}
