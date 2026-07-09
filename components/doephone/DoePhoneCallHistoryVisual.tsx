"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";

const { ink: INK, accent: DOE_ORANGE } = CAROUSEL_MENU_UI;

const MUTED_TEXT = "#6B7280";
const TYPE_MUTED = "#9CA3AF";
const BORDER = "#E5E7EB";
const ROW_BG = "#FFFFFF";
const LIVE_BADGE_BG = "rgba(210, 119, 76, 0.14)";
const CARD_SHADOW = "0 10px 28px rgba(30, 52, 58, 0.09), 0 1px 5px rgba(30, 52, 58, 0.04)";

const INNER_RADIUS = "rounded-[clamp(0.55rem,1.55vmin,0.65rem)]";
const ROW_SIZE = "clamp(0.92rem,2.75vmin,1.08rem)";
const META_SIZE = "clamp(0.78rem,2.3vmin,0.92rem)";
const TIME_SIZE = "clamp(0.72rem,2.15vmin,0.86rem)";
const NOTE_SIZE = "clamp(0.76rem,2.25vmin,0.9rem)";
const BADGE_SIZE = "clamp(0.72rem,2.15vmin,0.86rem)";

type CallEntry = {
  callerName: string;
  phone: string;
  time: string;
  duration: string;
  direction: "inbound" | "outbound";
  routeDestination: string;
  routeDetail: string;
  routeQueue: string;
  expanded?: boolean;
  summary?: string;
  transcript?: string;
  outcomes?: readonly string[];
};

const FILTERS = [
  { id: "all-routed", label: "All routed", count: 18 },
  { id: "agent-queues", label: "Routed to agents", count: 11 },
  { id: "staff-handoff", label: "Routed to staff", count: 7 },
] as const;

const ACTIVE_FILTER_ID = "all-routed";

const CALL_HISTORY: readonly CallEntry[] = [
  {
    callerName: "Maria Lopez",
    phone: "(415) 555-0176",
    time: "2:41 PM",
    duration: "3m 08s",
    direction: "inbound",
    routeDestination: "Inbox Agent",
    routeQueue: "Results queue",
    routeDetail: "Critical potassium flagged · chart note drafted for Dr. Chen",
  },
  {
    callerName: "Dr. Patel's office",
    phone: "(628) 555-0134",
    time: "1:18 PM",
    duration: "6m 44s",
    direction: "inbound",
    routeDestination: "Referrals Agent",
    routeQueue: "Cardiology intake",
    routeDetail: "Tuesday 2:30 PM slot on hold · warm callback queued for 4 PM",
    expanded: true,
    summary: "Specialist slot held for Tuesday at 2:30 PM.",
    transcript: "\"Need to schedule Maria Lopez with cardiology for abnormal stress test.\"",
    outcomes: ["Referral queued", "Callback 4 PM"],
  },
  {
    callerName: "James Chen",
    phone: "(510) 555-0192",
    time: "11:52 AM",
    duration: "2m 15s",
    direction: "outbound",
    routeDestination: "Scheduling Agent",
    routeQueue: "Confirmations",
    routeDetail: "Apr 12 visit locked · reminder SMS queued before visit",
  },
] as const;

type VisualLayout = "phone" | "desktop";

