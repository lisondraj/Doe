import type { Metadata } from "next";

import { DoeDtcProfileApp } from "@/components/doedtc/DoeDtcProfileApp";
import { getDoeDtcProfileSnapshot, getDoeDtcUserByCareToken } from "@/lib/doedtc/doedtc-db";
import {
  DOEDTC_PAGE_DESCRIPTION,
  DOEDTC_PROFILE,
  DOEDTC_LINK_PREVIEW_IMAGE,
  doeDtcLinkPreviewImageUrl,
  doeDtcPublicOrigin,
} from "@/lib/doedtc/doedtc-copy";
import type { DoeDtcProfileSnapshot, DoeDtcProfileTab } from "@/lib/doedtc/doedtc-types";
import { DOEDTC_PATH } from "@/lib/site-domains";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const ogImage = doeDtcLinkPreviewImageUrl();

export const metadata: Metadata = {
  title: `${DOEDTC_PROFILE.pageTitle} · Doe`,
  description: DOEDTC_PAGE_DESCRIPTION,
  openGraph: {
    title: DOEDTC_PROFILE.pageTitle,
    description: DOEDTC_PAGE_DESCRIPTION,
    url: `${doeDtcPublicOrigin()}${DOEDTC_PATH}/app`,
    siteName: "Doe",
    images: [
      {
        url: ogImage,
        width: DOEDTC_LINK_PREVIEW_IMAGE.width,
        height: DOEDTC_LINK_PREVIEW_IMAGE.height,
        alt: "Doe",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: DOEDTC_PROFILE.pageTitle,
    description: DOEDTC_PAGE_DESCRIPTION,
    images: [ogImage],
  },
};

const VALID_TABS = new Set<DoeDtcProfileTab>([
  "dashboard",
  "appointments",
  "results",
  "conditions",
  "family",
  "locker",
  "share",
  "trackers",
  "guides",
  "accountability",
  "feedback",
]);

type PageProps = {
  searchParams: Promise<{ t?: string; tab?: string; artifact?: string; ticket?: string; guide?: string; member?: string }>;
};

export default async function DoeDtcAppPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const token = params.t?.trim() ?? "";
  const tabParam = params.tab?.trim() ?? "dashboard";
  const initialTab = VALID_TABS.has(tabParam as DoeDtcProfileTab)
    ? (tabParam as DoeDtcProfileTab)
    : "dashboard";
  const initialArtifactId = params.artifact?.trim() || null;
  const initialTicketId = params.ticket?.trim() || null;
  const initialGuideId = params.guide?.trim() || null;
  const viewingMemberUserId = params.member?.trim() || null;

  let valid = false;
  let snapshot: DoeDtcProfileSnapshot | null = null;

  if (token) {
    try {
      const user = await getDoeDtcUserByCareToken(token);
      valid = Boolean(user);
      if (user) {
        const subjectUserId = viewingMemberUserId || user.id;
        snapshot = await getDoeDtcProfileSnapshot(subjectUserId, { viewerUserId: user.id });
      }
    } catch {
      valid = false;
      snapshot = null;
    }
  }

  return (
    <DoeDtcProfileApp
      token={token}
      valid={valid}
      initialSnapshot={snapshot}
      initialTab={initialTab}
      initialArtifactId={initialArtifactId}
      initialTicketId={initialTicketId}
      initialGuideId={initialGuideId}
      viewingMemberUserId={viewingMemberUserId}
    />
  );
}
