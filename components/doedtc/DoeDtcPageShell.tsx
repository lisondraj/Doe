"use client";

import type { ReactNode } from "react";

import { useDoeDtcPageVariant } from "@/lib/doedtc/use-doedtc-page-variant";
import { useDoePhoneLayoutViewport } from "@/lib/doephone/use-doe-phone-layout-viewport";
import { useDoePhoneStableViewport } from "@/lib/doephone/use-doe-phone-stable-viewport";
import { dmSans, lora } from "@/lib/home/fonts";
import "@/lib/doedtc/doedtc-page.css";
import "@/lib/doedtc/doedtc-light-ui.css";

type DoeDtcPageShellProps = {
  children: ReactNode;
  landing?: boolean;
};

export function DoeDtcPageShell({ children, landing = false }: DoeDtcPageShellProps) {
  const { variant, ready } = useDoeDtcPageVariant();
  const isPhone = !ready || variant === "phone";

  useDoePhoneLayoutViewport();
  useDoePhoneStableViewport(isPhone);

  return (
    <div
      className={`doedtc-root ${landing ? "doedtc-root--landing " : ""}${lora.variable} ${dmSans.className} ${dmSans.variable}`}
      data-doedtc-variant={ready ? variant : "phone"}
      suppressHydrationWarning
    >
      <div className="doedtc-shell">{children}</div>
    </div>
  );
}

/** @deprecated Use DoeDtcPageShell */
export const DoeDtcPhoneShell = DoeDtcPageShell;
