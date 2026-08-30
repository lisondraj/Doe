"use client";

import { DoeDtcGetStartedForm } from "@/components/doedtc/DoeDtcGetStartedForm";
import { DoeDtcPageShell } from "@/components/doedtc/DoeDtcPageShell";
import { DoeDtcTopBar } from "@/components/doedtc/DoeDtcTopBar";
import { DOEDTC_GET_STARTED } from "@/lib/doedtc/doedtc-copy";
import { dmSans } from "@/lib/home/fonts";

type DoeDtcGetStartedRouterProps = {
  token: string;
  valid: boolean;
};

export function DoeDtcGetStartedRouter({ token, valid }: DoeDtcGetStartedRouterProps) {
  return (
    <DoeDtcPageShell>
      <DoeDtcTopBar href={`/doedtc/get-started?t=${encodeURIComponent(token)}`} />
      <header className="doedtc-header">
        <h1 className={`doedtc-headline ${dmSans.className}`}>{DOEDTC_GET_STARTED.title}</h1>
        <p className={`doedtc-display ${dmSans.className}`}>{DOEDTC_GET_STARTED.subtitle}</p>
      </header>
      <DoeDtcGetStartedForm token={token} valid={valid} />
    </DoeDtcPageShell>
  );
}
