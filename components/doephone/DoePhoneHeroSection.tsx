"use client";

import { DoePhoneHeroHeadline } from "@/components/doephone/DoePhoneHeroHeadline";
import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import { DOEPHONE_SECTION_COPY_INSET } from "@/lib/doephone/section-styles";
import { DOEPHONE_HERO_WAITLIST_CLASS } from "@/lib/doephone/waitlist-button";
import { DOEPHONE_HERO_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";
import { useCallback, useEffect, useRef, useState } from "react";

/** Full first-screen hero — extra depth below the fold so beige never peeks on load. */
export const DOEPHONE_HERO_HEIGHT =
  "calc(112svh + max(8rem, calc(env(safe-area-inset-top, 0px) + 3.5rem)))";

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
  const [gradientZoom, setGradientZoom] = useState(1);

  const updateZoom = useCallback(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const heroTop = hero.offsetTop;
    const heroHeight = hero.offsetHeight;
    const scrolledIntoHero = Math.max(0, window.scrollY - heroTop);
    setGradientZoom(gradientZoomFromScroll(scrolledIntoHero, heroHeight));
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    updateZoom();
    window.addEventListener("scroll", updateZoom, { passive: true });
    window.addEventListener("resize", updateZoom);
    return () => {
      window.removeEventListener("scroll", updateZoom);
      window.removeEventListener("resize", updateZoom);
    };
  }, [updateZoom]);

  return (
    <section
      ref={heroRef}
      className="relative w-full overflow-hidden"
      style={{ minHeight: DOEPHONE_HERO_HEIGHT, height: DOEPHONE_HERO_HEIGHT }}
      aria-label="Hero"
    >
      <WorkflowCarouselDesignBackdrop
        backdrop={DOEPHONE_HERO_BACKDROP}
        embedded
        introOnLoad
        gradientScale={gradientZoom}
      />

      <div
        className={`absolute inset-0 z-[3] flex flex-col items-start justify-start pt-[max(9rem,calc(env(safe-area-inset-top,0px)+31svh))] pb-8 ${DOEPHONE_SECTION_COPY_INSET}`}
      >
        <DoePhoneHeroHeadline />
        <a href="#" className={DOEPHONE_HERO_WAITLIST_CLASS}>
          Join Waitlist
        </a>
      </div>
    </section>
  );
}
