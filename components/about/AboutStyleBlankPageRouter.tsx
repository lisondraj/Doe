"use client";

import { AboutStyleBlankPageContent } from "@/components/about/AboutStyleBlankPageContent";
import { AboutStyleArticleDesktopView } from "@/components/blog/AboutStyleArticleDesktopView";
import { AboutStyleArticleMobileView } from "@/components/blog/AboutStyleArticleMobileView";
import { useAboutPageVariant } from "@/lib/about/use-about-page-variant";

type AboutStyleBlankPageRouterProps = {
  ariaLabel: string;
};

/** About-style shell with a blank full-viewport center section — iPhone + desktop. */
export function AboutStyleBlankPageRouter({ ariaLabel }: AboutStyleBlankPageRouterProps) {
  const variant = useAboutPageVariant();
  const content = <AboutStyleBlankPageContent ariaLabel={ariaLabel} />;

  if (variant === null) {
    return null;
  }

  return variant === "desktop" ? (
    <AboutStyleArticleDesktopView>{content}</AboutStyleArticleDesktopView>
  ) : (
    <AboutStyleArticleMobileView>{content}</AboutStyleArticleMobileView>
  );
}
