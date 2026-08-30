import type { Metadata } from "next";

import { DoeDtcCareRouter } from "@/components/doedtc/DoeDtcCareRouter";
import {
  getDoeDtcUserByCareToken,
  getLatestDoeDtcAssessment,
  listDoeDtcSymptoms,
} from "@/lib/doedtc/doedtc-db";
import {
  DOEDTC_CARE,
  DOEDTC_PAGE_DESCRIPTION,
  doeDtcLinkPreviewImageUrl,
  doeDtcPublicOrigin,
} from "@/lib/doedtc/doedtc-copy";
import { DOEDTC_PATH } from "@/lib/site-domains";
import type { DoeDtcAssessmentResult, DoeDtcSymptomRow } from "@/lib/doedtc/doedtc-types";

export const dynamic = "force-dynamic";

const ogImage = doeDtcLinkPreviewImageUrl();

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
        width: 1200,
        height: 630,
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
  let symptoms: DoeDtcSymptomRow[] = [];

  if (token) {
    try {
      const user = await getDoeDtcUserByCareToken(token);
      valid = Boolean(user);
      if (user) {
        const [latest, symptomRows] = await Promise.all([
          getLatestDoeDtcAssessment(user.id),
          listDoeDtcSymptoms(user.id, 12),
        ]);
        assessment = latest?.result ?? null;
        symptoms = symptomRows;
      }
    } catch {
      valid = false;
      assessment = null;
      symptoms = [];
    }
  }

  return <DoeDtcCareRouter assessment={assessment} symptoms={symptoms} valid={valid} />;
}