function CallDirectionIcon({ direction }: { direction: CallEntry["direction"] }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="home-call-history-visual__direction-icon h-[0.95em] w-[0.95em] shrink-0">
      {direction === "inbound" ? (
        <path
          d="M8 3.5v9M4.5 8.5 8 12l3.5-3.5"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M8 12.5v-9M11.5 7.5 8 4 4.5 7.5"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

function CallLogRow({ call }: { call: CallEntry }) {
  const isExpanded = Boolean(call.expanded);

  return (
    <article
      className={`home-call-history-visual__row ${INNER_RADIUS}${
        isExpanded ? " home-call-history-visual__row--expanded" : ""
      }`}
      style={{
        background: ROW_BG,
        border: `0.5px solid ${BORDER}`,
        boxShadow: CARD_SHADOW,
        padding: "clamp(0.78rem,2.35vmin,0.95rem) clamp(0.9rem,2.65vmin,1.05rem)",
      }}
    >
      <div className="home-call-history-visual__row-main flex items-start gap-[clamp(0.55rem,1.65vmin,0.72rem)]">
        <span
          className="home-call-history-visual__avatar inline-flex shrink-0 items-center justify-center rounded-full"
          style={{
            width: "clamp(1.85rem,5.4vmin,2.2rem)",
            height: "clamp(1.85rem,5.4vmin,2.2rem)",
            background: LIVE_BADGE_BG,
            color: DOE_ORANGE,
            fontSize: BADGE_SIZE,
          }}
        >
          <CallDirectionIcon direction={call.direction} />
        </span>

        <div className="home-call-history-visual__row-copy min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p
                className={`home-call-history-visual__name ${inter.className} font-medium leading-snug`}
                style={{ color: INK, fontSize: ROW_SIZE }}
              >
                {call.callerName}
              </p>
              <p
                className={`home-call-history-visual__phone mt-[0.18em] tabular-nums ${inter.className} font-medium leading-snug`}
                style={{ color: DOE_ORANGE, fontSize: META_SIZE }}
              >
                {call.phone}
              </p>
            </div>
            <div className="home-call-history-visual__time-block shrink-0 text-right">
              <span
                className={`home-call-history-visual__time block tabular-nums ${inter.className} font-normal leading-none`}
                style={{ color: TYPE_MUTED, fontSize: TIME_SIZE }}
              >
                {call.time}
              </span>
              <span
                className={`home-call-history-visual__duration mt-[0.28em] block tabular-nums ${inter.className} font-normal leading-none`}
                style={{ color: TYPE_MUTED, fontSize: TIME_SIZE }}
              >
                {call.duration}
              </span>
            </div>
          </div>

          <div className="home-call-history-visual__route mt-[clamp(0.48rem,1.4vmin,0.58rem)]">
            <div className="home-call-history-visual__route-head flex flex-wrap items-center gap-[clamp(0.28rem,0.82vmin,0.36rem)]">
              <span
                className={`home-call-history-visual__route-dest ${inter.className} font-medium leading-snug`}
                style={{ color: INK, fontSize: META_SIZE }}
              >
                → {call.routeDestination}
              </span>
              <span
                className="home-call-history-visual__route-sep"
                style={{ color: TYPE_MUTED, fontSize: META_SIZE }}
                aria-hidden
              >
                ·
              </span>
              <span
                className={`home-call-history-visual__route-queue ${inter.className} font-normal leading-snug`}
                style={{ color: MUTED_TEXT, fontSize: META_SIZE }}
              >
                {call.routeQueue}
              </span>
              <span
                className={`home-call-history-visual__status home-call-history-visual__status--routed ${inter.className} font-medium leading-none`}
                style={{
                  background: LIVE_BADGE_BG,
                  color: DOE_ORANGE,
                  fontSize: BADGE_SIZE,
                  padding: "0.32em 0.62em",
                  borderRadius: "999px",
                }}
              >
                Routed
              </span>
            </div>
            <p
              className={`home-call-history-visual__route-detail mt-[clamp(0.28rem,0.82vmin,0.34rem)] ${inter.className} font-normal leading-snug`}
              style={{ color: MUTED_TEXT, fontSize: NOTE_SIZE }}
            >
              {call.routeDetail}
            </p>
          </div>
        </div>
      </div>

      {isExpanded && call.summary ? (
        <div className="home-call-history-visual__detail mt-[clamp(0.62rem,1.85vmin,0.78rem)]">
          <p
            className={`home-call-history-visual__summary ${inter.className} font-normal leading-snug`}
            style={{ color: MUTED_TEXT, fontSize: NOTE_SIZE }}
          >
            {call.summary}
          </p>

          {call.transcript ? (
            <p
              className={`home-call-history-visual__transcript mt-[clamp(0.42rem,1.25vmin,0.55rem)] ${INNER_RADIUS} ${inter.className} font-normal italic leading-snug`}
              style={{
                color: MUTED_TEXT,
                fontSize: NOTE_SIZE,
                background: "rgba(30, 52, 58, 0.04)",
                padding: "clamp(0.48rem,1.4vmin,0.58rem) clamp(0.55rem,1.65vmin,0.68rem)",
              }}
            >
              {call.transcript}
            </p>
          ) : null}

          {call.outcomes && call.outcomes.length > 0 ? (
            <div className="home-call-history-visual__outcomes mt-[clamp(0.42rem,1.25vmin,0.55rem)] flex flex-wrap gap-[clamp(0.28rem,0.82vmin,0.36rem)]">
              {call.outcomes.map((outcome) => (
                <span
                  key={outcome}
                  className={`home-call-history-visual__outcome ${inter.className} font-medium leading-none`}
                  style={{
                    color: DOE_ORANGE,
                    fontSize: BADGE_SIZE,
                    padding: "0.32em 0.62em",
                    borderRadius: "999px",
                    background: LIVE_BADGE_BG,
                  }}
                >
                  {outcome}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

/** Call history — routed tabs and log rows placed directly on the feature shader. */
export function DoePhoneCallHistoryVisual({ layout = "phone" }: { layout?: VisualLayout }) {
  const isDesktop = layout === "desktop";
  const maxWidth = isDesktop ? "min(100%, 28rem)" : CAROUSEL_MENU_UI.maxWidthPhone;

  return (
    <div
      className={`home-call-history-visual mx-auto flex h-full w-full flex-col justify-center px-[clamp(0.65rem,2vmin,0.9rem)] ${suisseIntl.className}`}
      style={{ maxWidth }}
      aria-hidden
    >
      <div
        className="home-call-history-visual__filters flex flex-wrap gap-[clamp(0.28rem,0.82vmin,0.36rem)]"
        role="tablist"
        aria-hidden
      >
        {FILTERS.map((filter) => {
          const isActive = filter.id === ACTIVE_FILTER_ID;

          return (
            <span
              key={filter.id}
              className={`home-call-history-visual__filter home-call-history-visual__filter--${filter.id}${
                isActive ? " home-call-history-visual__filter--active" : ""
              } ${inter.className} font-medium leading-none`}
              style={{
                color: isActive ? DOE_ORANGE : MUTED_TEXT,
                fontSize: BADGE_SIZE,
                padding: "0.38em 0.72em",
                borderRadius: "999px",
                background: isActive ? LIVE_BADGE_BG : "rgba(30, 52, 58, 0.05)",
                border: isActive ? `1px solid rgba(210, 119, 76, 0.22)` : `1px solid ${BORDER}`,
              }}
            >
              {filter.label}
              <span className="home-call-history-visual__filter-count ml-[0.35em] tabular-nums opacity-80">
                {filter.count}
              </span>
            </span>
          );
        })}
      </div>

      <div
        className="home-call-history-visual__list flex flex-col"
        style={{
          marginTop: "clamp(0.72rem,2.15vmin,0.88rem)",
          gap: "clamp(0.55rem,1.65vmin,0.72rem)",
        }}
      >
        {CALL_HISTORY.map((call) => (
          <CallLogRow key={`${call.callerName}-${call.time}`} call={call} />
        ))}
      </div>
    </div>
  );
}
