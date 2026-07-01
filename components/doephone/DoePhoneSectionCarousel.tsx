"use client";

import { DoePhoneCommunicationCarouselCard } from "@/components/doephone/DoePhoneCommunicationCarouselCard";
import {
  DOEPHONE_COMMUNICATION_SLIDES,
  DOEPHONE_COMMUNICATION_SLIDE_COUNT,
  type DoePhoneCommunicationSlide,
} from "@/lib/doephone/communication-carousel";
import { PROTO_HERO_BACKDROP } from "@/lib/proto/proto-hero-backdrop";
import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";

type MenuInject = { scrollIndex: number; slideIndex: number };

function scrollPositionPx(
  scrollRef: RefObject<HTMLDivElement>,
  position: number,
  behavior: ScrollBehavior = "auto",
) {
  const el = scrollRef.current;
  if (!el) return;
  const w = el.clientWidth;
  if (w <= 0) return;
  el.scrollTo({ left: position * w, behavior });
}

function forwardSteps(from: number, to: number): number {
  if (from === to) return 0;
  return (to - from + DOEPHONE_COMMUNICATION_SLIDE_COUNT) % DOEPHONE_COMMUNICATION_SLIDE_COUNT;
}

function waitCarouselScrollEnd(el: HTMLDivElement): Promise<void> {
  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      el.removeEventListener("scrollend", onScrollEnd);
      window.clearTimeout(fallback);
      resolve();
    };
    const onScrollEnd = () => finish();
    const fallback = window.setTimeout(finish, 520);
    el.addEventListener("scrollend", onScrollEnd);
  });
}

function slideForScrollIndex(
  scrollIndex: number,
  menuInject: MenuInject | null,
): DoePhoneCommunicationSlide {
  if (menuInject && menuInject.scrollIndex === scrollIndex) {
    return DOEPHONE_COMMUNICATION_SLIDES[menuInject.slideIndex];
  }
  return DOEPHONE_COMMUNICATION_SLIDES[scrollIndex % DOEPHONE_COMMUNICATION_SLIDE_COUNT];
}

function logicalIndexForScrollPosition(position: number, menuInject: MenuInject | null): number {
  if (menuInject && position === menuInject.scrollIndex) {
    return menuInject.slideIndex;
  }
  return position % DOEPHONE_COMMUNICATION_SLIDE_COUNT;
}

/** Two full sets + tail clone for seamless manual wrap at slide 8→0. */
function buildLoopScrollCount() {
  return DOEPHONE_COMMUNICATION_SLIDE_COUNT * 2 + 1;
}

