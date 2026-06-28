"use client";

import { suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";

const { ink: INK, accent: DOE_ORANGE, divider: DIVIDER } = CAROUSEL_MENU_UI;

const MUTED = "#9CA3AF";
const MUTED_TEXT = "#6B7280";
const BTN_BG = "#F3F4F6";
const BORDER = "#E5E7EB";
const LIVE_BG = "rgba(210, 119, 76, 0.12)";

const OUTER_RADIUS = "rounded-[clamp(0.8rem,2.4vmin,0.95rem)]";
const INNER_RADIUS = "rounded-[clamp(0.45rem,1.35vmin,0.55rem)]";
const CARD_PAD = "clamp(1.15rem,3.65vmin,1.42rem) clamp(1.05rem,3.35vmin,1.32rem)";
const HEADING_MB = "clamp(0.78rem,2.45vmin,0.95rem)";
const ROW_PAD = "clamp(0.68rem,2.1vmin,0.82rem) clamp(0.88rem,2.75vmin,1.05rem)";

const WEEKDAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"] as const;
const WEEK_DATES = ["12", "13", "14", "15", "16", "17", "18"] as const;
const TODAY = "14";
const BOOKED = "16";

function VoiceIcon() {
  const iconSize = "clamp(1.15rem,3.55vmin,1.38rem)";
  const sw = 1.25;

  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="shrink-0" style={{ width: iconSize, height: iconSize }}>
      <rect x="7.5" y="3" width="5" height="8.5" rx="2.5" stroke={DOE_ORANGE} strokeWidth={sw} />
      <path d="M5.5 11a4.5 4.5 0 009 0" stroke={DOE_ORANGE} strokeWidth={sw} strokeLinecap="round" />
      <path d="M10 15.5v2.5" stroke={DOE_ORANGE} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  );
}

function CalendarIcon() {
  const iconSize = "clamp(1.15rem,3.55vmin,1.38rem)";
  const sw = 1.25;

  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="shrink-0" style={{ width: iconSize, height: iconSize }}>
      <rect x="3.5" y="4.5" width="13" height="12.5" rx="1.5" stroke={DOE_ORANGE} strokeWidth={sw} />
      <path d="M3.5 8.5h13" stroke={DOE_ORANGE} strokeWidth={sw} strokeLinecap="round" />
      <path d="M7 2.5v3M13 2.5v3" stroke={DOE_ORANGE} strokeWidth={sw} strokeLinecap="round" />
      <circle cx="7.1" cy="11.6" r="1.05" stroke={DOE_ORANGE} strokeWidth={sw * 0.85} />
      <circle cx="11" cy="11.6" r="1.05" stroke={DOE_ORANGE} strokeWidth={sw * 0.85} />
    </svg>
  );
}

