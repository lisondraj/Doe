"use client";

import { DoePhoneCommunicationSlideVisual } from "@/components/doephone/DoePhoneCommunicationSlideVisual";
import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import {
  DOEPHONE_COMMUNICATION_SLIDES,
  DOEPHONE_COMMUNICATION_SLIDE_COUNT,
  type DoePhoneCommunicationSlide,
} from "@/lib/doephone/communication-carousel";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";
import {
  DOEPHONE_SECTION_CAROUSEL_CLIP_STYLE,
  DOEPHONE_SECTION_CAROUSEL_RADIUS,
} from "@/lib/doephone/section-styles";
import { inter } from "@/lib/home/fonts";
import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";

type MenuInject = { scrollIndex: number; slideIndex: number };

const ADD_BADGE_SIZE = "clamp(4.35rem,13.4vmin,5.4rem)";

/** Orange frosted glass — shared by the toggle badge and full-slide fill. */
const ORANGE_FROST_STYLE = {
  background: "rgba(210, 119, 76, 0.48)",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.38)",
} as const;

const FROST_BLUR_CLASS = "backdrop-blur-[10px] iphone-page:backdrop-blur-[8px]";

const EXPAND_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const EXPAND_DURATION = "720ms";
const EXPAND_DURATION_MS = 720;
const DESCRIPTION_PAD_X = "clamp(1.45rem,4.45vmin,1.95rem)";

type PanelPhase = "idle" | "open" | "closing";

function CarouselSlideToggleBadge({
  expanded,
  interactive,
  onToggle,
}: {
  expanded: boolean;
  interactive: boolean;
  onToggle: () => void;
}) {
  const sharedStyle = {
    bottom: "clamp(1.45rem,4.45vmin,1.85rem)",
    right: "clamp(1.45rem,4.45vmin,1.85rem)",
    width: ADD_BADGE_SIZE,
    height: ADD_BADGE_SIZE,
    ...ORANGE_FROST_STYLE,
  } as const;

  if (!interactive) {
    return (
      <span
        className={`pointer-events-none absolute z-30 flex items-center justify-center rounded-full ${FROST_BLUR_CLASS}`}
        style={sharedStyle}
        aria-hidden
      >
        <span
          className="font-light leading-none text-white"
          style={{
            fontSize: "clamp(2.85rem,8.85vmin,3.55rem)",
            marginTop: "-0.06em",
            textShadow: "0 1px 8px rgba(30, 52, 58, 0.18)",
          }}
        >
          +
        </span>
      </span>
    );
  }

  return (
    <button
      type="button"
      className={`absolute z-30 flex items-center justify-center rounded-full ${FROST_BLUR_CLASS} transition-[transform,opacity] duration-[720ms]`}
      style={{ ...sharedStyle, transitionTimingFunction: EXPAND_EASE }}
      aria-label={expanded ? "Close details" : "Show details"}
      aria-expanded={expanded}
      onClick={onToggle}
    >
      {expanded ? (
        <svg
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden
          className="shrink-0"
          style={{
            width: "clamp(1.85rem,5.75vmin,2.35rem)",
            height: "clamp(1.85rem,5.75vmin,2.35rem)",
          }}
        >
          <path
            d="M5 5l10 10M15 5L5 15"
            stroke="white"
            strokeWidth="1.35"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 1px 8px rgba(30, 52, 58, 0.18))" }}
          />
        </svg>
      ) : (
        <span
          className="font-light leading-none text-white"
          style={{
            fontSize: "clamp(2.85rem,8.85vmin,3.55rem)",
            marginTop: "-0.06em",
            textShadow: "0 1px 8px rgba(30, 52, 58, 0.18)",
          }}
        >
          +
        </span>
      )}
    </button>
  );
}

function CarouselSlideFrostOverlay({ closing }: { closing: boolean }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-[12] ${FROST_BLUR_CLASS} ${
        closing ? "doephone-carousel-frost-out" : "doephone-carousel-frost-fill"
      } ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
      style={ORANGE_FROST_STYLE}
      aria-hidden
    />
  );
}

