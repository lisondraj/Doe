"use client";

import {
  useCallback,
  useRef,
  useState,
  type CSSProperties,
  type TouchEvent,
} from "react";
import { inter, suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";

const { ink: INK, accent: DOE_ORANGE } = CAROUSEL_MENU_UI;

const MUTED_TEXT = "#6B7280";
const BTN_BG = "#F3F4F6";
const BORDER = "#E5E7EB";
const LIVE_BADGE_BG = "rgba(210, 119, 76, 0.14)";
const CARD_SHADOW = "0 12px 32px rgba(30, 52, 58, 0.09), 0 1px 6px rgba(30, 52, 58, 0.04)";
const BUTTON_SHADOW = "0 8px 22px rgba(30, 52, 58, 0.06)";

const OUTER_RADIUS = "rounded-[clamp(0.72rem,2.1vmin,0.95rem)]";
const BUTTON_RADIUS = "rounded-[clamp(0.48rem,1.4vmin,0.6rem)]";
const BADGE_RADIUS = "0.375rem";
const CARD_PAD = "clamp(1.2rem,3.75vmin,1.5rem) clamp(1.2rem,3.75vmin,1.5rem) clamp(0.95rem,2.85vmin,1.15rem)";
const STACK_GAP = "clamp(0.62rem,1.85vmin,0.8rem)";
const BUTTON_PAD = "clamp(0.72rem,2.15vmin,0.88rem) clamp(1.05rem,3.1vmin,1.3rem)";
const TITLE_SIZE = "clamp(1.32rem,4vmin,1.62rem)";
const BADGE_SIZE = "clamp(0.72rem,2.15vmin,0.86rem)";
const ACTION_SIZE = "clamp(0.9rem,2.7vmin,1.05rem)";

const WORKFLOW_PILLS = [
  "Booking an Appointment",
  "Handling Prior Auth",
  "Receiving a referral",
  "Speaking to allied-health",
  "Reviewing lab results",
] as const;

const PILL_COUNT = WORKFLOW_PILLS.length;
const CAROUSEL_START_INDEX = 0;
const CAROUSEL_SWIPE_THRESHOLD_PX = 44;

type VisualLayout = "phone" | "desktop";

function getCircularOffset(index: number, activeIndex: number, count: number) {
  let offset = index - activeIndex;

  if (offset > count / 2) {
    offset -= count;
  }

  if (offset < -count / 2) {
    offset += count;
  }

  return offset;
}

function getPillTransform(offset: number): CSSProperties {
  const absOffset = Math.abs(offset);
  const hidden = absOffset > 2;
  const step = 1;
  const tilt = -22;
  const depth = 1;
  const translateY = offset * step;
  const translateZ = (1 - absOffset) * depth;
  const rotateX = offset * tilt;
  const scale = 1 - absOffset * 0.08;

  return {
    opacity: hidden ? 0 : Math.max(0.34, 1 - absOffset * 0.28),
    pointerEvents: absOffset === 0 ? "auto" : "none",
    zIndex: 10 - absOffset,
    transform: `translate3d(0, calc(-50% + ${translateY} * var(--pill-step)), calc(${translateZ} * var(--pill-depth))) rotateX(${rotateX}deg) scale(${scale})`,
  };
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden className="h-[0.72em] w-[0.72em] shrink-0">
      <path
        d="M2.4 6.1l2 2 5.2-5.4"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronUpIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" aria-hidden className="h-[0.95em] w-[0.95em]">
      <path d="M3.5 8.5L7 5l3.5 3.5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" aria-hidden className="h-[0.95em] w-[0.95em]">
      <path d="M3.5 5.5L7 9l3.5-3.5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 18 18" fill="none" aria-hidden className="home-active-agents-visual__plus-icon h-[1.05em] w-[1.05em] shrink-0">
      <path d="M9 4.5v9M4.5 9h9" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  );
}

function VolumeIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="home-active-agents-visual__pill-volume-icon">
      <path
        d="M5.5 8.25v3.5M8.75 5.75L5.75 8.25H3.75v3.5h2l3 2.5V5.75z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.25 8.25a2.25 2.25 0 010 3.5M13.75 6.75a4.5 4.5 0 010 6.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CarouselArrow({
  direction,
  onClick,
  label,
}: {
  direction: "up" | "down";
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      className={`home-active-agents-visual__carousel-nav home-active-agents-visual__carousel-nav--${direction}`}
      aria-label={label}
      onClick={onClick}
    >
      {direction === "up" ? <ChevronUpIcon /> : <ChevronDownIcon />}
    </button>
  );
}

