"use client";

import { suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";

const { ink: INK, muted: MUTED, accent: DOE_ORANGE, divider: DIVIDER } = CAROUSEL_MENU_UI;

const CARD = `${CAROUSEL_MENU_UI.cardRadius} ${CAROUSEL_MENU_UI.cardShell}`;

const AUTH_STEPS = [
  { done: true },
  { done: true },
  { done: false },
] as const;

const REVENUE_BARS = [0.42, 0.68, 0.55, 0.82, 0.74, 0.91] as const;

function ProgressRing({ pct, size }: { pct: number; size: number }) {
  const stroke = 5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden className="shrink-0">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#EBE7E0"
        strokeWidth={stroke}
      />
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

function StepDot({ done }: { done: boolean }) {
  return (
    <span
      className="flex h-[clamp(1.65rem,5.2vmin,2.05rem)] w-[clamp(1.65rem,5.2vmin,2.05rem)] items-center justify-center rounded-full border"
      style={{
        borderColor: done ? DOE_ORANGE : DIVIDER,
        background: done ? "rgba(210, 119, 76, 0.12)" : "#FAFAF8",
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
        <span className="h-[0.42rem] w-[0.42rem] rounded-full bg-[#D9D4CC]" />
      )}
    </span>
  );
}

function PriorAuthCard() {
  return (
    <div className={`${CARD} flex h-full flex-col ${suisseIntl.className}`}>
      <div
        className="border-b"
        style={{
          borderColor: DIVIDER,
          padding: `${CAROUSEL_MENU_UI.padY} ${CAROUSEL_MENU_UI.padX}`,
        }}
      >
        <p className="font-medium uppercase tracking-[0.14em]" style={{ color: MUTED, fontSize: CAROUSEL_MENU_UI.type.eyebrow }}>
          Prior auth
        </p>
        <p className="mt-[0.12rem] font-medium tracking-[-0.012em]" style={{ color: INK, fontSize: CAROUSEL_MENU_UI.type.title }}>
          Humira
        </p>
      </div>

      <div
        className="flex flex-1 flex-col items-center justify-center gap-[clamp(0.65rem,2.2vmin,0.95rem)]"
        style={{ padding: `${CAROUSEL_MENU_UI.padY} ${CAROUSEL_MENU_UI.padX}` }}
      >
        <ProgressRing pct={2 / 3} size={88} />
        <div className="flex items-center gap-[clamp(0.45rem,1.5vmin,0.65rem)]">
          {AUTH_STEPS.map((step, i) => (
            <StepDot key={i} done={step.done} />
          ))}
        </div>
        <p className="font-medium tabular-nums" style={{ color: DOE_ORANGE, fontSize: CAROUSEL_MENU_UI.type.caption }}>
          2 / 3
        </p>
      </div>
    </div>
  );
}

function RevenueSparkBars() {
  return (
    <div className="flex h-[clamp(2.4rem,7.5vmin,3.1rem)] items-end gap-[0.28rem]" aria-hidden>
      {REVENUE_BARS.map((h, i) => (
        <span
          key={i}
          className="w-[clamp(0.38rem,1.2vmin,0.52rem)] rounded-[0.22rem]"
          style={{
            height: `${h * 100}%`,
            background: i === REVENUE_BARS.length - 1 ? "#FFFFFF" : "rgba(255,255,255,0.42)",
          }}
        />
      ))}
    </div>
  );
}

function ExtraRevenueCard() {
  return (
    <div
      className={`${CAROUSEL_MENU_UI.cardRadius} flex h-full flex-col overflow-hidden border shadow-[0_20px_56px_rgba(30,52,58,0.22)] ${suisseIntl.className}`}
      style={{ background: DOE_ORANGE, borderColor: "rgba(255,255,255,0.18)" }}
    >
      <div
        className="border-b"
        style={{
          borderColor: "rgba(255,255,255,0.16)",
          padding: `${CAROUSEL_MENU_UI.padY} ${CAROUSEL_MENU_UI.padX}`,
        }}
      >
        <p className="font-medium uppercase tracking-[0.14em] text-white/72" style={{ fontSize: CAROUSEL_MENU_UI.type.eyebrow }}>
          Revenue
        </p>
      </div>

      <div
        className="flex flex-1 flex-col justify-between"
        style={{ padding: `${CAROUSEL_MENU_UI.padY} ${CAROUSEL_MENU_UI.padX}` }}
      >
        <p
          className="font-light leading-none tracking-[-0.04em] text-white tabular-nums"
          style={{ fontSize: CAROUSEL_MENU_UI.type.display }}
        >
          $8,640
        </p>

        <div className="mt-[clamp(0.55rem,1.8vmin,0.85rem)] flex items-end justify-between gap-3">
          <RevenueSparkBars />
          <div className="flex flex-col gap-[0.28rem]">
            {[
              { icon: "✓", tone: "rgba(255,255,255,0.88)" },
              { icon: "↺", tone: "rgba(255,255,255,0.55)" },
            ].map((badge, i) => (
              <span
                key={i}
                className="flex h-[clamp(1.35rem,4.2vmin,1.65rem)] w-[clamp(1.35rem,4.2vmin,1.65rem)] items-center justify-center rounded-full border text-[clamp(0.72rem,2.2vmin,0.88rem)] font-semibold"
                style={{ borderColor: "rgba(255,255,255,0.22)", background: "rgba(255,255,255,0.1)", color: badge.tone }}
              >
                {badge.icon}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Overlapping prior auth + revenue — Billing carousel slide. */
export function DoePhoneBillingVisual() {
  return (
    <div
      className="relative mx-auto h-full w-full max-h-full aspect-[1.02/1]"
      style={{ maxWidth: CAROUSEL_MENU_UI.maxWidth }}
      aria-hidden
    >
      <div className="absolute left-[4%] top-[6%] z-10 h-[68%] w-[68%]">
        <PriorAuthCard />
      </div>
      <div className="absolute bottom-[6%] right-[4%] z-20 h-[68%] w-[68%]">
        <ExtraRevenueCard />
      </div>
    </div>
  );
}
