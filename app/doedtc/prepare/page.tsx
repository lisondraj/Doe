import type { Metadata } from "next";

import { DoeDtcPreparePageClient } from "@/components/doedtc/DoeDtcPreparePageClient";
import { getDoeDtcPreparationById, getDoeDtcUserByCareToken } from "@/lib/doedtc/doedtc-db";
import {
  DOEDTC_LINK_PREVIEW_IMAGE,
  DOEDTC_PAGE_DESCRIPTION,
  DOEDTC_PREPARE,
  doeDtcLinkPreviewImageUrl,
  doeDtcPublicOrigin,
} from "@/lib/doedtc/doedtc-copy";
import type { DoeDtcPreparationRow } from "@/lib/doedtc/doedtc-types";
import { DOEDTC_PATH } from "@/lib/site-domains";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const ogImage = doeDtcLinkPreviewImageUrl();

export const metadata: Metadata = {
  title: `${DOEDTC_PREPARE.pageTitle} · Doe`,
  description: DOEDTC_PAGE_DESCRIPTION,
  openGraph: {
    title: DOEDTC_PREPARE.pageTitle,
    description: DOEDTC_PREPARE.subtitle,
    url: `${doeDtcPublicOrigin()}${DOEDTC_PATH}/prepare`,
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
  searchParams: Promise<{ t?: string; p?: string }>;
};

export default async function DoeDtcPreparePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const token = params.t?.trim() ?? "";
  const preparationId = params.p?.trim() ?? "";

  let valid = false;
  let preparation: DoeDtcPreparationRow | null = null;

  if (token && preparationId) {
    try {
      const user = await getDoeDtcUserByCareToken(token);
      valid = Boolean(user);
      if (user) {
        preparation = await getDoeDtcPreparationById({
          userId: user.id,
          preparationId,
        });
      }
    } catch {
      valid = false;
      preparation = null;
    }
  }

  return (
    <DoeDtcPreparePageClient token={token} valid={valid} preparation={preparation} />
  );
}
