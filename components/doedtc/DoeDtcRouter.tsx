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
      <div className="doedtc-landing-body">
        <header className="doedtc-header doedtc-header--landing">
          <h1 className={`doedtc-headline doedtc-headline--landing ${dmSans.className}`}>
            <span className="doedtc-headline__line">{DOEDTC_LANDING.headlineLine1}</span>
            <span className="doedtc-headline__line">{DOEDTC_LANDING.headlineLine2}</span>
          </h1>
          <p className={`doedtc-display ${dmSans.className}`}>{DOEDTC_LANDING.subhead}</p>
        </header>
        <DoeDtcLandingForm />
      </div>
    </DoeDtcPageShell>
  );
}
