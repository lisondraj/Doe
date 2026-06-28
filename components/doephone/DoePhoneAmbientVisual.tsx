"use client";

import { dmSans } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";

const { ink: INK, accent: DOE_ORANGE } = CAROUSEL_MENU_UI;

const MUTED = "#9CA3AF";
const BORDER = "#E5E7EB";
const BTN_BG = "#F3F4F6";
const LIVE_BG = "rgba(210, 119, 76, 0.12)";

const OUTER_RADIUS = "rounded-[clamp(0.8rem,2.4vmin,0.95rem)]";
const INNER_RADIUS = "rounded-[clamp(0.45rem,1.35vmin,0.55rem)]";
const BTN_RADIUS = "rounded-[clamp(0.32rem,0.95vmin,0.4rem)]";

const CARD_PAD = "clamp(1.2rem,3.85vmin,1.45rem) clamp(1.25rem,4vmin,1.55rem)";
const BODY_SIZE = "clamp(0.88rem,2.65vmin,1.05rem)";
const CAPTION_SIZE = "clamp(0.72rem,2.15vmin,0.86rem)";
const ACTION_SIZE = "clamp(0.84rem,2.55vmin,1rem)";

function PatientTag({ label }: { label: string }) {
  return (
    <span
      className={`inline-flex items-center font-medium leading-none ${BTN_RADIUS}`}
      style={{
        background: LIVE_BG,
        color: DOE_ORANGE,
        fontSize: CAPTION_SIZE,
        padding: "clamp(0.22rem,0.68vmin,0.28rem) clamp(0.42rem,1.28vmin,0.52rem)",
        marginInline: "clamp(0.12rem,0.38vmin,0.16rem)",
        verticalAlign: "baseline",
      }}
    >
      @{label}
    </span>
  );
}

function ModelSelector() {
  const iconSize = "clamp(0.48rem,1.45vmin,0.58rem)";

  return (
    <span
      className={`inline-flex shrink-0 items-center font-medium leading-none ${BTN_RADIUS}`}
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
      className={`inline-flex shrink-0 items-center justify-center border bg-white ${BTN_RADIUS}`}
      style={{ borderColor: BORDER, width: size, height: size }}
      aria-hidden
    >
      <svg viewBox="0 0 16 16" fill="none" style={{ width: iconSize, height: iconSize }} aria-hidden>
        <path
          d="M3 8h10M9 4l4 4-4 4"
          stroke={DOE_ORANGE}
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
      className={`mx-auto flex h-full w-full items-center justify-center ${dmSans.className}`}
      style={{ maxWidth: CAROUSEL_MENU_UI.maxWidthPhone }}
      aria-hidden
    >
      <div
        className={`w-full border bg-white ${OUTER_RADIUS}`}
        style={{ borderColor: BORDER, padding: CARD_PAD }}
      >
        <div
          className={`border bg-white ${INNER_RADIUS}`}
          style={{ borderColor: BORDER, padding: "clamp(0.68rem,2.1vmin,0.82rem) clamp(0.75rem,2.3vmin,0.92rem)" }}
        >
          <p className="font-normal leading-snug" style={{ color: INK, fontSize: BODY_SIZE }}>
            Show me
            <PatientTag label="Sarah Nguyen" />
            &apos;s HBA1C trend over the last year
          </p>

          <div
            className="flex items-center justify-end"
            style={{
              gap: "clamp(0.42rem,1.28vmin,0.55rem)",
              marginTop: "clamp(0.62rem,1.9vmin,0.78rem)",
            }}
          >
            <ModelSelector />
            <SubmitIconButton />
          </div>
        </div>
      </div>
    </div>
  );
}
