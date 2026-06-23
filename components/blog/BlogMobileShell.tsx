"use client";

import { useRef, type ReactNode } from "react";

import DoeIphoneSiteNav from "@/components/DoeIphoneSiteNav";
import { HomeFooter } from "@/components/home/sections/HomeFooter";
import { BLOG_FOOTER_GAP, BLOG_PAGE_INSET_X } from "@/lib/blog/blog-layout-styles";
import { useBlogPhoneScale } from "@/lib/blog/use-blog-phone-scale";

export function BlogMobileShell({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  useBlogPhoneScale(rootRef, canvasRef);

  return (
    <div
      ref={rootRef}
      className="blog-mobile-root relative z-0 min-h-[100svh] overflow-x-hidden bg-[#F7F6F3]"
      suppressHydrationWarning
      data-doeforvc-view="iphone"
    >
      <div ref={canvasRef} className="blog-mobile-canvas">
        <DoeIphoneSiteNav blogChrome />
        <div className={`blog-page-root relative z-0 ${BLOG_PAGE_INSET_X} ${BLOG_FOOTER_GAP}`}>
          {children}
        </div>
        <HomeFooter blogChrome />
      </div>
    </div>
  );
}
