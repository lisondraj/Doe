"use client";

import { DoeDtcLandingForm } from "@/components/doedtc/DoeDtcLandingForm";
import { DoeDtcPhoneShell } from "@/components/doedtc/DoeDtcPhoneShell";
import { DOEDTC_LANDING } from "@/lib/doedtc/doedtc-copy";
import { lora } from "@/lib/home/fonts";

export function DoeDtcRouter() {
  return (
    <DoeDtcPhoneShell>
      <p className="doedtc-eyebrow">{DOEDTC_LANDING.eyebrow}</p>
      <h1 className={`doedtc-headline ${lora.className}`}>{DOEDTC_LANDING.headline}</h1>
      <p className="doedtc-subhead">{DOEDTC_LANDING.subhead}</p>
      <DoeDtcLandingForm />
    </DoeDtcPhoneShell>
  );
}
