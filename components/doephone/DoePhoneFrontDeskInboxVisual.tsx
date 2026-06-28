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
const PILL_RADIUS = "rounded-[clamp(0.32rem,0.95vmin,0.4rem)]";

const CALENDAR_DAYS = ["12", "13", "14", "15", "16", "17", "18"] as const;

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

function StatusPill({ label }: { label: string }) {
  const isDeployed = label === "Deployed";

  return (
    <span
      className={`inline-flex shrink-0 items-center font-medium leading-none ${PILL_RADIUS}`}
      style={{
        background: isDeployed ? LIVE_BG : BTN_BG,
        color: isDeployed ? DOE_ORANGE : MUTED_TEXT,
        fontSize: "clamp(0.72rem,2.15vmin,0.86rem)",
        padding: "clamp(0.22rem,0.68vmin,0.28rem) clamp(0.42rem,1.28vmin,0.52rem)",
        gap: isDeployed ? "clamp(0.28rem,0.85vmin,0.38rem)" : undefined,
      }}
    >
      {label}
      {isDeployed ? (
        <span
          className="rounded-full"
          style={{
            width: "clamp(0.32rem,0.98vmin,0.38rem)",
            height: "clamp(0.32rem,0.98vmin,0.38rem)",
            background: DOE_ORANGE,
          }}
        />
      ) : null}
    </span>
  );
}

function MetricPill({ label, accent = false }: { label: string; accent?: boolean }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center font-normal leading-none ${PILL_RADIUS}`}
      style={{
        background: accent ? LIVE_BG : BTN_BG,
        color: accent ? DOE_ORANGE : MUTED_TEXT,
        fontSize: "clamp(0.72rem,2.15vmin,0.86rem)",
        padding: "clamp(0.22rem,0.68vmin,0.28rem) clamp(0.42rem,1.28vmin,0.52rem)",
      }}
    >
      {label}
    </span>
  );
}

function WeekStripCalendar() {
  return (
    <div className="flex w-full items-center justify-between" style={{ gap: "clamp(0.22rem,0.68vmin,0.28rem)" }}>
      {CALENDAR_DAYS.map((day) => {
        const isBooked = day === "16";
        const isToday = day === "14";

        return (
          <div
            key={day}
            className={`flex flex-1 flex-col items-center ${INNER_RADIUS}`}
            style={{
              padding: "clamp(0.28rem,0.85vmin,0.35rem) clamp(0.18rem,0.55vmin,0.22rem)",
              background: isBooked ? DOE_ORANGE : isToday ? LIVE_BG : BTN_BG,
            }}
          >
            <span
              className="font-normal leading-none"
              style={{
                color: isBooked ? "#FFFFFF" : MUTED,
                fontSize: "clamp(0.52rem,1.55vmin,0.62rem)",
                minHeight: "clamp(0.52rem,1.55vmin,0.62rem)",
              }}
            >
              {isToday ? "Tue" : ""}
            </span>
            <span
              className="font-medium leading-none"
              style={{
                color: isBooked ? "#FFFFFF" : isToday ? DOE_ORANGE : INK,
                fontSize: "clamp(0.72rem,2.15vmin,0.86rem)",
                marginTop: "clamp(0.06rem,0.18vmin,0.1rem)",
              }}
            >
              {day}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function AgentCard({ title, children }: { title: string; children: React.ReactNode }) {
  const headingSize = "clamp(1.02rem,3.15vmin,1.22rem)";

  return (
    <div
      className={`w-full border bg-white ${OUTER_RADIUS}`}
      style={{
        borderColor: BORDER,
        padding: "clamp(1.15rem,3.65vmin,1.42rem) clamp(1.05rem,3.35vmin,1.32rem)",
      }}
    >
      <p
        className="font-semibold leading-none tracking-[-0.015em]"
        style={{ color: INK, fontSize: headingSize, marginBottom: "clamp(0.78rem,2.45vmin,0.95rem)" }}
      >
        {title}
      </p>
      {children}
    </div>
  );
}

function VoiceAgentPanel() {
  const bodySize = "clamp(0.88rem,2.65vmin,1.05rem)";

  return (
    <AgentCard title="Voice Agent">
      <div className={`overflow-hidden border ${INNER_RADIUS}`} style={{ borderColor: BORDER }}>
        <div
          className="flex items-center justify-between"
          style={{
            gap: "clamp(0.55rem,1.75vmin,0.72rem)",
            padding: "clamp(0.82rem,2.55vmin,1.02rem) clamp(0.88rem,2.75vmin,1.05rem)",
          }}
        >
          <div className="flex min-w-0 items-center" style={{ gap: "clamp(0.55rem,1.75vmin,0.72rem)" }}>
            <VoiceIcon />
            <span className="min-w-0 truncate font-normal leading-snug tabular-nums" style={{ color: MUTED_TEXT, fontSize: bodySize }}>
              (416) 555-0142 · refill request
            </span>
          </div>
          <StatusPill label="Deployed" />
        </div>

        <div className="h-px w-full" style={{ background: DIVIDER }} />

        <div
          className="flex flex-wrap items-center"
          style={{
            gap: "clamp(0.35rem,1.05vmin,0.45rem)",
            padding: "clamp(0.68rem,2.1vmin,0.82rem) clamp(0.88rem,2.75vmin,1.05rem)",
          }}
        >
          <span className="font-normal leading-none" style={{ color: MUTED, fontSize: "clamp(0.72rem,2.15vmin,0.86rem)" }}>
            Status
          </span>
          <MetricPill label="Answering call" accent />
          <MetricPill label="Routing to scheduling" />
        </div>
      </div>
    </AgentCard>
  );
}

function SchedulingAgentPanel() {
  const bodySize = "clamp(0.88rem,2.65vmin,1.05rem)";

  return (
    <AgentCard title="Scheduling Agent">
      <div className={`overflow-hidden border ${INNER_RADIUS}`} style={{ borderColor: BORDER }}>
        <div
          className="flex items-center justify-between"
          style={{
            gap: "clamp(0.55rem,1.75vmin,0.72rem)",
            padding: "clamp(0.82rem,2.55vmin,1.02rem) clamp(0.88rem,2.75vmin,1.05rem)",
          }}
        >
          <div className="flex min-w-0 items-center" style={{ gap: "clamp(0.55rem,1.75vmin,0.72rem)" }}>
            <CalendarIcon />
            <span className="min-w-0 truncate font-normal leading-snug" style={{ color: MUTED_TEXT, fontSize: bodySize }}>
              Booking into calendar · Dr. Chen
            </span>
          </div>
          <StatusPill label="Deployed" />
        </div>

        <div className="h-px w-full" style={{ background: DIVIDER }} />

        <div style={{ padding: "clamp(0.68rem,2.1vmin,0.82rem) clamp(0.88rem,2.75vmin,1.05rem)" }}>
          <WeekStripCalendar />
        </div>

        <div className="h-px w-full" style={{ background: DIVIDER }} />

        <div
          className="flex items-center"
          style={{
            gap: "clamp(0.35rem,1.05vmin,0.45rem)",
            padding: "clamp(0.68rem,2.1vmin,0.82rem) clamp(0.88rem,2.75vmin,1.05rem)",
          }}
        >
          <span className="font-normal leading-none" style={{ color: MUTED, fontSize: "clamp(0.72rem,2.15vmin,0.86rem)" }}>
            Booked
          </span>
          <MetricPill label="Tue 2:30 PM" accent />
        </div>
      </div>
    </AgentCard>
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
