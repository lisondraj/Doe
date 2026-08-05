"use client";

import { BroaderDoeVisionDesktopView } from "@/components/blog/BroaderDoeVisionDesktopView";
import { BroaderDoeVisionMobileView } from "@/components/blog/BroaderDoeVisionMobileView";
import { BROADER_DOE_VISION_TOC_ITEMS } from "@/lib/blog/about-style-article-toc";
import { useAboutPageVariant } from "@/lib/about/use-about-page-variant";

export function BroaderDoeVisionRouter() {
  const variant = useAboutPageVariant();
  const tocItems = BROADER_DOE_VISION_TOC_ITEMS;

  if (variant === null) {
    return null;
  }

  return variant === "desktop" ? (
    <BroaderDoeVisionDesktopView tocItems={tocItems} />
  ) : (
    <BroaderDoeVisionMobileView tocItems={tocItems} />
  );
}
