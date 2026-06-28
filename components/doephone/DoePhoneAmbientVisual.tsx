"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";

const { ink: INK, accent: DOE_ORANGE } = CAROUSEL_MENU_UI;

const MUTED = "#9CA3AF";
const BTN_BG = "#F3F4F6";
const LIVE_BG = "rgba(210, 119, 76, 0.12)";

const OUTER_RADIUS = "rounded-[clamp(0.86rem,2.6vmin,1.03rem)]";
const BTN_RADIUS = "rounded-[clamp(0.35rem,1.03vmin,0.43rem)]";

const INPUT_PAD = "clamp(0.89rem,2.75vmin,1.1rem) clamp(0.95rem,2.97vmin,1.13rem)";
const BODY_SIZE = "clamp(0.95rem,2.86vmin,1.13rem)";
const ACTION_SIZE = "clamp(0.91rem,2.75vmin,1.08rem)";
const HEADER_SIZE = "clamp(0.84rem,2.54vmin,0.99rem)";

function PatientTag({ label }: { label: string }) {
  return (
    <span
      className={`inline-flex items-center font-normal leading-snug ${BTN_RADIUS}`}
      style={{
        background: LIVE_BG,
        color: DOE_ORANGE,
        fontSize: BODY_SIZE,
        padding: "clamp(0.13rem,0.41vmin,0.17rem) clamp(0.41rem,1.24vmin,0.52rem)",
        marginInline: "clamp(0.13rem,0.41vmin,0.17rem)",
        verticalAlign: "baseline",
      }}
    >
      @{label}&apos;s
    </span>
  );
}

function ChartContextHeader() {
  const iconSize = "clamp(0.52rem,1.57vmin,0.63rem)";

  return (
    <div
      className="flex items-center"
      style={{ gap: "clamp(0.3rem,0.92vmin,0.39rem)", marginBottom: "clamp(0.59rem,1.78vmin,0.73rem)" }}
    >
      <span className="font-medium leading-none" style={{ color: DOE_ORANGE, fontSize: HEADER_SIZE }}>
        Patient chart
      </span>
      <svg viewBox="0 0 8 8" fill="none" aria-hidden style={{ width: iconSize, height: iconSize }}>
        <path
          d="M2 3l2 2 2-2"
          stroke={DOE_ORANGE}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function ChartToolIcons() {
  const iconSize = "clamp(1.27rem,3.94vmin,1.53rem)";
  const sw = 1.3;
  const cap = "round" as const;
  const join = "round" as const;

  return (
    <div className="flex items-center" style={{ gap: "clamp(0.73rem,2.21vmin,0.89rem)" }} aria-hidden>
      <svg viewBox="0 0 16 16" fill="none" style={{ width: iconSize, height: iconSize }}>
        <path d="M2.5 12.5V3.5" stroke={MUTED} strokeWidth={sw} strokeLinecap={cap} />
        <path d="M2.5 12.5h11" stroke={MUTED} strokeWidth={sw} strokeLinecap={cap} />
        <path
          d="M4.5 10l2.5-2.5 2 1.5 4.5-5"
          stroke={MUTED}
          strokeWidth={sw}
          strokeLinecap={cap}
          strokeLinejoin={join}
        />
      </svg>

      <svg viewBox="0 0 16 16" fill="none" style={{ width: iconSize, height: iconSize }}>
        <rect x="3" y="6.25" width="10" height="3.5" rx="1.75" stroke={MUTED} strokeWidth={sw} />
        <path d="M8 6.25v3.5" stroke={MUTED} strokeWidth={sw} strokeLinecap={cap} />
      </svg>

      <svg viewBox="0 0 16 16" fill="none" style={{ width: iconSize, height: iconSize }}>
        <rect x="2.5" y="3.5" width="8.5" height="7" rx="1.2" stroke={MUTED} strokeWidth={sw} />
        <rect x="5" y="5.5" width="8.5" height="7" rx="1.2" stroke={MUTED} strokeWidth={sw} />
        <path
          d="M7.2 8.2h4.8M7.2 10.2h3.4"
          stroke={DOE_ORANGE}
          strokeWidth={sw * 0.95}
          strokeLinecap={cap}
        />
      </svg>
    </div>
  );
}

function ModelSelector() {
  const iconSize = "clamp(0.52rem,1.57vmin,0.63rem)";

  return (
    <span
      className={`inline-flex shrink-0 items-center font-medium leading-none ${BTN_RADIUS} ${inter.className}`}
      style={{
        background: BTN_BG,
        color: INK,
        fontSize: ACTION_SIZE,
        gap: "clamp(0.24rem,0.73vmin,0.3rem)",
        padding: "clamp(0.41rem,1.3vmin,0.52rem) clamp(0.59rem,1.78vmin,0.73rem)",
      }}
    >
      Fable 5
      <svg viewBox="0 0 8 8" fill="none" aria-hidden style={{ width: iconSize, height: iconSize }}>
        <path
          d="M2 3l2 2 2-2"
          stroke={MUTED}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function SubmitIconButton() {
  const size = "clamp(2rem,6.1vmin,2.32rem)";
  const iconSize = "clamp(0.89rem,2.7vmin,1.06rem)";

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${BTN_RADIUS}`}
      style={{ background: DOE_ORANGE, width: size, height: size }}
      aria-hidden
    >
      <svg viewBox="0 0 16 16" fill="none" style={{ width: iconSize, height: iconSize }} aria-hidden>
        <path
          d="M3 8h10M9 4l4 4-4 4"
          stroke="#FFFFFF"
          strokeWidth="1.45"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/** Ambient clinical AI prompt — Ambient carousel slide. */
export function DoePhoneAmbientVisual() {
  return (
    <div
      className={`mx-auto flex h-full w-full items-center justify-center ${suisseIntl.className}`}
      style={{ maxWidth: CAROUSEL_MENU_UI.maxWidthPhone }}
      aria-hidden
    >
      <div
        className={`w-[96%] bg-white ${OUTER_RADIUS}`}
        style={{ padding: INPUT_PAD }}
      >
        <ChartContextHeader />

        <p className="font-normal leading-snug" style={{ color: INK, fontSize: BODY_SIZE }}>
          Show me
          <PatientTag label="Sarah Nguyen" />
          HBA1C trend over the last year, medication dose changes on same graph
        </p>

        <div
          className="flex items-center justify-between"
          style={{
            gap: "clamp(0.59rem,1.78vmin,0.73rem)",
            marginTop: "clamp(0.67rem,2.05vmin,0.84rem)",
          }}
        >
          <ChartToolIcons />

          <div className="flex shrink-0 items-center" style={{ gap: "clamp(0.45rem,1.38vmin,0.59rem)" }}>
            <ModelSelector />
            <SubmitIconButton />
          </div>
        </div>
      </div>
    </div>
  );
}
