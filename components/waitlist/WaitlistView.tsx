"use client";

import DoeIphoneSiteNav from "@/components/DoeIphoneSiteNav";
import { HomeFooter } from "@/components/home/sections/HomeFooter";
import { BLOG_FOOTER_GAP, BLOG_PAGE_INSET_X } from "@/lib/blog/blog-layout-styles";
import { BLOG_CONTENT_PT } from "@/lib/blog/blog-layout-styles";

export function WaitlistView() {
  return (
    <div
      className="relative z-0 min-h-[100svh] overflow-x-hidden bg-[#F7F6F3]"
      suppressHydrationWarning
      data-doeforvc-view="iphone"
    >
      <DoeIphoneSiteNav pinchSafe />

      <div className={`relative z-0 ${BLOG_PAGE_INSET_X} ${BLOG_FOOTER_GAP}`}>
        <main className={`w-full ${BLOG_CONTENT_PT}`}>
          {/* Beige hero section — placeholder for waitlist content */}
          <div className="w-full rounded-[clamp(1.1rem,0.95rem+0.75vmin,1.45rem)] border border-[#D9D4CC] bg-[#EBE7E0] min-h-[70svh]" />
        </main>
      </div>

      <HomeFooter />
    </div>
  );
}
