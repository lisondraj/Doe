"use client";

import type { ReactElement, ReactNode } from "react";

/** Warm chart / hero palette — aligned with Doe hero gradients (#1a2e34 … #d4893f) */
const ink = "rgba(30, 52, 58, 0.92)";
const muted = "rgba(30, 52, 58, 0.48)";
const line = "rgba(30, 52, 58, 0.12)";
const accent = "#c96a45";
const accentSoft = "rgba(201, 106, 69, 0.35)";
const surface = "rgba(255, 249, 242, 0.96)";
const surface2 = "rgba(255, 255, 255, 0.55)";

function TinyLabel({ children }: { children: ReactNode }) {
  return (
    <span
      className="block truncate font-semibold uppercase tracking-[0.06em]"
      style={{
        color: muted,
        fontSize: "clamp(0.38rem, 1.05vmin, 0.52rem)",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {children}
    </span>
  );
}

function PanelChrome({
  title,
  scanDelay,
  children,
}: {
  title: string;
  scanDelay: number;
  children: ReactNode;
}) {
  return (
    <div
      className="relative flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-[min(9px,1.6vmin)] p-[min(5px,1.1vmin)]"
      style={{
        background: surface,
        border: `1px solid ${surface2}`,
        boxShadow: "0 2px 10px rgba(26, 46, 52, 0.12)",
      }}
    >
      <div className="mb-[0.15rem] flex items-center justify-between gap-0.5">
        <TinyLabel>{title}</TinyLabel>
        <span
          className="hero-hcp-pulse-dot h-[0.28rem] w-[0.28rem] shrink-0 rounded-full"
          style={{ background: accent }}
          aria-hidden
        />
      </div>
      <div className="relative min-h-0 flex-1">{children}</div>
      <div
        className="hero-hcp-scan pointer-events-none absolute inset-0"
        style={{ animationDelay: `${scanDelay}ms` }}
        aria-hidden
      />
    </div>
  );
}

function VitalsPanel({ scanDelay }: { scanDelay: number }) {
  const rows = [
    { l: "BP", v: "122/78", w: 72 },
    { l: "HR", v: "68", w: 45 },
    { l: "SpO₂", v: "98%", w: 88 },
  ];
  return (
    <PanelChrome title="Vitals" scanDelay={scanDelay}>
      <div className="flex h-full flex-col justify-between gap-[0.12rem]">
        {rows.map((r) => (
          <div key={r.l} className="flex items-center gap-1">
            <span
              className="w-[28%] shrink-0 truncate font-medium"
              style={{
                color: ink,
                fontSize: "clamp(0.42rem, 1.15vmin, 0.58rem)",
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              {r.l}
            </span>
            <div className="relative h-[0.22rem] min-w-0 flex-1 overflow-hidden rounded-full" style={{ background: line }}>
              <div
                className="hero-hcp-bar-wave absolute left-0 top-0 h-full rounded-full"
                style={{ background: accentSoft, width: `${r.w}%` }}
              />
            </div>
            <span
              className="w-[26%] shrink-0 text-right font-medium tabular-nums"
              style={{
                color: ink,
                fontSize: "clamp(0.4rem, 1.1vmin, 0.55rem)",
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              {r.v}
            </span>
          </div>
        ))}
      </div>
    </PanelChrome>
  );
}

function LabsPanel({ scanDelay }: { scanDelay: number }) {
  return (
    <PanelChrome title="Labs" scanDelay={scanDelay}>
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-end gap-[0.1rem]" style={{ height: "42%" }}>
          {[0.35, 0.55, 0.4, 0.7, 0.45, 0.6, 0.5].map((h, i) => (
            <div
              key={i}
              className="hero-hcp-spark flex-1 rounded-t-[2px]"
              style={{
                height: `${h * 100}%`,
                background: i % 2 === 0 ? accentSoft : "rgba(30, 52, 58, 0.18)",
                animationDelay: `${i * 0.12}s`,
              }}
            />
          ))}
        </div>
        <div className="space-y-[0.12rem]">
          <div className="h-[0.18rem] w-full rounded-full" style={{ background: line }} />
          <div className="h-[0.18rem] w-[72%] rounded-full" style={{ background: line }} />
        </div>
      </div>
    </PanelChrome>
  );
}

function MedsPanel({ scanDelay }: { scanDelay: number }) {
  const meds = ["Lisinopril", "Metformin", "Atorvastatin"];
  return (
    <PanelChrome title="Meds" scanDelay={scanDelay}>
      <div className="flex h-full flex-col justify-center gap-[0.18rem]">
        {meds.map((m, i) => (
          <div
            key={m}
            className="hero-hcp-float truncate rounded-full px-[0.28rem] py-[0.1rem] font-medium"
            style={{
              border: `1px solid ${line}`,
              color: ink,
              fontSize: "clamp(0.38rem, 1.05vmin, 0.52rem)",
              fontFamily: "system-ui, -apple-system, sans-serif",
              animationDelay: `${i * 0.21}s`,
            }}
          >
            {m}
          </div>
        ))}
      </div>
    </PanelChrome>
  );
}

function ProblemsPanel({ scanDelay }: { scanDelay: number }) {
  const items = ["Type 2 DM", "HTN", "CKD 2"];
  return (
    <PanelChrome title="Problems" scanDelay={scanDelay}>
      <ul className="flex h-full flex-col justify-center gap-[0.14rem]">
        {items.map((t, i) => (
          <li key={t} className="hero-hcp-float flex items-center gap-[0.2rem]" style={{ animationDelay: `${i * 0.17}s` }}>
            <span className="w-[0.14rem] shrink-0 self-stretch rounded-full" style={{ background: accent }} />
            <span
              className="truncate font-medium"
              style={{
                color: ink,
                fontSize: "clamp(0.4rem, 1.1vmin, 0.55rem)",
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              {t}
            </span>
          </li>
        ))}
      </ul>
    </PanelChrome>
  );
}

function TimelinePanel({ scanDelay }: { scanDelay: number }) {
  return (
    <PanelChrome title="Timeline" scanDelay={scanDelay}>
      <div className="relative flex h-full flex-col justify-between pl-[0.28rem]">
        <div className="absolute bottom-[6%] left-[0.1rem] top-[6%] w-[0.08rem] rounded-full" style={{ background: line }} />
        {[0, 1, 2].map((i) => (
          <div key={i} className="relative flex items-center gap-[0.22rem]">
            <span
              className="hero-hcp-node z-[1] h-[0.32rem] w-[0.32rem] shrink-0 rounded-full border"
              style={{ borderColor: line, background: i === 0 ? accent : surface2 }}
            />
            <div className="min-w-0 flex-1">
              <div
                className="hero-hcp-line-grow h-[0.16rem] rounded-full"
                style={{
                  width: `${68 + i * 8}%`,
                  background: line,
                  animationDelay: `${i * 0.25}s`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </PanelChrome>
  );
}

function OrdersPanel({ scanDelay }: { scanDelay: number }) {
  return (
    <PanelChrome title="Orders" scanDelay={scanDelay}>
      <div className="flex h-full flex-col justify-center gap-[0.16rem]">
        {[1, 0, 1].map((c, i) => (
          <div key={i} className="flex items-center gap-[0.2rem]">
            <span
              className="hero-hcp-check h-[0.36rem] w-[0.36rem] shrink-0 rounded border"
              style={{
                borderColor: line,
                background: c ? accentSoft : "transparent",
                animationDelay: `${i * 0.2}s`,
              }}
            />
            <div
              className="hero-hcp-line-grow h-[0.16rem] flex-1 rounded-full"
              style={{
                background: line,
                animationDelay: `${i * 0.18}s`,
              }}
            />
          </div>
        ))}
      </div>
    </PanelChrome>
  );
}

const HERO_CHART_STACK: { Panel: (p: { scanDelay: number }) => ReactElement; scan: number }[] = [
  { Panel: VitalsPanel, scan: 0 },
  { Panel: LabsPanel, scan: 220 },
  { Panel: MedsPanel, scan: 110 },
  { Panel: ProblemsPanel, scan: 330 },
  { Panel: TimelinePanel, scan: 450 },
  { Panel: OrdersPanel, scan: 180 },
];

export function HeroChartPanels({ staggerMs }: { staggerMs: number[] | null }) {
  return (
    <div
      className="pointer-events-none mx-auto grid aspect-[3/2] h-auto w-full max-w-[min(82vw,25.5rem)] select-none grid-cols-3 grid-rows-2 gap-[min(1.8vmin,0.55rem)] sm:max-w-[min(78vw,27rem)] sm:gap-2"
      aria-hidden
    >
      {HERO_CHART_STACK.map(({ Panel, scan }, i) => (
        <div
          key={i}
          className={`relative z-[1] min-h-0 min-w-0 motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:opacity-100 ${
            staggerMs ? "hero-tile-rise" : "translate-y-3 scale-[0.92] opacity-0"
          }`}
          style={staggerMs ? { animationDelay: `${staggerMs[i]}ms` } : undefined}
        >
          <Panel scanDelay={scan} />
        </div>
      ))}
    </div>
  );
}
