"use client";

import { DoeDtcLandingForm } from "@/components/doedtc/DoeDtcLandingForm";
import { DOEDTC_LANDING } from "@/lib/doedtc/doedtc-copy";
import { useDoeDtcPageVariant } from "@/lib/doedtc/use-doedtc-page-variant";
import { lora } from "@/lib/home/fonts";
import "@/lib/doedtc/doedtc-page.css";

export function DoeDtcRouter() {
  const { variant, ready } = useDoeDtcPageVariant();

  if (!ready) {
    return <div className="doedtc-root" suppressHydrationWarning />;
  }

  return (
    <div className={`doedtc-root doedtc-root--${variant}`}>
      <div className="doedtc-shell">
        <p className="doedtc-eyebrow">{DOEDTC_LANDING.eyebrow}</p>
        <h1 className={`doedtc-headline ${lora.className}`}>{DOEDTC_LANDING.headline}</h1>
        <p className="doedtc-subhead">{DOEDTC_LANDING.subhead}</p>
        <DoeDtcLandingForm />
      </div>
    </div>
  );
}
