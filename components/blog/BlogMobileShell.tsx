"use client";

import type { ReactNode } from "react";

import DoeIphoneSiteNav from "@/components/DoeIphoneSiteNav";
import { HomeFooter } from "@/components/home/sections/HomeFooter";

export function BlogMobileShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="blog-mobile-root relative z-0 min-h-[100dvh] overflow-x-clip bg-[#F7F6F3]"
      suppressHydrationWarning
      data-doeforvc-view="iphone"
    >
      <DoeIphoneSiteNav pinchSafe />
      <div className="blog-page-root relative z-0 px-[max(1.5rem,env(safe-area-inset-left,0px))] pr-[max(1.5rem,env(safe-area-inset-right,0px))]">
        {children}
      </div>
      <HomeFooter />
    </div>
  );
}
