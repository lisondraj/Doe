"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";

const INK = "#1E343A";
const MUTED = "rgba(30, 52, 58, 0.52)";
const DIVIDER = "#EBE7E0";
const DOE_ORANGE = "#D2774C";

const CARD =
  "h-full overflow-hidden rounded-[clamp(0.82rem,0.65rem+0.65vmin,1.05rem)] border border-[#1E343A]/10 bg-white shadow-[0_16px_40px_rgba(30,52,58,0.16)]";

const CALL_STEPS = [
  "Patient requesting refill for Bupropion XL 300 mg",
  "Medication pulled from chart",
  "Clinic availability shared",
] as const;

function LiveDot() {
  return (
    <span className="relative flex h-[0.42rem] w-[0.42rem] shrink-0" aria-hidden>
      <span className="absolute inset-0 animate-ping rounded-full bg-[#E05252]/35" />
      <span className="relative h-[0.42rem] w-[0.42rem] rounded-full bg-[#E05252]" />
    </span>
  );
}

function VoiceOrb() {
  return (
    <div className="relative flex shrink-0 items-center justify-center">
      <div
        className="flex h-[clamp(4.5rem,18vmin,6.25rem)] w-[clamp(4.5rem,18vmin,6.25rem)] items-center justify-center rounded-full"
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
        className="absolute -bottom-[0.15rem] left-1/2 flex -translate-x-1/2 items-end gap-[0.12rem]"
        aria-hidden
      >
        {[0.45, 0.72, 1, 0.68, 0.52].map((h, i) => (
          <span
            key={i}
            className="w-[0.14rem] rounded-full bg-[#D2774C]/55"
            style={{ height: `${h}rem` }}
          />
        ))}
      </div>
    </div>
  );
}

function StepCheck() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden className="shrink-0">
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
      className={`mx-auto w-full max-w-[min(92%,22.5rem)] iphone-page:max-w-[min(94%,24rem)] ${suisseIntl.className}`}
      aria-hidden
    >
      <div className={`${CARD} flex min-h-[clamp(13.5rem,52vmin,17.5rem)] flex-col`}>
        <div
          className="flex items-center justify-between gap-2 border-b px-[clamp(0.72rem,2.6vmin,0.95rem)] py-[clamp(0.5rem,1.8vmin,0.65rem)]"
          style={{ borderColor: DIVIDER }}
        >
          <div>
            <p className="text-[clamp(0.58rem,2.05vmin,0.72rem)] font-medium tracking-[-0.012em]" style={{ color: INK }}>
              Voice Agent
            </p>
            <p
              className={`mt-[0.18rem] flex items-center gap-[0.28rem] text-[clamp(0.44rem,1.55vmin,0.52rem)] ${inter.className}`}
              style={{ color: MUTED }}
            >
              <LiveDot />
              Live call in progress
            </p>
          </div>
          <span
            className="rounded-full px-[0.42rem] py-[0.12rem] text-[clamp(0.38rem,1.35vmin,0.44rem)] font-medium uppercase tracking-[0.1em]"
            style={{ background: "rgba(210, 119, 76, 0.12)", color: DOE_ORANGE }}
          >
            Front desk
          </span>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-[clamp(0.65rem,2.4vmin,0.85rem)] px-[clamp(0.72rem,2.6vmin,0.95rem)] py-[clamp(0.62rem,2.2vmin,0.82rem)] sm:flex-row sm:items-start">
          <VoiceOrb />

          <div className="min-w-0 flex-1">
            <p
              className="text-[clamp(0.44rem,1.55vmin,0.52rem)] font-semibold uppercase tracking-[0.14em]"
              style={{ color: MUTED }}
            >
              (416) 555-0142
            </p>
            <p
              className="mt-[0.32rem] text-[clamp(0.62rem,2.2vmin,0.78rem)] font-medium leading-[1.38] tracking-[-0.018em]"
              style={{ color: INK }}
            >
              &ldquo;Hi, this is Sarah Walsh — can I get a refill on my Bupropion?&rdquo;
            </p>

            <div className={`mt-[clamp(0.55rem,2vmin,0.72rem)] space-y-[0.28rem] ${inter.className}`}>
              {CALL_STEPS.map((step) => (
                <div key={step} className="flex items-start gap-[0.32rem]">
                  <StepCheck />
                  <p className="min-w-0 text-[clamp(0.44rem,1.55vmin,0.52rem)] leading-[1.35]" style={{ color: INK }}>
                    {step}
                  </p>
                </div>
              ))}
              <div className="flex items-center gap-[0.32rem] pt-[0.08rem]">
                <span
                  className="h-[0.62rem] w-[0.62rem] shrink-0 animate-spin rounded-full border-[1.5px] border-[#D9D4CC] border-r-transparent"
                  aria-hidden
                />
                <p className="text-[clamp(0.44rem,1.55vmin,0.52rem)] leading-[1.35]" style={{ color: MUTED }}>
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
