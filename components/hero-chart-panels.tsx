"use client";

import type { ReactElement, ReactNode } from "react";
import { useId } from "react";

/** Hero / chart UI — warm slate + amber, matches Doe gradient hero */
const ink = "rgba(30, 52, 58, 0.88)";
const line = "rgba(30, 52, 58, 0.14)";
const accent = "#c96a45";
const accentDeep = "#9a4d32";
const accentSoft = "rgba(201, 106, 69, 0.42)";
const surface = "rgba(255, 249, 242, 0.97)";
const surfaceDeep = "rgba(255, 255, 255, 0.65)";
const ok = "rgba(46, 125, 95, 0.55)";
const mutedColor = "rgba(30, 52, 58, 0.42)";

function PanelShell({
  label,
  scanDelay,
  children,
}: {
  label: string;
  scanDelay: number;
  children: ReactNode;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className="relative flex h-full min-h-[2.5rem] min-w-0 w-full flex-col overflow-hidden rounded-[min(11px,2vmin)] p-[min(6px,1.2vmin)] shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_2px_12px_rgba(26,46,52,0.14)]"
      style={{
        background: `linear-gradient(165deg, ${surface} 0%, rgba(248, 242, 236, 0.99) 100%)`,
        border: `1px solid ${surfaceDeep}`,
      }}
    >
      <div
        className="hero-hcp-scan pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{ animationDelay: `${scanDelay}ms` }}
        aria-hidden
      />
      <div className="relative z-[1] flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}

/** Three radial gauges — numbers dominant, labels minimal */
function VitalsPanel({ scanDelay }: { scanDelay: number }) {
  const gauges = [
    { pct: 72, big: "122", sub: "/78", micro: "BP" },
    { pct: 48, big: "68", sub: "", micro: "HR" },
    { pct: 88, big: "98", sub: "%", micro: "SpO₂" },
  ];
  return (
    <PanelShell label="Vitals summary" scanDelay={scanDelay}>
      <div className="flex min-h-0 flex-1 items-center justify-between gap-[0.15rem]">
        {gauges.map((g) => (
          <div key={g.micro} className="flex min-w-0 flex-1 flex-col items-center justify-center">
            <div className="relative aspect-square w-[min(42%,2.1rem)] max-w-[2.4rem]">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(${accent} 0 ${g.pct * 3.6}deg, ${line} ${g.pct * 3.6}deg 360deg)`,
                }}
              />
              <div
                className="absolute inset-[14%] flex flex-col items-center justify-center rounded-full"
                style={{ background: surface }}
              >
                <span
                  className="font-bold tabular-nums leading-none"
                  style={{
                    color: ink,
                    fontSize: "clamp(0.45rem, 1.35vmin, 0.62rem)",
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  {g.big}
                  <span style={{ color: mutedColor, fontSize: "0.75em" }}>{g.sub}</span>
                </span>
              </div>
            </div>
            <span
              className="mt-[0.08rem] font-semibold uppercase tracking-wider"
              style={{
                color: mutedColor,
                fontSize: "clamp(0.28rem, 0.85vmin, 0.4rem)",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              {g.micro}
            </span>
          </div>
        ))}
      </div>
    </PanelShell>
  );
}

/** Animated area chart — visual only */
function LabsPanel({ scanDelay }: { scanDelay: number }) {
  const lid = useId().replace(/:/g, "");
  const fillId = `labsFill-${lid}`;
  return (
    <PanelShell label="Lab trends" scanDelay={scanDelay}>
      <div className="flex min-h-0 flex-1 flex-col justify-end">
        <div className="min-h-0 flex-1">
        <svg
          className="hero-hcp-labs-wave h-full w-full min-h-[1.25rem]"
          viewBox="0 0 100 36"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <defs>
            <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
              <stop offset="100%" stopColor={accent} stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path
            d="M0 28 L12 22 L24 26 L38 12 L52 18 L66 8 L80 14 L100 6 L100 36 L0 36 Z"
            fill={`url(#${fillId})`}
            stroke="none"
          />
          <path
            d="M0 28 L12 22 L24 26 L38 12 L52 18 L66 8 L80 14 L100 6"
            fill="none"
            stroke={accentDeep}
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="hero-hcp-labs-stroke"
          />
        </svg>
        </div>
        <div className="mt-[0.1rem] flex justify-between px-[0.1rem]">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="h-[0.14rem] w-[0.14rem] shrink-0 rounded-full"
              style={{ background: i === 2 ? accent : line }}
            />
          ))}
        </div>
      </div>
    </PanelShell>
  );
}

/** Capsule “pills” only — color + proportion, almost no text */
function MedsPanel({ scanDelay }: { scanDelay: number }) {
  const caps = [
    { w: "78%", bg: `linear-gradient(90deg, ${accentSoft}, rgba(255,255,255,0.5))` },
    { w: "62%", bg: `linear-gradient(90deg, rgba(30,52,58,0.2), rgba(255,255,255,0.45))` },
    { w: "88%", bg: `linear-gradient(90deg, ${ok}, rgba(255,255,255,0.4))` },
  ];
  return (
    <PanelShell label="Active medications" scanDelay={scanDelay}>
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-[0.22rem]">
        {caps.map((c, i) => (
          <div
            key={i}
            className="hero-hcp-float flex h-[22%] max-h-[0.55rem] min-h-[0.38rem] items-center rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
            style={{
              width: c.w,
              background: c.bg,
              animationDelay: `${i * 0.18}s`,
            }}
          >
            <span
              className="mx-auto h-[0.16rem] w-[28%] rounded-full opacity-50"
              style={{ background: ink }}
            />
          </div>
        ))}
      </div>
    </PanelShell>
  );
}

/** Stacked horizontal “risk” bars — icon strip */
function ProblemsPanel({ scanDelay }: { scanDelay: number }) {
  const bars = [0.92, 0.65, 0.4];
  return (
    <PanelShell label="Problem list overview" scanDelay={scanDelay}>
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-[0.2rem]">
        <div className="mb-[0.08rem] flex justify-center gap-[0.12rem]">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="hero-hcp-prob-flag inline-block h-[0.26rem] w-[0.26rem] rounded-sm"
              style={{
                background: i === 0 ? accent : i === 1 ? accentSoft : line,
                transform: `rotate(${45 + i * 15}deg)`,
              }}
            />
          ))}
        </div>
        {bars.map((w, i) => (
          <div
            key={i}
            className="hero-hcp-line-grow h-[0.2rem] overflow-hidden rounded-full"
            style={{
              width: `${w * 100}%`,
              marginLeft: i === 1 ? "8%" : i === 2 ? "16%" : "0",
              background: `linear-gradient(90deg, ${accentDeep}, ${accent})`,
              opacity: 0.55 + i * 0.12,
              animationDelay: `${i * 0.22}s`,
            }}
          />
        ))}
      </div>
    </PanelShell>
  );
}

