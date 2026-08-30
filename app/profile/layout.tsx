import type { Metadata, Viewport } from "next";

import { DOEDTC_OVERFLOW_SURFACE } from "@/lib/doedtc/doedtc-chrome";
import {
  DOEDTC_PAGE_DESCRIPTION,
  DOEDTC_PROFILE,
  DOEDTC_LINK_PREVIEW_IMAGE,
  doeDtcLinkPreviewImageUrl,
} from "@/lib/doedtc/doedtc-copy";
import { lora } from "@/lib/home/fonts";

export const dynamic = "force-dynamic";

const ogImage = doeDtcLinkPreviewImageUrl();

export const metadata: Metadata = {
  title: `${DOEDTC_PROFILE.pageTitle} · Doe`,
  description: DOEDTC_PAGE_DESCRIPTION,
  openGraph: {
    title: DOEDTC_PROFILE.pageTitle,
    description: DOEDTC_PAGE_DESCRIPTION,
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: DOEDTC_OVERFLOW_SURFACE,
};

export default function ProfilePreviewLayout({ children }: { children: React.ReactNode }) {
  return <div className={lora.variable}>{children}</div>;
}
