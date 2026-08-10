"use client";

import { AboutStyleArticleDesktopView } from "@/components/blog/AboutStyleArticleDesktopView";
import { AboutStyleArticleMobileView } from "@/components/blog/AboutStyleArticleMobileView";
import { BlogLandingPageContent } from "@/components/blog/BlogLandingPageContent";
import { useAboutPageVariant } from "@/lib/about/use-about-page-variant";

/** /blog — about-style landing with iPhone + desktop variants. */
export function BlogLandingRouter() {
  const variant = useAboutPageVariant();
  const content = <BlogLandingPageContent />;

  return variant === "desktop" ? (
    <AboutStyleArticleDesktopView>{content}</AboutStyleArticleDesktopView>
  ) : (
    <AboutStyleArticleMobileView>{content}</AboutStyleArticleMobileView>
  );
}
