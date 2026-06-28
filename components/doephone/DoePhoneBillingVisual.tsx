"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";

const { ink: INK, muted: MUTED, accent: DOE_ORANGE, divider: DIVIDER } = CAROUSEL_MENU_UI;

const BORDER = "#E5E7EB";
const LIVE_BG = "rgba(210, 119, 76, 0.12)";

const OUTER_RADIUS = "rounded-[clamp(0.8rem,2.4vmin,0.95rem)]";

const AUTH_STEPS = [
  { label: "Chart review", done: true },
  { label: "Payer submit", done: true },
  { label: "Awaiting approval", done: false },
] as const;

function ProgressRing({ pct, size }: { pct: number; size: number }) {
  const stroke = 5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={DIVIDER} strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={DOE_ORANGE}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill={INK}
        fontSize={size * 0.22}
        fontWeight={600}
        fontFamily={suisseIntl.style.fontFamily}
      >
        {Math.round(pct * 100)}%
      </text>
    </svg>
  );
}

function StepRow({ label, done }: { label: string; done: boolean }) {
  return (
    <div className="flex items-center" style={{ gap: "clamp(0.48rem,1.45vmin,0.62rem)" }}>
      <span
        className="flex shrink-0 items-center justify-center rounded-full border"
        style={{
          width: "clamp(1.35rem,4.15vmin,1.62rem)",
          height: "clamp(1.35rem,4.15vmin,1.62rem)",
          borderColor: done ? DOE_ORANGE : DIVIDER,
          background: done ? LIVE_BG : "#FAFAF8",
        }}
        aria-hidden
      >
        {done ? (
          <svg width="42%" height="42%" viewBox="0 0 10 10" fill="none">
            <path
              d="M2.8 5.1l1.2 1.2 3.1-3.2"
              stroke={DOE_ORANGE}
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <span className="h-[0.38rem] w-[0.38rem] rounded-full bg-[#D9D4CC]" />
        )}
      </span>
      <span
        className={`font-medium leading-snug ${inter.className}`}
        style={{
          color: done ? INK : MUTED,
          fontSize: "clamp(0.84rem,2.55vmin,1rem)",
        }}
      >
        {label}
      </span>
    </div>
  );
}

/** Prior auth — Billing carousel slide. */
export function DoePhoneBillingVisual() {
  const headingSize = "clamp(1.02rem,3.15vmin,1.22rem)";
  const captionSize = "clamp(0.78rem,2.45vmin,0.94rem)";

  return (
    <div
      className={`mx-auto flex h-full w-full items-center justify-center ${suisseIntl.className}`}
      style={{ maxWidth: CAROUSEL_MENU_UI.maxWidthPhone }}
      aria-hidden
    >
      <div
        className={`w-full border bg-white ${OUTER_RADIUS}`}
        style={{
          borderColor: BORDER,
          padding: "clamp(1.2rem,3.85vmin,1.45rem) clamp(1.25rem,4vmin,1.55rem)",
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p
              className="font-semibold leading-none tracking-[-0.015em]"
              style={{ color: INK, fontSize: headingSize }}
            >
              Prior Authorization
            </p>
            <p
              className={`${inter.className} mt-[clamp(0.38rem,1.15vmin,0.48rem)] font-normal leading-snug`}
              style={{ color: MUTED, fontSize: captionSize }}
            >
              Humira · BCBS
            </p>
          </div>
          <span
            className={`inline-flex shrink-0 items-center rounded-full font-medium leading-none ${inter.className}`}
            style={{
              background: LIVE_BG,
              color: DOE_ORANGE,
              fontSize: "clamp(0.72rem,2.2vmin,0.86rem)",
              padding: "clamp(0.28rem,0.85vmin,0.36rem) clamp(0.52rem,1.58vmin,0.65rem)",
              gap: "clamp(0.28rem,0.85vmin,0.36rem)",
            }}
          >
            <span
              className="rounded-full"
              style={{
                width: "clamp(0.38rem,1.15vmin,0.46rem)",
                height: "clamp(0.38rem,1.15vmin,0.46rem)",
                background: DOE_ORANGE,
              }}
            />
            AI handling
          </span>
        </div>

        <div
          className="flex flex-col items-center"
          style={{
            marginTop: "clamp(1.05rem,3.25vmin,1.32rem)",
            gap: "clamp(0.85rem,2.6vmin,1.08rem)",
          }}
        >
          <ProgressRing pct={2 / 3} size={92} />
          <div
            className="flex w-full flex-col"
            style={{ gap: "clamp(0.55rem,1.68vmin,0.72rem)", maxWidth: "min(100%,16.5rem)" }}
          >
            {AUTH_STEPS.map((step) => (
              <StepRow key={step.label} {...step} />
            ))}
          </div>
        </div>

        <p
          className={`${inter.className} mt-[clamp(0.95rem,2.95vmin,1.18rem)] text-center font-normal leading-snug`}
          style={{ color: MUTED, fontSize: captionSize }}
        >
          AI submitted clinical documentation to payer
        </p>
      </div>
    </div>
  );
}
