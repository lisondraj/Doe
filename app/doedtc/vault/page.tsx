import type { Metadata } from "next";

import { DoeDtcVaultView } from "@/components/doedtc/DoeDtcVaultView";
import { getDoeDtcVaultTokenContext } from "@/lib/doedtc/doedtc-browser-db";
import {
  DOEDTC_PAGE_DESCRIPTION,
  DOEDTC_VAULT,
  DOEDTC_LINK_PREVIEW_IMAGE,
  doeDtcLinkPreviewImageUrl,
  doeDtcPublicOrigin,
} from "@/lib/doedtc/doedtc-copy";
import { DOEDTC_PATH } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

const ogImage = doeDtcLinkPreviewImageUrl();

export const metadata: Metadata = {
  title: `${DOEDTC_VAULT.pageTitle} · Doe`,
  description: DOEDTC_PAGE_DESCRIPTION,
  openGraph: {
    title: DOEDTC_VAULT.pageTitle,
    description: DOEDTC_PAGE_DESCRIPTION,
    url: `${doeDtcPublicOrigin()}${DOEDTC_PATH}/vault`,
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
  searchParams: Promise<{ t?: string }>;
};

export default async function DoeDtcVaultPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const token = params.t?.trim() ?? "";
  const context = token ? await getDoeDtcVaultTokenContext(token) : null;

  return (
    <DoeDtcVaultView token={token} valid={Boolean(context)} host={context?.host ?? ""} />
  );
}
