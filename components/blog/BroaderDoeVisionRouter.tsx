"use client";

import { BroaderDoeVisionDesktopView } from "@/components/blog/BroaderDoeVisionDesktopView";
import { BroaderDoeVisionMobileView } from "@/components/blog/BroaderDoeVisionMobileView";
import { ShaderBackdropPreloader } from "@/components/shared/ShaderBackdropPreloader";
import { BROADER_DOE_VISION_TOC_ITEMS } from "@/lib/blog/about-style-article-toc";
import { BLOG_ABOUT_PAGE_SHADER_BACKDROP_PATHS } from "@/lib/blog/blog-about-shader-backdrops";
import { useAboutPageVariant } from "@/lib/about/use-about-page-variant";

export function BroaderDoeVisionRouter() {
  const variant = useAboutPageVariant();
  const tocItems = BROADER_DOE_VISION_TOC_ITEMS;

  return (
    <>
      <ShaderBackdropPreloader srcs={BLOG_ABOUT_PAGE_SHADER_BACKDROP_PATHS} />
      {variant === "desktop" ? (
        <BroaderDoeVisionDesktopView tocItems={tocItems} />
      ) : (
        <BroaderDoeVisionMobileView tocItems={tocItems} />
      )}
    </>
  );
}
