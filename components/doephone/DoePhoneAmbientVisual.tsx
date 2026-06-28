"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";

const { ink: INK, accent: DOE_ORANGE } = CAROUSEL_MENU_UI;

const MUTED = "#9CA3AF";
const BTN_BG = "#F3F4F6";
const LIVE_BG = "rgba(210, 119, 76, 0.12)";

const OUTER_RADIUS = "rounded-[clamp(0.8rem,2.4vmin,0.95rem)]";
const BTN_RADIUS = "rounded-[clamp(0.32rem,0.95vmin,0.4rem)]";

const INPUT_PAD = "clamp(0.82rem,2.55vmin,1.02rem) clamp(0.88rem,2.75vmin,1.05rem)";
const BODY_SIZE = "clamp(0.88rem,2.65vmin,1.05rem)";
const ACTION_SIZE = "clamp(0.84rem,2.55vmin,1rem)";
const HEADER_SIZE = "clamp(0.78rem,2.35vmin,0.92rem)";

function PatientTag({ label }: { label: string }) {
  return (
    <span
      className={`inline-flex items-center font-normal leading-snug ${BTN_RADIUS}`}
      style={{
        background: LIVE_BG,
        color: DOE_ORANGE,
        fontSize: BODY_SIZE,
        padding: "clamp(0.12rem,0.38vmin,0.16rem) clamp(0.38rem,1.15vmin,0.48rem)",
        marginInline: "clamp(0.12rem,0.38vmin,0.16rem)",
        verticalAlign: "baseline",
      }}
    >
      @{label}&apos;s
    </span>
  );
}

function ChartContextHeader() {
  const iconSize = "clamp(0.48rem,1.45vmin,0.58rem)";

  return (
    <div
      className="flex items-center"
      style={{ gap: "clamp(0.28rem,0.85vmin,0.36rem)", marginBottom: "clamp(0.55rem,1.65vmin,0.68rem)" }}
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
  const iconSize = "clamp(1.18rem,3.65vmin,1.42rem)";
  const sw = 1.3;
  const cap = "round" as const;
  const join = "round" as const;

  return (
    <div className="flex items-center" style={{ gap: "clamp(0.68rem,2.05vmin,0.82rem)" }} aria-hidden>
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
  const iconSize = "clamp(0.48rem,1.45vmin,0.58rem)";

  return (
    <span
      className={`inline-flex shrink-0 items-center font-medium leading-none ${BTN_RADIUS} ${inter.className}`}
      style={{
        background: BTN_BG,
        color: INK,
        fontSize: ACTION_SIZE,
        gap: "clamp(0.22rem,0.68vmin,0.28rem)",
        padding: "clamp(0.38rem,1.2vmin,0.48rem) clamp(0.55rem,1.65vmin,0.68rem)",
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
  const size = "clamp(1.85rem,5.65vmin,2.15rem)";
  const iconSize = "clamp(0.82rem,2.5vmin,0.98rem)";

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
        className={`w-[92%] bg-white ${OUTER_RADIUS}`}
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
            gap: "clamp(0.55rem,1.65vmin,0.68rem)",
            marginTop: "clamp(0.62rem,1.9vmin,0.78rem)",
          }}
        >
          <ChartToolIcons />

          <div className="flex shrink-0 items-center" style={{ gap: "clamp(0.42rem,1.28vmin,0.55rem)" }}>
            <ModelSelector />
            <SubmitIconButton />
          </div>
        </div>
      </div>
    </div>
  );
}
