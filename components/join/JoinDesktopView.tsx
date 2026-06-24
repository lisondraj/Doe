"use client";

import { BlogFilterBar } from "@/components/blog/BlogFilterBar";
import { BlogLandingHero } from "@/components/blog/BlogLandingHero";
import { DesktopRouteLayout } from "@/components/DesktopRouteLayout";
import { DesktopSiteFooter } from "@/components/home/DesktopSiteFooter";
import { JoinDesktopNav } from "@/components/join/JoinDesktopNav";

export function JoinDesktopView() {
  return (
    <DesktopRouteLayout>
      <div
        className="relative min-h-[100dvh] overflow-x-hidden bg-[#F7F6F3]"
        data-doeforvc-view="desktop"
      >
        <JoinDesktopNav />

        <main className="pt-[5.5rem]">
          <div className="mx-auto w-full max-w-[1400px] px-8">
            <BlogLandingHero
              line1="Join the"
              line2="waitlist."
              showFilter={false}
              className="h-[min(66.667vh,42rem)] min-h-[min(66.667vh,42rem)] [&_p]:text-[clamp(2.75rem,4.5vw,4.25rem)]"
            />
          </div>

          <div className="w-full border-t border-[#E6E6E6]" />

          <section className="mx-auto flex w-full max-w-[1400px] flex-col items-center justify-center px-8 py-24 md:py-28">
            <BlogFilterBar />
          </section>
        </main>

        <DesktopSiteFooter linksDisabled />
      </div>
    </DesktopRouteLayout>
  );
}
