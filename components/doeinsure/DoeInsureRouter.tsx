"use client";

import { DoeInsureBlueDefs } from "@/components/doeinsure/DoeInsureBlueDefs";
import { DoeInsureDesktopView } from "@/components/doeinsure/DoeInsureDesktopView";
import { DoeInsureMobileView } from "@/components/doeinsure/DoeInsureMobileView";
import { useDoeInsurePageVariant } from "@/lib/doeinsure/use-doeinsure-page-variant";
import "@/lib/doeinsure/doeinsure-page.css";

export function DoeInsureRouter() {
  const { variant, ready } = useDoeInsurePageVariant();

  if (!ready) {
    return <div className="doeinsure-root doeinsure-root--desktop" suppressHydrationWarning />;
  }

  return variant === "desktop" ? (
    <>
      <DoeInsureBlueDefs />
      <DoeInsureDesktopView />
    </>
  ) : (
    <>
      <DoeInsureBlueDefs />
      <DoeInsureMobileView />
    </>
  );
}
