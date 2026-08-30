"use client";

import { DoeDtcLandingForm } from "@/components/doedtc/DoeDtcLandingForm";
import { DoeDtcPageShell } from "@/components/doedtc/DoeDtcPageShell";
import { DoeDtcTopBar } from "@/components/doedtc/DoeDtcTopBar";
import { DOEDTC_LANDING } from "@/lib/doedtc/doedtc-copy";
import { dmSans } from "@/lib/home/fonts";

export function DoeDtcRouter() {
  return (
    <DoeDtcPageShell landing>
      <DoeDtcTopBar compact />
      <header className="doedtc-header doedtc-header--landing">
        <p className="doedtc-eyebrow">{DOEDTC_LANDING.eyebrow}</p>
        <h1 className={`doedtc-headline ${dmSans.className}`}>{DOEDTC_LANDING.headline}</h1>
        <p className={`doedtc-display ${dmSans.className}`}>{DOEDTC_LANDING.subhead}</p>
      </header>
      <DoeDtcLandingForm />
    </DoeDtcPageShell>
  );
}
