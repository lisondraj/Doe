"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";

const INK = "#1E343A";
const MUTED = "rgba(30, 52, 58, 0.52)";
const DIVIDER = "#EBE7E0";
const FLAG_HIGH = "#D2774C";

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

const CARD =
  "overflow-hidden rounded-[clamp(0.72rem,0.58rem+0.55vmin,0.95rem)] border border-[#1E343A]/10 bg-white shadow-[0_14px_36px_rgba(30,52,58,0.14)]";

function LabFlag({ flag }: { flag: "H" | "L" | null }) {
  if (!flag) return <span className="w-[1.05rem]" aria-hidden />;
  return (
    <span
      className="inline-flex h-[0.95rem] min-w-[0.95rem] items-center justify-center rounded-[0.2rem] px-[0.18rem] text-[0.42rem] font-semibold leading-none text-white"
      style={{ background: FLAG_HIGH }}
    >
      {flag}
    </span>
  );
}

function IncomingLabsSheet() {
  return (
    <div className={`${CARD} h-full ${suisseIntl.className}`}>
      <div className="border-b px-[clamp(0.55rem,2.2vmin,0.72rem)] py-[clamp(0.42rem,1.6vmin,0.55rem)]" style={{ borderColor: DIVIDER }}>
        <p className="text-[clamp(0.42rem,1.55vmin,0.52rem)] font-medium uppercase tracking-[0.14em]" style={{ color: MUTED }}>
          Incoming labs
        </p>
        <p className="mt-[0.12rem] text-[clamp(0.52rem,1.85vmin,0.62rem)] font-medium tracking-[-0.012em]" style={{ color: INK }}>
          CBC · CMP · Lipid panel
        </p>
      </div>

      <div className={`px-[clamp(0.55rem,2.2vmin,0.72rem)] py-[clamp(0.38rem,1.4vmin,0.5rem)] ${inter.className}`}>
        <div
          className="grid gap-x-[0.35rem] border-b pb-[0.28rem] text-[clamp(0.38rem,1.35vmin,0.46rem)] font-medium uppercase tracking-[0.08em]"
          style={{ gridTemplateColumns: "1fr auto auto auto", color: MUTED, borderColor: DIVIDER }}
        >
          <span>Test</span>
          <span className="text-right">Result</span>
          <span className="text-right">Unit</span>
          <span aria-hidden />
        </div>

        <div className="mt-[0.18rem] flex flex-col gap-[0.14rem]">
          {INCOMING_LABS.map((row) => (
            <div
              key={row.test}
              className="grid items-center gap-x-[0.35rem] rounded-[0.28rem] px-[0.12rem] py-[0.1rem]"
              style={{
                gridTemplateColumns: "1fr auto auto auto",
                background: row.flag ? "rgba(210, 119, 76, 0.06)" : "transparent",
              }}
            >
              <span className="truncate text-[clamp(0.44rem,1.55vmin,0.52rem)] font-medium" style={{ color: INK }}>
                {row.test}
              </span>
              <span
                className="text-right text-[clamp(0.44rem,1.55vmin,0.52rem)] font-semibold tabular-nums"
                style={{ color: row.flag ? FLAG_HIGH : INK }}
              >
                {row.value}
              </span>
              <span className="text-right text-[clamp(0.38rem,1.35vmin,0.46rem)] tabular-nums" style={{ color: MUTED }}>
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
        className="flex items-center justify-between gap-2 border-b px-[clamp(0.55rem,2.2vmin,0.72rem)] py-[clamp(0.42rem,1.6vmin,0.55rem)]"
        style={{ borderColor: DIVIDER, background: "rgba(30, 52, 58, 0.03)" }}
      >
        <div className="min-w-0">
          <p className="text-[clamp(0.42rem,1.55vmin,0.52rem)] font-medium uppercase tracking-[0.14em]" style={{ color: MUTED }}>
            Patient EMR
          </p>
          <p className="mt-[0.1rem] truncate text-[clamp(0.52rem,1.85vmin,0.62rem)] font-medium tracking-[-0.012em]" style={{ color: INK }}>
            Sarah Chen · Epic chart
          </p>
        </div>
        <span
          className="shrink-0 rounded-full px-[0.38rem] py-[0.14rem] text-[clamp(0.38rem,1.3vmin,0.44rem)] font-medium text-white"
          style={{ background: FLAG_HIGH }}
        >
          Auto-sorted
        </span>
      </div>

      <div className={`flex flex-col gap-[clamp(0.28rem,1vmin,0.38rem)] px-[clamp(0.55rem,2.2vmin,0.72rem)] py-[clamp(0.42rem,1.5vmin,0.55rem)] ${inter.className}`}>
        {EMR_SECTIONS.map((section) => (
          <div key={section.label}>
            <div className="mb-[0.14rem] flex items-center gap-[0.28rem]">
              <svg width="8" height="8" viewBox="0 0 10 10" fill="none" aria-hidden className="shrink-0">
                <path
                  d="M2 5.2l2 2 4-4.5"
                  stroke={FLAG_HIGH}
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[clamp(0.4rem,1.4vmin,0.48rem)] font-medium uppercase tracking-[0.07em]" style={{ color: MUTED }}>
                {section.label}
              </span>
            </div>
            <div className="flex flex-wrap gap-[0.22rem]">
              {section.filed.map((item) => (
                <span
                  key={item}
                  className="rounded-[0.28rem] border px-[0.32rem] py-[0.12rem] text-[clamp(0.4rem,1.4vmin,0.48rem)] font-medium tabular-nums"
                  style={{ borderColor: DIVIDER, color: INK, background: "#FAFAF8" }}
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

/** Overlapping labs sheet → EMR sort — Incoming carousel slide. */
export function DoePhoneIncomingLabsVisual() {
  return (
    <div
      className="relative mx-auto aspect-[1.05/1] w-full max-w-[min(88%,20rem)] iphone-page:max-w-[min(92%,22rem)]"
      aria-hidden
    >
      <div className="absolute left-[6%] top-[8%] z-10 h-[62%] w-[62%]">
        <IncomingLabsSheet />
      </div>
      <div className="absolute bottom-[8%] right-[6%] z-20 h-[62%] w-[62%]">
        <EmrAutoSortedPanel />
      </div>
    </div>
  );
}
