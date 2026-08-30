"use client";

import type { ReactNode } from "react";

import { useDoeDtcPageVariant } from "@/lib/doedtc/use-doedtc-page-variant";
import { useDoePhoneLayoutViewport } from "@/lib/doephone/use-doe-phone-layout-viewport";
import { useDoePhoneStableViewport } from "@/lib/doephone/use-doe-phone-stable-viewport";
import "@/lib/doedtc/doedtc-page.css";

type DoeDtcPageShellProps = {
  children: ReactNode;
};

export function DoeDtcPageShell({ children }: DoeDtcPageShellProps) {
  const { variant, ready } = useDoeDtcPageVariant();
  const isPhone = !ready || variant === "phone";

  useDoePhoneLayoutViewport();
  useDoePhoneStableViewport(isPhone);

  return (
    <div
      className="doedtc-root"
      data-doedtc-variant={ready ? variant : "phone"}
      suppressHydrationWarning
    >
      <div className="doedtc-shell">{children}</div>
    </div>
  );
}

/** @deprecated Use DoeDtcPageShell */
export const DoeDtcPhoneShell = DoeDtcPageShell;
