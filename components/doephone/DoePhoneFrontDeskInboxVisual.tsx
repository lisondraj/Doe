"use client";

import { dmSans } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";

const { ink: INK, accent: DOE_ORANGE } = CAROUSEL_MENU_UI;

const MUTED = "#9CA3AF";
const MUTED_TEXT = "#6B7280";
const BORDER = "#E5E7EB";
const LIVE_BG = "rgba(210, 119, 76, 0.12)";

const OUTER_RADIUS = "rounded-[clamp(0.8rem,2.4vmin,0.95rem)]";
const INNER_RADIUS = "rounded-[clamp(0.45rem,1.35vmin,0.55rem)]";
const CALENDAR_INNER_PAD = "clamp(0.55rem,1.65vmin,0.68rem)";
const CALENDAR_OUTER_PAD_Y = "clamp(0.38rem,1.15vmin,0.48rem)";
const CALLER_INNER_PAD_Y = "clamp(0.82rem,2.45vmin,1rem)";

const ROW_PAD = "clamp(0.82rem,2.55vmin,1.02rem) clamp(0.88rem,2.75vmin,1.05rem)";
const BODY_SIZE = "clamp(0.88rem,2.65vmin,1.05rem)";
const CAPTION_SIZE = "clamp(0.72rem,2.15vmin,0.86rem)";
const STATUS_SIZE = "clamp(0.95rem,2.85vmin,1.12rem)";
const FOOTER_PRIMARY_SIZE = "clamp(0.95rem,2.85vmin,1.12rem)";
const FOOTER_SECONDARY_SIZE = "clamp(0.88rem,2.65vmin,1.05rem)";
const HEADING_SIZE = "clamp(1.02rem,3.15vmin,1.22rem)";

const WEEKDAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"] as const;
const WEEK_DATES = ["12", "13", "14", "15", "16", "17", "18"] as const;
const TODAY = "14";
const BOOKED = "16";

const WAVE_HEIGHTS = [0.38, 0.72, 0.55, 0.88, 0.48, 0.68, 0.42] as const;

function AgentStatus({ label }: { label: string }) {
  return (
    <span className="shrink-0 font-medium leading-snug" style={{ color: DOE_ORANGE, fontSize: STATUS_SIZE }}>
      {label}
    </span>
  );
}

function PanelHeading({
  title,
  status,
  tightBelow = false,
}: {
  title: string;
  status: string;
  tightBelow?: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between"
      style={{
        gap: "clamp(0.55rem,1.75vmin,0.72rem)",
        padding: tightBelow
          ? "clamp(0.82rem,2.55vmin,1.02rem) clamp(0.88rem,2.75vmin,1.05rem) clamp(0.32rem,0.98vmin,0.42rem)"
          : ROW_PAD,
      }}
    >
      <span
        className="truncate font-semibold leading-snug tracking-[-0.015em]"
        style={{ color: INK, fontSize: HEADING_SIZE }}
      >
        {title}
      </span>
      <AgentStatus label={status} />
    </div>
  );
}

function VoiceWaveform({ inline = false }: { inline?: boolean }) {
  const barWidth = "clamp(0.14rem,0.42vmin,0.18rem)";
  const barMax = inline ? "clamp(1.65rem,5vmin,2rem)" : "clamp(1.05rem,3.2vmin,1.28rem)";

  return (
    <div
      className={`flex shrink-0 items-end ${inline ? "" : "justify-center"}`}
      style={{ gap: "clamp(0.18rem,0.55vmin,0.24rem)", height: barMax }}
      aria-hidden
    >
      {WAVE_HEIGHTS.map((height, index) => (
        <span
          key={index}
          className="rounded-full"
          style={{
            width: barWidth,
            height: `calc(${barMax} * ${height})`,
            background: DOE_ORANGE,
            opacity: 0.72,
          }}
        />
      ))}
    </div>
  );
}

