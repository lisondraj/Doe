"use client";

import { DoeDtcCareView } from "@/components/doedtc/DoeDtcCareView";
import { DoeDtcPageHeader } from "@/components/doedtc/DoeDtcPageHeader";
import { DoeDtcPageShell } from "@/components/doedtc/DoeDtcPageShell";
import { DoeDtcTopBar } from "@/components/doedtc/DoeDtcTopBar";
import { DOEDTC_CARE } from "@/lib/doedtc/doedtc-copy";
import type { DoeDtcAssessmentResult, DoeDtcSymptomRow } from "@/lib/doedtc/doedtc-types";

type DoeDtcCareRouterProps = {
  assessment: DoeDtcAssessmentResult | null;
  symptoms: DoeDtcSymptomRow[];
  valid: boolean;
};

export function DoeDtcCareRouter({ assessment, symptoms, valid }: DoeDtcCareRouterProps) {
  return (
    <DoeDtcPageShell>
      <DoeDtcTopBar compact />
      <DoeDtcPageHeader title={DOEDTC_CARE.title} />
      <DoeDtcCareView assessment={assessment} symptoms={symptoms} valid={valid} />
    </DoeDtcPageShell>
  );
}
