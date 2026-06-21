"use client";

import DoeIphoneSiteNav from "@/components/DoeIphoneSiteNav";
import { DoePhoneHeroHeadline } from "@/components/doephone/DoePhoneHeroHeadline";
import { DoePhoneSectionPlus, DoePhoneSectionText } from "@/components/doephone/DoePhoneSectionText";
import { HeroCarouselTextureOverlay } from "@/components/hero-carousel-texture";
import { HomeFooter } from "@/components/home/sections/HomeFooter";
import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import { DOEPHONE_HERO_BACKDROP_GRADIENT } from "@/lib/home/hero-constants";
import {
  DOEPHONE_SECTION_COPY_INSET,
  DOEPHONE_VIEWPORT_SECTION,
} from "@/lib/doephone/section-styles";
import { CARE_COORDINATION_BACKDROP, DIAGNOSTIC_ASSISTANT_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";
import { useLayoutEffect } from "react";

/** Hero headline — symmetric inset for centered copy. */
const DOEPHONE_HERO_HEADLINE_INSET =
  "px-6 iphone-page:px-[max(1.65rem,calc(env(safe-area-inset-left,0px)+1rem))]";

/**
 * Full first-screen hero — extra depth below the fold so beige never peeks on load.
 * CSS-only (no JS resize) so pinch zoom does not reflow layout.
 */
const DOEPHONE_HERO_HEIGHT =
  "calc(112svh + max(8rem, calc(env(safe-area-inset-top, 0px) + 3.5rem)))";

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
            style={{ background: DOEPHONE_HERO_BACKDROP_GRADIENT }}
            aria-hidden
          />
          <HeroCarouselTextureOverlay introOnLoad grid="dot" />
        </div>

        <div
          className={`absolute inset-0 z-[3] flex flex-col items-center justify-start pt-[max(9rem,calc(env(safe-area-inset-top,0px)+31svh))] pb-8 ${DOEPHONE_HERO_HEADLINE_INSET}`}
        >
          <DoePhoneHeroHeadline />
        </div>
      </section>

      <div className="w-full border-t border-[#E6E6E6]" aria-hidden />

      <section className={`${DOEPHONE_VIEWPORT_SECTION} bg-[#F7F6F3]`} aria-label="Communication">
        <DoePhoneSectionText
          line1="Communication"
          line2={
            <>
              <DoePhoneSectionPlus />
              intelligence.
            </>
          }
        />
      </section>

      <div className="w-full border-t border-[#E6E6E6]" aria-hidden />

      <section className={`${DOEPHONE_VIEWPORT_SECTION} overflow-hidden bg-[#F7F6F3]`} aria-label="Automation">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <WorkflowCarouselDesignBackdrop
            backdrop={CARE_COORDINATION_BACKDROP}
            embedded
            gradientScale={1.38}
          />
        </div>
        <DoePhoneSectionText line1="Labs in." line2="Referrals in." color="text-white" />
      </section>

      <div className="w-full border-t border-[#E6E6E6]" aria-hidden />

      <section className={`${DOEPHONE_VIEWPORT_SECTION} bg-[#F7F6F3]`} aria-label="Customization">
        <DoePhoneSectionText line1="Your practice," line2="your rules." />
      </section>

      <div className="w-full border-t border-[#E6E6E6]" aria-hidden />

      <section className={`${DOEPHONE_VIEWPORT_SECTION} overflow-hidden bg-[#F7F6F3]`} aria-label="Integrations">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <WorkflowCarouselDesignBackdrop backdrop={DIAGNOSTIC_ASSISTANT_BACKDROP} embedded />
        </div>
        <DoePhoneSectionText line1="Intelligence built." line2="into your stack." color="text-white" />
      </section>

      <div className="w-full border-t border-[#E6E6E6]" aria-hidden />

      <section className={`${DOEPHONE_VIEWPORT_SECTION} bg-[#F7F6F3]`} aria-label="Closing">
        <DoePhoneSectionText line1="One provider," line2="one patient at a time." />
      </section>

      <HomeFooter />
    </div>
  );
}
