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
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

/** Full first-screen hero — extra depth below the fold so beige never peeks on load. */
export const DOEPHONE_HERO_HEIGHT =
  "calc(var(--app-vh,100lvh)*1.12 + max(8rem, calc(env(safe-area-inset-top, 0px) + 3.5rem)))";

/** No gradient zoom until this share of hero scroll travel. */
const GRADIENT_ZOOM_FREEZE_RATIO = 0.16;
/** Gradient zoom completes over this share of hero scroll after freeze. */
const GRADIENT_ZOOM_RANGE_RATIO = 0.58;
const GRADIENT_ZOOM_MAX = 1.72;

function gradientZoomFromScroll(scrolledPx: number, heroHeightPx: number): number {
  if (heroHeightPx <= 0) return 1;
  const freezePx = heroHeightPx * GRADIENT_ZOOM_FREEZE_RATIO;
  const rangePx = heroHeightPx * GRADIENT_ZOOM_RANGE_RATIO;
  if (scrolledPx <= freezePx) return 1;
  const t = Math.min(1, (scrolledPx - freezePx) / rangePx);
  const eased = t * t * (3 - 2 * t);
  return 1 + eased * (GRADIENT_ZOOM_MAX - 1);
}

export function DoePhoneHeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const [introZoom, setIntroZoom] = useState(DOEPHONE_HERO_INTRO_GRADIENT_START);
  const [introDone, setIntroDone] = useState(false);
  const [scrollZoom, setScrollZoom] = useState(1);

  const updateZoom = useCallback(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const heroTop = hero.offsetTop;
    const heroHeight = hero.offsetHeight;
    const scrolledIntoHero = Math.max(0, window.scrollY - heroTop);
    setScrollZoom(gradientZoomFromScroll(scrolledIntoHero, heroHeight));
  }, []);

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

  useEffect(() => {
    if (!introDone) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    updateZoom();
    window.addEventListener("scroll", updateZoom, { passive: true });
    window.addEventListener("resize", updateZoom);
    return () => {
      window.removeEventListener("scroll", updateZoom);
      window.removeEventListener("resize", updateZoom);
    };
  }, [introDone, updateZoom]);

  const gradientZoom = introDone ? scrollZoom : introZoom;

  return (
    <section
      ref={heroRef}
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
        className={`doephone-hero-copy absolute inset-0 z-[3] flex min-w-0 flex-col items-start justify-start overflow-visible pt-[max(9rem,calc(env(safe-area-inset-top,0px)+calc(var(--app-vh,100lvh)*0.31)))] pb-[clamp(1.5rem,5vmin,2.5rem)] ${DOEPHONE_HERO_COPY_INSET}`}
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
