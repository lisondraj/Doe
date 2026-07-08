"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";

const { ink: INK, accent: DOE_ORANGE } = CAROUSEL_MENU_UI;

const MUTED_TEXT = "#6B7280";
const TYPE_MUTED = "#9CA3AF";
const BORDER = "#E5E7EB";
const CARD_SHADOW = "0 12px 32px rgba(30, 52, 58, 0.09), 0 1px 6px rgba(30, 52, 58, 0.04)";

const OUTER_RADIUS = "rounded-[clamp(0.72rem,2.1vmin,0.95rem)]";
const CARD_PAD = "clamp(1.2rem,3.75vmin,1.5rem)";
const TITLE_SIZE = "clamp(1.32rem,4vmin,1.62rem)";
const NAME_SIZE = "clamp(0.92rem,2.75vmin,1.08rem)";
const META_SIZE = "clamp(0.78rem,2.3vmin,0.92rem)";
const TIME_SIZE = "clamp(0.72rem,2.15vmin,0.86rem)";
const NOTE_SIZE = "clamp(0.76rem,2.25vmin,0.9rem)";

type CallEntry = {
  callerName: string;
  phone: string;
  callType: string;
  time: string;
  duration: string;
  note?: string;
};

const CALL_HISTORY: readonly CallEntry[] = [
  {
    callerName: "Maria Lopez",
    phone: "(415) 555-0176",
    callType: "Lab results callback",
    time: "2:41 PM",
    duration: "3m 08s",
  },
  {
    callerName: "Dr. Patel's office",
    phone: "(628) 555-0134",
    callType: "Referral intake",
    time: "1:18 PM",
    duration: "6m 44s",
    note: "Specialist slot held for Tuesday. Referral routed to chart and patient callback queued for 4 PM.",
  },
  {
    callerName: "James Chen",
    phone: "(510) 555-0192",
    callType: "Appointment confirmation",
    time: "11:52 AM",
    duration: "2m 15s",
  },
] as const;

type VisualLayout = "phone" | "desktop";

function CallLogRow({ call, isLast }: { call: CallEntry; isLast: boolean }) {
  return (
    <div
      className="py-[clamp(0.72rem,2.15vmin,0.88rem)]"
      style={{ borderBottom: isLast ? undefined : `1px solid ${BORDER}` }}
    >
      <div className="flex items-start justify-between gap-3">
        <p
          className={`min-w-0 flex-1 ${inter.className} font-medium leading-snug`}
          style={{ color: INK, fontSize: NAME_SIZE }}
        >
          {call.callerName}
        </p>
        <span
          className={`shrink-0 tabular-nums ${inter.className} font-normal leading-none`}
          style={{ color: TYPE_MUTED, fontSize: TIME_SIZE }}
        >
          {call.time}
        </span>
      </div>

      <div className="mt-[0.28em] flex flex-wrap items-center gap-x-[0.45em] gap-y-[0.1em]">
        <span
          className={`shrink-0 tabular-nums ${inter.className} font-medium leading-snug`}
          style={{ color: DOE_ORANGE, fontSize: META_SIZE }}
        >
          {call.phone}
        </span>
        <span aria-hidden style={{ color: TYPE_MUTED, fontSize: META_SIZE }}>
          ·
        </span>
        <span
          className={`${inter.className} font-normal leading-snug`}
          style={{ color: MUTED_TEXT, fontSize: META_SIZE }}
        >
          {call.callType}
        </span>
        <span aria-hidden style={{ color: TYPE_MUTED, fontSize: META_SIZE }}>
          ·
        </span>
        <span
          className={`tabular-nums ${inter.className} font-normal leading-snug`}
          style={{ color: TYPE_MUTED, fontSize: META_SIZE }}
        >
          {call.duration}
        </span>
      </div>

      {call.note ? (
        <p
          className={`mt-[clamp(0.48rem,1.4vmin,0.58rem)] border-l-[2px] pl-[0.65em] ${inter.className} font-normal leading-snug`}
          style={{ borderColor: DOE_ORANGE, color: MUTED_TEXT, fontSize: NOTE_SIZE }}
        >
          {call.note}
        </p>
      ) : null}
    </div>
  );
}

/** Call history log in Review Package card shell — inbox / documents slide. */
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
        <div className="flex items-baseline justify-between gap-3">
          <h3
            className="font-semibold leading-tight tracking-[-0.025em]"
            style={{ color: INK, fontSize: TITLE_SIZE }}
          >
            Call History
          </h3>
          <span
            className={`shrink-0 ${inter.className} font-normal leading-none`}
            style={{ color: TYPE_MUTED, fontSize: META_SIZE }}
          >
            {CALL_HISTORY.length} today
          </span>
        </div>

        <div
          className="mt-[clamp(0.85rem,2.5vmin,1rem)]"
          style={{ borderTop: `1px solid ${BORDER}` }}
        >
          {CALL_HISTORY.map((call, index) => (
            <CallLogRow
              key={`${call.callerName}-${call.time}`}
              call={call}
              isLast={index === CALL_HISTORY.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
