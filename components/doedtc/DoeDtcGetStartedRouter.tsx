"use client";

import { DoeDtcGetStartedForm } from "@/components/doedtc/DoeDtcGetStartedForm";
import { DOEDTC_GET_STARTED } from "@/lib/doedtc/doedtc-copy";
import { useDoeDtcPageVariant } from "@/lib/doedtc/use-doedtc-page-variant";
import { lora } from "@/lib/home/fonts";
import "@/lib/doedtc/doedtc-page.css";

type DoeDtcGetStartedRouterProps = {
  token: string;
  valid: boolean;
};

export function DoeDtcGetStartedRouter({ token, valid }: DoeDtcGetStartedRouterProps) {
  const { variant, ready } = useDoeDtcPageVariant();

  if (!ready) {
    return <div className="doedtc-root" suppressHydrationWarning />;
  }

  return (
    <div className={`doedtc-root doedtc-root--${variant}`}>
      <div className="doedtc-shell">
        <p className="doedtc-wordmark">Doe</p>
        <h1 className={`doedtc-headline ${lora.className}`}>{DOEDTC_GET_STARTED.title}</h1>
        <p className="doedtc-subhead">{DOEDTC_GET_STARTED.subtitle}</p>
        <DoeDtcGetStartedForm token={token} valid={valid} />
      </div>
    </div>
  );
}
