"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";

const { ink: INK, accent: DOE_ORANGE, divider: DIVIDER, muted: MUTED } = CAROUSEL_MENU_UI;

const MUTED_TEXT = "#6B7280";
const PANEL_BG = "#FAFAF8";

const SIGNALS = [
  {
    patient: "M. Chen",
    detail: "A1c trend rising · 8.4 → 9.1",
    action: "Outreach draft",
    state: "ready" as const,
  },
  {
    patient: "J. Park",
    detail: "Missed metformin refill · 12 days",
    action: "Pharmacy queue",
    state: "queued" as const,
  },
  {
    patient: "S. Reyes",
    detail: "Home BP avg ↑ · 148/94",
    action: "Care plan review",
    state: "review" as const,
  },
] as const;

type VisualLayout = "phone" | "desktop";

type VisualSizes = {
  outerRadius: string;
  innerRadius: string;
  maxWidth: string;
  panelPad: string;
  eyebrow: string;
  title: string;
  statValue: string;
  statLabel: string;
  body: string;
  caption: string;
  chip: string;
  rowPad: string;
  rowGap: string;
  sectionGap: string;
  statGap: string;
};

const PHONE_SIZES: VisualSizes = {
  outerRadius: "rounded-[clamp(0.8rem,2.4vmin,0.95rem)]",
  innerRadius: "rounded-[clamp(0.45rem,1.35vmin,0.55rem)]",
  maxWidth: CAROUSEL_MENU_UI.maxWidthPhone,
  panelPad: "clamp(1.2rem,3.85vmin,1.45rem) clamp(1.25rem,4vmin,1.55rem)",
  eyebrow: "clamp(0.68rem,2.15vmin,0.86rem)",
  title: "clamp(1.02rem,3.15vmin,1.22rem)",
  statValue: "clamp(1.45rem,4.45vmin,1.75rem)",
  statLabel: "clamp(0.72rem,2.15vmin,0.86rem)",
  body: "clamp(0.88rem,2.65vmin,1.05rem)",
  caption: "clamp(0.72rem,2.15vmin,0.86rem)",
  chip: "clamp(0.68rem,2.05vmin,0.82rem)",
  rowPad: "clamp(0.72rem,2.2vmin,0.9rem) clamp(0.82rem,2.5vmin,1rem)",
  rowGap: "clamp(0.48rem,1.45vmin,0.62rem)",
  sectionGap: "clamp(0.95rem,2.9vmin,1.18rem)",
  statGap: "clamp(0.72rem,2.2vmin,0.9rem)",
};

const DESKTOP_SIZES: VisualSizes = {
  outerRadius: "rounded-[clamp(0.85rem,0.95vw,1rem)]",
  innerRadius: "rounded-[clamp(0.48rem,0.58vw,0.62rem)]",
  maxWidth: "min(100%, 34rem)",
  panelPad: "clamp(1.15rem,1.45vw,1.5rem) clamp(1.2rem,1.55vw,1.6rem)",
  eyebrow: "clamp(0.72rem,0.85vw,0.9rem)",
  title: "clamp(1.12rem,1.35vw,1.42rem)",
  statValue: "clamp(1.55rem,1.85vw,1.95rem)",
  statLabel: "clamp(0.78rem,0.9vw,0.92rem)",
  body: "clamp(0.9rem,1.02vw,1.05rem)",
  caption: "clamp(0.78rem,0.9vw,0.92rem)",
  chip: "clamp(0.72rem,0.85vw,0.88rem)",
  rowPad: "clamp(0.72rem,0.88vw,0.92rem) clamp(0.82rem,1vw,1.05rem)",
  rowGap: "clamp(0.5rem,0.62vw,0.66rem)",
  sectionGap: "clamp(0.95rem,1.15vw,1.2rem)",
  statGap: "clamp(0.72rem,0.88vw,0.92rem)",
};

function SignalPulse({ size }: { size: string }) {
  return (
    <span className="relative flex shrink-0 items-center justify-center" style={{ width: size, height: size }} aria-hidden>
      <span
        className="absolute inset-0 rounded-full"
        style={{ background: "rgba(210, 119, 76, 0.18)", animation: "cohort-pulse 2.4s ease-out infinite" }}
      />
      <span className="relative rounded-full" style={{ width: "42%", height: "42%", background: DOE_ORANGE }} />
    </span>
  );
}

function ActionChip({ label, state, sizes }: { label: string; state: (typeof SIGNALS)[number]["state"]; sizes: VisualSizes }) {
  const styles =
    state === "ready"
      ? { background: "rgba(210, 119, 76, 0.12)", color: DOE_ORANGE, border: "rgba(210, 119, 76, 0.28)" }
      : state === "queued"
        ? { background: "rgba(30, 52, 58, 0.06)", color: INK, border: DIVIDER }
        : { background: "#FFFFFF", color: MUTED_TEXT, border: DIVIDER };

  return (
    <span
      className={`shrink-0 rounded-full border font-medium ${inter.className}`}
      style={{ ...styles, fontSize: sizes.chip, padding: "0.22em 0.72em" }}
    >
      {label}
    </span>
  );
}

