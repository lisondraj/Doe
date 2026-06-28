"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";

const { ink: INK, accent: DOE_ORANGE, divider: DIVIDER } = CAROUSEL_MENU_UI;

const MUTED = "#9CA3AF";
const MUTED_TEXT = "#6B7280";

const OUTER_RADIUS = "rounded-[clamp(0.8rem,2.4vmin,0.95rem)]";
const CARD_PAD = "clamp(1.2rem,3.85vmin,1.45rem) clamp(1.25rem,4vmin,1.55rem)";
const TITLE_SIZE = "clamp(1.12rem,3.45vmin,1.38rem)";
const DOT_SIZE = "clamp(0.78rem,2.35vmin,0.94rem)";
const BODY_SIZE = "clamp(0.88rem,2.65vmin,1.05rem)";
const CAPTION_SIZE = "clamp(0.72rem,2.15vmin,0.86rem)";
const FOOTER_SIZE = "clamp(0.84rem,2.55vmin,1rem)";

const TIMELINE = [
  { label: "Clinical note pulled from chart", time: "9:02 AM", state: "done" as const },
  { label: "Prior auth form submitted to BCBS", time: "9:04 AM", state: "done" as const },
  { label: "Awaiting payer decision", time: "Pending", state: "active" as const },
] as const;

function TimelineDot({ state }: { state: (typeof TIMELINE)[number]["state"] }) {
  if (state === "done") {
    return (
      <span
        className="relative z-[1] flex shrink-0 items-center justify-center rounded-full"
        style={{ width: DOT_SIZE, height: DOT_SIZE, background: DOE_ORANGE }}
        aria-hidden
      >
        <svg width="55%" height="55%" viewBox="0 0 10 10" fill="none">
          <path
            d="M2.8 5.1l1.2 1.2 3.1-3.2"
            stroke="#FFFFFF"
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  return (
    <span
      className="relative z-[1] shrink-0 rounded-full border-[2px] bg-white"
      style={{ width: DOT_SIZE, height: DOT_SIZE, borderColor: DOE_ORANGE }}
      aria-hidden
    />
  );
}

function AuthTimeline() {
  return (
    <div
      className="flex flex-col"
      style={{
        marginTop: "clamp(1.05rem,3.25vmin,1.32rem)",
        gap: "clamp(0.82rem,2.55vmin,1.02rem)",
      }}
    >
      {TIMELINE.map((event, index) => {
        const isLast = index === TIMELINE.length - 1;

        return (
          <div
            key={event.label}
            className="flex items-stretch"
            style={{ gap: "clamp(0.68rem,2.1vmin,0.86rem)" }}
          >
            <div className="flex shrink-0 flex-col items-center" style={{ width: DOT_SIZE }}>
              <TimelineDot state={event.state} />
              {!isLast ? (
                <span
                  className="mt-[0.12rem] w-px flex-1 min-h-[clamp(0.55rem,1.68vmin,0.72rem)]"
                  style={{ background: index === 0 ? DOE_ORANGE : DIVIDER }}
                  aria-hidden
                />
              ) : null}
            </div>

            <div className="min-w-0 flex-1 pb-[0.02rem]">
              <p
                className={`font-medium leading-snug ${event.state === "active" ? "" : inter.className}`}
                style={{
                  color: event.state === "active" ? INK : MUTED_TEXT,
                  fontSize: BODY_SIZE,
                }}
              >
                {event.label}
              </p>
              <p
                className={`${inter.className} font-normal leading-snug tabular-nums`}
                style={{
                  color: event.state === "active" ? DOE_ORANGE : MUTED,
                  fontSize: CAPTION_SIZE,
                  marginTop: "clamp(0.12rem,0.38vmin,0.16rem)",
                }}
              >
                {event.time}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** AI prior auth timeline — Billing carousel slide. */
export function DoePhoneBillingVisual({ layout = "phone" }: { layout?: "phone" | "desktop" }) {
  const isDesktop = layout === "desktop";

  return (
    <div
      className={`mx-auto flex h-full w-full items-center justify-center ${suisseIntl.className}`}
      style={{ maxWidth: isDesktop ? "min(100%, 28rem)" : CAROUSEL_MENU_UI.maxWidthPhone }}
      aria-hidden
    >
      <div
        className={`w-full border bg-white ${OUTER_RADIUS}`}
        style={{ borderColor: "#E5E7EB", padding: CARD_PAD }}
      >
        <h3
          className="font-semibold leading-tight tracking-[-0.02em]"
          style={{
            color: INK,
            fontSize: TITLE_SIZE,
          }}
        >
          Humira 40mg
        </h3>

        <p
          className={`${inter.className} font-normal leading-snug`}
          style={{
            color: MUTED_TEXT,
            fontSize: BODY_SIZE,
            marginTop: "clamp(0.28rem,0.85vmin,0.36rem)",
          }}
        >
          BCBS Ontario · M. Alvarez
        </p>

        <AuthTimeline />

        <p
          className={`${inter.className} font-normal leading-snug`}
          style={{
            color: MUTED,
            fontSize: FOOTER_SIZE,
            marginTop: "clamp(1.05rem,3.25vmin,1.32rem)",
          }}
        >
          Refreshing in 30 minutes
        </p>
      </div>
    </div>
  );
}
