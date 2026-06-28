"use client";

import { DoePhoneHeroHeadline } from "@/components/doephone/DoePhoneHeroHeadline";
import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import {
  DOEPHONE_HERO_INTRO_GRADIENT_MS,
  DOEPHONE_HERO_INTRO_GRADIENT_START,
  doephoneHeroIntroStyleVars,
} from "@/lib/doephone/hero-intro-timing";
import { DOEPHONE_SECTION_CAROUSEL_INSET_X } from "@/lib/doephone/section-styles";
import { CARE_COORDINATION_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";
import { useEffect, useState, type CSSProperties } from "react";

/** Hero — modest height band; inbox UI anchors to bottom of this section. */
export const DOEPHONE_HERO_HEIGHT =
  "calc(var(--app-vh,100lvh)*0.94 + max(8rem, calc(env(safe-area-inset-top, 0px) + 3.5rem)))";

export function DoePhoneHeroSection() {
  const [introZoom, setIntroZoom] = useState(DOEPHONE_HERO_INTRO_GRADIENT_START);
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setIntroZoom(1);
      setIntroDone(true);
      return;
    }

    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DOEPHONE_HERO_INTRO_GRADIENT_MS);
      const eased = t * t * (3 - 2 * t);
      setIntroZoom(
        DOEPHONE_HERO_INTRO_GRADIENT_START +
          (1 - DOEPHONE_HERO_INTRO_GRADIENT_START) * eased,
      );
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setIntroZoom(1);
        setIntroDone(true);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const gradientZoom = introDone ? 1 : introZoom;

  return (
    <section
      className="doephone-hero-section relative w-full overflow-hidden bg-[#D2774C]"
      style={
        {
          minHeight: DOEPHONE_HERO_HEIGHT,
          height: DOEPHONE_HERO_HEIGHT,
          ...doephoneHeroIntroStyleVars(),
        } as CSSProperties
      }
      aria-label="Hero"
    >
      <WorkflowCarouselDesignBackdrop
        backdrop={CARE_COORDINATION_BACKDROP}
        embedded
        introOnLoad
        gradientScale={gradientZoom}
      />

      <div
        className={`absolute inset-0 z-[3] flex min-w-0 flex-col items-start justify-end overflow-visible pb-[clamp(1.5rem,5vmin,2.5rem)] ${DOEPHONE_SECTION_CAROUSEL_INSET_X}`}
      >
        <div className="doephone-hero-copy pointer-events-none w-full min-w-0">
          <DoePhoneHeroHeadline />
        </div>
      </div>
    </section>
  );
}
