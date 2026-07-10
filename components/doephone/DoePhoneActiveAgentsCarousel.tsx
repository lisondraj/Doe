"use client";

import { useCallback, useRef, useState, type CSSProperties, type TouchEvent } from "react";

import { inter, suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";

const { ink: INK } = CAROUSEL_MENU_UI;

type VisualLayout = "phone" | "desktop";

const AGENT_TASKS = [
  { id: "booking", label: "Booking an appointment" },
  { id: "prior-auth", label: "Handling prior auth" },
  { id: "referral", label: "Receiving a referral" },
  { id: "allied-health", label: "Speaking to allied health" },
  { id: "refill", label: "Refilling a prescription" },
] as const;

const TASK_COUNT = AGENT_TASKS.length;
const SWIPE_THRESHOLD_PX = 28;
const VISIBLE_DELTA = 2;

/** Clean thin speaker/volume glyph — echoes the live-call agent state. */
function VolumeIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className="home-active-agents-vcarousel__icon-glyph"
    >
      <path
        d="M4.25 7.9v4.2h2.55l3.55 2.9V5l-3.55 2.9H4.25z"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path d="M13.35 7.05a4.15 4.15 0 010 5.9" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
      <path d="M15.55 4.85a7.4 7.4 0 010 10.3" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
    </svg>
  );
}

function VerticalArrowIcon({ direction }: { direction: "up" | "down" }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="home-active-agents-vcarousel__nav-icon">
      {direction === "up" ? (
        <path d="M3.25 9.75L8 5l4.75 4.75" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M3.25 6.25L8 11l4.75-4.75" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

/** Shortest signed distance around the 5-item loop (-2..2). */
function loopDelta(index: number, selected: number, count: number) {
  let delta = index - selected;
  if (delta > count / 2) delta -= count;
  if (delta < -count / 2) delta += count;
  return delta;
}

function pillVars(delta: number): CSSProperties {
  const abs = Math.abs(delta);
  const scale = delta === 0 ? 1 : abs === 1 ? 0.86 : 0.74;
  const opacity = delta === 0 ? 1 : abs === 1 ? 0.56 : 0.24;

  return {
    "--pill-delta": delta,
    "--pill-abs": abs,
    "--pill-scale": scale,
    "--pill-opacity": opacity,
    zIndex: 10 - abs,
  } as CSSProperties;
}

/** Vertical 3D wheel of agent conversation types — replaces the Active Agents mock UI. */
export function DoePhoneActiveAgentsCarousel({ layout = "phone" }: { layout?: VisualLayout }) {
  const isDesktop = layout === "desktop";
  const maxWidth = isDesktop ? "min(100%, 28rem)" : CAROUSEL_MENU_UI.maxWidthPhone;
  const [selected, setSelected] = useState(0);
  const dragStartRef = useRef<number | null>(null);

  const goUp = useCallback(() => {
    setSelected((current) => (current - 1 + TASK_COUNT) % TASK_COUNT);
  }, []);

  const goDown = useCallback(() => {
    setSelected((current) => (current + 1) % TASK_COUNT);
  }, []);

  const handleTouchStart = useCallback((event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    if (!touch) return;
    dragStartRef.current = touch.clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      const start = dragStartRef.current;
      dragStartRef.current = null;
      if (start === null) return;

      const touch = event.changedTouches[0];
      if (!touch) return;

      const deltaY = touch.clientY - start;
      if (Math.abs(deltaY) < SWIPE_THRESHOLD_PX) return;

      if (deltaY < 0) {
        goDown();
        return;
      }

      goUp();
    },
    [goDown, goUp],
  );

  return (
    <div
      className={`home-active-agents-vcarousel home-active-agents-vcarousel--${layout} mx-auto flex w-full flex-col items-center ${suisseIntl.className}`}
      style={{ maxWidth }}
      aria-hidden
    >
      <p className="home-active-agents-vcarousel__title font-semibold leading-none tracking-[-0.015em]" style={{ color: INK }}>
        Active Agents
      </p>

      <button
        type="button"
        className="home-active-agents-vcarousel__nav home-active-agents-vcarousel__nav--up"
        onClick={goUp}
        aria-label="Previous conversation type"
        tabIndex={-1}
      >
        <VerticalArrowIcon direction="up" />
      </button>

      <div
        className="home-active-agents-vcarousel__viewport"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={() => {
          dragStartRef.current = null;
        }}
      >
        <div className="home-active-agents-vcarousel__stage">
          {AGENT_TASKS.map((task, index) => {
            const delta = loopDelta(index, selected, TASK_COUNT);
            if (Math.abs(delta) > VISIBLE_DELTA) return null;

            return (
              <button
                key={task.id}
                type="button"
                className={`home-active-agents-vcarousel__pill${
                  delta === 0 ? " home-active-agents-vcarousel__pill--active" : ""
                }`}
                style={pillVars(delta)}
                onClick={() => setSelected(index)}
                tabIndex={-1}
              >
                <span className="home-active-agents-vcarousel__pill-icon">
                  <VolumeIcon />
                </span>
                <span className={`home-active-agents-vcarousel__pill-label ${inter.className}`}>{task.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        className="home-active-agents-vcarousel__nav home-active-agents-vcarousel__nav--down"
        onClick={goDown}
        aria-label="Next conversation type"
        tabIndex={-1}
      >
        <VerticalArrowIcon direction="down" />
      </button>
    </div>
  );
}
