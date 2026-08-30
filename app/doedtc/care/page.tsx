import type { Metadata } from "next";

import { DoeDtcCareRouter } from "@/components/doedtc/DoeDtcCareRouter";
import {
  getDoeDtcUserByCareToken,
  getLatestDoeDtcAssessment,
} from "@/lib/doedtc/doedtc-db";
import { DOEDTC_CARE } from "@/lib/doedtc/doedtc-copy";
import type { DoeDtcAssessmentResult } from "@/lib/doedtc/doedtc-types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${DOEDTC_CARE.title} · Doe`,
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
