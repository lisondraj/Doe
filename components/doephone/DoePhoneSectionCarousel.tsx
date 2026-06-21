"use client";

import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import {
  DOEPHONE_COMMUNICATION_SLIDES,
  DOEPHONE_COMMUNICATION_SLIDE_COUNT,
} from "@/lib/doephone/communication-carousel";
import { DOEPHONE_SECTION_CAROUSEL_RADIUS } from "@/lib/doephone/section-styles";
import type { WorkflowCarouselDesignBackdrop as WorkflowCarouselDesignBackdropType } from "@/lib/workflow-carousel-design-backdrops";
import { useCallback, useEffect, useMemo, useRef, type RefObject } from "react";

const LOOP_TAIL_CLONE = DOEPHONE_COMMUNICATION_SLIDES[0];

function DoePhoneCarouselCard({ backdrop }: { backdrop: WorkflowCarouselDesignBackdropType }) {
  return (
    <div
      className={`relative isolate h-full w-full overflow-hidden shadow-[0_10px_32px_rgba(0,0,0,0.1)] [contain:layout_paint] ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
      aria-hidden
    >
      <WorkflowCarouselDesignBackdrop
        backdrop={backdrop}
        embedded
        className={DOEPHONE_SECTION_CAROUSEL_RADIUS}
      />
    </div>
  );
}

function scrollPositionPx(scrollRef: RefObject<HTMLDivElement>, position: number) {
  const el = scrollRef.current;
  if (!el) return;
  const w = el.clientWidth;
  if (w <= 0) return;
  el.scrollTo({ left: position * w, behavior: "auto" });
}

export function useDoePhoneSectionCarousel(activeIndex: number, onActiveIndexChange: (index: number) => void) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const loopingRef = useRef(false);
  const scrollEndTimerRef = useRef<number | undefined>(undefined);

  const loopSlides = useMemo(
    () => [...DOEPHONE_COMMUNICATION_SLIDES, LOOP_TAIL_CLONE],
    [],
  );

  const scrollToPosition = useCallback(
    (position: number, behavior: ScrollBehavior = "smooth") => {
      const el = scrollRef.current;
      if (!el) return;
      const w = el.clientWidth;
      if (w <= 0) return;
      el.scrollTo({ left: position * w, behavior });
    },
    [],
  );

  const settleScrollPosition = useCallback(() => {
    if (loopingRef.current) return;
    const el = scrollRef.current;
    if (!el) return;
    const w = el.clientWidth;
    if (w <= 0) return;

    const position = Math.round(el.scrollLeft / w);

    if (position === DOEPHONE_COMMUNICATION_SLIDE_COUNT) {
      loopingRef.current = true;
      onActiveIndexChange(0);
      scrollPositionPx(scrollRef, 0);
      requestAnimationFrame(() => {
        loopingRef.current = false;
      });
      return;
    }

    if (position >= 0 && position < DOEPHONE_COMMUNICATION_SLIDE_COUNT) {
      onActiveIndexChange(position);
    }
  }, [onActiveIndexChange]);

  const selectSlide = useCallback(
    (targetIndex: number) => {
      if (targetIndex === activeIndex) return;
      if (targetIndex < 0 || targetIndex >= DOEPHONE_COMMUNICATION_SLIDE_COUNT) return;

      if (activeIndex === DOEPHONE_COMMUNICATION_SLIDE_COUNT - 1 && targetIndex === 0) {
        scrollToPosition(DOEPHONE_COMMUNICATION_SLIDE_COUNT, "smooth");
        return;
      }

      scrollToPosition(targetIndex, "smooth");
    },
    [activeIndex, scrollToPosition],
  );

  const handleScroll = useCallback(() => {
    if (loopingRef.current) return;
    window.clearTimeout(scrollEndTimerRef.current);
    scrollEndTimerRef.current = window.setTimeout(settleScrollPosition, 90);
  }, [settleScrollPosition]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScrollEnd = () => settleScrollPosition();
    el.addEventListener("scrollend", onScrollEnd);
    return () => {
      el.removeEventListener("scrollend", onScrollEnd);
      window.clearTimeout(scrollEndTimerRef.current);
    };
  }, [settleScrollPosition]);

  return {
    scrollRef,
    loopSlides,
    selectSlide,
    handleScroll,
  };
}

export function DoePhoneSectionCarousel({
  activeIndex,
  scrollRef,
  loopSlides,
  onScroll,
}: {
  activeIndex: number;
  scrollRef: RefObject<HTMLDivElement>;
  loopSlides: typeof DOEPHONE_COMMUNICATION_SLIDES;
  onScroll: () => void;
}) {
  return (
    <div
      ref={scrollRef}
      className="flex h-full w-full shrink-0 touch-pan-x snap-x snap-mandatory flex-row overflow-x-auto overflow-y-hidden overscroll-y-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      style={{ WebkitOverflowScrolling: "touch" }}
      aria-label="Communication features"
      onScroll={onScroll}
    >
      {loopSlides.map((slide, index) => {
        const logicalIndex =
          index === DOEPHONE_COMMUNICATION_SLIDE_COUNT ? 0 : index;
        const isActive = logicalIndex === activeIndex;

        return (
          <div
            key={`${slide.id}-${index}`}
            id={index < DOEPHONE_COMMUNICATION_SLIDE_COUNT ? `doephone-comm-slide-${slide.id}` : undefined}
            className="box-border h-full w-full min-w-full shrink-0 snap-center snap-always"
            role="tabpanel"
            aria-hidden={!isActive}
          >
            <DoePhoneCarouselCard backdrop={slide.backdrop} />
          </div>
        );
      })}
    </div>
  );
}
