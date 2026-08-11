import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { CampusAmbassadorRouter } from "@/components/join/CampusAmbassadorRouter";
import {
  CAMPUS_AMBASSADOR_OPENING_PARAGRAPH,
  CAMPUS_AMBASSADOR_PAGE_TITLE,
} from "@/lib/join/campus-ambassador-copy";
import { joinCampusPageHostAllowed } from "@/lib/join/join-campus-page-path";
import { joinPageUrl, requestHostFromHeaders } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

const pageTitle = `${CAMPUS_AMBASSADOR_PAGE_TITLE} · Doe`;

export const metadata: Metadata = {
  title: pageTitle,
  description: CAMPUS_AMBASSADOR_OPENING_PARAGRAPH,
  alternates: {
    canonical: joinPageUrl(),
  },
};

export default function JoinPage() {
  const host = requestHostFromHeaders(headers());

  if (!joinCampusPageHostAllowed(host)) {
    redirect(joinPageUrl());
  }

  return <CampusAmbassadorRouter />;
}
