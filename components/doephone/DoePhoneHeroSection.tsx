"use client";

import { DoePhoneHeroHeadline } from "@/components/doephone/DoePhoneHeroHeadline";
import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import {
  DOEPHONE_HERO_INTRO_GRADIENT_MS,
  DOEPHONE_HERO_INTRO_GRADIENT_START,
  doephoneHeroIntroStyleVars,
} from "@/lib/doephone/hero-intro-timing";
import {
  DOEPHONE_DESKTOP_PAGE_INSET_LEFT,
  DOEPHONE_HERO_COPY_INSET,
} from "@/lib/doephone/section-styles";
import { CARE_COORDINATION_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";
import { useEffect, useState, type CSSProperties } from "react";

/** Hero — slightly below full viewport so Safari bottom bar does not clip; section 2 stays full height. */
export const DOEPHONE_HERO_HEIGHT =
  "calc(var(--app-vh,100lvh)*0.88 + max(8rem, calc(env(safe-area-inset-top, 0px) + 3.5rem)))";

const DOEPHONE_HERO_DESKTOP_HEIGHT = "100dvh";

export function DoePhoneHeroSection({
  variant = "mobile",
}: {
  /** Desktop home uses full viewport height and wider copy gutters. */
  variant?: "mobile" | "desktop";
}) {
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
  const isDesktop = variant === "desktop";
  const heroHeight = isDesktop ? DOEPHONE_HERO_DESKTOP_HEIGHT : DOEPHONE_HERO_HEIGHT;
  const copyInset = isDesktop ? DOEPHONE_DESKTOP_PAGE_INSET_LEFT : DOEPHONE_HERO_COPY_INSET;
  const copyBottom = isDesktop
    ? "bottom-[clamp(5rem,16vh,10rem)]"
    : "bottom-[clamp(2.75rem,9vmin,4.25rem)]";

  return (
    <section
      className="doephone-hero-section relative w-full overflow-hidden bg-[#D2774C]"
      style={
        {
          minHeight: heroHeight,
          height: heroHeight,
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
        className={`absolute left-0 right-0 z-[3] ${copyInset} ${copyBottom}`}
      >
        <div className="doephone-hero-copy pointer-events-none w-full min-w-0">
          <DoePhoneHeroHeadline />
        </div>
      </div>
    </section>
  );
}
