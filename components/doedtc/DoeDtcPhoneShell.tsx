"use client";

import type { ReactNode } from "react";

import { useDoeDtcPhonePageChrome } from "@/lib/doedtc/use-doedtc-phone-page-chrome";
import "@/lib/doedtc/doedtc-page.css";

type DoeDtcPhoneShellProps = {
  children: ReactNode;
};

export function DoeDtcPhoneShell({ children }: DoeDtcPhoneShellProps) {
  useDoeDtcPhonePageChrome();

  return (
    <div className="doedtc-root" suppressHydrationWarning>
      <div className="doedtc-shell">{children}</div>
    </div>
  );
}
