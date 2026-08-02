"use client";

import { BroaderDoeVisionDesktopView } from "@/components/blog/BroaderDoeVisionDesktopView";
import { BroaderDoeVisionMobileView } from "@/components/blog/BroaderDoeVisionMobileView";
import { useAboutPageVariant } from "@/lib/about/use-about-page-variant";

export function BroaderDoeVisionRouter() {
  const variant = useAboutPageVariant();

  return variant === "desktop" ? <BroaderDoeVisionDesktopView /> : <BroaderDoeVisionMobileView />;
}
