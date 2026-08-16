"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";

import { StoryShaderPosterFill } from "@/components/story/StoryShaderPosterFill";
import { suisseIntl } from "@/lib/home/fonts";
import { DOEPHONE_DISPLAY_WEIGHT_TW } from "@/lib/doephone/section-styles";
import {
  STORY_INTRODUCTION_CAROUSEL_INITIAL_SLIDE_INDEX,
  STORY_INTRODUCTION_CAROUSEL_SLIDE_COUNT,
  STORY_INTRODUCTION_CAROUSEL_SLIDES,
  type StoryIntroductionCarouselSlide,
} from "@/lib/story/story-introduction-carousel";
import "@/lib/doehealth/doehealth-landing.css";

function IntroductionCarouselSlide({
  slide,
  isActive,
}: {
  slide: StoryIntroductionCarouselSlide;
  isActive: boolean;
}) {
  const isHero = slide.layout === "hero";
  const isStack = slide.layout === "stack";
  const isContact = slide.layout === "contact";

  return (
    <div
      className={`story-introduction-carousel__slide${isActive ? " story-introduction-carousel__slide--active" : ""}`}
    >
      <div className="story-introduction-carousel__backdrop">
        <StoryShaderPosterFill
          src={slide.posterSrc}
          className="story-introduction-carousel__shader"
        />
        <div
          className={`story-introduction-carousel__title doehealth-hero-headline ${DOEPHONE_DISPLAY_WEIGHT_TW} ${suisseIntl.className}${isHero ? " story-introduction-carousel__title--hero" : ""}${isStack ? " story-introduction-carousel__title--stack" : ""}${isContact ? " story-introduction-carousel__title--contact" : ""}`}
        >
          {slide.lines.map((line, lineIndex) => {
            const href = slide.links?.[lineIndex];

            if (isContact && href) {
              return (
                <a
                  key={slide.id + line}
                  href={href}
                  className="story-introduction-carousel__title-line story-introduction-carousel__title-link"
                  {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                >
                  {line}
                </a>
              );
            }

            return (
              <span key={slide.id + line} className="story-introduction-carousel__title-line">
                {line}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function readActiveSlideIndex(carousel: HTMLDivElement) {
  const slides = carousel.querySelectorAll<HTMLElement>(".story-introduction-carousel__slide");
  if (slides.length === 0) return STORY_INTRODUCTION_CAROUSEL_INITIAL_SLIDE_INDEX;

  const center = carousel.scrollLeft + carousel.clientWidth / 2;
  let closestIndex = 0;
  let closestDistance = Number.POSITIVE_INFINITY;

  slides.forEach((slide, index) => {
    const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
    const distance = Math.abs(center - slideCenter);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  return closestIndex;
}

function isSlideCentered(carousel: HTMLDivElement, index: number, tolerance = 24) {
  const slides = carousel.querySelectorAll<HTMLElement>(".story-introduction-carousel__slide");
  const target = slides[index];
  if (!target || target.offsetWidth <= 0 || carousel.clientWidth <= 0) return false;

  const carouselCenter = carousel.scrollLeft + carousel.clientWidth / 2;
  const slideCenter = target.offsetLeft + target.offsetWidth / 2;
  return Math.abs(carouselCenter - slideCenter) <= tolerance;
}

function scrollToSlide(carousel: HTMLDivElement, index: number, behavior: ScrollBehavior = "smooth") {
  const slides = carousel.querySelectorAll<HTMLElement>(".story-introduction-carousel__slide");
  const target = slides[index];
  if (!target || target.offsetWidth <= 0 || carousel.clientWidth <= 0) return false;

  const left = target.offsetLeft - (carousel.clientWidth - target.offsetWidth) / 2;
  const nextLeft = Math.max(0, left);

  if (behavior === "auto") {
    carousel.scrollLeft = nextLeft;
  } else {
    carousel.scrollTo({ left: nextLeft, behavior });
  }

  return true;
}

/** Introduction tab — modal-shaped deck preview carousel with progress dots. */
export function StoryIntroductionCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const bootstrappingRef = useRef(true);
  const [activeSlide, setActiveSlide] = useState(STORY_INTRODUCTION_CAROUSEL_INITIAL_SLIDE_INDEX);
  const [isReady, setIsReady] = useState(false);

  useLayoutEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const initialIndex = STORY_INTRODUCTION_CAROUSEL_INITIAL_SLIDE_INDEX;
    let disposed = false;

    const finishBootstrap = () => {
      if (disposed || !bootstrappingRef.current) return;

      bootstrappingRef.current = false;
      carousel.classList.remove("story-introduction-carousel__track--bootstrapping");
      carousel.classList.add("story-introduction-carousel__track--ready");
      setActiveSlide(initialIndex);
      setIsReady(true);
      observer.disconnect();
    };

    const alignInitial = () => {
      if (disposed || !bootstrappingRef.current) return;

      carousel.classList.add("story-introduction-carousel__track--bootstrapping");

      const didScroll = scrollToSlide(carousel, initialIndex, "auto");
      if (!didScroll) return;

      if (isSlideCentered(carousel, initialIndex)) {
        finishBootstrap();
      }
    };

    const observer = new ResizeObserver(alignInitial);
    observer.observe(carousel);

    const panel = carousel.closest(".story-introduction-carousel__panel");
    const introPanel = carousel.closest(".story-introduction-panel");
    if (panel instanceof Element) observer.observe(panel);
    if (introPanel instanceof Element) observer.observe(introPanel);

    carousel.querySelectorAll(".story-introduction-carousel__slide").forEach((slide) => {
      observer.observe(slide);
    });

    alignInitial();

    const fallback = window.setTimeout(() => {
      if (disposed || !bootstrappingRef.current) return;

      scrollToSlide(carousel, initialIndex, "auto");
      finishBootstrap();
    }, 600);

    return () => {
      disposed = true;
      bootstrappingRef.current = false;
      window.clearTimeout(fallback);
      observer.disconnect();
    };
  }, []);

  const goToSlide = useCallback((index: number) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const nextIndex = Math.min(STORY_INTRODUCTION_CAROUSEL_SLIDE_COUNT - 1, Math.max(0, index));
    scrollToSlide(carousel, nextIndex);
    setActiveSlide(nextIndex);
  }, []);

  return (
    <div
      className={`story-introduction-carousel${isReady ? " story-introduction-carousel--ready" : ""}`}
      aria-label="Story deck preview"
    >
      <div className="story-introduction-carousel__stack">
        <div className="story-introduction-carousel__panel">
          <div
            ref={carouselRef}
            className="story-introduction-carousel__track story-introduction-carousel__track--bootstrapping"
            aria-label="Introduction preview slides"
            onScroll={(event) => {
              if (bootstrappingRef.current) return;
              setActiveSlide(readActiveSlideIndex(event.currentTarget));
            }}
          >
            {STORY_INTRODUCTION_CAROUSEL_SLIDES.map((slide, index) => (
              <IntroductionCarouselSlide key={slide.id} slide={slide} isActive={activeSlide === index} />
            ))}
          </div>
        </div>

        <div className="story-introduction-carousel__dots" role="tablist" aria-label="Slide pagination">
          {STORY_INTRODUCTION_CAROUSEL_SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-label={`${slide.ariaLabel} — slide ${index + 1} of ${STORY_INTRODUCTION_CAROUSEL_SLIDE_COUNT}`}
              aria-selected={activeSlide === index}
              className={`story-introduction-carousel__dot${activeSlide === index ? " story-introduction-carousel__dot--active" : ""}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
