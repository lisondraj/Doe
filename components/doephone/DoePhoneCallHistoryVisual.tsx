"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";

const { ink: INK, accent: DOE_ORANGE } = CAROUSEL_MENU_UI;

const MUTED_TEXT = "#6B7280";
const TYPE_MUTED = "#9CA3AF";
const BORDER = "#E5E7EB";
const ROW_BG = "#FAFAF8";
const LIVE_BADGE_BG = "rgba(210, 119, 76, 0.14)";
const CARD_SHADOW = "0 12px 32px rgba(30, 52, 58, 0.09), 0 1px 6px rgba(30, 52, 58, 0.04)";

const OUTER_RADIUS = "rounded-[clamp(0.72rem,2.1vmin,0.95rem)]";
const INNER_RADIUS = "rounded-[clamp(0.45rem,1.3vmin,0.55rem)]";
const CARD_PAD = "clamp(1.2rem,3.75vmin,1.5rem)";
const TITLE_SIZE = "clamp(1.32rem,4vmin,1.62rem)";
const ROW_SIZE = "clamp(0.92rem,2.75vmin,1.08rem)";
const META_SIZE = "clamp(0.78rem,2.3vmin,0.92rem)";
const TIME_SIZE = "clamp(0.72rem,2.15vmin,0.86rem)";
const NOTE_SIZE = "clamp(0.76rem,2.25vmin,0.9rem)";
const BADGE_SIZE = "clamp(0.72rem,2.15vmin,0.86rem)";

type CallStatus = "resolved" | "routed" | "review";

type CallEntry = {
  callerName: string;
  phone: string;
  callType: string;
  time: string;
  duration: string;
  status: CallStatus;
  agent: string;
  direction: "inbound" | "outbound";
  expanded?: boolean;
  summary?: string;
  transcript?: string;
  outcomes?: readonly string[];
};

const FILTERS = [
  { id: "all", label: "All", count: 18 },
  { id: "routed", label: "Routed", count: 6 },
  { id: "review", label: "Needs review", count: 2 },
] as const;

const CALL_HISTORY: readonly CallEntry[] = [
  {
    callerName: "Maria Lopez",
    phone: "(415) 555-0176",
    callType: "Lab results callback",
    time: "2:41 PM",
    duration: "3m 08s",
    status: "resolved",
    agent: "Inbox Agent",
    direction: "inbound",
  },
  {
    callerName: "Dr. Patel's office",
    phone: "(628) 555-0134",
    callType: "Referral intake",
    time: "1:18 PM",
    duration: "6m 44s",
    status: "routed",
    agent: "Referrals Agent",
    direction: "inbound",
    expanded: true,
    summary: "Specialist slot held for Tuesday at 2:30 PM.",
    transcript: "\"Need to schedule Maria Lopez with cardiology for abnormal stress test.\"",
    outcomes: ["Referral queued", "Callback 4 PM"],
  },
  {
    callerName: "James Chen",
    phone: "(510) 555-0192",
    callType: "Appointment confirmation",
    time: "11:52 AM",
    duration: "2m 15s",
    status: "resolved",
    agent: "Scheduling Agent",
    direction: "outbound",
  },
] as const;

const STATUS_LABEL: Record<CallStatus, string> = {
  resolved: "Resolved",
  routed: "Routed",
  review: "Needs review",
};

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

          <div className="home-call-history-visual__meta mt-[clamp(0.42rem,1.25vmin,0.55rem)] flex flex-wrap items-center gap-[clamp(0.28rem,0.82vmin,0.36rem)]">
            <span
              className={`home-call-history-visual__type ${inter.className} font-normal leading-none`}
              style={{ color: MUTED_TEXT, fontSize: META_SIZE }}
            >
              {call.callType}
            </span>
            <span
              className={`home-call-history-visual__status home-call-history-visual__status--${call.status} ${inter.className} font-medium leading-none`}
              style={{
                background: call.status === "routed" ? LIVE_BADGE_BG : "rgba(30, 52, 58, 0.06)",
                color: call.status === "routed" ? DOE_ORANGE : MUTED_TEXT,
                fontSize: BADGE_SIZE,
                padding: "0.32em 0.62em",
                borderRadius: "999px",
              }}
            >
              {STATUS_LABEL[call.status]}
            </span>
            <span
              className={`home-call-history-visual__agent ${inter.className} font-normal leading-none`}
              style={{ color: TYPE_MUTED, fontSize: META_SIZE }}
            >
              {call.agent}
            </span>
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

