"use client";

import { DoeDtcCareView } from "@/components/doedtc/DoeDtcCareView";
import { DoeDtcPhoneShell } from "@/components/doedtc/DoeDtcPhoneShell";
import { DOEDTC_CARE } from "@/lib/doedtc/doedtc-copy";
import type { DoeDtcAssessmentResult } from "@/lib/doedtc/doedtc-types";
import { lora } from "@/lib/home/fonts";

type DoeDtcCareRouterProps = {
  assessment: DoeDtcAssessmentResult | null;
  valid: boolean;
};

export function DoeDtcCareRouter({ assessment, valid }: DoeDtcCareRouterProps) {
  return (
    <DoeDtcPhoneShell>
      <p className="doedtc-wordmark">Doe</p>
      <h1 className={`doedtc-headline ${lora.className}`}>{DOEDTC_CARE.title}</h1>
      <DoeDtcCareView assessment={assessment} valid={valid} />
    </DoeDtcPhoneShell>
  );
}
