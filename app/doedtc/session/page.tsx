import type { Metadata } from "next";

import { DoeDtcSessionView } from "@/components/doedtc/DoeDtcSessionView";
import {
  DOEDTC_LINK_PREVIEW_IMAGE,
  DOEDTC_PAGE_DESCRIPTION,
  DOEDTC_SESSION,
  doeDtcLinkPreviewImageUrl,
  doeDtcPublicOrigin,
} from "@/lib/doedtc/doedtc-copy";
import { getDoeDtcSessionPageData } from "@/lib/doedtc/doedtc-session";
import { DOEDTC_PATH } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ t?: string }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const token = params.t?.trim() ?? "";
  let description = DOEDTC_PAGE_DESCRIPTION;

  if (token) {
    try {
      const session = await getDoeDtcSessionPageData(token);
      if (session?.browserIntent?.trim()) {
        description = session.browserIntent.trim();
      } else if (session?.liveViewUrl) {
        description = "Watch Doe browse live.";
      }
    } catch {
      // Fall back to default metadata when auth/data is unavailable.
    }
  }

  return {
    title: `${DOEDTC_SESSION.pageTitle} · Doe`,
    description,
    openGraph: {
      title: DOEDTC_SESSION.pageTitle,
      description,
      url: `${doeDtcPublicOrigin()}${DOEDTC_PATH}/session`,
      siteName: "Doe",
      images: [
        {
          url: doeDtcLinkPreviewImageUrl(),
          width: DOEDTC_LINK_PREVIEW_IMAGE.width,
          height: DOEDTC_LINK_PREVIEW_IMAGE.height,
          alt: "Doe live session",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: DOEDTC_SESSION.pageTitle,
      description,
      images: [doeDtcLinkPreviewImageUrl()],
    },
  };
}

export default async function DoeDtcSessionPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const token = params.t?.trim() ?? "";
  let session = null;

  if (token) {
    try {
      session = await getDoeDtcSessionPageData(token);
    } catch {
      session = null;
    }
  }

  return <DoeDtcSessionView valid={Boolean(session)} session={session} />;
}
