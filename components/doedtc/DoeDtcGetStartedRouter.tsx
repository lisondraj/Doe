"use client";

import { DoeDtcGetStartedForm } from "@/components/doedtc/DoeDtcGetStartedForm";
import { DoeDtcPageHeader } from "@/components/doedtc/DoeDtcPageHeader";
import { DoeDtcPageShell } from "@/components/doedtc/DoeDtcPageShell";
import { DoeDtcTopBar } from "@/components/doedtc/DoeDtcTopBar";
import { DOEDTC_GET_STARTED } from "@/lib/doedtc/doedtc-copy";
import { dmSans } from "@/lib/home/fonts";

type DoeDtcGetStartedRouterProps = {
  token: string;
  valid: boolean;
  preview?: boolean;
  homeHref?: string;
};

export function DoeDtcGetStartedRouter({
  token,
  valid,
  preview = false,
  homeHref,
}: DoeDtcGetStartedRouterProps) {
  return (
    <DoeDtcPageShell>
      <DoeDtcTopBar compact href={homeHref ?? `/doedtc/get-started?t=${encodeURIComponent(token)}`} />
      <DoeDtcPageHeader title={DOEDTC_GET_STARTED.title} />
      <p className={`doedtc-display ${dmSans.className}`}>{DOEDTC_GET_STARTED.subtitle}</p>
      <DoeDtcGetStartedForm token={token} valid={valid} preview={preview} />
    </DoeDtcPageShell>
  );
}
