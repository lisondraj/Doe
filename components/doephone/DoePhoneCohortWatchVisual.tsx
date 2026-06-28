"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";

const { ink: INK, accent: DOE_ORANGE, divider: DIVIDER } = CAROUSEL_MENU_UI;

const MUTED_TEXT = "#6B7280";
const BTN_BG = "#F3F4F6";
const BORDER = "#E5E7EB";

const PANELS = ["Diabetes panel", "142 patients"] as const;

const SIGNALS = [
  {
    patient: "M. Chen",
    detail: "A1c trend rising · 8.4 → 9.1",
    status: "Draft ready",
  },
  {
    patient: "J. Park",
    detail: "Missed metformin refill · 12 days",
    status: "Queued",
  },
  {
    patient: "S. Reyes",
    detail: "Home BP avg ↑ · 148/94",
    status: "Review",
  },
] as const;

type VisualLayout = "phone" | "desktop";

type VisualSizes = {
  outerRadius: string;
  innerRadius: string;
  btnRadius: string;
  maxWidth: string;
  panelPad: string;
  heading: string;
  action: string;
  body: string;
  status: string;
  addPlus: string;
  smallIcon: string;
  sectionGap: string;
  chipGap: string;
  chipPad: string;
  rowGap: string;
  rowPad: string;
  footerPad: string;
  headingMarginBottom: string;
  subheadingMarginTop: string;
  subheadingMarginBottom: string;
};

const PHONE_SIZES: VisualSizes = {
  outerRadius: "rounded-[clamp(0.8rem,2.4vmin,0.95rem)]",
  innerRadius: "rounded-[clamp(0.45rem,1.35vmin,0.55rem)]",
  btnRadius: "rounded-[clamp(0.32rem,0.95vmin,0.4rem)]",
  maxWidth: CAROUSEL_MENU_UI.maxWidthPhone,
  panelPad: "clamp(1.2rem,3.85vmin,1.45rem) clamp(1.25rem,4vmin,1.55rem)",
  heading: "clamp(1.02rem,3.15vmin,1.22rem)",
  action: "clamp(0.84rem,2.55vmin,1rem)",
  body: "clamp(0.88rem,2.65vmin,1.05rem)",
  status: "clamp(0.72rem,2.15vmin,0.86rem)",
  addPlus: "clamp(0.95rem,2.85vmin,1.12rem)",
  smallIcon: "clamp(0.9rem,2.75vmin,1.05rem)",
  sectionGap: "clamp(0.62rem,1.95vmin,0.82rem)",
  chipGap: "clamp(0.32rem,1vmin,0.42rem)",
  chipPad: "clamp(0.38rem,1.2vmin,0.48rem) clamp(0.62rem,1.95vmin,0.78rem)",
  rowGap: "clamp(0.55rem,1.75vmin,0.72rem)",
  rowPad: "clamp(0.82rem,2.55vmin,1.02rem) clamp(0.88rem,2.75vmin,1.05rem)",
  footerPad: "clamp(0.62rem,1.95vmin,0.78rem) clamp(0.88rem,2.75vmin,1.05rem)",
  headingMarginBottom: "clamp(0.78rem,2.45vmin,0.95rem)",
  subheadingMarginTop: "clamp(1.15rem,3.55vmin,1.42rem)",
  subheadingMarginBottom: "clamp(0.68rem,2.1vmin,0.82rem)",
};

const DESKTOP_SIZES: VisualSizes = {
  outerRadius: "rounded-[clamp(0.85rem,0.95vw,1rem)]",
  innerRadius: "rounded-[clamp(0.48rem,0.58vw,0.62rem)]",
  btnRadius: "rounded-[clamp(0.36rem,0.44vw,0.48rem)]",
  maxWidth: "min(100%, 32rem)",
  panelPad: "clamp(1.15rem,1.45vw,1.5rem) clamp(1.2rem,1.55vw,1.6rem)",
  heading: "clamp(1.12rem,1.35vw,1.42rem)",
  action: "clamp(0.92rem,1.05vw,1.08rem)",
  body: "clamp(0.9rem,1.02vw,1.05rem)",
  status: "clamp(0.78rem,0.9vw,0.92rem)",
  addPlus: "clamp(0.98rem,1.1vw,1.12rem)",
  smallIcon: "clamp(0.86rem,0.98vw,1.02rem)",
  sectionGap: "clamp(0.62rem,0.78vw,0.82rem)",
  chipGap: "clamp(0.34rem,0.42vw,0.46rem)",
  chipPad: "clamp(0.42rem,0.52vw,0.56rem) clamp(0.68rem,0.82vw,0.88rem)",
  rowGap: "clamp(0.58rem,0.72vw,0.76rem)",
  rowPad: "clamp(0.78rem,0.95vw,1rem) clamp(0.82rem,1vw,1.05rem)",
  footerPad: "clamp(0.62rem,0.78vw,0.82rem) clamp(0.82rem,1vw,1.05rem)",
  headingMarginBottom: "clamp(0.78rem,0.95vw,1rem)",
  subheadingMarginTop: "clamp(1.05rem,1.3vw,1.35rem)",
  subheadingMarginBottom: "clamp(0.68rem,0.82vw,0.88rem)",
};

function PanelIcon({ size }: { size: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="shrink-0" style={{ width: size, height: size }}>
      <rect x="3.5" y="4.5" width="13" height="11" rx="1.5" stroke={DOE_ORANGE} strokeWidth="1.2" />
      <path d="M3.5 8h13" stroke={DOE_ORANGE} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="7" cy="6.25" r="0.75" fill={DOE_ORANGE} />
    </svg>
  );
}

