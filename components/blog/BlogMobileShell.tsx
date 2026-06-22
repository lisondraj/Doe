"use client";

import type { ReactNode } from "react";

import DoeIphoneSiteNav from "@/components/DoeIphoneSiteNav";
import { HomeFooter } from "@/components/home/sections/HomeFooter";

/** Space between blog copy and the footer gradient — keeps content off the footer edge. */
const BLOG_FOOTER_GAP =
  "pb-[max(3.5rem,calc(env(safe-area-inset-bottom,0px)+2.75rem))] iphone-page:pb-[max(4rem,calc(env(safe-area-inset-bottom,0px)+3rem))]";

export function BlogMobileShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="blog-mobile-root relative z-0 min-h-[100dvh] overflow-x-hidden bg-[#F7F6F3]"
      suppressHydrationWarning
      data-doeforvc-view="iphone"
    >
      <DoeIphoneSiteNav pinchSafe />
      <div
        className={`blog-page-root relative z-0 px-[max(1.5rem,env(safe-area-inset-left,0px))] pr-[max(1.5rem,env(safe-area-inset-right,0px))] ${BLOG_FOOTER_GAP}`}
      >
        {children}
      </div>
      <HomeFooter />
    </div>
  );
}
