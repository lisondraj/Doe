"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";

const { ink: INK, accent: DOE_ORANGE } = CAROUSEL_MENU_UI;

const MUTED_TEXT = "#6B7280";
const TYPE_MUTED = "#9CA3AF";
const SURFACE = "#FAFAF8";
const BORDER = "#E5E7EB";
const DIVIDER = "#EBE7E0";
const COMPLETED_BG = "rgba(30, 52, 58, 0.06)";
const CALLBACK_BG = "rgba(210, 119, 76, 0.12)";
const SUMMARY_BG = "rgba(250, 250, 248, 0.92)";
const CARD_SHADOW = "0 12px 32px rgba(30, 52, 58, 0.09), 0 1px 6px rgba(30, 52, 58, 0.04)";

const OUTER_RADIUS = "rounded-[clamp(0.72rem,2.1vmin,0.95rem)]";
const INNER_RADIUS = "rounded-[clamp(0.45rem,1.3vmin,0.55rem)]";
const CARD_PAD = "clamp(1.2rem,3.75vmin,1.5rem)";
const TITLE_SIZE = "clamp(1.32rem,4vmin,1.62rem)";
const LABEL_SIZE = "clamp(0.68rem,2rem,0.8rem)";
const ROW_SIZE = "clamp(0.92rem,2.75vmin,1.08rem)";
const META_SIZE = "clamp(0.78rem,2.3vmin,0.92rem)";
const TIME_SIZE = "clamp(0.72rem,2.15vmin,0.86rem)";
const SUMMARY_SIZE = "clamp(0.76rem,2.25vmin,0.9rem)";
const OUTCOME_SIZE = "clamp(0.74rem,2.15vmin,0.88rem)";
const BADGE_SIZE = "clamp(0.68rem,2rem,0.8rem)";

type CallStatus = "completed" | "callback";

type CallEntry = {
  callerName: string;
  phone: string;
  callType: string;
  time: string;
  duration: string;
  direction: "inbound" | "outbound";
  status: CallStatus;
  initials: string;
  expanded?: boolean;
  summary?: string;
  outcomes?: readonly string[];
};

const CALL_HISTORY: readonly CallEntry[] = [
  {
    callerName: "Maria Lopez",
    phone: "(415) 555-0176",
    callType: "Lab results callback",
    time: "2:41 PM",
    duration: "3m 08s",
    direction: "inbound",
    status: "completed",
    initials: "ML",
  },
  {
    callerName: "Dr. Patel's office",
    phone: "(628) 555-0134",
    callType: "Referral intake",
    time: "1:18 PM",
    duration: "6m 44s",
    direction: "inbound",
    status: "callback",
    initials: "DP",
    expanded: true,
    summary:
      "Front desk agent confirmed specialist availability, attached the referral letter to chart, and queued a follow-up confirmation for the patient.",
    outcomes: [
      "Specialist slot held for next Tuesday",
      "Referral letter routed to chart",
      "Patient callback scheduled for 4 PM",
    ],
  },
] as const;

type VisualLayout = "phone" | "desktop";

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

function InboundIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden className="h-[0.85em] w-[0.85em] shrink-0">
      <path
        d="M6 2.5v7M6 9.5L3.5 7M6 9.5L8.5 7"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhonePlusIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" aria-hidden className="h-[0.9em] w-[0.9em] shrink-0">
      <path
        d="M4.1 3.4c.3-.7 1.2-.9 1.8-.5l.9.7c.6.4.6 1.2.2 1.7l-.5.7c.6 1.2 1.6 2.2 2.8 2.8l.7-.5c.5-.4 1.3-.3 1.7.2l.7.9c.4.6.2 1.5-.5 1.8l-.8.4c-1.5.7-3.2.3-4.5-1s-1.7-3-1-4.5l.4-.8z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path d="M10.5 2.5v2M9.5 3.5h2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

function StatusBadge({ status }: { status: CallStatus }) {
  const isCompleted = status === "completed";

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-[0.3em] ${inter.className} font-medium leading-none`}
      style={{
        background: isCompleted ? COMPLETED_BG : CALLBACK_BG,
        color: isCompleted ? INK : DOE_ORANGE,
        fontSize: BADGE_SIZE,
        padding: "0.38em 0.68em",
        borderRadius: "0.375rem",
      }}
    >
      {isCompleted ? <CheckIcon /> : null}
      {isCompleted ? "Completed" : "Call back"}
    </span>
  );
}

function CallerAvatar({ initials }: { initials: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${inter.className} font-medium leading-none`}
      style={{
        width: "clamp(2rem,5.8vmin,2.35rem)",
        height: "clamp(2rem,5.8vmin,2.35rem)",
        borderRadius: "9999px",
        background: CALLBACK_BG,
        color: DOE_ORANGE,
        fontSize: META_SIZE,
      }}
    >
      {initials}
    </span>
  );
}

