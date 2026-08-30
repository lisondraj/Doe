"use client";

import { DoeDtcCareView } from "@/components/doedtc/DoeDtcCareView";
import { DoeDtcPageShell } from "@/components/doedtc/DoeDtcPageShell";
import { DoeDtcTopBar } from "@/components/doedtc/DoeDtcTopBar";
import { DOEDTC_CARE } from "@/lib/doedtc/doedtc-copy";
import type { DoeDtcAssessmentResult, DoeDtcSymptomRow } from "@/lib/doedtc/doedtc-types";
import { dmSans } from "@/lib/home/fonts";

type DoeDtcCareRouterProps = {
  assessment: DoeDtcAssessmentResult | null;
  symptoms: DoeDtcSymptomRow[];
  valid: boolean;
};

export function DoeDtcCareRouter({ assessment, symptoms, valid }: DoeDtcCareRouterProps) {
  return (
    <DoeDtcPageShell>
      <DoeDtcTopBar />
      <header className="doedtc-header">
        <h1 className={`doedtc-headline ${dmSans.className}`}>{DOEDTC_CARE.title}</h1>
      </header>
      <DoeDtcCareView assessment={assessment} symptoms={symptoms} valid={valid} />
    </DoeDtcPageShell>
  );
}