/** Proactive cohort monitoring — surfaces deteriorating patients before rounds. */
export function DoePhoneCohortWatchVisual({ layout = "phone" }: { layout?: VisualLayout }) {
  const sizes = layout === "desktop" ? DESKTOP_SIZES : PHONE_SIZES;

  return (
    <>
      <style>{`
        @keyframes cohort-pulse {
          0% { transform: scale(0.85); opacity: 0.55; }
          70% { transform: scale(1.35); opacity: 0; }
          100% { transform: scale(1.35); opacity: 0; }
        }
      `}</style>
      <div
        className={`mx-auto flex h-full w-full items-center justify-center ${suisseIntl.className}`}
        style={{ maxWidth: sizes.maxWidth }}
        aria-hidden
      >
        <div
          className={`w-full border bg-white ${sizes.outerRadius}`}
          style={{ borderColor: "#E5E7EB", padding: sizes.panelPad }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p
                className="font-medium uppercase tracking-[0.14em]"
                style={{ color: MUTED, fontSize: sizes.eyebrow }}
              >
                Cohort watch
              </p>
              <h3
                className="font-semibold leading-tight tracking-[-0.02em]"
                style={{ color: INK, fontSize: sizes.title, marginTop: "0.28em" }}
              >
                Diabetes panel
              </h3>
            </div>
            <div
              className={`flex shrink-0 items-center gap-2 border ${sizes.innerRadius}`}
              style={{
                borderColor: DIVIDER,
                background: PANEL_BG,
                padding: "0.42em 0.72em",
              }}
            >
              <SignalPulse size="0.72rem" />
              <span className={`${inter.className} font-normal`} style={{ color: MUTED_TEXT, fontSize: sizes.caption }}>
                Sweep · 6m ago
              </span>
            </div>
          </div>

          <div
            className="grid"
            style={{
              marginTop: sizes.sectionGap,
              gap: sizes.statGap,
              gridTemplateColumns: layout === "desktop" ? "1fr 1.35fr" : "1fr",
            }}
          >
            <div
              className={`border ${sizes.innerRadius}`}
              style={{ borderColor: DIVIDER, background: PANEL_BG, padding: sizes.rowPad }}
            >
              <p
                className="font-semibold tabular-nums leading-none tracking-[-0.03em]"
                style={{ color: INK, fontSize: sizes.statValue }}
              >
                142
              </p>
              <p
                className={`${inter.className} font-normal`}
                style={{ color: MUTED_TEXT, fontSize: sizes.statLabel, marginTop: "0.35em" }}
              >
                Active patients
              </p>
            </div>

            <div
              className={`border ${sizes.innerRadius}`}
              style={{ borderColor: "rgba(210, 119, 76, 0.22)", background: "rgba(210, 119, 76, 0.07)", padding: sizes.rowPad }}
            >
              <p className="font-semibold leading-tight" style={{ color: DOE_ORANGE, fontSize: sizes.body }}>
                3 signals surfaced
              </p>
              <p
                className={`${inter.className} font-normal leading-snug`}
                style={{ color: MUTED_TEXT, fontSize: sizes.caption, marginTop: "0.28em" }}
              >
                Agent drafted outreach and queued follow-ups overnight
              </p>
            </div>
          </div>

          <div style={{ marginTop: sizes.sectionGap }}>
            <div className="mb-[0.55em] flex items-center justify-between gap-2">
              <p className="font-medium" style={{ color: INK, fontSize: sizes.body }}>
                Signal queue
              </p>
              <span
                className={`rounded-full font-medium text-white ${inter.className}`}
                style={{ background: DOE_ORANGE, fontSize: sizes.chip, padding: "0.18em 0.62em" }}
              >
                3 new
              </span>
            </div>

            <div className="flex flex-col" style={{ gap: sizes.rowGap }}>
              {SIGNALS.map((signal) => (
                <div
                  key={signal.patient}
                  className={`flex items-center justify-between gap-3 border ${sizes.innerRadius}`}
                  style={{
                    borderColor: DIVIDER,
                    background: PANEL_BG,
                    padding: sizes.rowPad,
                  }}
                >
                  <div className="min-w-0 flex items-start gap-[0.55em]">
                    <span
                      className="mt-[0.35em] shrink-0 rounded-full"
                      style={{ width: "0.42rem", height: "0.42rem", background: DOE_ORANGE }}
                      aria-hidden
                    />
                    <div className="min-w-0">
                      <p className="font-semibold leading-snug" style={{ color: INK, fontSize: sizes.body }}>
                        {signal.patient}
                      </p>
                      <p
                        className={`${inter.className} truncate font-normal leading-snug`}
                        style={{ color: MUTED_TEXT, fontSize: sizes.caption, marginTop: "0.12em" }}
                      >
                        {signal.detail}
                      </p>
                    </div>
                  </div>
                  <ActionChip label={signal.action} state={signal.state} sizes={sizes} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
