import type { Metadata } from "next";

import { DoeDtcFeedbackPageClient } from "@/components/doedtc/DoeDtcFeedbackPageClient";
import { getDoeDtcProfileSnapshot, getDoeDtcUserByCareToken } from "@/lib/doedtc/doedtc-db";
import {
  DOEDTC_FEEDBACK,
  DOEDTC_LINK_PREVIEW_IMAGE,
  DOEDTC_PAGE_DESCRIPTION,
  doeDtcLinkPreviewImageUrl,
  doeDtcPublicOrigin,
} from "@/lib/doedtc/doedtc-copy";
import type { DoeDtcProfileSnapshot } from "@/lib/doedtc/doedtc-types";
import { DOEDTC_PATH } from "@/lib/site-domains";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const ogImage = doeDtcLinkPreviewImageUrl();

export const metadata: Metadata = {
  title: `${DOEDTC_FEEDBACK.pageTitle} · Doe`,
  description: DOEDTC_PAGE_DESCRIPTION,
  openGraph: {
    title: DOEDTC_FEEDBACK.pageTitle,
    description: DOEDTC_FEEDBACK.subtitle,
    url: `${doeDtcPublicOrigin()}${DOEDTC_PATH}/feedback`,
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
    title: DOEDTC_FEEDBACK.pageTitle,
    description: DOEDTC_FEEDBACK.subtitle,
    images: [ogImage],
  },
};

type PageProps = {
  searchParams: Promise<{ t?: string; ticket?: string }>;
};

export default async function DoeDtcFeedbackPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const token = params.t?.trim() ?? "";
  const focusedTicketId = params.ticket?.trim() || null;

  let valid = false;
  let snapshot: DoeDtcProfileSnapshot | null = null;

  if (token) {
    try {
      const user = await getDoeDtcUserByCareToken(token);
      valid = Boolean(user);
      if (user) {
        snapshot = await getDoeDtcProfileSnapshot(user.id);
      }
    } catch {
      valid = false;
      snapshot = null;
    }
  }

  return (
    <DoeDtcFeedbackPageClient
      token={token}
      valid={valid}
      initialSnapshot={snapshot}
      focusedTicketId={focusedTicketId}
    />
  );
}
