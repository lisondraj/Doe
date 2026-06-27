"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";

const INK = "#1E343A";
const MUTED = "rgba(30, 52, 58, 0.52)";
const DIVIDER = "#EBE7E0";
const DOE_ORANGE = "#D2774C";

const CARD =
  "overflow-hidden rounded-[clamp(0.72rem,0.58rem+0.55vmin,0.95rem)] border border-[#1E343A]/10 bg-white shadow-[0_14px_36px_rgba(30,52,58,0.14)]";

const AUTH_CRITERIA = [
  { label: "Diagnosis on file", done: true },
  { label: "Step therapy documented", done: true },
  { label: "Clinical summary attached", done: false },
] as const;

function PriorAuthCard() {
  return (
    <div className={`${CARD} h-full ${suisseIntl.className}`}>
      <div className="border-b px-[clamp(0.55rem,2.2vmin,0.72rem)] py-[clamp(0.42rem,1.6vmin,0.55rem)]" style={{ borderColor: DIVIDER }}>
        <p className="text-[clamp(0.42rem,1.55vmin,0.52rem)] font-medium uppercase tracking-[0.14em]" style={{ color: MUTED }}>
          Prior auth
        </p>
        <p className="mt-[0.1rem] text-[clamp(0.52rem,1.85vmin,0.62rem)] font-medium tracking-[-0.012em]" style={{ color: INK }}>
          Humira · Patient #2847
        </p>
      </div>

      <div className={`px-[clamp(0.55rem,2.2vmin,0.72rem)] py-[clamp(0.42rem,1.5vmin,0.55rem)] ${inter.className}`}>
        <p className="text-[clamp(0.44rem,1.55vmin,0.52rem)] leading-[1.4]" style={{ color: MUTED }}>
          Medical necessity packet drafting from chart facts.
        </p>

        <div className="mt-[0.38rem] flex items-center justify-between gap-2">
          <span className="text-[clamp(0.4rem,1.4vmin,0.48rem)] font-medium uppercase tracking-[0.07em]" style={{ color: MUTED }}>
            Packet progress
          </span>
          <span className="text-[clamp(0.44rem,1.55vmin,0.52rem)] font-semibold tabular-nums" style={{ color: DOE_ORANGE }}>
            2 / 3
          </span>
        </div>
        <div className="mt-[0.22rem] h-[0.28rem] overflow-hidden rounded-full bg-[#EBE7E0]">
          <div className="h-full w-[66%] rounded-full" style={{ background: DOE_ORANGE }} />
        </div>

        <div className="mt-[0.42rem] flex flex-col gap-[0.18rem]">
          {AUTH_CRITERIA.map(({ label, done }) => (
            <div key={label} className="flex items-center gap-[0.28rem]">
              {done ? (
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none" aria-hidden className="shrink-0">
                  <circle cx="5" cy="5" r="5" fill={DOE_ORANGE} />
                  <path
                    d="M2.8 5.1l1.2 1.2 3.1-3.2"
                    stroke="#FFFFFF"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <span className="h-[0.48rem] w-[0.48rem] shrink-0 rounded-full border border-[#D9D4CC]" aria-hidden />
              )}
              <span className="text-[clamp(0.4rem,1.4vmin,0.48rem)]" style={{ color: done ? INK : MUTED }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ExtraRevenueCard() {
  return (
    <div
      className={`${CARD} flex h-full flex-col ${suisseIntl.className}`}
      style={{ background: DOE_ORANGE, borderColor: "rgba(255,255,255,0.18)" }}
    >
      <div className="border-b px-[clamp(0.55rem,2.2vmin,0.72rem)] py-[clamp(0.42rem,1.6vmin,0.55rem)]" style={{ borderColor: "rgba(255,255,255,0.16)" }}>
        <p className="text-[clamp(0.42rem,1.55vmin,0.52rem)] font-medium uppercase tracking-[0.14em] text-white/72">
          Extra revenue
        </p>
        <p className="mt-[0.1rem] text-[clamp(0.52rem,1.85vmin,0.62rem)] font-medium tracking-[-0.012em] text-white/88">
          Captured this week
        </p>
      </div>

      <div className="flex flex-1 flex-col justify-center px-[clamp(0.55rem,2.2vmin,0.72rem)] py-[clamp(0.55rem,2vmin,0.72rem)]">
        <p
          className="text-[clamp(1.55rem,6.2vmin,2.15rem)] font-light leading-none tracking-[-0.04em] text-white tabular-nums"
        >
          $8,640
        </p>
        <p className={`mt-[0.38rem] text-[clamp(0.44rem,1.55vmin,0.52rem)] leading-[1.35] text-white/78 ${inter.className}`}>
          6 claims processed · 2 auths queued
        </p>

        <div className="mt-[0.48rem] flex flex-wrap gap-[0.22rem]">
          {["ERA matched", "Denials recovered", "Auth approved"].map((chip) => (
            <span
              key={chip}
              className="rounded-full border px-[0.34rem] py-[0.1rem] text-[clamp(0.36rem,1.25vmin,0.42rem)] font-medium text-white/88"
              style={{ borderColor: "rgba(255,255,255,0.22)", background: "rgba(255,255,255,0.1)" }}
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Overlapping prior auth + extra revenue — Billing carousel slide. */
export function DoePhoneBillingVisual() {
  return (
    <div
      className="relative mx-auto aspect-[1.05/1] w-full max-w-[min(88%,20rem)] iphone-page:max-w-[min(92%,22rem)]"
      aria-hidden
    >
      <div className="absolute left-[6%] top-[10%] z-10 h-[58%] w-[62%]">
        <PriorAuthCard />
      </div>
      <div className="absolute bottom-[8%] right-[6%] z-20 h-[58%] w-[62%]">
        <ExtraRevenueCard />
      </div>
    </div>
  );
}
