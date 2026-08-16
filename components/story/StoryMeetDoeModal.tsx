"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { lora, suisseIntl } from "@/lib/home/fonts";
import { DOEPHONE_DISPLAY_WEIGHT_TW } from "@/lib/doephone/section-styles";
import { ShaderBackdropImage } from "@/components/shared/ShaderBackdropImage";
import { preloadShaderBackdrop } from "@/lib/shader/shader-backdrop-preload";
import { STORY_MEET_DOE_MODAL_BACKDROPS } from "@/lib/story/story-meet-doe-backdrops";
import { STORY_MEET_DOE_MODAL_SHADERS } from "@/lib/story/story-contact-shader";
import { STORY_MEET_DOE_MODAL_ALWAYS_SHOW, STORY_MEET_DOE_MODAL_SLIDE_COUNT, STORY_MEET_DOE_MODAL_SLIDE_LINES, STORY_MEET_DOE_MODAL_STORAGE_KEY, storyMeetDoeModalShouldShow } from "@/lib/story/story-copy";
import "@/lib/doehealth/doehealth-landing.css";
import "@/lib/story/story-page.css";

const STORY_MEET_DOE_REVEAL_START_DELAY_MS = 350;

function clearStoryMeetDoePending() {
  document.documentElement.removeAttribute("data-story-meet-doe-pending");
}

function MeetDoeTitleChevron() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="story-meet-doe-modal__title-chevron"
    >
      <path d="m9.5 6.5 6 5.5-6 5.5" />
    </svg>
  );
}

function MeetDoeModalSlide({
  slideIndex,
  titleId,
  isRevealed,
}: {
  slideIndex: number;
  titleId?: string;
  isRevealed: boolean;
}) {
  const shader = STORY_MEET_DOE_MODAL_SHADERS[slideIndex] ?? STORY_MEET_DOE_MODAL_SHADERS[0];
  const backdropSrc = STORY_MEET_DOE_MODAL_BACKDROPS[slideIndex] ?? STORY_MEET_DOE_MODAL_BACKDROPS[0];
  const lines = STORY_MEET_DOE_MODAL_SLIDE_LINES[slideIndex] ?? STORY_MEET_DOE_MODAL_SLIDE_LINES[0];
  const isBrandWordmark = slideIndex === 0;
  const isStatement = !isBrandWordmark && lines.length === 2;
  const isProductStack = lines.length >= 4;
  const isCta = isStatement && lines[0] === "Learn more";

  return (
    <div className="story-meet-doe-modal__slide">
      <div
        className="story-meet-doe-modal__backdrop"
        style={{ backgroundColor: shader.colorBack }}
      >
        <ShaderBackdropImage
          src={backdropSrc}
          className="story-meet-doe-modal__backdrop-image"
        />
        <h1
          id={titleId}
          className={`story-meet-doe-modal__title${isBrandWordmark ? ` story-meet-doe-modal__title--brand ${lora.className}` : ` doehealth-hero-headline ${DOEPHONE_DISPLAY_WEIGHT_TW} ${suisseIntl.className}`}${isStatement ? " story-meet-doe-modal__title--statement" : ""}${isProductStack ? " story-meet-doe-modal__title--product-stack" : ""}${!isBrandWordmark && isRevealed ? " story-meet-doe-modal__title--revealed" : ""}`}
        >
          {lines.map((line, lineIndex) => (
            <span
              key={`${slideIndex}-${lineIndex}`}
              className={`story-meet-doe-modal__title-line${isBrandWordmark ? ` story-meet-doe-modal__title-line--brand ${lora.className}` : ""}${isCta && lineIndex === 1 ? " story-meet-doe-modal__title-line--cta" : ""}`}
            >
              {line}
              {isCta && lineIndex === 1 ? <MeetDoeTitleChevron /> : null}
            </span>
          ))}
        </h1>
      </div>
    </div>
  );
}

