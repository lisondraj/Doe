import type { Metadata } from "next";

import { DoeDtcArtifactSharePageClient } from "@/components/doedtc/DoeDtcArtifactSharePageClient";
import { getDoeDtcArtifactByShareToken } from "@/lib/doedtc/doedtc-db";
import {
  DOEDTC_ARTIFACT,
  DOEDTC_LINK_PREVIEW_IMAGE,
  DOEDTC_PAGE_DESCRIPTION,
  doeDtcLinkPreviewImageUrl,
  doeDtcPublicOrigin,
} from "@/lib/doedtc/doedtc-copy";
import type { DoeDtcArtifactEntryRow, DoeDtcArtifactRow } from "@/lib/doedtc/doedtc-types";
import { DOEDTC_PATH } from "@/lib/site-domains";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const ogImage = doeDtcLinkPreviewImageUrl();

export const metadata: Metadata = {
  title: `${DOEDTC_ARTIFACT.pageTitle} · Doe`,
  description: DOEDTC_PAGE_DESCRIPTION,
  openGraph: {
    title: DOEDTC_ARTIFACT.pageTitle,
    description: DOEDTC_ARTIFACT.subtitle,
    url: `${doeDtcPublicOrigin()}${DOEDTC_PATH}/artifact`,
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
  searchParams: Promise<{ s?: string }>;
};

export default async function DoeDtcArtifactSharePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const shareToken = params.s?.trim() ?? "";

  let valid = false;
  let artifact: DoeDtcArtifactRow | null = null;
  let entries: DoeDtcArtifactEntryRow[] = [];

  if (shareToken) {
    try {
      const result = await getDoeDtcArtifactByShareToken(shareToken);
      valid = Boolean(result);
      if (result) {
        artifact = result.artifact;
        entries = result.entries;
      }
    } catch {
      valid = false;
      artifact = null;
      entries = [];
    }
  }

  return (
    <DoeDtcArtifactSharePageClient valid={valid} artifact={artifact} entries={entries} />
  );
}
