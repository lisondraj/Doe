"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";

const { ink: INK, muted: MUTED, accent: FLAG_HIGH, divider: DIVIDER } = CAROUSEL_MENU_UI;

const CARD = `${CAROUSEL_MENU_UI.cardRadius} ${CAROUSEL_MENU_UI.cardShell}`;

const INCOMING_LABS = [
  { test: "WBC", value: "6.4", unit: "K/uL", flag: null },
  { test: "Hgb", value: "13.8", unit: "g/dL", flag: null },
  { test: "Plt", value: "248", unit: "K/uL", flag: null },
  { test: "Glucose", value: "142", unit: "mg/dL", flag: "H" as const },
  { test: "A1c", value: "8.2", unit: "%", flag: "H" as const },
  { test: "Creatinine", value: "0.9", unit: "mg/dL", flag: null },
  { test: "LDL", value: "118", unit: "mg/dL", flag: "H" as const },
] as const;

const EMR_SECTIONS = [
  { label: "Hematology", filed: ["WBC 6.4", "Hgb 13.8", "Plt 248"] },
  { label: "Metabolic panel", filed: ["Glucose 142", "Creatinine 0.9"] },
  { label: "Endocrine", filed: ["A1c 8.2%"] },
  { label: "Lipids", filed: ["LDL 118"] },
] as const;

function LabFlag({ flag }: { flag: "H" | "L" | null }) {
  if (!flag) return <span className="w-[1.2rem]" aria-hidden />;
  return (
    <span
      className="inline-flex h-[1.1rem] min-w-[1.1rem] items-center justify-center rounded-[0.24rem] px-[0.22rem] font-semibold leading-none text-white"
      style={{ background: FLAG_HIGH, fontSize: CAROUSEL_MENU_UI.type.eyebrow }}
    >
      {flag}
    </span>
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
        <p
          className="mt-[0.16rem] font-medium tracking-[-0.012em]"
          style={{ color: INK, fontSize: CAROUSEL_MENU_UI.type.title }}
        >
          CBC · CMP · Lipid panel
        </p>
      </div>

      <div
        className={inter.className}
        style={{ padding: `${CAROUSEL_MENU_UI.padY} ${CAROUSEL_MENU_UI.padX}` }}
      >
        <div
          className="grid gap-x-[0.45rem] border-b pb-[0.38rem] font-medium uppercase tracking-[0.08em]"
          style={{
            gridTemplateColumns: "1fr auto auto auto",
            color: MUTED,
            borderColor: DIVIDER,
            fontSize: CAROUSEL_MENU_UI.type.eyebrow,
          }}
        >
          <span>Test</span>
          <span className="text-right">Result</span>
          <span className="text-right">Unit</span>
          <span aria-hidden />
        </div>

        <div className="mt-[0.28rem] flex flex-col gap-[0.22rem]">
          {INCOMING_LABS.map((row) => (
            <div
              key={row.test}
              className="grid items-center gap-x-[0.45rem] rounded-[0.38rem] px-[0.18rem] py-[0.16rem]"
              style={{
                gridTemplateColumns: "1fr auto auto auto",
                background: row.flag ? "rgba(210, 119, 76, 0.06)" : "transparent",
              }}
            >
              <span className="truncate font-medium" style={{ color: INK, fontSize: CAROUSEL_MENU_UI.type.caption }}>
                {row.test}
              </span>
              <span
                className="text-right font-semibold tabular-nums"
                style={{ color: row.flag ? FLAG_HIGH : INK, fontSize: CAROUSEL_MENU_UI.type.caption }}
              >
                {row.value}
              </span>
              <span className="text-right tabular-nums" style={{ color: MUTED, fontSize: CAROUSEL_MENU_UI.type.eyebrow }}>
                {row.unit}
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
        <div className="min-w-0">
          <p className="font-medium uppercase tracking-[0.14em]" style={{ color: MUTED, fontSize: CAROUSEL_MENU_UI.type.eyebrow }}>
            Patient EMR
          </p>
          <p
            className="mt-[0.12rem] truncate font-medium tracking-[-0.012em]"
            style={{ color: INK, fontSize: CAROUSEL_MENU_UI.type.title }}
          >
            Sarah Chen · Epic chart
          </p>
        </div>
        <span
          className="shrink-0 rounded-full px-[0.48rem] py-[0.18rem] font-medium text-white"
          style={{ background: FLAG_HIGH, fontSize: CAROUSEL_MENU_UI.type.eyebrow }}
        >
          Auto-sorted
        </span>
      </div>

      <div
        className={`flex flex-col gap-[clamp(0.38rem,1.35vmin,0.52rem)] ${inter.className}`}
        style={{ padding: `${CAROUSEL_MENU_UI.padY} ${CAROUSEL_MENU_UI.padX}` }}
      >
        {EMR_SECTIONS.map((section) => (
          <div key={section.label}>
            <div className="mb-[0.18rem] flex items-center gap-[0.32rem]">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden className="shrink-0">
                <path
                  d="M2 5.2l2 2 4-4.5"
                  stroke={FLAG_HIGH}
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                className="font-medium uppercase tracking-[0.07em]"
                style={{ color: MUTED, fontSize: CAROUSEL_MENU_UI.type.eyebrow }}
              >
                {section.label}
              </span>
            </div>
            <div className="flex flex-wrap gap-[0.28rem]">
              {section.filed.map((item) => (
                <span
                  key={item}
                  className="rounded-[0.38rem] border px-[0.42rem] py-[0.16rem] font-medium tabular-nums"
                  style={{
                    borderColor: DIVIDER,
                    color: INK,
                    background: "#FAFAF8",
                    fontSize: CAROUSEL_MENU_UI.type.eyebrow,
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
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
