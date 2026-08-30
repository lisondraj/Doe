import type { Metadata } from "next";

import { DoeDtcListenView } from "@/components/doedtc/DoeDtcListenView";
import { getDoeDtcListenSession, getDoeDtcUserByCareToken } from "@/lib/doedtc/doedtc-db";
import {
  DOEDTC_LISTEN,
  DOEDTC_PAGE_DESCRIPTION,
  doeDtcContactCardImageUrl,
  doeDtcPublicOrigin,
} from "@/lib/doedtc/doedtc-copy";
import type { DoeDtcListenSessionRow } from "@/lib/doedtc/doedtc-types";
import { DOEDTC_PATH } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

const ogImage = doeDtcContactCardImageUrl();

export const metadata: Metadata = {
  title: `${DOEDTC_LISTEN.pageTitle} · Doe`,
  description: DOEDTC_PAGE_DESCRIPTION,
  openGraph: {
    title: DOEDTC_LISTEN.pageTitle,
    description: DOEDTC_PAGE_DESCRIPTION,
    url: `${doeDtcPublicOrigin()}${DOEDTC_PATH}/listen`,
    siteName: "Doe",
    images: [
      {
        url: ogImage,
        width: 1024,
        height: 1024,
        alt: "Doe",
      },
    ],
    type: "website",
  },
};

type PageProps = {
  searchParams: Promise<{ t?: string; s?: string }>;
};

export default async function DoeDtcListenPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const token = params.t?.trim() ?? "";
  const sessionId = params.s?.trim() ?? "";

  let valid = false;
  let session: DoeDtcListenSessionRow | null = null;

  if (token && sessionId) {
    try {
      const user = await getDoeDtcUserByCareToken(token);
      if (user) {
        session = await getDoeDtcListenSession({ sessionId, userId: user.id });
        valid = Boolean(session);
      }
    } catch {
      valid = false;
      session = null;
    }
  }

  return (
    <DoeDtcListenView
      token={token}
      sessionId={sessionId}
      valid={valid}
      initialSession={session}
    />
  );
}
