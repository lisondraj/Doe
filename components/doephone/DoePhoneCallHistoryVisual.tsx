"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";

const { ink: INK, accent: DOE_ORANGE, divider: DIVIDER } = CAROUSEL_MENU_UI;

const TITLE_WHITE = "#FFFFFF";
const MUTED_TEXT = "#6B7280";
const TYPE_MUTED = "#9CA3AF";
const ROW_SURFACE = "#FFFFFF";
const ROW_BORDER = "#E5E7EB";
const SUMMARY_DIVIDER = DIVIDER;

const STACK_GAP = "clamp(0.62rem,1.85vmin,0.8rem)";
const TITLE_SIZE = "clamp(1.32rem,4vmin,1.62rem)";
const NAME_SIZE = "clamp(0.92rem,2.75vmin,1.08rem)";
const PHONE_SIZE = "clamp(0.82rem,2.45vmin,0.98rem)";
const TYPE_SIZE = "clamp(0.76rem,2.2vmin,0.9rem)";
const ACTION_SIZE = "clamp(0.84rem,2.5vmin,1rem)";
const SUMMARY_SIZE = "clamp(0.76rem,2.2vmin,0.9rem)";
const ROW_PAD = "clamp(0.78rem,2.35vmin,0.95rem) clamp(0.9rem,2.65vmin,1.05rem)";

const CALL_HISTORY = [
  {
    callerName: "Maria Lopez",
    phone: "(415) 555-0176",
    callType: "Lab results callback",
    action: "Completed",
  },
  {
    callerName: "Dr. Patel's office",
    phone: "(628) 555-0134",
    callType: "Referral intake",
    action: "Call back >",
    expanded: true,
    achievements: [
      "Confirmed specialist availability for next week",
      "Routed referral letter to patient chart",
      "Scheduled follow-up confirmation call",
    ],
  },
] as const;

type CallEntry = (typeof CALL_HISTORY)[number];
type VisualLayout = "phone" | "desktop";

function CallRowHeader({ call }: { call: CallEntry }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <p
          className={`truncate ${inter.className} font-medium leading-snug`}
          style={{ color: INK, fontSize: NAME_SIZE }}
        >
          {call.callerName}
        </p>
        <p
          className={`mt-[0.32em] truncate ${inter.className} font-normal leading-snug`}
          style={{ color: MUTED_TEXT, fontSize: PHONE_SIZE }}
        >
          {call.phone}
        </p>
        <p
          className={`mt-[0.22em] truncate ${inter.className} font-normal leading-snug`}
          style={{ color: TYPE_MUTED, fontSize: TYPE_SIZE }}
        >
          {call.callType}
        </p>
      </div>
      <span
        className={`inline-flex shrink-0 items-center ${inter.className} font-medium leading-none`}
        style={{ color: DOE_ORANGE, fontSize: ACTION_SIZE, marginTop: "0.12em" }}
      >
        {call.action}
      </span>
    </div>
  );
}

/** Call history list — open layout on shader, no card shell. */
export function DoePhoneCallHistoryVisual({ layout = "phone" }: { layout?: VisualLayout }) {
  const isDesktop = layout === "desktop";
  const maxWidth = isDesktop ? "min(100%, 28rem)" : CAROUSEL_MENU_UI.maxWidthPhone;

  return (
    <div
      className={`mx-auto flex h-full w-full items-center justify-center px-[clamp(0.65rem,2vmin,0.9rem)] ${suisseIntl.className}`}
      style={{ maxWidth }}
      aria-hidden
    >
      <div className="flex w-full flex-col" style={{ gap: STACK_GAP }}>
        <h3
          className="font-semibold leading-tight tracking-[-0.025em]"
          style={{
            color: TITLE_WHITE,
            fontSize: TITLE_SIZE,
          }}
        >
          Call History
        </h3>

        <div className="flex flex-col" style={{ gap: "clamp(0.62rem,1.85vmin,0.8rem)" }}>
          {CALL_HISTORY.map((call) =>
            "expanded" in call && call.expanded ? (
              <div
                key={`${call.callerName}-${call.phone}`}
                className="rounded-[clamp(0.45rem,1.3vmin,0.55rem)]"
                style={{
                  background: ROW_SURFACE,
                  border: `1px solid ${ROW_BORDER}`,
                  padding: ROW_PAD,
                }}
              >
                <CallRowHeader call={call} />
                <div
                  className="flex flex-col"
                  style={{
                    marginTop: "clamp(0.62rem,1.85vmin,0.78rem)",
                    marginLeft: "clamp(0.55rem,1.65vmin,0.72rem)",
                    paddingLeft: "clamp(0.72rem,2.15vmin,0.88rem)",
                    borderLeft: `1px solid ${SUMMARY_DIVIDER}`,
                    gap: "clamp(0.42rem,1.25vmin,0.55rem)",
                  }}
                >
                  {call.achievements.map((item) => (
                    <p
                      key={item}
                      className={`${inter.className} font-normal leading-snug`}
                      style={{ color: MUTED_TEXT, fontSize: SUMMARY_SIZE }}
                    >
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            ) : (
              <div
                key={`${call.callerName}-${call.phone}`}
                className="rounded-[clamp(0.45rem,1.3vmin,0.55rem)]"
                style={{
                  background: ROW_SURFACE,
                  border: `1px solid ${ROW_BORDER}`,
                  padding: ROW_PAD,
                }}
              >
                <CallRowHeader call={call} />
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
