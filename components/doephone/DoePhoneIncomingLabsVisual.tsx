"use client";

import { suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";

const { ink: INK, muted: MUTED, accent: FLAG_HIGH, divider: DIVIDER } = CAROUSEL_MENU_UI;

const CARD = `${CAROUSEL_MENU_UI.cardRadius} ${CAROUSEL_MENU_UI.cardShell}`;

const INCOMING_LABS = [
  { test: "WBC", value: "6.4", flag: null },
  { test: "Hgb", value: "13.8", flag: null },
  { test: "Glucose", value: "142", flag: "H" as const },
  { test: "A1c", value: "8.2", flag: "H" as const },
  { test: "LDL", value: "118", flag: "H" as const },
] as const;

const FILED_CHIPS = ["WBC", "Hgb", "Glucose", "A1c", "LDL", "Plt"] as const;

function LabFlag({ flag }: { flag: "H" | "L" | null }) {
  if (!flag) return null;
  return (
    <span
      className="inline-flex h-[1.15rem] min-w-[1.15rem] items-center justify-center rounded-[0.24rem] px-[0.22rem] font-semibold leading-none text-white"
      style={{ background: FLAG_HIGH, fontSize: CAROUSEL_MENU_UI.type.eyebrow }}
    >
      {flag}
    </span>
  );
}

function MiniSparkline({ flagged }: { flagged: boolean }) {
  const stroke = flagged ? FLAG_HIGH : "rgba(30, 52, 58, 0.28)";
  return (
    <svg viewBox="0 0 48 14" fill="none" aria-hidden className="block h-[0.85rem] w-full">
      <path
        d={flagged ? "M1 10 L12 6 L24 8 L36 3 L47 5" : "M1 8 L12 9 L24 7 L36 8 L47 6"}
        stroke={stroke}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IncomingLabsSheet() {
  return (
    <div className={`${CARD} h-full ${suisseIntl.className}`}>
      <div
        className="border-b"
        style={{
          borderColor: DIVIDER,
          padding: `${CAROUSEL_MENU_UI.padY} ${CAROUSEL_MENU_UI.padX}`,
        }}
      >
        <p className="font-medium uppercase tracking-[0.14em]" style={{ color: MUTED, fontSize: CAROUSEL_MENU_UI.type.eyebrow }}>
          Incoming labs
        </p>
      </div>

      <div style={{ padding: `${CAROUSEL_MENU_UI.padY} ${CAROUSEL_MENU_UI.padX}` }}>
        <div className="flex flex-col gap-[0.32rem]">
          {INCOMING_LABS.map((row) => (
            <div
              key={row.test}
              className="grid items-center gap-x-[0.45rem] rounded-[0.5rem] px-[0.42rem] py-[0.32rem]"
              style={{
                gridTemplateColumns: "auto 1fr auto auto",
                background: row.flag ? "rgba(210, 119, 76, 0.08)" : "#FAFAF8",
                border: `1px solid ${row.flag ? "rgba(210, 119, 76, 0.18)" : DIVIDER}`,
              }}
            >
              <span
                className="flex h-[clamp(1.35rem,4.2vmin,1.65rem)] w-[clamp(1.35rem,4.2vmin,1.65rem)] items-center justify-center rounded-[0.38rem] font-semibold"
                style={{
                  background: row.flag ? "rgba(210, 119, 76, 0.14)" : "rgba(30, 52, 58, 0.06)",
                  color: row.flag ? FLAG_HIGH : INK,
                  fontSize: CAROUSEL_MENU_UI.type.eyebrow,
                }}
              >
                {row.test.slice(0, 1)}
              </span>
              <MiniSparkline flagged={Boolean(row.flag)} />
              <span
                className="font-semibold tabular-nums"
                style={{ color: row.flag ? FLAG_HIGH : INK, fontSize: CAROUSEL_MENU_UI.type.caption }}
              >
                {row.value}
              </span>
              <LabFlag flag={row.flag} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmrAutoSortedPanel() {
  return (
    <div className={`${CARD} h-full ${suisseIntl.className}`}>
      <div
        className="flex items-center justify-between gap-2 border-b"
        style={{
          borderColor: DIVIDER,
          background: "rgba(30, 52, 58, 0.03)",
          padding: `${CAROUSEL_MENU_UI.padY} ${CAROUSEL_MENU_UI.padX}`,
        }}
      >
        <p className="font-medium uppercase tracking-[0.14em]" style={{ color: MUTED, fontSize: CAROUSEL_MENU_UI.type.eyebrow }}>
          EMR filed
        </p>
        <span
          className="shrink-0 rounded-full px-[0.48rem] py-[0.18rem] font-medium text-white"
          style={{ background: FLAG_HIGH, fontSize: CAROUSEL_MENU_UI.type.eyebrow }}
        >
          ✓
        </span>
      </div>

      <div
        className="grid grid-cols-3 gap-[0.38rem]"
        style={{ padding: `${CAROUSEL_MENU_UI.padY} ${CAROUSEL_MENU_UI.padX}` }}
      >
        {FILED_CHIPS.map((chip) => (
          <span
            key={chip}
            className="flex aspect-square flex-col items-center justify-center rounded-[0.55rem] border font-semibold"
            style={{
              borderColor: DIVIDER,
              color: INK,
              background: "#FAFAF8",
              fontSize: CAROUSEL_MENU_UI.type.caption,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 10 10" fill="none" aria-hidden className="mb-[0.12rem]">
              <path
                d="M2 5.2l2 2 4-4.5"
                stroke={FLAG_HIGH}
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {chip}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Overlapping labs sheet → EMR sort — Inbox carousel slide. */
export function DoePhoneIncomingLabsVisual() {
  return (
    <div
      className="relative mx-auto h-full w-full max-h-full aspect-[1.02/1]"
      style={{ maxWidth: CAROUSEL_MENU_UI.maxWidth }}
      aria-hidden
    >
      <div className="absolute left-[4%] top-[6%] z-10 h-[68%] w-[68%]">
        <IncomingLabsSheet />
      </div>
      <div className="absolute bottom-[6%] right-[4%] z-20 h-[68%] w-[68%]">
        <EmrAutoSortedPanel />
      </div>
    </div>
  );
}
