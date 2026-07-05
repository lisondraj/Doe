"use client";

import { AboutDesktopView } from "@/components/about/AboutDesktopView";
import { AboutMobileView } from "@/components/about/AboutMobileView";
import { useAboutPageVariant } from "@/lib/about/use-about-page-variant";

export function AboutRouter() {
  const variant = useAboutPageVariant();

  return variant === "desktop" ? <AboutDesktopView /> : <AboutMobileView />;
}