/** Call history log in Review Package card shell — inbox / documents slide. */
export function DoePhoneCallHistoryVisual({ layout = "phone" }: { layout?: VisualLayout }) {
  const isDesktop = layout === "desktop";
  const maxWidth = isDesktop ? "min(100%, 28rem)" : CAROUSEL_MENU_UI.maxWidthPhone;

  return (
    <div
      className={`home-call-history-visual mx-auto flex h-full w-full items-center justify-center px-[clamp(0.65rem,2vmin,0.9rem)] ${suisseIntl.className}`}
      style={{ maxWidth }}
      aria-hidden
    >
      <div
        className={`home-call-history-visual__card relative w-full overflow-hidden bg-white ${OUTER_RADIUS}`}
        style={{
          padding: CARD_PAD,
          border: `1px solid ${BORDER}`,
          boxShadow: CARD_SHADOW,
        }}
      >
        <div className="home-call-history-visual__header flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3
              className="home-call-history-visual__title font-semibold leading-tight tracking-[-0.025em]"
              style={{ color: INK, fontSize: TITLE_SIZE }}
            >
              Call History
            </h3>
            <p
              className={`home-call-history-visual__subtitle mt-[0.28em] ${inter.className} font-normal leading-snug`}
              style={{ color: MUTED_TEXT, fontSize: META_SIZE }}
            >
              Review transcripts, routing, and outcomes
            </p>
          </div>
          <span
            className={`home-call-history-visual__count shrink-0 ${inter.className} font-medium leading-none`}
            style={{
              color: DOE_ORANGE,
              fontSize: BADGE_SIZE,
              padding: "0.38em 0.72em",
              borderRadius: "0.375rem",
              background: LIVE_BADGE_BG,
            }}
          >
            18 today
          </span>
        </div>

        <div
          className="home-call-history-visual__filters mt-[clamp(0.72rem,2.15vmin,0.88rem)] flex flex-wrap gap-[clamp(0.28rem,0.82vmin,0.36rem)]"
          role="tablist"
          aria-hidden
        >
          {FILTERS.map((filter, index) => (
            <span
              key={filter.id}
              className={`home-call-history-visual__filter home-call-history-visual__filter--${filter.id}${
                index === 0 ? " home-call-history-visual__filter--active" : ""
              } ${inter.className} font-medium leading-none`}
              style={{
                color: index === 0 ? DOE_ORANGE : MUTED_TEXT,
                fontSize: BADGE_SIZE,
                padding: "0.38em 0.72em",
                borderRadius: "999px",
                background: index === 0 ? LIVE_BADGE_BG : "rgba(30, 52, 58, 0.05)",
                border: index === 0 ? `1px solid rgba(210, 119, 76, 0.22)` : `1px solid ${BORDER}`,
              }}
            >
              {filter.label}
              <span className="home-call-history-visual__filter-count ml-[0.35em] tabular-nums opacity-80">
                {filter.count}
              </span>
            </span>
          ))}
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

        <div
          className="home-call-history-visual__footer mt-[clamp(0.72rem,2.15vmin,0.88rem)] flex items-center justify-between gap-3 border-t pt-[clamp(0.72rem,2.15vmin,0.88rem)]"
          style={{ borderColor: BORDER }}
        >
          <span
            className={`home-call-history-visual__footer-stat ${inter.className} font-normal leading-snug`}
            style={{ color: MUTED_TEXT, fontSize: META_SIZE }}
          >
            Avg handle time 4m 12s
          </span>
          <span
            className={`home-call-history-visual__footer-pill ${inter.className} font-medium leading-none`}
            style={{
              color: DOE_ORANGE,
              fontSize: BADGE_SIZE,
              padding: "0.34em 0.68em",
              borderRadius: "999px",
              background: LIVE_BADGE_BG,
            }}
          >
            Auto-route on
          </span>
        </div>
      </div>
    </div>
  );
}