function ModernWeekCalendar() {
  const monthSize = "clamp(0.88rem,2.65vmin,1.05rem)";
  const weekdaySize = "clamp(0.52rem,1.55vmin,0.62rem)";
  const daySize = "clamp(0.72rem,2.15vmin,0.86rem)";
  const dayCell = "clamp(1.42rem,4.35vmin,1.72rem)";

  return (
    <div style={{ padding: ROW_PAD }}>
      <div
        className="flex items-baseline justify-between"
        style={{ marginBottom: "clamp(0.55rem,1.65vmin,0.68rem)" }}
      >
        <span className="font-semibold leading-none tracking-[-0.015em]" style={{ color: INK, fontSize: monthSize }}>
          June
        </span>
        <span className="font-normal leading-none" style={{ color: MUTED, fontSize: "clamp(0.68rem,2.05vmin,0.82rem)" }}>
          Dr. Chen
        </span>
      </div>

      <div
        className="grid grid-cols-7"
        style={{ marginBottom: "clamp(0.28rem,0.85vmin,0.38rem)" }}
      >
        {WEEKDAY_LABELS.map((label, index) => (
          <span
            key={`${label}-${index}`}
            className="text-center font-medium leading-none"
            style={{ color: MUTED, fontSize: weekdaySize }}
          >
            {label}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7" style={{ gap: "clamp(0.12rem,0.38vmin,0.18rem) 0" }}>
        {WEEK_DATES.map((day) => {
          const isToday = day === TODAY;
          const isBooked = day === BOOKED;

          return (
            <div key={day} className="flex items-center justify-center">
              <span
                className="inline-flex items-center justify-center rounded-full font-medium leading-none tabular-nums"
                style={{
                  width: dayCell,
                  height: dayCell,
                  fontSize: daySize,
                  background: isBooked ? DOE_ORANGE : isToday ? LIVE_BG : "transparent",
                  color: isBooked ? "#FFFFFF" : isToday ? DOE_ORANGE : INK,
                  fontWeight: isToday || isBooked ? 600 : 500,
                }}
              >
                {day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SchedulingAgentPanel() {
  const headingSize = "clamp(1.02rem,3.15vmin,1.22rem)";
  const bodySize = "clamp(0.88rem,2.65vmin,1.05rem)";
  const smallSize = "clamp(0.72rem,2.15vmin,0.86rem)";

  return (
    <div
      className={`w-full border bg-white ${OUTER_RADIUS}`}
      style={{ borderColor: BORDER, padding: CARD_PAD }}
    >
      <div
        className="flex items-center justify-between"
        style={{ gap: "clamp(0.55rem,1.75vmin,0.72rem)", marginBottom: HEADING_MB }}
      >
        <div className="flex min-w-0 items-center" style={{ gap: "clamp(0.55rem,1.75vmin,0.72rem)" }}>
          <CalendarIcon />
          <span className="truncate font-semibold leading-none tracking-[-0.015em]" style={{ color: INK, fontSize: headingSize }}>
            Scheduling Agent
          </span>
        </div>
        <span
          className="inline-flex shrink-0 items-center font-medium leading-none"
          style={{ color: DOE_ORANGE, fontSize: smallSize, gap: "clamp(0.28rem,0.85vmin,0.38rem)" }}
        >
          <span
            className="rounded-full"
            style={{
              width: "clamp(0.32rem,0.98vmin,0.38rem)",
              height: "clamp(0.32rem,0.98vmin,0.38rem)",
              background: DOE_ORANGE,
            }}
          />
          Booking
        </span>
      </div>

      <div className={`overflow-hidden border ${INNER_RADIUS}`} style={{ borderColor: BORDER }}>
        <ModernWeekCalendar />

        <div className="h-px w-full" style={{ background: DIVIDER }} />

        <div
          className="flex items-center justify-between"
          style={{ gap: "clamp(0.55rem,1.75vmin,0.72rem)", padding: ROW_PAD }}
        >
          <div className="min-w-0">
            <p className="truncate font-medium leading-snug tabular-nums" style={{ color: INK, fontSize: bodySize }}>
              Tue 2:30 PM
            </p>
            <p
              className="truncate font-normal leading-snug"
              style={{ color: MUTED_TEXT, fontSize: smallSize, marginTop: "clamp(0.18rem,0.55vmin,0.24rem)" }}
            >
              M. Patel · Follow-up
            </p>
          </div>
          <span
            className={`inline-flex shrink-0 items-center font-medium leading-none ${INNER_RADIUS}`}
            style={{
              background: BTN_BG,
              color: MUTED_TEXT,
              fontSize: smallSize,
              padding: "clamp(0.22rem,0.68vmin,0.28rem) clamp(0.42rem,1.28vmin,0.52rem)",
            }}
          >
            3 open
          </span>
        </div>
      </div>
    </div>
  );
}

function VoiceAgentPanel() {
  const headingSize = "clamp(1.02rem,3.15vmin,1.22rem)";
  const bodySize = "clamp(0.88rem,2.65vmin,1.05rem)";
  const smallSize = "clamp(0.72rem,2.15vmin,0.86rem)";

  return (
    <div
      className={`w-full border bg-white ${OUTER_RADIUS}`}
      style={{ borderColor: BORDER, padding: CARD_PAD }}
    >
      <div
        className="flex items-center justify-between"
        style={{ gap: "clamp(0.55rem,1.75vmin,0.72rem)", marginBottom: HEADING_MB }}
      >
        <div className="flex min-w-0 items-center" style={{ gap: "clamp(0.55rem,1.75vmin,0.72rem)" }}>
          <VoiceIcon />
          <span className="truncate font-semibold leading-none tracking-[-0.015em]" style={{ color: INK, fontSize: headingSize }}>
            Voice Agent
          </span>
        </div>
        <span
          className="inline-flex shrink-0 items-center font-medium leading-none"
          style={{ color: DOE_ORANGE, fontSize: smallSize, gap: "clamp(0.28rem,0.85vmin,0.38rem)" }}
        >
          <span
            className="rounded-full"
            style={{
              width: "clamp(0.32rem,0.98vmin,0.38rem)",
              height: "clamp(0.32rem,0.98vmin,0.38rem)",
              background: DOE_ORANGE,
            }}
          />
          On call
        </span>
      </div>

      <div className={`overflow-hidden border ${INNER_RADIUS}`} style={{ borderColor: BORDER }}>
        <div
          className="flex items-start justify-between"
          style={{ gap: "clamp(0.55rem,1.75vmin,0.72rem)", padding: "clamp(0.82rem,2.55vmin,1.02rem) clamp(0.88rem,2.75vmin,1.05rem)" }}
        >
          <div className="min-w-0">
            <p className="truncate font-medium leading-snug" style={{ color: INK, fontSize: bodySize }}>
              M. Patel
            </p>
            <p className="truncate font-normal leading-snug tabular-nums" style={{ color: MUTED_TEXT, fontSize: smallSize, marginTop: "clamp(0.18rem,0.55vmin,0.24rem)" }}>
              (416) 555-0142
            </p>
          </div>
          <span className="shrink-0 font-normal leading-none tabular-nums" style={{ color: MUTED, fontSize: smallSize }}>
            2:14
          </span>
        </div>

        <div className="h-px w-full" style={{ background: DIVIDER }} />

        <div style={{ padding: ROW_PAD }}>
          <p className="font-normal leading-none" style={{ color: MUTED, fontSize: smallSize }}>
            Refill request
          </p>
          <p
            className="truncate font-normal leading-snug"
            style={{ color: MUTED_TEXT, fontSize: bodySize, marginTop: "clamp(0.28rem,0.85vmin,0.38rem)" }}
          >
            &ldquo;I can help with that refill.&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

/** Overlapping voice + scheduling panels — Front Desk carousel slide. */
export function DoePhoneFrontDeskInboxVisual() {
  return (
    <div
      className={`mx-auto flex h-full w-full items-center justify-center ${suisseIntl.className}`}
      style={{ maxWidth: CAROUSEL_MENU_UI.maxWidthPhone }}
      aria-hidden
    >
      <div
        className="relative w-full"
        style={{ height: "clamp(17.5rem,53vmin,21.5rem)" }}
      >
        <div className="absolute left-0 top-0 z-10 w-[75%]">
          <VoiceAgentPanel />
        </div>

        <div
          className="absolute right-0 z-20 w-[75%]"
          style={{ top: "clamp(7.65rem,23.25vmin,9.35rem)" }}
        >
          <SchedulingAgentPanel />
        </div>
      </div>
    </div>
  );
}