/** Vertical spine + event nodes — graphic timeline */
function TimelinePanel({ scanDelay }: { scanDelay: number }) {
  return (
    <PanelShell label="Encounter timeline" scanDelay={scanDelay}>
      <div className="relative flex min-h-0 flex-1 items-stretch justify-center gap-[0.15rem] pl-[8%] pr-[4%]">
        <div
          className="hero-hcp-timeline-spine absolute bottom-[8%] left-[22%] top-[8%] w-[0.1rem] rounded-full"
          style={{ background: line }}
        />
        <div className="relative z-[2] flex flex-1 flex-col justify-between py-[4%]">
          {[
            { c: accent, r: 0.38 },
            { c: accentSoft, r: 0.28 },
            { c: line, r: 0.22 },
          ].map((n, i) => (
            <div key={i} className="flex items-center gap-[0.18rem]">
              <span
                className="hero-hcp-tl-node z-[3] shrink-0 rounded-full border-2"
                style={{
                  width: "min(22%, 0.42rem)",
                  height: "min(22%, 0.42rem)",
                  borderColor: surfaceDeep,
                  background: n.c,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
                }}
              />
              <div
                className="hero-hcp-spark h-[0.12rem] flex-1 rounded-full"
                style={{
                  background: line,
                  maxWidth: `${60 + i * 12}%`,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </PanelShell>
  );
}

/** Check glyphs + row stripes */
function OrdersPanel({ scanDelay }: { scanDelay: number }) {
  return (
    <PanelShell label="Orders queue" scanDelay={scanDelay}>
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-[0.18rem] px-[0.08rem]">
        {[1, 0, 1].map((done, i) => (
          <div key={i} className="flex items-center gap-[0.2rem]">
            <svg
              className="hero-hcp-check shrink-0"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              aria-hidden
              style={{ animationDelay: `${i * 0.16}s` }}
            >
              <rect
                x="1.5"
                y="1.5"
                width="11"
                height="11"
                rx="2.5"
                fill={done ? accentSoft : "transparent"}
                stroke={line}
                strokeWidth="1.2"
              />
              {done ? (
                <path
                  d="M3.5 7 L6 9.5 L10.5 4.5"
                  fill="none"
                  stroke={accentDeep}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : null}
            </svg>
            <div
              className="hero-hcp-bar-wave h-[0.14rem] flex-1 rounded-full"
              style={{
                background: `linear-gradient(90deg, ${line}, rgba(30,52,58,0.08))`,
                animationDelay: `${i * 0.12}s`,
              }}
            />
          </div>
        ))}
      </div>
    </PanelShell>
  );
}

const HERO_CHART_STACK: { Panel: (p: { scanDelay: number }) => ReactElement; scan: number }[] = [
  { Panel: VitalsPanel, scan: 0 },
  { Panel: LabsPanel, scan: 200 },
  { Panel: MedsPanel, scan: 100 },
  { Panel: ProblemsPanel, scan: 320 },
  { Panel: TimelinePanel, scan: 440 },
  { Panel: OrdersPanel, scan: 160 },
];

export function HeroChartPanels({ staggerMs }: { staggerMs: number[] | null }) {
  return (
    <div
      className="pointer-events-none mx-auto w-full max-w-[min(90vw,28rem)] select-none sm:max-w-[min(88vw,30rem)]"
      aria-hidden
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gridTemplateRows: "repeat(2, minmax(0, 1fr))",
        gap: "clamp(7px, 1.6vmin, 12px)",
        aspectRatio: "3 / 2",
      }}
    >
      {HERO_CHART_STACK.map(({ Panel, scan }, i) => (
        <div
          key={i}
          className={`relative isolate min-h-0 min-w-0 overflow-hidden motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:opacity-100 ${
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