function ActiveAgentsWorkflowCarousel() {
  const [activeIndex, setActiveIndex] = useState(CAROUSEL_START_INDEX);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);

  const goPrev = useCallback(() => {
    setActiveIndex((current) => (current - 1 + PILL_COUNT) % PILL_COUNT);
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % PILL_COUNT);
  }, []);

  const handleViewportTouchStart = useCallback((event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    if (!touch) return;
    swipeStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleViewportTouchEnd = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      const start = swipeStartRef.current;
      swipeStartRef.current = null;
      if (!start) return;

      const touch = event.changedTouches[0];
      if (!touch) return;

      const deltaX = touch.clientX - start.x;
      const deltaY = touch.clientY - start.y;

      if (Math.abs(deltaY) < CAROUSEL_SWIPE_THRESHOLD_PX) return;
      if (Math.abs(deltaY) <= Math.abs(deltaX)) return;

      if (deltaY < 0) {
        goNext();
        return;
      }

      goPrev();
    },
    [goNext, goPrev],
  );

  return (
    <div className="home-active-agents-visual__carousel">
      <CarouselArrow direction="up" onClick={goPrev} label="Previous workflow" />

      <div
        className="home-active-agents-visual__carousel-viewport"
        onTouchStart={handleViewportTouchStart}
        onTouchEnd={handleViewportTouchEnd}
        onTouchCancel={() => {
          swipeStartRef.current = null;
        }}
      >
        <div className="home-active-agents-visual__carousel-stage">
          {WORKFLOW_PILLS.map((label, index) => {
            const offset = getCircularOffset(index, activeIndex, PILL_COUNT);
            const isFocused = offset === 0;

            return (
              <div
                key={label}
                className={`home-active-agents-visual__pill${
                  isFocused ? " home-active-agents-visual__pill--focused" : ""
                }`}
                style={getPillTransform(offset)}
              >
                <span className="home-active-agents-visual__pill-icon" aria-hidden>
                  <VolumeIcon />
                </span>
                <span className={`home-active-agents-visual__pill-label ${inter.className}`}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <CarouselArrow direction="down" onClick={goNext} label="Next workflow" />
    </div>
  );
}

/** Active agents list — shader band below agents carousel. */
export function DoePhoneReviewPackageVisual({ layout = "phone" }: { layout?: VisualLayout }) {
  const isDesktop = layout === "desktop";
  const maxWidth = isDesktop ? "min(100%, 28rem)" : CAROUSEL_MENU_UI.maxWidthPhone;

  return (
    <div
      className={`home-active-agents-visual mx-auto flex h-full w-full items-center justify-center px-[clamp(0.65rem,2vmin,0.9rem)] ${suisseIntl.className}`}
      style={{ maxWidth }}
      aria-hidden
    >
      <div className="home-active-agents-visual__stack flex w-full flex-col" style={{ gap: STACK_GAP }}>
        <div
          className={`home-active-agents-visual__card relative w-full overflow-hidden bg-white ${OUTER_RADIUS}`}
          style={{
            padding: CARD_PAD,
            border: `1px solid ${BORDER}`,
            boxShadow: CARD_SHADOW,
          }}
        >
          <div className="home-active-agents-visual__header flex items-center justify-between gap-[clamp(0.55rem,1.65vmin,0.72rem)]">
            <div className="flex min-w-0 items-center gap-[clamp(0.45rem,1.35vmin,0.58rem)]">
              <h3
                className="home-active-agents-visual__title min-w-0 shrink-0 font-semibold leading-tight tracking-[-0.025em]"
                style={{
                  color: INK,
                  fontSize: TITLE_SIZE,
                }}
              >
                Active Agents
              </h3>
              <span
                className={`home-active-agents-visual__badge inline-flex shrink-0 items-center gap-[0.35em] ${inter.className} font-medium leading-none`}
                style={{
                  background: LIVE_BADGE_BG,
                  color: DOE_ORANGE,
                  fontSize: BADGE_SIZE,
                  padding: "0.38em 0.72em",
                  borderRadius: BADGE_RADIUS,
                }}
              >
                <CheckIcon />
                {WORKFLOW_PILLS.length} live
              </span>
            </div>
            <span
              className="home-active-agents-visual__collapse inline-flex shrink-0 items-center justify-center rounded-full"
              style={{
                width: "clamp(1.85rem,5.4vmin,2.2rem)",
                height: "clamp(1.85rem,5.4vmin,2.2rem)",
                background: BTN_BG,
                color: MUTED_TEXT,
              }}
            >
              <ChevronUpIcon />
            </span>
          </div>

          <div className="home-active-agents-visual__carousel-shell" style={{ marginTop: "clamp(0.85rem,2.5vmin,1rem)" }}>
            <ActiveAgentsWorkflowCarousel />
          </div>
        </div>

        <div
          className={`home-active-agents-visual__action flex w-full items-center overflow-hidden ${BUTTON_RADIUS}`}
          style={{
            background: BTN_BG,
            padding: BUTTON_PAD,
            gap: "clamp(0.62rem,1.85vmin,0.8rem)",
            border: `1px solid ${BORDER}`,
            boxShadow: BUTTON_SHADOW,
          }}
        >
          <PlusIcon />
          <p
            className={`home-active-agents-visual__action-label ${inter.className} font-medium leading-snug`}
            style={{ color: INK, fontSize: ACTION_SIZE }}
          >
            Build agent
          </p>
        </div>
      </div>
    </div>
  );
}
