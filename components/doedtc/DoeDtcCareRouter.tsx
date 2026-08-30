"use client";

import { DoeDtcCareView } from "@/components/doedtc/DoeDtcCareView";
import { DoeDtcPageShell } from "@/components/doedtc/DoeDtcPageShell";
import { DoeDtcWordmark } from "@/components/doedtc/DoeDtcWordmark";
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
      <header className="doedtc-header">
        <DoeDtcWordmark />
        <h1 className={`doedtc-headline ${dmSans.className}`}>{DOEDTC_CARE.title}</h1>
      </header>
      <DoeDtcCareView assessment={assessment} symptoms={symptoms} valid={valid} />
    </DoeDtcPageShell>
  );
}
