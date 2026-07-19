"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type TransitionEvent,
} from "react";

import { DoePhoneClosingBandVisual } from "@/components/doephone/DoePhoneClosingBandVisual";
import { JOIN_INTERN_TRACKS } from "@/components/join/join-intern-tracks";
import { CLOSING_SECTION_CAROUSEL_ARTICLE_COUNT } from "@/lib/doephone/closing-section-styles";
import { BLOG_ARTICLES } from "@/lib/blog/articles";

const CLOSING_ARTICLE_COUNT = CLOSING_SECTION_CAROUSEL_ARTICLE_COUNT;
const CLOSING_FEATURE_ARTICLES = BLOG_ARTICLES.slice(0, CLOSING_ARTICLE_COUNT);

function graphicForIndex(index: number): 0 | 1 | 2 | 3 {
  return JOIN_INTERN_TRACKS[index % JOIN_INTERN_TRACKS.length].graphic;
}

function CarouselChevron({
  direction,
  onClick,
  label,
}: {
  direction: "left" | "right";
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      className={`home-closing-section__carousel-nav home-closing-section__carousel-nav--${direction}`}
      aria-label={label}
      onClick={onClick}
    >
      <span className="home-closing-section__carousel-nav-hit">
        <svg viewBox="0 0 16 16" fill="none" aria-hidden className="home-closing-section__carousel-nav-icon">
          {direction === "left" ? (
            <path
              d="M10 3L5 8l5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            <path
              d="M6 3l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
      </span>
    </button>
  );
}

/** Infinite horizontal blog carousel — fills space between title and fundraise note. */
export function DoePhoneClosingBlogCarousel() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState({
    slideStepPx: 0,
    slideWidthPx: 0,
    viewportWidthPx: 0,
  });
  const [position, setPosition] = useState(CLOSING_ARTICLE_COUNT);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const loopingRef = useRef(false);

  const loopSlides = useMemo(
    () => [...CLOSING_FEATURE_ARTICLES, ...CLOSING_FEATURE_ARTICLES, ...CLOSING_FEATURE_ARTICLES],
    [],
  );

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const firstSlide = viewport.querySelector<HTMLElement>(".home-closing-section__carousel-slide");
    if (!firstSlide) return;
    const track = viewport.querySelector(".home-closing-section__carousel-track");
    if (!track) return;
    const styles = getComputedStyle(track);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
    const slideWidthPx = firstSlide.offsetWidth;
    setMetrics({
      slideStepPx: slideWidthPx + gap,
      slideWidthPx,
      viewportWidthPx: viewport.offsetWidth,
    });
  }, []);

  useLayoutEffect(() => {
    measure();
    const viewport = viewportRef.current;
    if (!viewport) return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const normalizeLoop = useCallback((nextPosition: number) => {
    if (nextPosition >= CLOSING_ARTICLE_COUNT * 2) {
      return nextPosition - CLOSING_ARTICLE_COUNT;
    }
    if (nextPosition < CLOSING_ARTICLE_COUNT) {
      return nextPosition + CLOSING_ARTICLE_COUNT;
    }
    return nextPosition;
  }, []);

  const goNext = useCallback(() => {
    if (loopingRef.current) return;
    setTransitionEnabled(true);
    setPosition((current) => current + 1);
  }, []);

  const goPrev = useCallback(() => {
    if (loopingRef.current) return;
    setTransitionEnabled(true);
    setPosition((current) => current - 1);
  }, []);

  const handleTransitionEnd = useCallback(
    (event: TransitionEvent<HTMLDivElement>) => {
      if (event.propertyName !== "transform") return;
      if (loopingRef.current) return;

      const normalized = normalizeLoop(position);
      if (normalized === position) return;

      loopingRef.current = true;
      setTransitionEnabled(false);
      setPosition(normalized);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          loopingRef.current = false;
          setTransitionEnabled(true);
        });
      });
    },
    [normalizeLoop, position],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") goNext();
      if (event.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrev]);

  const translateX =
    metrics.slideStepPx > 0 && metrics.viewportWidthPx > 0
      ? metrics.viewportWidthPx / 2 - metrics.slideWidthPx / 2 - position * metrics.slideStepPx
      : 0;

  return (
    <div className="home-closing-section__carousel" aria-label="Featured updates">
      <div ref={viewportRef} className="home-closing-section__carousel-viewport">
        <div
          className={`home-closing-section__carousel-track${
            transitionEnabled ? " home-closing-section__carousel-track--transition" : ""
          }`}
          style={{ transform: `translate3d(${translateX}px, 0, 0)` }}
          onTransitionEnd={handleTransitionEnd}
        >
          {loopSlides.map((article, index) => (
            <div key={`${article.slug}-${index}`} className="home-closing-section__carousel-slide">
              <Link href={`/blog/${article.slug}`} className="home-closing-section__card group block h-full no-underline">
                <DoePhoneClosingBandVisual
                  graphic={graphicForIndex(index % CLOSING_ARTICLE_COUNT)}
                  title={article.title}
                  fillHeight
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
      <CarouselChevron direction="left" onClick={goPrev} label="Previous article" />
      <CarouselChevron direction="right" onClick={goNext} label="Next article" />
    </div>
  );
}
