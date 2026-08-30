import type { Metadata } from "next";

import { DoeDtcViewPageClient } from "@/components/doedtc/DoeDtcViewPageClient";
import {
  DOEDTC_LINK_PREVIEW_IMAGE,
  DOEDTC_PAGE_DESCRIPTION,
  DOEDTC_VIEW,
  doeDtcLinkPreviewImageUrl,
  doeDtcPublicOrigin,
} from "@/lib/doedtc/doedtc-copy";
import { DOEDTC_PATH } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

const ogImage = doeDtcLinkPreviewImageUrl();

export const metadata: Metadata = {
  title: `${DOEDTC_VIEW.pageTitle} · Doe`,
  description: DOEDTC_PAGE_DESCRIPTION,
  openGraph: {
    title: DOEDTC_VIEW.pageTitle,
    description: DOEDTC_VIEW.subtitle,
    url: `${doeDtcPublicOrigin()}${DOEDTC_PATH}/view`,
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

export default function DoeDtcViewPage() {
  return <DoeDtcViewPageClient />;
}
