"use client";

import DoeIphoneSiteNav from "@/components/DoeIphoneSiteNav";
import { HeroCarouselTextureOverlay } from "@/components/hero-carousel-texture";
import { HomeFooter } from "@/components/home/sections/HomeFooter";
import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import { HERO_BACKDROP_GRADIENT } from "@/lib/home/hero-constants";
import { CARE_COORDINATION_BACKDROP, CARE_COORDINATION_GRADIENT_DOEPHONE, DIAGNOSTIC_ASSISTANT_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";
import { useLayoutEffect } from "react";

/** Shared band height for /doephone sections 2+. */
const DOEPHONE_BAND_SECTION =
  "relative z-10 w-full min-h-[min(152vh,86rem)] iphone-page:min-h-[min(144dvh,82rem)]";

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
        style={{
          minHeight:
            "calc(var(--app-vh, 100dvh) + env(safe-area-inset-bottom, 0px) + clamp(2.5rem, 8vmin, 4.5rem))",
          height:
            "calc(var(--app-vh, 100dvh) + env(safe-area-inset-bottom, 0px) + clamp(2.5rem, 8vmin, 4.5rem))",
        }}
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
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <WorkflowCarouselDesignBackdrop
            backdrop={CARE_COORDINATION_BACKDROP}
            gradientOverride={CARE_COORDINATION_GRADIENT_DOEPHONE}
            embedded
          />
        </div>
      </section>

      <div className="w-full border-t border-[#E6E6E6]" aria-hidden />

      <section className={`${DOEPHONE_BAND_SECTION} bg-[#F7F6F3]`} aria-hidden />

      <div className="w-full border-t border-[#E6E6E6]" aria-hidden />

      <section className={`${DOEPHONE_BAND_SECTION} overflow-hidden bg-[#F7F6F3]`} aria-label="Diagnostic assistant">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <WorkflowCarouselDesignBackdrop backdrop={DIAGNOSTIC_ASSISTANT_BACKDROP} embedded />
        </div>
        <div
          className="pointer-events-none absolute inset-0 z-[3] bg-[#1E343A]/[0.14]"
          aria-hidden
        />
      </section>

      <div className="w-full border-t border-[#E6E6E6]" aria-hidden />

      <section className={`${DOEPHONE_BAND_SECTION} bg-[#F7F6F3]`} aria-hidden />

      <HomeFooter />
    </div>
  );
}
