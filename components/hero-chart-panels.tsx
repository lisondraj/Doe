"use client";

import type { ReactElement, ReactNode } from "react";
import { useId } from "react";

/** Hero / chart UI — warm slate + amber, matches Doe gradient hero */
const ink = "rgba(30, 52, 58, 0.9)";
const line = "rgba(30, 52, 58, 0.16)";
const accent = "#c96a45";
const accentDeep = "#9a4d32";
const accentSoft = "rgba(201, 106, 69, 0.5)";
const surface = "rgba(255, 249, 242, 0.98)";
const surfaceDeep = "rgba(255, 255, 255, 0.72)";
const ok = "rgba(46, 125, 95, 0.65)";
const mutedColor = "rgba(30, 52, 58, 0.5)";

/** Square cell track — same length for columns & rows = rounded squares */
const CELL =
  "clamp(3.4rem, min(16vw, 11vmin), 6.75rem)";

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
      className="relative flex h-full w-full flex-col overflow-hidden p-[clamp(5px,12%,9px)] shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_3px_14px_rgba(26,46,52,0.16)]"
      style={{
        background: `linear-gradient(168deg, ${surface} 0%, rgba(252, 246, 238, 0.99) 55%, rgba(248, 238, 228, 0.98) 100%)`,
        border: `1.5px solid ${surfaceDeep}`,
        borderRadius: "clamp(14px, 22%, 26px)",
      }}
    >
      <div
        className="hero-hcp-scan pointer-events-none absolute inset-0"
        style={{
          animationDelay: `${scanDelay}ms`,
          borderRadius: "inherit",
        }}
        aria-hidden
      />
      <div className="relative z-[1] flex min-h-0 min-w-0 flex-1 flex-col overflow-visible">{children}</div>
    </div>
  );
}

