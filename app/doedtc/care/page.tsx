import type { Metadata } from "next";

import { DoeDtcCareRouter } from "@/components/doedtc/DoeDtcCareRouter";
import {
  getDoeDtcUserByCareToken,
  getLatestDoeDtcAssessment,
} from "@/lib/doedtc/doedtc-db";
import {
  DOEDTC_CARE,
  DOEDTC_PAGE_DESCRIPTION,
  doeDtcContactCardImageUrl,
  doeDtcPublicOrigin,
} from "@/lib/doedtc/doedtc-copy";
import { DOEDTC_PATH } from "@/lib/site-domains";
import type { DoeDtcAssessmentResult } from "@/lib/doedtc/doedtc-types";

export const dynamic = "force-dynamic";

const ogImage = doeDtcContactCardImageUrl();

export const metadata: Metadata = {
  title: `${DOEDTC_CARE.title} · Doe`,
  description: DOEDTC_PAGE_DESCRIPTION,
  openGraph: {
    title: DOEDTC_CARE.title,
    description: DOEDTC_PAGE_DESCRIPTION,
    url: `${doeDtcPublicOrigin()}${DOEDTC_PATH}/care`,
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
    title: DOEDTC_CARE.title,
    description: DOEDTC_PAGE_DESCRIPTION,
    images: [ogImage],
  },
};

type PageProps = {
  searchParams: Promise<{ t?: string }>;
};

export default async function DoeDtcCarePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const token = params.t?.trim() ?? "";
  let valid = false;
  let assessment: DoeDtcAssessmentResult | null = null;

  if (token) {
    try {
      const user = await getDoeDtcUserByCareToken(token);
      valid = Boolean(user);
      if (user) {
        const latest = await getLatestDoeDtcAssessment(user.id);
        assessment = latest?.result ?? null;
      }
    } catch {
      valid = false;
      assessment = null;
    }
  }

  return <DoeDtcCareRouter assessment={assessment} valid={valid} />;
}