/** First-visit welcome modal for /story — /doehealth hero dusk shader + gold headline. */
export function StoryMeetDoeModal() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [revealedSlide, setRevealedSlide] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    setMounted(true);
    const shouldShow = storyMeetDoeModalShouldShow();
    if (!shouldShow) {
      clearStoryMeetDoePending();
      return;
    }

    void preloadShaderBackdrop(STORY_MEET_DOE_MODAL_BACKDROPS[0]).finally(() => {
      setOpen(true);
    });
  }, []);

  useLayoutEffect(() => {
    if (!mounted) return;
    if (!open) {
      clearStoryMeetDoePending();
    }
  }, [mounted, open]);

  useEffect(() => {
    return () => {
      clearStoryMeetDoePending();
    };
  }, []);

  useEffect(() => {
    if (!open) {
      setRevealedSlide(null);
      return undefined;
    }

    if (activeSlide === 0) {
      setRevealedSlide(0);
      return undefined;
    }

    setRevealedSlide(null);
    const timeout = window.setTimeout(() => {
      setRevealedSlide(activeSlide);
    }, STORY_MEET_DOE_REVEAL_START_DELAY_MS);

    return () => window.clearTimeout(timeout);
  }, [activeSlide, open]);

  const close = useCallback(() => {
    setOpen(false);
    clearStoryMeetDoePending();

    if (STORY_MEET_DOE_MODAL_ALWAYS_SHOW) return;

    try {
      sessionStorage.setItem(STORY_MEET_DOE_MODAL_STORAGE_KEY, "1");
    } catch {
      /* ignore storage failures */
    }
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [close, open]);

  const goToSlide = useCallback((index: number) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const nextIndex = Math.min(STORY_MEET_DOE_MODAL_SLIDE_COUNT - 1, Math.max(0, index));
    carousel.scrollTo({ left: nextIndex * carousel.clientWidth, behavior: "smooth" });
    setActiveSlide(nextIndex);
  }, []);

  const advance = useCallback(() => {
    const carousel = carouselRef.current;
    const width = carousel?.clientWidth ?? 0;
    const currentIndex =
      width > 0 && carousel
        ? Math.min(
            STORY_MEET_DOE_MODAL_SLIDE_COUNT - 1,
            Math.max(0, Math.round(carousel.scrollLeft / width)),
          )
        : activeSlide;

    if (currentIndex >= STORY_MEET_DOE_MODAL_SLIDE_COUNT - 1) {
      close();
      return;
    }

    goToSlide(currentIndex + 1);
  }, [activeSlide, close, goToSlide]);

  if (!mounted || !open) {
    return null;
  }

  return createPortal(
    <div className="story-meet-doe-modal fixed inset-0 z-[9999] flex items-center justify-center px-4 py-6">
      <button
        type="button"
        aria-label="Next slide"
        className="story-meet-doe-modal__scrim absolute inset-0"
        onClick={advance}
      />

      <div className="story-meet-doe-modal__stack relative z-[1]" onClick={advance}>
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="story-meet-doe-title"
          className="story-meet-doe-modal__panel"
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              advance();
            }
          }}
        >
          <div
            ref={carouselRef}
            className="story-meet-doe-modal__carousel"
            aria-label="Meet Doe introduction slides"
            onScroll={(event) => {
              const carousel = event.currentTarget;
              const width = carousel.clientWidth;
              if (width <= 0) return;

              setActiveSlide(
                Math.min(
                  STORY_MEET_DOE_MODAL_SLIDE_COUNT - 1,
                  Math.max(0, Math.round(carousel.scrollLeft / width)),
                ),
              );
            }}
          >
            {Array.from({ length: STORY_MEET_DOE_MODAL_SLIDE_COUNT }, (_, index) => (
              <MeetDoeModalSlide
                key={index}
                slideIndex={index}
                titleId={index === 0 ? "story-meet-doe-title" : undefined}
                isRevealed={revealedSlide === index}
              />
            ))}
          </div>
        </div>

        <div
          className="story-meet-doe-modal__dots"
          role="tablist"
          aria-label="Slide pagination"
          onClick={(event) => event.stopPropagation()}
        >
          {Array.from({ length: STORY_MEET_DOE_MODAL_SLIDE_COUNT }, (_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-label={`Slide ${index + 1} of ${STORY_MEET_DOE_MODAL_SLIDE_COUNT}`}
              aria-selected={activeSlide === index}
              className={`story-meet-doe-modal__dot${activeSlide === index ? " story-meet-doe-modal__dot--active" : ""}`}
              onClick={(event) => {
                event.stopPropagation();
                goToSlide(index);
              }}
            />
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
