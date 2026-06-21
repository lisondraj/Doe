"use client";

import DoeIphoneSiteNav from "@/components/DoeIphoneSiteNav";
import { HeroCarouselTextureOverlay } from "@/components/hero-carousel-texture";
import { HomeFooter } from "@/components/home/sections/HomeFooter";
import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import { HERO_BACKDROP_GRADIENT } from "@/lib/home/hero-constants";
import { CARE_COORDINATION_BACKDROP, DIAGNOSTIC_ASSISTANT_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";
import { useLayoutEffect } from "react";

/** Shared band height for /doephone sections 2+. */
const DOEPHONE_BAND_SECTION =
  "relative z-10 w-full min-h-[min(152vh,86rem)] iphone-page:min-h-[min(144dvh,82rem)]";

/**
 * Full first-screen hero — extra depth below the fold so beige never peeks on load.
 * CSS-only (no JS resize) so pinch zoom does not reflow layout.
 */
const DOEPHONE_HERO_HEIGHT =
  "calc(100svh + max(8rem, calc(env(safe-area-inset-top, 0px) + 3.5rem)) + 12vh)";

export function DoePhoneMobileView() {
  /** Set viewport vars once + on orientation change only — avoids pinch-zoom layout jumps. */
  useLayoutEffect(() => {
    const measure = () => {
      document.documentElement.style.setProperty("--app-vw", `${window.innerWidth}px`);
      document.documentElement.style.setProperty("--app-vh", `${window.innerHeight}px`);
    };
    measure();
    window.addEventListener("orientationchange", measure);
    return () => window.removeEventListener("orientationchange", measure);
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
        style={{ minHeight: DOEPHONE_HERO_HEIGHT, height: DOEPHONE_HERO_HEIGHT }}
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
            embedded
            gradientScale={1.38}
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
