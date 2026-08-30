import type { Metadata, Viewport } from "next";

import { DOEDTC_OVERFLOW_SURFACE } from "@/lib/doedtc/doedtc-chrome";
import {
  DOEDTC_PAGE_DESCRIPTION,
  DOEDTC_PAGE_TITLE,
  DOEDTC_LINK_PREVIEW_IMAGE,
  doeDtcLinkPreviewImageUrl,
  doeDtcPublicOrigin,
} from "@/lib/doedtc/doedtc-copy";
import { DOEDTC_PATH } from "@/lib/site-domains";
import { lora } from "@/lib/home/fonts";

export const dynamic = "force-dynamic";

const ogImage = doeDtcLinkPreviewImageUrl();

export const metadata: Metadata = {
  title: `${DOEDTC_PAGE_TITLE} · Doe`,
  description: DOEDTC_PAGE_DESCRIPTION,
  openGraph: {
    title: DOEDTC_PAGE_TITLE,
    description: DOEDTC_PAGE_DESCRIPTION,
    url: `${doeDtcPublicOrigin()}${DOEDTC_PATH}`,
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
    title: DOEDTC_PAGE_TITLE,
    description: DOEDTC_PAGE_DESCRIPTION,
    images: [ogImage],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: DOEDTC_OVERFLOW_SURFACE,
};

export default function DoeDtcLayout({ children }: { children: React.ReactNode }) {
  return <div className={lora.variable}>{children}</div>;
}
