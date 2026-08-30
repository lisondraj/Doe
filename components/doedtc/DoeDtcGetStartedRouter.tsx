"use client";

import { DoeDtcGetStartedForm } from "@/components/doedtc/DoeDtcGetStartedForm";
import { DoeDtcPageShell } from "@/components/doedtc/DoeDtcPageShell";
import { DOEDTC_GET_STARTED } from "@/lib/doedtc/doedtc-copy";
import { lora, suisseIntl } from "@/lib/home/fonts";

type DoeDtcGetStartedRouterProps = {
  token: string;
  valid: boolean;
};

export function DoeDtcGetStartedRouter({ token, valid }: DoeDtcGetStartedRouterProps) {
  return (
    <DoeDtcPageShell>
      <header className="doedtc-header">
        <p className="doedtc-wordmark doedtc-wordmark--gold">Doe</p>
        <h1 className={`doedtc-headline ${lora.className}`}>{DOEDTC_GET_STARTED.title}</h1>
        <p className={`doedtc-display ${suisseIntl.className}`}>{DOEDTC_GET_STARTED.subtitle}</p>
      </header>
      <DoeDtcGetStartedForm token={token} valid={valid} />
    </DoeDtcPageShell>
  );
}
