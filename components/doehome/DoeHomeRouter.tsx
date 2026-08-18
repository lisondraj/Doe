"use client";

import { DoeHomeDesktopView } from "@/components/doehome/DoeHomeDesktopView";
import { DoeHomeMobileView } from "@/components/doehome/DoeHomeMobileView";
import { DoeInsureBlueDefs } from "@/components/doeinsure/DoeInsureBlueDefs";
import { useDoeHomePageVariant } from "@/lib/doehome/use-doehome-page-variant";
import "@/lib/doeinsure/doeinsure-page.css";
import "@/lib/doehome/doehome-page.css";

export function DoeHomeRouter() {
  const { variant, ready } = useDoeHomePageVariant();

  if (!ready) {
    return <div className="doeinsure-root doeinsure-root--desktop" suppressHydrationWarning />;
  }

  return variant === "desktop" ? (
    <>
      <DoeInsureBlueDefs />
      <DoeHomeDesktopView />
    </>
  ) : (
    <>
      <DoeInsureBlueDefs />
      <DoeHomeMobileView />
    </>
  );
}
