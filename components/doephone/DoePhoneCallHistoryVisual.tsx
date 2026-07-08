"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";

const { ink: INK, accent: DOE_ORANGE } = CAROUSEL_MENU_UI;

const MUTED_TEXT = "#6B7280";
const TYPE_MUTED = "#9CA3AF";
const BTN_BG = "#F3F4F6";
const BORDER = "#E5E7EB";
const ROW_BG = "#FAFAF8";
const CARD_SHADOW = "0 12px 32px rgba(30, 52, 58, 0.09), 0 1px 6px rgba(30, 52, 58, 0.04)";
const BUTTON_SHADOW = "0 8px 22px rgba(30, 52, 58, 0.06)";

const OUTER_RADIUS = "rounded-[clamp(0.72rem,2.1vmin,0.95rem)]";
const INNER_RADIUS = "rounded-[clamp(0.45rem,1.3vmin,0.55rem)]";
const BUTTON_RADIUS = "rounded-[clamp(0.48rem,1.4vmin,0.6rem)]";
const CARD_PAD = "clamp(1.2rem,3.75vmin,1.5rem) clamp(1.2rem,3.75vmin,1.5rem) clamp(0.95rem,2.85vmin,1.15rem)";
const STACK_GAP = "clamp(0.62rem,1.85vmin,0.8rem)";
const BUTTON_PAD = "clamp(0.72rem,2.15vmin,0.88rem) clamp(1.05rem,3.1vmin,1.3rem)";
const TITLE_SIZE = "clamp(1.32rem,4vmin,1.62rem)";
const ROW_SIZE = "clamp(0.92rem,2.75vmin,1.08rem)";
const META_SIZE = "clamp(0.78rem,2.3vmin,0.92rem)";
const TYPE_SIZE = "clamp(0.76rem,2.2vmin,0.9rem)";
const ACTION_SIZE = "clamp(0.9rem,2.7vmin,1.05rem)";
const STATUS_SIZE = "clamp(0.84rem,2.5vmin,1rem)";
const STEP_SIZE = "clamp(0.76rem,2.2vmin,0.9rem)";
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

function ChevronUpIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" aria-hidden className="h-[0.95em] w-[0.95em]">
      <path d="M3.5 8.5L7 5l3.5 3.5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 18 18" fill="none" aria-hidden className="h-[1.05em] w-[1.05em] shrink-0" style={{ color: INK }}>
      <path
        d="M5.2 3.8c.4-.9 1.5-1.2 2.3-.6l1.2.9c.7.5.8 1.5.3 2.2l-.7.9c.8 1.5 2.1 2.8 3.6 3.6l.9-.7c.7-.5 1.7-.4 2.2.3l.9 1.2c.6.8.3 1.9-.6 2.3l-1.1.5c-2 .9-4.3.4-6-1.3s-2.2-4-1.3-6l.5-1.1z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CallRowHeader({ call }: { call: CallEntry }) {
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <span
          className={`min-w-0 truncate ${inter.className} font-normal`}
          style={{ color: MUTED_TEXT, fontSize: ROW_SIZE }}
        >
          {call.callerName}
        </span>
        <span
          className={`inline-flex shrink-0 items-center ${inter.className} font-medium leading-none`}
          style={{ color: DOE_ORANGE, fontSize: STATUS_SIZE }}
        >
          {call.action}
        </span>
      </div>
      <p
        className={`mt-[0.32em] truncate ${inter.className} font-normal leading-snug`}
        style={{ color: MUTED_TEXT, fontSize: META_SIZE }}
      >
        {call.phone}
      </p>
      <p
        className={`mt-[0.18em] truncate ${inter.className} font-normal leading-snug`}
        style={{ color: TYPE_MUTED, fontSize: TYPE_SIZE }}
      >
        {call.callType}
      </p>
    </>
  );
}

/** Call history list in Review Package card shell — inbox / documents slide. */
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
        <div
          className={`relative w-full overflow-hidden bg-white ${OUTER_RADIUS}`}
          style={{
            padding: CARD_PAD,
            border: `1px solid ${BORDER}`,
            boxShadow: CARD_SHADOW,
          }}
        >
          <div className="flex items-center justify-between gap-[clamp(0.55rem,1.65vmin,0.72rem)]">
            <h3
              className="min-w-0 font-semibold leading-tight tracking-[-0.025em]"
              style={{
                color: INK,
                fontSize: TITLE_SIZE,
              }}
            >
              Call History
            </h3>
            <span
              className="inline-flex shrink-0 items-center justify-center rounded-full"
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

          <div style={{ marginTop: "clamp(0.85rem,2.5vmin,1rem)" }}>
            <div className="flex flex-col" style={{ gap: "clamp(0.62rem,1.85vmin,0.8rem)" }}>
              {CALL_HISTORY.map((call) =>
                "expanded" in call && call.expanded ? (
                  <div
                    key={`${call.callerName}-${call.phone}`}
                    className={INNER_RADIUS}
                    style={{ background: ROW_BG, padding: ROW_PAD }}
                  >
                    <CallRowHeader call={call} />
                    <div
                      className="flex flex-col"
                      style={{
                        marginTop: "clamp(0.62rem,1.85vmin,0.78rem)",
                        marginLeft: "clamp(0.55rem,1.65vmin,0.72rem)",
                        paddingLeft: "clamp(0.72rem,2.15vmin,0.88rem)",
                        borderLeft: `1px solid ${BORDER}`,
                        gap: "clamp(0.42rem,1.25vmin,0.55rem)",
                      }}
                    >
                      {call.achievements.map((item) => (
                        <p
                          key={item}
                          className={`${inter.className} font-normal leading-snug`}
                          style={{ color: MUTED_TEXT, fontSize: STEP_SIZE }}
                        >
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div
                    key={`${call.callerName}-${call.phone}`}
                    className={INNER_RADIUS}
                    style={{ background: ROW_BG, padding: ROW_PAD }}
                  >
                    <CallRowHeader call={call} />
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        <div
          className={`flex w-full items-center overflow-hidden ${BUTTON_RADIUS}`}
          style={{
            background: BTN_BG,
            padding: BUTTON_PAD,
            gap: "clamp(0.62rem,1.85vmin,0.8rem)",
            border: `1px solid ${BORDER}`,
            boxShadow: BUTTON_SHADOW,
          }}
        >
          <PhoneIcon />
          <p
            className={`${inter.className} font-medium leading-snug`}
            style={{ color: INK, fontSize: ACTION_SIZE }}
          >
            Log call
          </p>
        </div>
      </div>
    </div>
  );
}