function VoiceCallPanel() {
  return (
    <div className={`border bg-white ${OUTER_RADIUS}`} style={{ borderColor: BORDER }}>
      <PanelHeading title="Voice Agent" status="On call" tightBelow />

      <div
        style={{
          padding: "clamp(0.32rem,0.98vmin,0.42rem) clamp(0.88rem,2.75vmin,1.05rem) clamp(0.55rem,1.65vmin,0.68rem)",
        }}
      >
        <div
          className={`flex items-center border ${INNER_RADIUS}`}
          style={{
            borderColor: BORDER,
            padding: `${CALLER_INNER_PAD_Y} ${CALENDAR_INNER_PAD}`,
            marginBottom: "clamp(0.42rem,1.28vmin,0.55rem)",
          }}
        >
          <div
            className="flex w-full items-center justify-between"
            style={{ gap: "clamp(0.55rem,1.75vmin,0.72rem)" }}
          >
            <div
              className="flex min-w-0 items-center"
              style={{ gap: "clamp(0.55rem,1.75vmin,0.72rem)" }}
            >
              <VoiceWaveform inline />
              <div className="min-w-0">
                <p className="truncate font-medium leading-snug" style={{ color: INK, fontSize: BODY_SIZE }}>
                  S. Nguyen
                </p>
                <p
                  className="truncate font-normal leading-snug tabular-nums"
                  style={{ color: MUTED_TEXT, fontSize: CAPTION_SIZE, marginTop: "clamp(0.18rem,0.55vmin,0.24rem)" }}
                >
                  (416) 555-0142
                </p>
              </div>
            </div>
            <span
              className="shrink-0 self-center font-medium leading-none tabular-nums"
              style={{ color: MUTED, fontSize: FOOTER_PRIMARY_SIZE }}
            >
              2:14
            </span>
          </div>
        </div>

        <p
          className="font-medium leading-snug"
          style={{ color: INK, fontSize: HEADING_SIZE, marginTop: "clamp(0.42rem,1.28vmin,0.55rem)" }}
        >
          Amlodipine 20 mg
        </p>
        <p
          className="font-normal leading-none"
          style={{ color: MUTED, fontSize: CAPTION_SIZE, marginTop: "clamp(0.18rem,0.55vmin,0.24rem)" }}
        >
          Medication Refill
        </p>
        <p
          className="font-normal leading-snug"
          style={{ color: MUTED_TEXT, fontSize: BODY_SIZE, marginTop: "clamp(0.28rem,0.85vmin,0.38rem)" }}
        >
          &ldquo;I can help with that refill today.&rdquo;
        </p>
      </div>
    </div>
  );
}

function WeekCalendar() {
  const dateRangeSize = "clamp(0.88rem,2.65vmin,1.05rem)";
  const weekdaySize = "clamp(0.62rem,1.88vmin,0.74rem)";
  const daySize = "clamp(0.72rem,2.15vmin,0.86rem)";
  const dayCell = "clamp(1.35rem,4.15vmin,1.65rem)";

  return (
    <div
      style={{
        padding: `${CALENDAR_OUTER_PAD_Y} clamp(0.88rem,2.75vmin,1.05rem)`,
      }}
    >
      <div
        className={`border ${INNER_RADIUS}`}
        style={{ borderColor: BORDER, padding: CALENDAR_INNER_PAD }}
      >
        <span
          className="block font-medium leading-none"
          style={{ color: INK, fontSize: dateRangeSize, marginBottom: "clamp(0.55rem,1.65vmin,0.68rem)" }}
        >
          Jun 12 – 18
        </span>

        <div className="grid grid-cols-7" style={{ marginBottom: "clamp(0.22rem,0.68vmin,0.28rem)" }}>
          {WEEKDAY_LABELS.map((label, index) => (
            <span
              key={`${label}-${index}`}
              className="text-center font-normal leading-none"
              style={{ color: MUTED, fontSize: weekdaySize }}
            >
              {label}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7">
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
                  }}
                >
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SchedulingPanel() {
  return (
    <div className={`border bg-white ${OUTER_RADIUS}`} style={{ borderColor: BORDER }}>
      <PanelHeading title="Scheduling Agent" status="Booking" tightBelow />

      <WeekCalendar />

      <div
        className="flex items-center justify-between"
        style={{
          gap: "clamp(0.55rem,1.75vmin,0.72rem)",
          padding: `${CALENDAR_OUTER_PAD_Y} clamp(0.88rem,2.75vmin,1.05rem) clamp(0.82rem,2.55vmin,1.02rem)`,
        }}
      >
        <div className="min-w-0">
          <p
            className="truncate font-normal leading-snug"
            style={{ color: MUTED_TEXT, fontSize: FOOTER_PRIMARY_SIZE }}
          >
            Tue 2:30 PM
          </p>
          <p
            className="truncate font-normal leading-snug"
            style={{ color: MUTED, fontSize: FOOTER_SECONDARY_SIZE, marginTop: "clamp(0.18rem,0.55vmin,0.24rem)" }}
          >
            S. Nguyen · Follow-up
          </p>
        </div>
        <span
          className="shrink-0 font-normal leading-snug"
          style={{ color: MUTED_TEXT, fontSize: FOOTER_PRIMARY_SIZE }}
        >
          3 open
        </span>
      </div>
    </div>
  );
}

/** Stacked voice + scheduling panels — Front Desk carousel slide. */
export function DoePhoneFrontDeskInboxVisual() {
  return (
    <div
      className={`mx-auto flex h-full w-full items-center justify-center ${dmSans.className}`}
      style={{ maxWidth: CAROUSEL_MENU_UI.maxWidthPhone }}
      aria-hidden
    >
      <div
        className="flex w-full flex-col"
        style={{ gap: "clamp(0.55rem,1.65vmin,0.68rem)" }}
      >
        <div
          className="w-[75%]"
          style={{ marginTop: "clamp(-0.38rem,-1.15vmin,-0.48rem)" }}
        >
          <VoiceCallPanel />
        </div>

        <div className="w-[75%] self-end">
          <SchedulingPanel />
        </div>
      </div>
    </div>
  );
}
