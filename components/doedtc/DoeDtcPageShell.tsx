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
  profile?: boolean;
  doedtc2?: boolean;
};

export function DoeDtcPageShell({
  children,
  landing = false,
  profile = false,
  doedtc2 = false,
}: DoeDtcPageShellProps) {
  const useProfileChrome = !landing && !doedtc2;
  const showBrandFooter = landing || useProfileChrome || doedtc2;
  const { variant, ready } = useDoeDtcPageVariant({ brandFooter: showBrandFooter });
  const isPhone = !ready || variant === "phone";

  useDoePhoneLayoutViewport(isPhone);
  useDoePhoneStableViewport(isPhone);

  return (
    <div
      className={`doedtc-root ${landing ? "doedtc-root--landing " : ""}${doedtc2 ? "doedtc-root--doedtc2 " : ""}${useProfileChrome ? "doedtc-root--profile " : ""}${showBrandFooter ? "doedtc-root--has-footer " : ""}${lora.variable} ${dmSans.className} ${dmSans.variable}`}
      data-doedtc-variant={ready ? variant : "phone"}
      suppressHydrationWarning
    >
      <div className={`doedtc-shell${showBrandFooter ? " doedtc-shell--brand-footer" : ""}${doedtc2 ? " doedtc-shell--doedtc2" : ""}`}>
        {children}
      </div>
      {showBrandFooter ? (
        <footer className="doedtc-profile-footer">
          <span className={`doedtc-profile-footer__wordmark ${lora.className}`}>Doe</span>
        </footer>
      ) : null}
    </div>
  );
}

/** @deprecated Use DoeDtcPageShell */
export const DoeDtcPhoneShell = DoeDtcPageShell;
