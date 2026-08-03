"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

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
}: {
  slide: DoeHealthTopBannerSlide;
  phase: "current" | "out" | "in";
}) {
  return (
    <p
      className={`doe-home-top-banner__text doehealth-top-banner__text doehealth-top-banner__slide doehealth-top-banner__slide--${phase} ${inter.className}`}
    >
      <span>{slide.message}</span>
      <Link href={slide.linkHref} className="doe-home-top-banner__link">
        {slide.linkLabel}
        <BannerArrow />
      </Link>
    </p>
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
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null);
  const [isCrossfading, setIsCrossfading] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const activeIndexRef = useRef(activeIndex);

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

  useEffect(() => {
    if (!carouselSlides || carouselSlides.length <= 1) return undefined;

    const interval = window.setInterval(() => {
      const nextIndex = (activeIndexRef.current + 1) % carouselSlides.length;

      if (reduceMotion) {
        setActiveIndex(nextIndex);
        setIncomingIndex(null);
        setIsCrossfading(false);
        return;
      }

      setIncomingIndex(nextIndex);
    }, rotateIntervalMs);

    return () => window.clearInterval(interval);
  }, [carouselSlides, reduceMotion, rotateIntervalMs]);

  useLayoutEffect(() => {
    if (incomingIndex === null || reduceMotion) return undefined;

    setIsCrossfading(false);

    let finishTimeout = 0;
    let startRaf = 0;

    startRaf = requestAnimationFrame(() => {
      startRaf = requestAnimationFrame(() => {
        setIsCrossfading(true);
        finishTimeout = window.setTimeout(() => {
          setActiveIndex(incomingIndex);
          setIncomingIndex(null);
          setIsCrossfading(false);
        }, DOEHEALTH_TOP_BANNER_CROSSFADE_MS);
      });
    });

    return () => {
      cancelAnimationFrame(startRaf);
      window.clearTimeout(finishTimeout);
    };
  }, [incomingIndex, reduceMotion]);

  return (
    <div
      className={`doe-home-top-banner doehealth-top-banner${dismissed ? " doe-home-top-banner--dismissed" : ""}${carouselSlides ? " doehealth-top-banner--carousel" : ""}${isCrossfading ? " doehealth-top-banner--crossfading" : ""}`}
      role="region"
      aria-live={carouselSlides ? "polite" : undefined}
      aria-label={`${activeSlide.message} ${activeSlide.linkLabel}`}
    >
      {carouselSlides ? (
        <div className="doehealth-top-banner__viewport">
          {incomingIndex === null ? (
            <BannerSlideText slide={carouselSlides[activeIndex]} phase="current" />
          ) : (
            <>
              <BannerSlideText slide={carouselSlides[activeIndex]} phase="out" />
              <BannerSlideText slide={carouselSlides[incomingIndex]} phase="in" />
            </>
          )}
        </div>
      ) : (
        <p className={`doe-home-top-banner__text doehealth-top-banner__text ${inter.className}`}>
          <span>{activeSlide.message}</span>
          <Link href={activeSlide.linkHref} className="doe-home-top-banner__link">
            {activeSlide.linkLabel}
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