export function useDoePhoneSectionCarousel(activeIndex: number, onActiveIndexChange: (index: number) => void) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const loopingRef = useRef(false);
  const menuAnimatingRef = useRef(false);
  const activeIndexRef = useRef(activeIndex);
  const menuInjectRef = useRef<MenuInject | null>(null);
  const scrollEndTimerRef = useRef<number | undefined>(undefined);
  const [menuInject, setMenuInject] = useState<MenuInject | null>(null);

  const loopScrollCount = useMemo(() => buildLoopScrollCount(), []);
  const loopScrollIndices = useMemo(
    () => Array.from({ length: loopScrollCount }, (_, i) => i),
    [loopScrollCount],
  );

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    menuInjectRef.current = menuInject;
  }, [menuInject]);

  const scrollToPosition = useCallback(
    (position: number, behavior: ScrollBehavior = "smooth") => {
      scrollPositionPx(scrollRef, position, behavior);
    },
    [],
  );

  const normalizeToFirstCopy = useCallback(
    (logicalIndex: number) => {
      loopingRef.current = true;
      onActiveIndexChange(logicalIndex);
      activeIndexRef.current = logicalIndex;
      scrollPositionPx(scrollRef, logicalIndex, "auto");
      requestAnimationFrame(() => {
        loopingRef.current = false;
      });
    },
    [onActiveIndexChange],
  );

  const settleScrollPosition = useCallback(() => {
    if (loopingRef.current || menuAnimatingRef.current) return;
    const el = scrollRef.current;
    if (!el) return;
    const w = el.clientWidth;
    if (w <= 0) return;

    const position = Math.round(el.scrollLeft / w);
    const inject = menuInjectRef.current;

    if (position === DOEPHONE_COMMUNICATION_SLIDE_COUNT * 2) {
      normalizeToFirstCopy(0);
      return;
    }

    if (position >= DOEPHONE_COMMUNICATION_SLIDE_COUNT) {
      normalizeToFirstCopy(logicalIndexForScrollPosition(position, inject));
      return;
    }

    if (position >= 0 && position < DOEPHONE_COMMUNICATION_SLIDE_COUNT) {
      onActiveIndexChange(logicalIndexForScrollPosition(position, inject));
    }
  }, [normalizeToFirstCopy, onActiveIndexChange]);

  const selectSlide = useCallback(
    async (targetIndex: number) => {
      if (menuAnimatingRef.current) return;
      if (targetIndex < 0 || targetIndex >= DOEPHONE_COMMUNICATION_SLIDE_COUNT) return;

      const startIndex = activeIndexRef.current;
      const steps = forwardSteps(startIndex, targetIndex);
      if (steps === 0) return;

      const el = scrollRef.current;
      if (!el) return;

      menuAnimatingRef.current = true;

      try {
        const jumpPos = DOEPHONE_COMMUNICATION_SLIDE_COUNT + startIndex;
        const nextPos = jumpPos + 1;

        if (steps > 1) {
          const inject: MenuInject = { scrollIndex: nextPos, slideIndex: targetIndex };
          menuInjectRef.current = inject;
          setMenuInject(inject);
          scrollPositionPx(scrollRef, jumpPos, "auto");
          await new Promise<void>((resolve) => {
            requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
          });
          scrollToPosition(nextPos, "smooth");
          await waitCarouselScrollEnd(el);
          setMenuInject(null);
          menuInjectRef.current = null;
          normalizeToFirstCopy(targetIndex);
          return;
        }

        scrollToPosition(
          startIndex === DOEPHONE_COMMUNICATION_SLIDE_COUNT - 1
            ? DOEPHONE_COMMUNICATION_SLIDE_COUNT
            : startIndex + 1,
          "smooth",
        );
        await waitCarouselScrollEnd(el);

        if (startIndex === DOEPHONE_COMMUNICATION_SLIDE_COUNT - 1) {
          normalizeToFirstCopy(0);
        } else {
          onActiveIndexChange(targetIndex);
          activeIndexRef.current = targetIndex;
        }
      } finally {
        menuAnimatingRef.current = false;
      }
    },
    [normalizeToFirstCopy, onActiveIndexChange, scrollToPosition],
  );

  const handleScroll = useCallback(() => {
    if (loopingRef.current || menuAnimatingRef.current) return;
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
    loopScrollIndices,
    menuInject,
    selectSlide,
    handleScroll,
  };
}

export function DoePhoneSectionCarousel({
  activeIndex,
  scrollRef,
  loopScrollIndices,
  menuInject,
  onScroll,
  variant = "home",
}: {
  activeIndex: number;
  scrollRef: RefObject<HTMLDivElement>;
  loopScrollIndices: number[];
  menuInject: MenuInject | null;
  onScroll: () => void;
  variant?: "home" | "proto";
}) {
  return (
    <div
      ref={scrollRef}
      className="doephone-section-carousel flex h-full w-full shrink-0 snap-x snap-mandatory flex-row overflow-x-auto overflow-y-visible [scrollbar-width:none] [-ms-overflow-style:none] [touch-action:pan-y_pinch-zoom] [&::-webkit-scrollbar]:hidden"
      style={{ WebkitOverflowScrolling: "touch" }}
      aria-label="Communication features"
      onScroll={onScroll}
    >
      {loopScrollIndices.map((scrollIndex) => {
        const slide = slideForScrollIndex(scrollIndex, menuInject);
        const logicalIndex = logicalIndexForScrollPosition(scrollIndex, menuInject);
        const isActive = logicalIndex === activeIndex;
        const isPrimaryPanel = scrollIndex < DOEPHONE_COMMUNICATION_SLIDE_COUNT;

        return (
          <div
            key={`comm-scroll-${scrollIndex}`}
            id={isPrimaryPanel ? `doephone-comm-slide-${slide.id}` : undefined}
            className="box-border h-full w-full min-w-full shrink-0 snap-center snap-always"
            role="tabpanel"
            aria-hidden={!isActive}
          >
            <DoePhoneCommunicationCarouselCard
              slide={slide}
              isActive={isActive}
              layout="phone"
              gradientOverride={
                variant === "proto" && slide.id === "agents"
                  ? PROTO_HERO_BACKDROP.gradient
                  : undefined
              }
            />
          </div>
        );
      })}
    </div>
  );
}
