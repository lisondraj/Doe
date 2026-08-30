import type { Metadata } from "next";

import { DoeDtcWorkView } from "@/components/doedtc/DoeDtcWorkView";
import { getDoeDtcWorkPreview } from "@/lib/doedtc/doedtc-browser-db";
import {
  DOEDTC_PAGE_DESCRIPTION,
  DOEDTC_WORK,
  DOEDTC_LINK_PREVIEW_IMAGE,
  doeDtcLinkPreviewImageUrl,
  doeDtcPublicOrigin,
} from "@/lib/doedtc/doedtc-copy";
import { DOEDTC_PATH } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ t?: string }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const token = params.t?.trim() ?? "";
  const preview = token ? await getDoeDtcWorkPreview(token) : null;
  const ogImage = preview?.imageUrl || doeDtcLinkPreviewImageUrl();

  return {
    title: `${DOEDTC_WORK.pageTitle} · Doe`,
    description: DOEDTC_PAGE_DESCRIPTION,
    openGraph: {
      title: DOEDTC_WORK.pageTitle,
      description: preview?.caption || DOEDTC_PAGE_DESCRIPTION,
      url: `${doeDtcPublicOrigin()}${DOEDTC_PATH}/work`,
      siteName: "Doe",
      images: [
        {
          url: ogImage,
          width: preview?.imageUrl ? 1200 : DOEDTC_LINK_PREVIEW_IMAGE.width,
          height: preview?.imageUrl ? 630 : DOEDTC_LINK_PREVIEW_IMAGE.height,
          alt: preview?.caption || "Doe browser preview",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: DOEDTC_WORK.pageTitle,
      description: preview?.caption || DOEDTC_PAGE_DESCRIPTION,
      images: [ogImage],
    },
  };
}

export default async function DoeDtcWorkPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const token = params.t?.trim() ?? "";
  const preview = token ? await getDoeDtcWorkPreview(token) : null;

  return <DoeDtcWorkView valid={Boolean(preview)} preview={preview} />;
}
