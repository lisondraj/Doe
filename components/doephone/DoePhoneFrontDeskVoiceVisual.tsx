"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";

const { ink: INK, muted: MUTED, accent: DOE_ORANGE, divider: DIVIDER, row: ROW_SHELL } = CAROUSEL_MENU_UI;

const CARD = `${CAROUSEL_MENU_UI.cardRadius} ${CAROUSEL_MENU_UI.cardShell}`;

const CALL_STEPS = [
  "Patient requesting refill for Bupropion XL 300 mg",
  "Medication pulled from chart",
  "Clinic availability shared",
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
          <div>
            <p className="font-medium tracking-[-0.014em]" style={{ color: INK, fontSize: CAROUSEL_MENU_UI.type.title }}>
              Voice Agent
            </p>
            <p
              className={`mt-[0.22rem] flex items-center gap-[0.32rem] ${inter.className}`}
              style={{ color: MUTED, fontSize: CAROUSEL_MENU_UI.type.eyebrow }}
            >
              <LiveDot />
              Live call in progress
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
            Front desk
          </span>
        </div>

        <div
          className="flex min-h-0 flex-1 flex-col gap-[clamp(0.85rem,3vmin,1.15rem)] sm:flex-row sm:items-start"
          style={{ padding: `${CAROUSEL_MENU_UI.padY} ${CAROUSEL_MENU_UI.padX}` }}
        >
          <VoiceOrb />

          <div className="min-w-0 flex-1">
            <p
              className="font-semibold uppercase tracking-[0.14em]"
              style={{ color: MUTED, fontSize: CAROUSEL_MENU_UI.type.eyebrow }}
            >
              (416) 555-0142
            </p>
            <p
              className="mt-[0.38rem] font-medium leading-[1.4] tracking-[-0.02em]"
              style={{ color: INK, fontSize: CAROUSEL_MENU_UI.type.body }}
            >
              &ldquo;Hi, this is Sarah Walsh — can I get a refill on my Bupropion?&rdquo;
            </p>

            <div className={`mt-[clamp(0.65rem,2.4vmin,0.9rem)] space-y-[0.38rem] ${inter.className}`}>
              {CALL_STEPS.map((step) => (
                <div
                  key={step}
                  className={`flex items-start gap-[0.42rem] px-[0.72rem] py-[0.52rem] ${ROW_SHELL}`}
                >
                  <StepCheck />
                  <p className="min-w-0 leading-[1.38]" style={{ color: INK, fontSize: CAROUSEL_MENU_UI.type.caption }}>
                    {step}
                  </p>
                </div>
              ))}
              <div className={`flex items-center gap-[0.42rem] px-[0.72rem] py-[0.52rem] ${ROW_SHELL}`}>
                <span
                  className="h-[0.72rem] w-[0.72rem] shrink-0 animate-spin rounded-full border-[1.5px] border-[#D9D4CC] border-r-transparent"
                  aria-hidden
                />
                <p className="leading-[1.38]" style={{ color: MUTED, fontSize: CAROUSEL_MENU_UI.type.caption }}>
                  Reviewing calendar
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
