import type { Metadata } from "next";

import { AboutRouter } from "@/components/about/AboutRouter";
import {
  DOE_MISSION_EXCERPT,
  DOE_MISSION_PATH,
  DOE_MISSION_TITLE,
} from "@/lib/blog/doe-mission-article";
import { primarySiteOrigin } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

const pageTitle = `${DOE_MISSION_TITLE} · Doe`;

export const metadata: Metadata = {
  title: pageTitle,
  description: DOE_MISSION_EXCERPT,
  alternates: {
    canonical: `${primarySiteOrigin()}${DOE_MISSION_PATH}`,
  },
};

export default function DoeMissionBlogPage() {
  return <AboutRouter />;
}
