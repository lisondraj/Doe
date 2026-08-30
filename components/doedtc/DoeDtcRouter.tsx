"use client";

import { DoeDtcLandingForm } from "@/components/doedtc/DoeDtcLandingForm";
import { DoeDtcPageShell } from "@/components/doedtc/DoeDtcPageShell";
import { DOEDTC_LANDING } from "@/lib/doedtc/doedtc-copy";
import { lora, suisseIntl } from "@/lib/home/fonts";

export function DoeDtcRouter() {
  return (
    <DoeDtcPageShell>
      <header className="doedtc-hero">
        <p className="doedtc-wordmark doedtc-wordmark--gold">Doe</p>
        <p className="doedtc-eyebrow">{DOEDTC_LANDING.eyebrow}</p>
        <h1 className={`doedtc-headline ${lora.className}`}>{DOEDTC_LANDING.headline}</h1>
        <p className={`doedtc-display ${suisseIntl.className}`}>{DOEDTC_LANDING.subhead}</p>
      </header>
      <DoeDtcLandingForm />
    </DoeDtcPageShell>
  );
}