function CarouselMenuOverlay({
  children,
  expanded,
  showContent,
  closing,
  description,
}: {
  children: React.ReactNode;
  expanded: boolean;
  showContent: boolean;
  closing: boolean;
  description?: string;
}) {
  const padX = CAROUSEL_MENU_UI.overlayPadX;
  const padY = CAROUSEL_MENU_UI.overlayPadY;
  const contentMaxWidth = CAROUSEL_MENU_UI.maxWidthPhone;

  return (
    <div
      className="absolute inset-0 z-[15] flex h-full w-full flex-col overflow-hidden"
      style={{
        padding: expanded
          ? `clamp(1rem,3.1vmin,1.35rem) ${padX} clamp(5.75rem,17vmin,7.25rem)`
          : `${padY} ${padX}`,
        transition: `padding ${EXPAND_DURATION} ${EXPAND_EASE}`,
      }}
    >
      <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center">
        <div
          className={`mx-auto flex w-full flex-col ${showContent ? "doephone-carousel-content--expanded" : ""}`}
          style={{ maxWidth: contentMaxWidth }}
        >
          <div className="w-full shrink-0">
            <div className="flex w-full items-center justify-center">{children}</div>
          </div>
          {description ? (
            <p
              className={`${inter.className} w-full overflow-hidden text-left font-normal ${
                expanded && showContent
                  ? "mt-[clamp(0.85rem,2.6vmin,1.15rem)] max-h-[min(46vh,32rem)] opacity-100"
                  : "mt-0 max-h-0 opacity-0"
              }`}
              style={{
                color: "#FFFFFF",
                fontSize: "clamp(1.32rem,4.05vmin,1.68rem)",
                lineHeight: 1.46,
                letterSpacing: "-0.018em",
                paddingLeft: DESCRIPTION_PAD_X,
                paddingRight: DESCRIPTION_PAD_X,
                textWrap: "pretty",
                transition: `max-height ${EXPAND_DURATION} ${EXPAND_EASE}, opacity 640ms ${EXPAND_EASE}, margin-top ${EXPAND_DURATION} ${EXPAND_EASE}`,
              }}
            >
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function DoePhoneCarouselCard({ slide, isActive }: { slide: DoePhoneCommunicationSlide; isActive: boolean }) {
  const [panelPhase, setPanelPhase] = useState<PanelPhase>("idle");
  const closeTimerRef = useRef<number | undefined>(undefined);
  const expandable = Boolean(slide.description);
  const panelOpen = panelPhase !== "idle";
  const isClosing = panelPhase === "closing";

  useEffect(() => {
    if (!isActive) {
      window.clearTimeout(closeTimerRef.current);
      setPanelPhase("idle");
    }
  }, [isActive]);

  useEffect(() => {
    return () => {
      window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  const toggleExpanded = useCallback(() => {
    if (!expandable || panelPhase === "closing") return;

    if (panelPhase === "open") {
      setPanelPhase("closing");
      closeTimerRef.current = window.setTimeout(() => {
        setPanelPhase("idle");
      }, EXPAND_DURATION_MS);
      return;
    }

    setPanelPhase("open");
  }, [expandable, panelPhase]);

  const overlayVisual = <DoePhoneCommunicationSlideVisual slideId={slide.id} />;

  return (
    <div
      className={`relative isolate h-full w-full overflow-hidden ${DOEPHONE_SECTION_CAROUSEL_RADIUS} shadow-[0_10px_32px_rgba(0,0,0,0.1)]`}
      style={DOEPHONE_SECTION_CAROUSEL_CLIP_STYLE}
      aria-hidden={!isActive}
    >
      <WorkflowCarouselDesignBackdrop
        backdrop={slide.backdrop}
        embedded
        className={DOEPHONE_SECTION_CAROUSEL_RADIUS}
      />
      {expandable && panelOpen ? <CarouselSlideFrostOverlay closing={isClosing} /> : null}
      {overlayVisual ? (
        <CarouselMenuOverlay
          expanded={panelPhase === "open"}
          showContent={panelPhase === "open"}
          closing={isClosing}
          description={slide.description}
        >
          {overlayVisual}
        </CarouselMenuOverlay>
      ) : null}
      <CarouselSlideToggleBadge
        expanded={panelOpen}
        interactive={expandable && !isClosing}
        onToggle={toggleExpanded}
      />
    </div>
  );
}

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
}: {
  activeIndex: number;
  scrollRef: RefObject<HTMLDivElement>;
  loopScrollIndices: number[];
  menuInject: MenuInject | null;
  onScroll: () => void;
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
            <DoePhoneCarouselCard slide={slide} isActive={isActive} />
          </div>
        );
      })}
    </div>
  );
}
