"use client";

import { DoeDtcGetStartedForm } from "@/components/doedtc/DoeDtcGetStartedForm";
import { DoeDtcPageShell } from "@/components/doedtc/DoeDtcPageShell";
import { DoeDtcTopBar } from "@/components/doedtc/DoeDtcTopBar";
import { DOEDTC_LANDING } from "@/lib/doedtc/doedtc-copy";
import { dmSans } from "@/lib/home/fonts";

type DoeDtcGetStartedRouterProps = {
  token: string;
  valid: boolean;
  preview?: boolean;
  homeHref?: string;
  initialStep?: "profile" | "medical";
};

export function DoeDtcGetStartedRouter({
  token,
  valid,
  preview = false,
  homeHref,
  initialStep = "profile",
}: DoeDtcGetStartedRouterProps) {
  return (
    <DoeDtcPageShell>
      <DoeDtcTopBar compact href={homeHref ?? `/doedtc/get-started?t=${encodeURIComponent(token)}`} />
      <header className="doedtc-header doedtc-header--landing">
        <h1 className={`doedtc-headline doedtc-headline--landing ${dmSans.className}`}>
          <span className="doedtc-headline__line">{DOEDTC_LANDING.headlineLine1}</span>
          <span className="doedtc-headline__line">{DOEDTC_LANDING.headlineLine2}</span>
        </h1>
        <p className={`doedtc-display ${dmSans.className}`}>{DOEDTC_LANDING.subhead}</p>
      </header>
      <DoeDtcGetStartedForm token={token} valid={valid} preview={preview} initialStep={initialStep} />
    </DoeDtcPageShell>
  );
}
