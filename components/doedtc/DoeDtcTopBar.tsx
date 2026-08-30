"use client";

import Link from "next/link";

import { DoeDtcWordmark } from "@/components/doedtc/DoeDtcWordmark";
import { useDoeDtcPageVariant } from "@/lib/doedtc/use-doedtc-page-variant";

type DoeDtcTopBarProps = {
  href?: string;
  trailing?: React.ReactNode;
};

export function DoeDtcTopBar({ href = "/doedtc", trailing }: DoeDtcTopBarProps) {
  const { variant, ready } = useDoeDtcPageVariant();
  const isPhone = !ready || variant === "phone";

  return (
    <div className={`doedtc-topbar${isPhone ? " doedtc-nav--phone" : ""}`}>
      <Link className="doedtc-nav__wordmark" href={href}>
        <DoeDtcWordmark />
      </Link>
      {trailing}
    </div>
  );
}
