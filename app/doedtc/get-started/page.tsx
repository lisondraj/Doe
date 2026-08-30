import type { Metadata } from "next";

import { DoeDtcGetStartedRouter } from "@/components/doedtc/DoeDtcGetStartedRouter";
import { getDoeDtcUserByOnboardingToken, isValidOnboardingUser } from "@/lib/doedtc/doedtc-db";
import {
  DOEDTC_GET_STARTED,
  DOEDTC_PAGE_DESCRIPTION,
  doeDtcContactCardImageUrl,
  doeDtcPublicOrigin,
} from "@/lib/doedtc/doedtc-copy";
import { DOEDTC_PATH } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

const ogImage = doeDtcContactCardImageUrl();

export const metadata: Metadata = {
  title: `${DOEDTC_GET_STARTED.title} · Doe`,
  description: DOEDTC_PAGE_DESCRIPTION,
  openGraph: {
    title: DOEDTC_GET_STARTED.title,
    description: DOEDTC_PAGE_DESCRIPTION,
    url: `${doeDtcPublicOrigin()}${DOEDTC_PATH}/get-started`,
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
  twitter: {
    card: "summary_large_image",
    title: DOEDTC_GET_STARTED.title,
    description: DOEDTC_PAGE_DESCRIPTION,
    images: [ogImage],
  },
};

type PageProps = {
  searchParams: Promise<{ t?: string }>;
};

export default async function DoeDtcGetStartedPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const token = params.t?.trim() ?? "";
  let valid = false;

  if (token) {
    try {
      const user = await getDoeDtcUserByOnboardingToken(token);
      valid = isValidOnboardingUser(user);
    } catch {
      valid = false;
    }
  }

  return <DoeDtcGetStartedRouter token={token} valid={valid} />;
}
