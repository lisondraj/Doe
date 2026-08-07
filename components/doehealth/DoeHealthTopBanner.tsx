"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { inter } from "@/lib/home/fonts";
import type { DoeHealthTopBannerSlide } from "@/lib/doehealth/doehealth-top-banner-slides";
import {
  DOEHEALTH_TOP_BANNER_CROSSFADE_MS,
  DOEHEALTH_TOP_BANNER_ROTATE_MS,
  DOEHEALTH_TOP_BANNER_SLIDES,
} from "@/lib/doehealth/doehealth-top-banner-slides";

function BannerArrow() {
  return (
    <svg
      className="doe-home-top-banner__arrow"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
    >
      <path
        d="M2.5 6h7M6.75 3.25 9.5 6 6.75 8.75"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BannerSlideText({
  slide,
  phase,
  animate = false,
  onEnterComplete,
}: {
  slide: DoeHealthTopBannerSlide;
  phase: "current" | "out" | "in";
  animate?: boolean;
  onEnterComplete?: () => void;
}) {
  const handleAnimationEnd = useCallback(
    (event: React.AnimationEvent<HTMLParagraphElement>) => {
      if (phase !== "in" || !animate) return;
      if (event.currentTarget !== event.target) return;
      if (event.animationName !== "doehealth-banner-in") return;
      onEnterComplete?.();
    },
    [animate, onEnterComplete, phase],
  );

  return (
    <div
      className={`doehealth-top-banner__slide-wrap doehealth-top-banner__slide-wrap--${phase}${animate ? " doehealth-top-banner__slide-wrap--animate" : ""}`}
    >
      <p
        className={`doe-home-top-banner__text doehealth-top-banner__text doehealth-top-banner__slide doehealth-top-banner__slide--${phase}${animate ? " doehealth-top-banner__slide--animate" : ""} ${inter.className}`}
        onAnimationEnd={handleAnimationEnd}
      >
        <span>{slide.message}</span>
        <Link href={slide.linkHref} className="doe-home-top-banner__link">
          <span className="doe-home-top-banner__link-label">{slide.linkLabel}</span>
          <BannerArrow />
        </Link>
      </p>
    </div>
  );
}

type DoeHealthTopBannerProps = {
  dismissPastHero?: boolean;
  message?: string;
  linkLabel?: string;
  linkHref?: string;
  slides?: readonly DoeHealthTopBannerSlide[];
  rotateIntervalMs?: number;
};

/** doehealth.care landing banner — pinned above nav; desktop dismisses after the hero. */
export function DoeHealthTopBanner({
  dismissPastHero = false,
  message = "Learn more about Doe's vision",
  linkLabel = "Read more",
  linkHref = "/about",
  slides,
  rotateIntervalMs = DOEHEALTH_TOP_BANNER_ROTATE_MS,
}: DoeHealthTopBannerProps = {}) {
  const [dismissed, setDismissed] = useState(false);
  const carouselSlides = slides && slides.length > 0 ? slides : null;
  const [activeIndex, setActiveIndex] = useState(0);
  const [transition, setTransition] = useState<{ from: number; to: number } | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const activeIndexRef = useRef(activeIndex);
  const isTransitioningRef = useRef(false);
  const transitionRef = useRef<{ from: number; to: number } | null>(null);

  const staticSlide = carouselSlides ? null : { message, linkLabel, linkHref };
  const activeSlide = carouselSlides ? carouselSlides[activeIndex] : staticSlide!;

  useLayoutEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useLayoutEffect(() => {
    if (!dismissPastHero) return undefined;

    const html = document.documentElement;
    let heroEl: HTMLElement | null = null;

    const sync = () => {
      heroEl ??= document.querySelector<HTMLElement>(".doephone-hero-section");
      const pastHero = heroEl
        ? heroEl.getBoundingClientRect().bottom <= 0
        : window.scrollY >= window.innerHeight;

      setDismissed(pastHero);
      if (pastHero) {
        html.setAttribute("data-home-banner-dismissed", "true");
      } else {
        html.removeAttribute("data-home-banner-dismissed");
      }
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);

    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      html.removeAttribute("data-home-banner-dismissed");
    };
  }, [dismissPastHero]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const completeTransition = useCallback(() => {
    const current = transitionRef.current;
    if (!current) return;

    transitionRef.current = null;
    activeIndexRef.current = current.to;
    setActiveIndex(current.to);
    setTransition(null);
    isTransitioningRef.current = false;
  }, []);

  useEffect(() => {
    if (!carouselSlides || carouselSlides.length <= 1) return undefined;

    const interval = window.setInterval(() => {
      if (isTransitioningRef.current) return;

      const nextIndex = (activeIndexRef.current + 1) % carouselSlides.length;

      if (reduceMotion) {
        setActiveIndex(nextIndex);
        activeIndexRef.current = nextIndex;
        return;
      }

      isTransitioningRef.current = true;
      const nextTransition = { from: activeIndexRef.current, to: nextIndex };
      transitionRef.current = nextTransition;
      setTransition(nextTransition);
    }, rotateIntervalMs);

    return () => window.clearInterval(interval);
  }, [carouselSlides, reduceMotion, rotateIntervalMs]);

  useEffect(() => {
    if (!transition || reduceMotion) return undefined;

    const fallback = window.setTimeout(completeTransition, DOEHEALTH_TOP_BANNER_CROSSFADE_MS + 80);
    return () => window.clearTimeout(fallback);
  }, [completeTransition, reduceMotion, transition]);

  return (
    <div
      className={`doe-home-top-banner doehealth-top-banner${dismissed ? " doe-home-top-banner--dismissed" : ""}${carouselSlides ? " doehealth-top-banner--carousel" : ""}`}
      role="region"
      aria-live={carouselSlides ? "polite" : undefined}
      aria-label={`${activeSlide.message} ${activeSlide.linkLabel}`}
    >
      {carouselSlides ? (
        <div className="doehealth-top-banner__viewport">
          {transition ? (
            <>
              <BannerSlideText slide={carouselSlides[transition.from]} phase="out" animate />
              <BannerSlideText
                slide={carouselSlides[transition.to]}
                phase="in"
                animate
                onEnterComplete={completeTransition}
              />
            </>
          ) : (
            <BannerSlideText slide={carouselSlides[activeIndex]} phase="current" />
          )}
        </div>
      ) : (
        <p className={`doe-home-top-banner__text doehealth-top-banner__text ${inter.className}`}>
          <span>{activeSlide.message}</span>
          <Link href={activeSlide.linkHref} className="doe-home-top-banner__link">
            <span className="doe-home-top-banner__link-label">{activeSlide.linkLabel}</span>
            <BannerArrow />
          </Link>
        </p>
      )}
    </div>
  );
}

/** /doehealth home — rotating vision + product intro slides. */
export function DoeHealthHomeTopBanner({ dismissPastHero = false }: { dismissPastHero?: boolean } = {}) {
  return <DoeHealthTopBanner dismissPastHero={dismissPastHero} slides={DOEHEALTH_TOP_BANNER_SLIDES} />;
}
