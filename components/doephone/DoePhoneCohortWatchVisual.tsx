"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";

const { ink: INK, accent: DOE_ORANGE, divider: DIVIDER } = CAROUSEL_MENU_UI;

const MUTED_TEXT = "#6B7280";
const BTN_BG = "#F3F4F6";
const BORDER = "#E5E7EB";

const BRIEF_SUMMARY =
  "The agent scanned 142 charts overnight and staged a morning packet with the three escalations that need a decision before clinic starts.";

const PRIORITIES = [
  {
    rank: 1,
    headline: "Refill gap · 12 days",
    detail: "J. Park · metformin not picked up",
  },
  {
    rank: 2,
    headline: "A1c trend · 8.4 to 9.1",
    detail: "M. Chen · six-month rise across visits",
  },
  {
    rank: 3,
    headline: "Home BP average · 148/94",
    detail: "S. Reyes · remote readings above target",
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

function PacketIcon({ size }: { size: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="shrink-0" style={{ width: size, height: size }}>
      <path
        d="M5.5 4.5h9a1.2 1.2 0 011.2 1.2v8.6a1.2 1.2 0 01-1.2 1.2h-9a1.2 1.2 0 01-1.2-1.2V5.7a1.2 1.2 0 011.2-1.2z"
        stroke={DOE_ORANGE}
        strokeWidth="1.2"
      />
      <path d="M7.5 8h5M7.5 10.5h3.8" stroke={DOE_ORANGE} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function LogIcon({ size }: { size: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="shrink-0" style={{ width: size, height: size }}>
      <path d="M5.5 4.5h9v11h-9z" stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M7.5 8h5M7.5 10.5h5M7.5 13h3.2" stroke={INK} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function PriorityRow({
  rank,
  headline,
  detail,
  sizes,
}: (typeof PRIORITIES)[number] & { sizes: VisualSizes }) {
  return (
    <div className="flex items-start" style={{ gap: sizes.rowGap, padding: sizes.rowPad }}>
      <span
        className={`${inter.className} shrink-0 font-medium tabular-nums leading-none`}
        style={{ color: DOE_ORANGE, fontSize: sizes.status, marginTop: "0.18em", minWidth: "1.15em" }}
      >
        {rank}
      </span>
      <div className="min-w-0">
        <p className="font-medium leading-snug" style={{ color: INK, fontSize: sizes.body }}>
          {headline}
        </p>
        <p
          className={`${inter.className} font-normal leading-snug`}
          style={{ color: MUTED_TEXT, fontSize: sizes.status, marginTop: "0.14em" }}
        >
          {detail}
        </p>
      </div>
    </div>
  );
}

/** Proactive cohort monitoring — overnight brief staged for morning rounds. */
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
          Overnight brief
        </p>

        <p
          className={`${inter.className} font-normal leading-snug`}
          style={{ color: MUTED_TEXT, fontSize: sizes.status }}
        >
          Diabetes panel · sweep completed 5:40 AM · 142 charts reviewed
        </p>

        <div
          className={`border ${sizes.innerRadius}`}
          style={{
            borderColor: "rgba(210, 119, 76, 0.22)",
            background: "rgba(210, 119, 76, 0.07)",
            padding: sizes.rowPad,
            marginTop: sizes.sectionGap,
          }}
        >
          <p className={`${inter.className} font-normal leading-[1.45]`} style={{ color: INK, fontSize: sizes.body }}>
            {BRIEF_SUMMARY}
          </p>
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
          Priorities for rounds
        </p>

        <div className={`overflow-hidden border ${sizes.innerRadius}`} style={{ borderColor: BORDER }}>
          {PRIORITIES.map((priority, index) => (
            <div key={priority.rank}>
              {index > 0 ? <div className="h-px w-full" style={{ background: DIVIDER }} /> : null}
              <PriorityRow {...priority} sizes={sizes} />
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
              <PacketIcon size={sizes.smallIcon} />
              Open morning packet
            </button>

            <button
              type="button"
              className={`ml-auto inline-flex items-center font-medium leading-none ${inter.className}`}
              style={{ color: INK, fontSize: sizes.action, gap: sizes.chipGap }}
              tabIndex={-1}
            >
              <LogIcon size={sizes.smallIcon} />
              Sweep log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
