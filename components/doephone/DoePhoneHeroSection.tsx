"use client";

import { DoePhoneHeroHeadline } from "@/components/doephone/DoePhoneHeroHeadline";
import { HeroTriagePreview } from "@/components/home/HeroTriagePreview";
import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import {
  DOEPHONE_HERO_INTRO_GRADIENT_MS,
  DOEPHONE_HERO_INTRO_GRADIENT_START,
  doephoneHeroIntroStyleVars,
} from "@/lib/doephone/hero-intro-timing";
import { DOEPHONE_HERO_COPY_INSET } from "@/lib/doephone/section-styles";
import { suisseIntl } from "@/lib/home/fonts";
import { DOEPHONE_HERO_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";
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
      className="doephone-hero-section relative w-full overflow-hidden bg-[#1E343A]"
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
        backdrop={DOEPHONE_HERO_BACKDROP}
        embedded
        introOnLoad
        gradientScale={gradientZoom}
      />

      <div
        className={`doephone-hero-copy absolute inset-0 z-[3] flex min-w-0 flex-col items-start justify-start overflow-visible pt-[max(7rem,calc(env(safe-area-inset-top,0px)+calc(var(--app-vh,100lvh)*0.22)))] pb-[clamp(1.5rem,5vmin,2.5rem)] ${DOEPHONE_HERO_COPY_INSET}`}
      >
        <DoePhoneHeroHeadline />
      </div>

      <HeroTriagePreview
        fontClassName={suisseIntl.className}
        size="mobile"
        className="doephone-hero-triage-preview z-[2]"
      />
    </section>
  );
}
