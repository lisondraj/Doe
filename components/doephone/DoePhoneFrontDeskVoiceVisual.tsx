"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";

const { ink: INK, muted: MUTED, accent: DOE_ORANGE, divider: DIVIDER, row: ROW_SHELL } = CAROUSEL_MENU_UI;

const CARD = `${CAROUSEL_MENU_UI.cardRadius} ${CAROUSEL_MENU_UI.cardShell}`;

const CALL_STEPS = [
  { label: "Refill", icon: "pill" },
  { label: "Chart", icon: "chart" },
  { label: "Slots", icon: "calendar" },
] as const;

function LiveDot() {
  return (
    <span className="relative flex h-[0.52rem] w-[0.52rem] shrink-0" aria-hidden>
      <span className="absolute inset-0 animate-ping rounded-full bg-[#E05252]/35" />
      <span className="relative h-[0.52rem] w-[0.52rem] rounded-full bg-[#E05252]" />
    </span>
  );
}

function VoiceOrb() {
  return (
    <div className="relative flex shrink-0 items-center justify-center">
      <div
        className="flex h-[clamp(6.25rem,24vmin,8.75rem)] w-[clamp(6.25rem,24vmin,8.75rem)] items-center justify-center rounded-full"
        style={{ background: DOE_ORANGE }}
        aria-hidden
      >
        <svg width="42%" height="42%" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"
            stroke="#FFFFFF"
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"
            stroke="#FFFFFF"
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div
        className="absolute -bottom-[0.2rem] left-1/2 flex -translate-x-1/2 items-end gap-[0.14rem]"
        aria-hidden
      >
        {[0.55, 0.88, 1.15, 0.82, 0.62].map((h, i) => (
          <span
            key={i}
            className="w-[0.16rem] rounded-full bg-[#D2774C]/55"
            style={{ height: `${h}rem` }}
          />
        ))}
      </div>
    </div>
  );
}

function StepIcon({ kind }: { kind: (typeof CALL_STEPS)[number]["icon"] }) {
  const props = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: DOE_ORANGE,
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (kind === "pill") {
    return (
      <svg {...props} aria-hidden>
        <path d="M8.5 8.5l7 7M15 9l-6 6" />
        <rect x="3" y="11" width="8" height="8" rx="4" transform="rotate(-45 7 15)" />
      </svg>
    );
  }
  if (kind === "chart") {
    return (
      <svg {...props} aria-hidden>
        <path d="M4 19V5M4 19h16" />
        <path d="M4 15l5-6 4 4 7-9" />
      </svg>
    );
  }
  return (
    <svg {...props} aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function StepCheck() {
  return (
    <svg width="13" height="13" viewBox="0 0 10 10" fill="none" aria-hidden className="shrink-0">
      <circle cx="5" cy="5" r="5" fill={DOE_ORANGE} />
      <path
        d="M2.8 5.1l1.2 1.2 3.1-3.2"
        stroke="#FFFFFF"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Single white voice-agent panel — Front Desk carousel slide. */
export function DoePhoneFrontDeskVoiceVisual() {
  return (
    <div
      className={`mx-auto h-full w-full ${suisseIntl.className}`}
      style={{ maxWidth: CAROUSEL_MENU_UI.maxWidth }}
      aria-hidden
    >
      <div className={`${CARD} flex h-full min-h-[clamp(16.5rem,62vmin,22rem)] flex-col`}>
        <div
          className="flex items-center justify-between gap-2 border-b"
          style={{
            borderColor: DIVIDER,
            padding: `${CAROUSEL_MENU_UI.padY} ${CAROUSEL_MENU_UI.padX}`,
          }}
        >
          <div className="flex items-center gap-[0.38rem]">
            <LiveDot />
            <p className="font-medium tracking-[-0.014em]" style={{ color: INK, fontSize: CAROUSEL_MENU_UI.type.title }}>
              Voice Agent
            </p>
          </div>
          <span
            className="shrink-0 rounded-full px-[0.55rem] py-[0.16rem] font-medium uppercase tracking-[0.1em]"
            style={{
              background: "rgba(210, 119, 76, 0.12)",
              color: DOE_ORANGE,
              fontSize: CAROUSEL_MENU_UI.type.eyebrow,
            }}
          >
            Live
          </span>
        </div>

        <div
          className="flex min-h-0 flex-1 flex-col gap-[clamp(0.85rem,3vmin,1.15rem)] sm:flex-row sm:items-center"
          style={{ padding: `${CAROUSEL_MENU_UI.padY} ${CAROUSEL_MENU_UI.padX}` }}
        >
          <VoiceOrb />

          <div className="min-w-0 flex-1">
            <p
              className="font-semibold tabular-nums tracking-[0.06em]"
              style={{ color: MUTED, fontSize: CAROUSEL_MENU_UI.type.headline }}
            >
              (416) 555-0142
            </p>

            <div className={`mt-[clamp(0.75rem,2.6vmin,1rem)] grid grid-cols-3 gap-[0.38rem] ${inter.className}`}>
              {CALL_STEPS.map((step) => (
                <div
                  key={step.label}
                  className={`flex flex-col items-center gap-[0.32rem] px-[0.38rem] py-[0.55rem] ${ROW_SHELL}`}
                >
                  <StepCheck />
                  <StepIcon kind={step.icon} />
                  <p className="font-medium" style={{ color: INK, fontSize: CAROUSEL_MENU_UI.type.eyebrow }}>
                    {step.label}
                  </p>
                </div>
              ))}
            </div>

            <div
              className={`mt-[0.42rem] flex items-center justify-center gap-[0.42rem] px-[0.72rem] py-[0.48rem] ${ROW_SHELL}`}
            >
              <span
                className="h-[0.72rem] w-[0.72rem] shrink-0 animate-spin rounded-full border-[1.5px] border-[#D9D4CC] border-r-transparent"
                aria-hidden
              />
              <StepIcon kind="calendar" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
