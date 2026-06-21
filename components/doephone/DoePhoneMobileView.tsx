"use client";

import DoeIphoneSiteNav from "@/components/DoeIphoneSiteNav";
import { HeroCarouselTextureOverlay } from "@/components/hero-carousel-texture";
import { HomeFooter } from "@/components/home/sections/HomeFooter";
import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import { HERO_BACKDROP_GRADIENT } from "@/lib/home/hero-constants";
import { CARE_COORDINATION_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";
import { useLayoutEffect } from "react";

/** Shared band height for /doephone sections 2–4. */
const DOEPHONE_BAND_SECTION =
  "relative z-10 w-full min-h-[min(144vh,80rem)] iphone-page:min-h-[min(136dvh,76rem)]";

export function DoePhoneMobileView() {
  /** Layout viewport only — ignore visualViewport shrink during pinch so layout stays stable. */
  useLayoutEffect(() => {
    const measure = () => {
      document.documentElement.style.setProperty("--app-vw", `${window.innerWidth}px`);
      document.documentElement.style.setProperty("--app-vh", `${window.innerHeight}px`);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div
      className="doephone-mobile-root relative z-0 min-h-[100dvh] overflow-x-hidden bg-[#F7F6F3]"
      suppressHydrationWarning
      data-doeforvc-view="iphone"
    >
      <DoeIphoneSiteNav pinchSafe />

      <section
        className="relative w-full overflow-hidden"
        style={{ minHeight: "var(--app-vh, 100dvh)", height: "var(--app-vh, 100dvh)" }}
        aria-label="Hero"
      >
        <div className="absolute inset-0">
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: HERO_BACKDROP_GRADIENT }}
            aria-hidden
          />
          <HeroCarouselTextureOverlay />
        </div>
      </section>

      <div className="w-full border-t border-[#E6E6E6]" aria-hidden />

      <section className={`${DOEPHONE_BAND_SECTION} bg-[#F7F6F3]`} aria-hidden />

      <div className="w-full border-t border-[#E6E6E6]" aria-hidden />

      <section className={`${DOEPHONE_BAND_SECTION} overflow-hidden bg-[#F7F6F3]`} aria-label="Care coordination">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[100dvh]" aria-hidden>
          <WorkflowCarouselDesignBackdrop backdrop={CARE_COORDINATION_BACKDROP} embedded />
        </div>
      </section>

      <div className="w-full border-t border-[#E6E6E6]" aria-hidden />

      <section className={`${DOEPHONE_BAND_SECTION} bg-[#F7F6F3]`} aria-hidden />

      <HomeFooter />
    </div>
  );
}
