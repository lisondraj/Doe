"use client";

import { DoeDtcLandingForm } from "@/components/doedtc/DoeDtcLandingForm";
import { DoeDtcPageShell } from "@/components/doedtc/DoeDtcPageShell";
import { DoeDtcWordmark } from "@/components/doedtc/DoeDtcWordmark";
import { DOEDTC_LANDING } from "@/lib/doedtc/doedtc-copy";
import { dmSans } from "@/lib/home/fonts";

export function DoeDtcRouter() {
  return (
    <DoeDtcPageShell>
      <header className="doedtc-hero">
        <DoeDtcWordmark />
        <p className="doedtc-eyebrow">{DOEDTC_LANDING.eyebrow}</p>
        <h1 className={`doedtc-headline ${dmSans.className}`}>{DOEDTC_LANDING.headline}</h1>
        <p className={`doedtc-display ${dmSans.className}`}>{DOEDTC_LANDING.subhead}</p>
      </header>
      <DoeDtcLandingForm />
    </DoeDtcPageShell>
  );
}
