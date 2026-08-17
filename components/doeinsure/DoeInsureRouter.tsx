"use client";

import { DoeInsureDesktopView } from "@/components/doeinsure/DoeInsureDesktopView";
import { DoeInsureMobileView } from "@/components/doeinsure/DoeInsureMobileView";
import { useDoeInsurePageVariant } from "@/lib/doeinsure/use-doeinsure-page-variant";
import "@/lib/doeinsure/doeinsure-page.css";

export function DoeInsureRouter() {
  const variant = useDoeInsurePageVariant();
  return variant === "desktop" ? <DoeInsureDesktopView /> : <DoeInsureMobileView />;
}
