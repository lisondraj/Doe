"use client";

import { DoeDtcGetStartedForm } from "@/components/doedtc/DoeDtcGetStartedForm";
import { DoeDtcPhoneShell } from "@/components/doedtc/DoeDtcPhoneShell";
import { DOEDTC_GET_STARTED } from "@/lib/doedtc/doedtc-copy";
import { lora } from "@/lib/home/fonts";

type DoeDtcGetStartedRouterProps = {
  token: string;
  valid: boolean;
};

export function DoeDtcGetStartedRouter({ token, valid }: DoeDtcGetStartedRouterProps) {
  return (
    <DoeDtcPhoneShell>
      <p className="doedtc-wordmark">Doe</p>
      <h1 className={`doedtc-headline ${lora.className}`}>{DOEDTC_GET_STARTED.title}</h1>
      <p className="doedtc-subhead">{DOEDTC_GET_STARTED.subtitle}</p>
      <DoeDtcGetStartedForm token={token} valid={valid} />
    </DoeDtcPhoneShell>
  );
}