function SweepIcon({ size }: { size: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="shrink-0" style={{ width: size, height: size }}>
      <circle cx="10" cy="10" r="6.25" stroke={DOE_ORANGE} strokeWidth="1.2" />
      <path d="M10 10V6.2" stroke={DOE_ORANGE} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M10 10l3.1 1.8" stroke={DOE_ORANGE} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function SlidersIcon({ size }: { size: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="shrink-0" style={{ width: size, height: size }}>
      <line x1="3" y1="7" x2="17" y2="7" stroke={INK} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="13" cy="7" r="2.25" fill="white" stroke={INK} strokeWidth="1.2" />
      <line x1="3" y1="13" x2="17" y2="13" stroke={INK} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="8" cy="13" r="2.25" fill="white" stroke={INK} strokeWidth="1.2" />
    </svg>
  );
}

function StatusLabel({ label, size }: { label: string; size: string }) {
  const isReady = label === "Draft ready";

  return (
    <span
      className="shrink-0 font-medium leading-none"
      style={{ color: isReady ? DOE_ORANGE : MUTED_TEXT, fontSize: size }}
    >
      {label}
    </span>
  );
}

function SignalRow({
  patient,
  detail,
  status,
  sizes,
}: (typeof SIGNALS)[number] & { sizes: VisualSizes }) {
  return (
    <div className="flex items-center justify-between" style={{ gap: sizes.rowGap, padding: sizes.rowPad }}>
      <div className="min-w-0">
        <p className="truncate font-normal leading-snug" style={{ color: MUTED_TEXT, fontSize: sizes.body }}>
          {patient}
        </p>
        <p
          className={`${inter.className} truncate font-normal leading-snug`}
          style={{ color: MUTED_TEXT, fontSize: sizes.status, marginTop: "0.12em", opacity: 0.88 }}
        >
          {detail}
        </p>
      </div>
      <StatusLabel label={status} size={sizes.status} />
    </div>
  );
}

/** Proactive cohort monitoring — surfaces deteriorating patients before rounds. */
export function DoePhoneCohortWatchVisual({ layout = "phone" }: { layout?: VisualLayout }) {
  const sizes = layout === "desktop" ? DESKTOP_SIZES : PHONE_SIZES;

  return (
    <div
      className={`mx-auto flex h-full w-full items-center justify-center ${suisseIntl.className}`}
      style={{ maxWidth: sizes.maxWidth }}
      aria-hidden
    >
      <div
        className={`w-full border bg-white ${sizes.outerRadius}`}
        style={{ borderColor: BORDER, padding: sizes.panelPad }}
      >
        <p
          className="font-semibold leading-none tracking-[-0.015em]"
          style={{ color: INK, fontSize: sizes.heading, marginBottom: sizes.headingMarginBottom }}
        >
          Cohort watch
        </p>

        <div className="flex flex-wrap items-center" style={{ gap: sizes.sectionGap }}>
          {PANELS.map((label) => (
            <button
              key={label}
              type="button"
              className={`inline-flex items-center ${sizes.btnRadius} font-medium leading-none ${inter.className}`}
              style={{
                background: BTN_BG,
                color: INK,
                fontSize: sizes.action,
                gap: sizes.chipGap,
                padding: sizes.chipPad,
              }}
              tabIndex={-1}
            >
              <PanelIcon size={sizes.smallIcon} />
              {label}
            </button>
          ))}

          <button
            type="button"
            className={`inline-flex items-center ${sizes.btnRadius} font-medium leading-none ${inter.className}`}
            style={{
              background: BTN_BG,
              color: INK,
              fontSize: sizes.action,
              gap: sizes.chipGap,
              padding: sizes.chipPad,
            }}
            tabIndex={-1}
          >
            <SweepIcon size={sizes.smallIcon} />
            Sweep · 6m ago
          </button>
        </div>

        <p
          className="font-semibold leading-none tracking-[-0.015em]"
          style={{
            color: INK,
            fontSize: sizes.heading,
            marginTop: sizes.subheadingMarginTop,
            marginBottom: sizes.subheadingMarginBottom,
          }}
        >
          Signal queue
        </p>

        <div className={`overflow-hidden border ${sizes.innerRadius}`} style={{ borderColor: BORDER }}>
          {SIGNALS.map((signal, index) => (
            <div key={signal.patient}>
              {index > 0 ? <div className="h-px w-full" style={{ background: DIVIDER }} /> : null}
              <SignalRow {...signal} sizes={sizes} />
            </div>
          ))}

          <div className="h-px w-full" style={{ background: DIVIDER }} />

          <div className="flex items-center justify-between" style={{ padding: sizes.footerPad }}>
            <button
              type="button"
              className={`inline-flex items-center ${sizes.btnRadius} font-medium leading-none ${inter.className}`}
              style={{
                background: BTN_BG,
                color: INK,
                fontSize: sizes.action,
                gap: sizes.chipGap,
                padding: sizes.chipPad,
              }}
              tabIndex={-1}
            >
              <span className="font-normal" style={{ fontSize: sizes.addPlus }}>
                +
              </span>
              Draft outreach
            </button>

            <button
              type="button"
              className={`ml-auto inline-flex items-center font-medium leading-none ${inter.className}`}
              style={{ color: INK, fontSize: sizes.action, gap: sizes.chipGap }}
              tabIndex={-1}
            >
              <SlidersIcon size={sizes.smallIcon} />
              Manage thresholds
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
