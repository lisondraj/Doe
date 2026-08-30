import type { Metadata } from "next";

import { DoeDtcWorkView } from "@/components/doedtc/DoeDtcWorkView";
import { getDoeDtcWorkPreview } from "@/lib/doedtc/doedtc-browser-db";
import {
  DOEDTC_PAGE_DESCRIPTION,
  DOEDTC_WORK,
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
          width: 1200,
          height: 630,
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
