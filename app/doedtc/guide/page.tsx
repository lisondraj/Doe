import type { Metadata } from "next";

import { DoeDtcGuidePageClient } from "@/components/doedtc/DoeDtcGuidePageClient";
import { getDoeDtcUserByCareToken } from "@/lib/doedtc/doedtc-db";
import { getDoeDtcGuideById } from "@/lib/doedtc/doedtc-guides-db";
import {
  DOEDTC_GUIDE,
  DOEDTC_LINK_PREVIEW_IMAGE,
  DOEDTC_PAGE_DESCRIPTION,
  doeDtcLinkPreviewImageUrl,
  doeDtcPublicOrigin,
} from "@/lib/doedtc/doedtc-copy";
import type { DoeDtcGuideRow } from "@/lib/doedtc/doedtc-types";
import { DOEDTC_PATH } from "@/lib/site-domains";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const ogImage = doeDtcLinkPreviewImageUrl();

export const metadata: Metadata = {
  title: `${DOEDTC_GUIDE.pageTitle} · Doe`,
  description: DOEDTC_PAGE_DESCRIPTION,
  openGraph: {
    title: DOEDTC_GUIDE.pageTitle,
    description: DOEDTC_GUIDE.subtitle,
    url: `${doeDtcPublicOrigin()}${DOEDTC_PATH}/guide`,
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
};

type PageProps = {
  searchParams: Promise<{ t?: string; g?: string }>;
};

export default async function DoeDtcGuidePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const token = params.t?.trim() ?? "";
  const guideId = params.g?.trim() ?? "";

  let valid = false;
  let guide: DoeDtcGuideRow | null = null;

  if (token && guideId) {
    try {
      const user = await getDoeDtcUserByCareToken(token);
      valid = Boolean(user);
      if (user) {
        guide = await getDoeDtcGuideById({ userId: user.id, guideId });
      }
    } catch {
      valid = false;
      guide = null;
    }
  }

  return <DoeDtcGuidePageClient token={token} valid={valid} guide={guide} />;
}
