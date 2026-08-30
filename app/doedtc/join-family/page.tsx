import type { Metadata } from "next";

import { DoeDtcJoinFamilyForm } from "@/components/doedtc/DoeDtcJoinFamilyForm";
import { DoeDtcPageHeader } from "@/components/doedtc/DoeDtcPageHeader";
import { DoeDtcPageShell } from "@/components/doedtc/DoeDtcPageShell";
import { DoeDtcTopBar } from "@/components/doedtc/DoeDtcTopBar";
import {
  DOEDTC_JOIN_FAMILY,
  DOEDTC_LINK_PREVIEW_IMAGE,
  DOEDTC_PAGE_DESCRIPTION,
  doeDtcLinkPreviewImageUrl,
  doeDtcPublicOrigin,
} from "@/lib/doedtc/doedtc-copy";
import { getDoeDtcHouseholdInviteByToken } from "@/lib/doedtc/doedtc-db";
import { DOEDTC_PATH } from "@/lib/site-domains";
import { dmSans } from "@/lib/home/fonts";

export const dynamic = "force-dynamic";

const ogImage = doeDtcLinkPreviewImageUrl();

export const metadata: Metadata = {
  title: `${DOEDTC_JOIN_FAMILY.title} · Doe`,
  description: DOEDTC_PAGE_DESCRIPTION,
  openGraph: {
    title: DOEDTC_JOIN_FAMILY.title,
    description: DOEDTC_PAGE_DESCRIPTION,
    url: `${doeDtcPublicOrigin()}${DOEDTC_PATH}/join-family`,
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
  searchParams: Promise<{ i?: string }>;
};

export default async function DoeDtcJoinFamilyPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const inviteToken = params.i?.trim() ?? "";
  let valid = false;

  if (inviteToken) {
    try {
      const context = await getDoeDtcHouseholdInviteByToken(inviteToken);
      valid = Boolean(context);
    } catch {
      valid = false;
    }
  }

  return (
    <DoeDtcPageShell>
      <DoeDtcTopBar compact href={`/doedtc/join-family?i=${encodeURIComponent(inviteToken)}`} />
      <DoeDtcPageHeader title={valid ? DOEDTC_JOIN_FAMILY.title : DOEDTC_JOIN_FAMILY.invalidInviteTitle} />
      {valid ? <p className={`doedtc-display ${dmSans.className}`}>{DOEDTC_JOIN_FAMILY.subtitle}</p> : null}
      {inviteToken ? <DoeDtcJoinFamilyForm inviteToken={inviteToken} /> : null}
    </DoeDtcPageShell>
  );
}
