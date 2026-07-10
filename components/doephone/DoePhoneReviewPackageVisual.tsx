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
  const translateY = offset;
  const translateZ = (1 - absOffset) * 1.15;
  const rotateX = offset * -20;
  const scale = absOffset === 0 ? 1.1 : Math.max(0.88, 1 - absOffset * 0.08);

  return {
    opacity: hidden ? 0 : Math.max(0.32, 1 - absOffset * 0.3),
    pointerEvents: absOffset === 0 ? "auto" : "none",
    zIndex: 10 - absOffset,
    transform: `translate3d(0, calc(-50% + ${translateY} * var(--pill-step)), calc(${translateZ} * var(--pill-depth))) rotateX(${rotateX}deg) scale(${scale})`,
    "--pill-blur": `${Math.min(1.1, absOffset * 0.45)}px`,
  } as CSSProperties;
}

function PillNavIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="home-active-agents-visual__pill-nav-icon">
      <path
        d={direction === "left" ? "M10 3.5L6 8l4 4.5" : "M6 3.5l4 4.5 4-4.5"}
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VolumeIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="home-active-agents-visual__pill-volume-icon">
      <path
        d="M5.5 8.25v3.5M8.75 5.75L5.75 8.25H3.75v3.5h2l3 2.5V5.75z"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.25 8.25a2.25 2.25 0 010 3.5M13.75 6.75a4.5 4.5 0 010 6.5"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PillNavButton({
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
      className={`home-active-agents-visual__pill-nav home-active-agents-visual__pill-nav--${direction}`}
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
    >
      <PillNavIcon direction={direction} />
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
                <span className="home-active-agents-visual__pill-circle" aria-hidden>
                  <VolumeIcon />
                </span>
                <span
                  className={`home-active-agents-visual__pill-body ${inter.className}${
                    isFocused ? "" : " home-active-agents-visual__pill-body--dimmed"
                  }`}
                >
                  {isFocused ? (
                    <PillNavButton direction="left" onClick={goPrev} label="Previous workflow" />
                  ) : null}
                  <span className="home-active-agents-visual__pill-label">{label}</span>
                  {isFocused ? (
                    <PillNavButton direction="right" onClick={goNext} label="Next workflow" />
                  ) : null}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Active agents — vertical workflow carousel in shader band. */
export function DoePhoneReviewPackageVisual({ layout = "phone" }: { layout?: VisualLayout }) {
  const isDesktop = layout === "desktop";
  const maxWidth = isDesktop ? "min(100%, 28rem)" : CAROUSEL_MENU_UI.maxWidthPhone;

  return (
    <div
      className={`home-active-agents-visual mx-auto flex h-full w-full items-center justify-center px-[clamp(0.65rem,2vmin,0.9rem)] ${suisseIntl.className}`}
      style={{ maxWidth }}
      aria-hidden
    >
      <ActiveAgentsWorkflowCarousel />
    </div>
  );
}