function CallTimelineRow({ call, isLast }: { call: CallEntry; isLast: boolean }) {
  return (
    <div className="relative flex gap-[clamp(0.62rem,1.85vmin,0.82rem)]">
      <div className="flex w-[clamp(2.35rem,6.8vmin,2.75rem)] shrink-0 flex-col items-center">
        <span
          className={`${inter.className} font-medium leading-none`}
          style={{ color: TYPE_MUTED, fontSize: TIME_SIZE }}
        >
          {call.time}
        </span>
        <span
          className="mt-[0.35em] inline-flex h-[0.42rem] w-[0.42rem] shrink-0 rounded-full"
          style={{ background: call.expanded ? DOE_ORANGE : DIVIDER }}
        />
        {!isLast ? (
          <span
            className="mt-[0.28em] w-px flex-1 min-h-[clamp(0.75rem,2.2vmin,1rem)]"
            style={{ background: DIVIDER }}
          />
        ) : null}
      </div>

      <div className={`min-w-0 flex-1 ${INNER_RADIUS}`} style={{ background: SURFACE, padding: "clamp(0.72rem,2.15vmin,0.88rem)" }}>
        <div className="flex items-start gap-[clamp(0.55rem,1.65vmin,0.72rem)]">
          <CallerAvatar initials={call.initials} />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p
                  className={`truncate ${inter.className} font-medium leading-snug`}
                  style={{ color: INK, fontSize: ROW_SIZE }}
                >
                  {call.callerName}
                </p>
                <p
                  className={`mt-[0.2em] flex flex-wrap items-center gap-x-[0.45em] gap-y-[0.15em] ${inter.className} font-normal leading-snug`}
                  style={{ color: MUTED_TEXT, fontSize: META_SIZE }}
                >
                  <span className="inline-flex items-center gap-[0.25em]" style={{ color: TYPE_MUTED }}>
                    <InboundIcon />
                    Inbound
                  </span>
                  <span aria-hidden>·</span>
                  <span>{call.duration}</span>
                </p>
              </div>
              <StatusBadge status={call.status} />
            </div>

            <p
              className={`mt-[0.35em] truncate ${inter.className} font-normal leading-snug`}
              style={{ color: TYPE_MUTED, fontSize: META_SIZE }}
            >
              {call.callType}
            </p>
            <p
              className={`mt-[0.15em] truncate ${inter.className} font-normal leading-snug`}
              style={{ color: TYPE_MUTED, fontSize: TIME_SIZE }}
            >
              {call.phone}
            </p>

            {call.expanded && call.summary ? (
              <div
                className={`mt-[clamp(0.62rem,1.85vmin,0.78rem)] ${INNER_RADIUS}`}
                style={{
                  background: SUMMARY_BG,
                  border: `1px solid ${BORDER}`,
                  padding: "clamp(0.62rem,1.85vmin,0.75rem)",
                }}
              >
                <p
                  className={`${inter.className} font-normal leading-snug`}
                  style={{ color: MUTED_TEXT, fontSize: SUMMARY_SIZE }}
                >
                  {call.summary}
                </p>
                {call.outcomes?.length ? (
                  <ul
                    className="mt-[clamp(0.48rem,1.4vmin,0.58rem)] flex flex-col"
                    style={{ gap: "clamp(0.32rem,0.95vmin,0.42rem)" }}
                  >
                    {call.outcomes.map((item) => (
                      <li
                        key={item}
                        className={`flex items-start gap-[0.45em] ${inter.className} font-normal leading-snug`}
                        style={{ color: MUTED_TEXT, fontSize: OUTCOME_SIZE }}
                      >
                        <span className="mt-[0.15em] shrink-0" style={{ color: DOE_ORANGE }}>
                          <CheckIcon />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Call history timeline in Review Package card shell — inbox / documents slide. */
export function DoePhoneCallHistoryVisual({ layout = "phone" }: { layout?: VisualLayout }) {
  const isDesktop = layout === "desktop";
  const maxWidth = isDesktop ? "min(100%, 28rem)" : CAROUSEL_MENU_UI.maxWidthPhone;

  return (
    <div
      className={`mx-auto flex h-full w-full items-center justify-center px-[clamp(0.65rem,2vmin,0.9rem)] ${suisseIntl.className}`}
      style={{ maxWidth }}
      aria-hidden
    >
      <div
        className={`relative w-full overflow-hidden bg-white ${OUTER_RADIUS}`}
        style={{
          padding: CARD_PAD,
          border: `1px solid ${BORDER}`,
          boxShadow: CARD_SHADOW,
        }}
      >
        <div className="flex items-center justify-between gap-[clamp(0.55rem,1.65vmin,0.72rem)]">
          <div className="min-w-0">
            <h3
              className="font-semibold leading-tight tracking-[-0.025em]"
              style={{ color: INK, fontSize: TITLE_SIZE }}
            >
              Call History
            </h3>
            <p
              className={`mt-[0.22em] ${inter.className} font-medium uppercase tracking-[0.08em]`}
              style={{ color: TYPE_MUTED, fontSize: LABEL_SIZE }}
            >
              Today · {CALL_HISTORY.length} calls
            </p>
          </div>
          <button
            type="button"
            className={`inline-flex shrink-0 items-center gap-[0.4em] ${inter.className} font-medium leading-none`}
            style={{
              background: CALLBACK_BG,
              color: DOE_ORANGE,
              fontSize: META_SIZE,
              padding: "0.55em 0.82em",
              borderRadius: "9999px",
              border: `1px solid rgba(210, 119, 76, 0.22)`,
            }}
          >
            <PhonePlusIcon />
            Log call
          </button>
        </div>

        <div
          className="flex flex-col"
          style={{
            marginTop: "clamp(0.95rem,2.85vmin,1.15rem)",
            gap: "clamp(0.72rem,2.15vmin,0.92rem)",
          }}
        >
          {CALL_HISTORY.map((call, index) => (
            <CallTimelineRow key={`${call.callerName}-${call.time}`} call={call} isLast={index === CALL_HISTORY.length - 1} />
          ))}
        </div>
      </div>
    </div>
  );
}
