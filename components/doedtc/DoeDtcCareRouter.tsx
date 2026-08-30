"use client";

import { DoeDtcCareView } from "@/components/doedtc/DoeDtcCareView";
import { DoeDtcPageShell } from "@/components/doedtc/DoeDtcPageShell";
import { DOEDTC_CARE } from "@/lib/doedtc/doedtc-copy";
import type { DoeDtcAssessmentResult, DoeDtcSymptomRow } from "@/lib/doedtc/doedtc-types";
import { lora } from "@/lib/home/fonts";

type DoeDtcCareRouterProps = {
  assessment: DoeDtcAssessmentResult | null;
  symptoms: DoeDtcSymptomRow[];
  valid: boolean;
};

export function DoeDtcCareRouter({ assessment, symptoms, valid }: DoeDtcCareRouterProps) {
  return (
    <DoeDtcPageShell>
      <header className="doedtc-header">
        <p className="doedtc-wordmark doedtc-wordmark--gold">Doe</p>
        <h1 className={`doedtc-headline ${lora.className}`}>{DOEDTC_CARE.title}</h1>
      </header>
      <DoeDtcCareView assessment={assessment} symptoms={symptoms} valid={valid} />
    </DoeDtcPageShell>
  );
}
