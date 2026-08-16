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

function scrollToSlide(carousel: HTMLDivElement, index: number, behavior: ScrollBehavior = "smooth") {
  const target = carousel.querySelector<HTMLElement>(
    `.story-introduction-carousel__slide:nth-child(${index + 1})`,
  );
  target?.scrollIntoView({ behavior, inline: "center", block: "nearest" });
}

/** Introduction tab — modal-shaped deck preview carousel with progress dots. */
export function StoryIntroductionCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(STORY_INTRODUCTION_CAROUSEL_INITIAL_SLIDE_INDEX);

  useLayoutEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    scrollToSlide(carousel, STORY_INTRODUCTION_CAROUSEL_INITIAL_SLIDE_INDEX, "auto");
    setActiveSlide(STORY_INTRODUCTION_CAROUSEL_INITIAL_SLIDE_INDEX);
  }, []);

  const goToSlide = useCallback((index: number) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const nextIndex = Math.min(STORY_INTRODUCTION_CAROUSEL_SLIDE_COUNT - 1, Math.max(0, index));
    scrollToSlide(carousel, nextIndex);
    setActiveSlide(nextIndex);
  }, []);

  return (
    <div className="story-introduction-carousel" aria-label="Story deck preview">
      <div className="story-introduction-carousel__stack">
        <div className="story-introduction-carousel__panel">
          <div
            ref={carouselRef}
            className="story-introduction-carousel__track"
            aria-label="Introduction preview slides"
            onScroll={(event) => {
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
