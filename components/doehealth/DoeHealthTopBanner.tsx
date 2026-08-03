"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useState } from "react";

import { inter } from "@/lib/home/fonts";
import type { DoeHealthTopBannerSlide } from "@/lib/doehealth/doehealth-top-banner-slides";
import {
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
  const [slideVisible, setSlideVisible] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  const staticSlide = carouselSlides ? null : { message, linkLabel, linkHref };
  const activeSlide = carouselSlides ? carouselSlides[activeIndex] : staticSlide!;

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

    let fadeTimeout = 0;

    const interval = window.setInterval(() => {
      if (reduceMotion) {
        setActiveIndex((current) => (current + 1) % carouselSlides.length);
        return;
      }

      setSlideVisible(false);
      fadeTimeout = window.setTimeout(() => {
        setActiveIndex((current) => (current + 1) % carouselSlides.length);
        setSlideVisible(true);
      }, 320);
    }, rotateIntervalMs);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(fadeTimeout);
    };
  }, [carouselSlides, reduceMotion, rotateIntervalMs]);

  return (
    <div
      className={`doe-home-top-banner doehealth-top-banner${dismissed ? " doe-home-top-banner--dismissed" : ""}${carouselSlides ? " doehealth-top-banner--carousel" : ""}`}
      role="region"
      aria-live={carouselSlides ? "polite" : undefined}
      aria-label={`${activeSlide.message} ${activeSlide.linkLabel}`}
    >
      <p
        className={`doe-home-top-banner__text doehealth-top-banner__text ${inter.className}${carouselSlides && !slideVisible ? " doehealth-top-banner__text--hidden" : ""}${carouselSlides && slideVisible ? " doehealth-top-banner__text--visible" : ""}`}
      >
        <span>{activeSlide.message}</span>
        <Link href={activeSlide.linkHref} className="doe-home-top-banner__link">
          {activeSlide.linkLabel}
          <BannerArrow />
        </Link>
      </p>
    </div>
  );
}

/** /doehealth home — rotating vision + product intro slides. */
export function DoeHealthHomeTopBanner({ dismissPastHero = false }: { dismissPastHero?: boolean } = {}) {
  return <DoeHealthTopBanner dismissPastHero={dismissPastHero} slides={DOEHEALTH_TOP_BANNER_SLIDES} />;
}
