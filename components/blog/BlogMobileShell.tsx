"use client";

import type { ReactNode } from "react";

import DoeIphoneSiteNav from "@/components/DoeIphoneSiteNav";
import { HomeFooter } from "@/components/home/sections/HomeFooter";
import { BLOG_FOOTER_GAP, BLOG_PAGE_INSET_X } from "@/lib/blog/blog-layout-styles";

export function BlogMobileShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="blog-mobile-root relative z-0 min-h-[100dvh] overflow-x-hidden bg-[#F7F6F3]"
      suppressHydrationWarning
      data-doeforvc-view="iphone"
    >
      <DoeIphoneSiteNav pinchSafe />
      <div className={`blog-page-root relative z-0 ${BLOG_PAGE_INSET_X} ${BLOG_FOOTER_GAP}`}>
        {children}
      </div>
      <HomeFooter />
    </div>
  );
}
