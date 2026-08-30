"use client";

import { DoeDtcCareView } from "@/components/doedtc/DoeDtcCareView";
import { DOEDTC_CARE } from "@/lib/doedtc/doedtc-copy";
import type { DoeDtcAssessmentResult } from "@/lib/doedtc/doedtc-types";
import { useDoeDtcPageVariant } from "@/lib/doedtc/use-doedtc-page-variant";
import { lora } from "@/lib/home/fonts";
import "@/lib/doedtc/doedtc-page.css";

type DoeDtcCareRouterProps = {
  assessment: DoeDtcAssessmentResult | null;
  valid: boolean;
};

export function DoeDtcCareRouter({ assessment, valid }: DoeDtcCareRouterProps) {
  const { variant, ready } = useDoeDtcPageVariant();

  if (!ready) {
    return <div className="doedtc-root" suppressHydrationWarning />;
  }

  return (
    <div className={`doedtc-root doedtc-root--${variant}`}>
      <div className="doedtc-shell">
        <p className="doedtc-wordmark">Doe</p>
        <h1 className={`doedtc-headline ${lora.className}`}>{DOEDTC_CARE.title}</h1>
        <DoeDtcCareView assessment={assessment} valid={valid} />
      </div>
    </div>
  );
}