/** Three ring gauges — clear vertical stack per column */
function VitalsPanel({ scanDelay }: { scanDelay: number }) {
  const gauges = [
    { pct: 72, line1: "122", line2: "/78", micro: "BP" },
    { pct: 52, line1: "68", line2: "", micro: "HR" },
    { pct: 88, line1: "98", line2: "%", micro: "SpO₂" },
  ];
  return (
    <PanelShell label="Vitals summary" scanDelay={scanDelay}>
      <div className="flex min-h-0 flex-1 items-stretch justify-between gap-[0.12rem] overflow-visible">
        {gauges.map((g) => (
          <div
            key={g.micro}
            className="flex min-w-0 flex-1 flex-col items-center justify-center gap-[0.12rem] overflow-visible"
          >
            <span
              className="shrink-0 whitespace-nowrap text-center font-bold uppercase leading-none tracking-wide"
              style={{
                color: mutedColor,
                fontSize: "clamp(0.32rem, 1.05vmin, 0.48rem)",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              {g.micro}
            </span>
            <div className="relative aspect-square w-[min(58%,2.35rem)] shrink-0">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(${accent} 0 ${g.pct * 3.6}deg, ${line} ${g.pct * 3.6}deg 360deg)`,
                }}
              />
              <div
                className="absolute inset-[12%] flex flex-col items-center justify-center rounded-full"
                style={{ background: surface }}
              >
                <span
                  className="whitespace-nowrap text-center font-bold tabular-nums leading-none"
                  style={{
                    color: ink,
                    fontSize: "clamp(0.42rem, 1.25vmin, 0.68rem)",
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  {g.line1}
                  <span style={{ color: mutedColor, fontSize: "0.78em" }}>{g.line2}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PanelShell>
  );
}

function LabsPanel({ scanDelay }: { scanDelay: number }) {
  const lid = useId().replace(/:/g, "");
  const fillId = `labsFill-${lid}`;
  return (
    <PanelShell label="Lab trends" scanDelay={scanDelay}>
      <div className="flex min-h-0 flex-1 flex-col justify-between gap-[0.08rem]">
        <svg
          className="hero-hcp-labs-wave min-h-[40%] w-full flex-1 overflow-visible"
          viewBox="0 0 100 44"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <defs>
            <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accent} stopOpacity="0.42" />
              <stop offset="100%" stopColor={accent} stopOpacity="0.04" />
            </linearGradient>
          </defs>
          {[8, 22, 36, 50, 64, 78, 92].map((x) => (
            <line
              key={x}
              x1={x}
              y1="34"
              x2={x}
              y2="38"
              stroke={line}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          ))}
          <path
            d="M4 30 L16 24 L28 28 L40 14 L52 20 L64 10 L76 16 L96 8 L96 40 L4 40 Z"
            fill={`url(#${fillId})`}
            stroke="none"
          />
          <path
            d="M4 30 L16 24 L28 28 L40 14 L52 20 L64 10 L76 16 L96 8"
            fill="none"
            stroke={accentDeep}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="hero-hcp-labs-stroke"
          />
        </svg>
        <div className="flex shrink-0 justify-between px-[0.15rem]">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="h-[0.2rem] w-[0.2rem] shrink-0 rounded-full"
              style={{ background: i === 2 ? accent : line }}
            />
          ))}
        </div>
      </div>
    </PanelShell>
  );
}

/** Three bold capsules + pill icons */
function MedsPanel({ scanDelay }: { scanDelay: number }) {
  const caps = [
    { w: "88%", border: accentDeep, bg: `linear-gradient(135deg, ${accentSoft}, rgba(255,255,255,0.55))` },
    { w: "72%", border: "rgba(30,52,58,0.35)", bg: `linear-gradient(135deg, rgba(30,52,58,0.12), rgba(255,255,255,0.55))` },
    { w: "94%", border: ok, bg: `linear-gradient(135deg, rgba(46,125,95,0.35), rgba(255,255,255,0.5))` },
  ];
  return (
    <PanelShell label="Active medications" scanDelay={scanDelay}>
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-[min(10%,0.38rem)] py-[2%]">
        {caps.map((c, i) => (
          <div
            key={i}
            className="hero-hcp-float flex items-center justify-center rounded-full border-[1.5px] shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
            style={{
              width: c.w,
              height: "max(0.44rem, min(20%, 0.58rem))",
              borderColor: c.border,
              background: c.bg,
              animationDelay: `${i * 0.18}s`,
            }}
          >
            <span className="flex gap-[0.14rem]">
              <span className="block h-[0.18rem] w-[0.18rem] rounded-full" style={{ background: accentDeep }} />
              <span className="block h-[0.18rem] w-[0.32rem] rounded-full opacity-60" style={{ background: ink }} />
            </span>
          </div>
        ))}
      </div>
    </PanelShell>
  );
}

/** Heat strip + severity diamonds */
function ProblemsPanel({ scanDelay }: { scanDelay: number }) {
  const bars = [0.94, 0.7, 0.48];
  return (
    <PanelShell label="Problem list overview" scanDelay={scanDelay}>
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-[min(8%,0.28rem)] py-[2%]">
        <div className="flex shrink-0 justify-center gap-[0.22rem]">
          {[accent, accentSoft, line].map((bg, i) => (
            <span
              key={i}
              className="hero-hcp-prob-flag inline-block h-[0.36rem] w-[0.36rem] rotate-45 rounded-[2px] shadow-sm"
              style={{ background: bg, animationDelay: `${i * 0.12}s` }}
            />
          ))}
        </div>
        <div
          className="flex flex-1 flex-col justify-center gap-[0.18rem]"
          style={{
            background: `linear-gradient(180deg, transparent, ${accentSoft})`,
            borderRadius: "10px",
            padding: "6% 4%",
          }}
        >
          {bars.map((w, i) => (
            <div
              key={i}
              className="hero-hcp-line-grow h-[min(14%,0.34rem)] min-h-[0.26rem] overflow-hidden rounded-full"
              style={{
                width: `${w * 100}%`,
                marginLeft: i === 1 ? "6%" : i === 2 ? "12%" : "0",
                background: `linear-gradient(90deg, ${accentDeep}, ${accent})`,
                opacity: 0.62 + i * 0.1,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </PanelShell>
  );
}

/** Timeline — nodes column + gradient event bars */
function TimelinePanel({ scanDelay }: { scanDelay: number }) {
  return (
    <PanelShell label="Encounter timeline" scanDelay={scanDelay}>
      <div className="flex min-h-0 flex-1 items-stretch gap-[7%] px-[5%] py-[6%]">
        <div className="flex w-[28%] flex-col items-center justify-between py-[2%]">
          {[accent, accentSoft, line].map((c, i) => (
            <span
              key={i}
              className="hero-hcp-tl-node rounded-full border-[2.5px] shadow-[0_2px_6px_rgba(0,0,0,0.12)]"
              style={{
                width: "clamp(0.32rem, 26%, 0.5rem)",
                height: "clamp(0.32rem, 26%, 0.5rem)",
                borderColor: surfaceDeep,
                background: c,
              }}
            />
          ))}
        </div>
        <div className="relative flex min-w-0 flex-1 flex-col justify-center gap-[14%]">
          <div
            className="hero-hcp-timeline-spine absolute bottom-[8%] left-0 top-[8%] w-[0.12rem] rounded-full opacity-80"
            style={{ background: line }}
          />
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="hero-hcp-spark relative z-[1] ml-[12%] h-[min(16%,0.32rem)] min-h-[0.24rem] rounded-full"
              style={{
                width: `${58 + i * 14}%`,
                background: `linear-gradient(90deg, ${accent}, ${accentSoft}, rgba(255,255,255,0.25))`,
                animationDelay: `${i * 0.14}s`,
              }}
            />
          ))}
        </div>
      </div>
    </PanelShell>
  );
}

function OrdersPanel({ scanDelay }: { scanDelay: number }) {
  return (
    <PanelShell label="Orders queue" scanDelay={scanDelay}>
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-[min(10%,0.36rem)] px-[6%] py-[4%]">
        {[1, 0, 1].map((done, i) => (
          <div key={i} className="flex items-center gap-[0.24rem]">
            <svg
              className="hero-hcp-check shrink-0"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              aria-hidden
              style={{ animationDelay: `${i * 0.14}s` }}
            >
              <rect
                x="2"
                y="2"
                width="14"
                height="14"
                rx="4"
                fill={done ? accentSoft : "rgba(255,255,255,0.35)"}
                stroke={line}
                strokeWidth="1.4"
              />
              {done ? (
                <path
                  d="M4.5 9 L8 12.5 L13.5 5.5"
                  fill="none"
                  stroke={accentDeep}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : null}
            </svg>
            <div
              className="hero-hcp-bar-wave h-[min(12%,0.26rem)] min-h-[0.22rem] flex-1 rounded-full"
              style={{
                background: done
                  ? `linear-gradient(90deg, ${accentSoft}, rgba(30,52,58,0.06))`
                  : `linear-gradient(90deg, ${line}, rgba(30,52,58,0.04))`,
                animationDelay: `${i * 0.1}s`,
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
  const gap = "clamp(8px, 1.8vmin, 14px)";
  return (
    <div
      className="pointer-events-none mx-auto w-fit max-w-[100%] select-none"
      aria-hidden
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(3, ${CELL})`,
        gridTemplateRows: `repeat(2, ${CELL})`,
        gap,
      }}
    >
      {HERO_CHART_STACK.map(({ Panel, scan }, i) => (
        <div
          key={i}
          className={`relative isolate box-border overflow-visible motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:opacity-100 ${
            staggerMs ? "hero-tile-rise" : "translate-y-3 scale-[0.92] opacity-0"
          }`}
          style={staggerMs ? { animationDelay: `${staggerMs[i]}ms` } : undefined}
        >
          <div className="h-full w-full min-h-0 min-w-0">
            <Panel scanDelay={scan} />
          </div>
        </div>
      ))}
    </div>
  );
}
