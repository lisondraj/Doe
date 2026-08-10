"use client";

import { PremedDesktopView } from "@/components/premed/PremedDesktopView";
import { PremedLearnMoreProvider } from "@/components/premed/PremedLearnMoreProvider";
import { PremedLinkGuard } from "@/components/premed/PremedLinkGuard";
import { PremedMobileView } from "@/components/premed/PremedMobileView";
import { useAboutPageVariant } from "@/lib/about/use-about-page-variant";
import { BROADER_DOE_VISION_TOC_ITEMS } from "@/lib/blog/about-style-article-toc";

export function PremedRouter() {
  const variant = useAboutPageVariant();
  const tocItems = BROADER_DOE_VISION_TOC_ITEMS;

  return (
    <PremedLearnMoreProvider>
      <PremedLinkGuard>
        {variant === "desktop" ? (
          <PremedDesktopView tocItems={tocItems} />
        ) : (
          <PremedMobileView tocItems={tocItems} />
        )}
      </PremedLinkGuard>
    </PremedLearnMoreProvider>
  );
}
