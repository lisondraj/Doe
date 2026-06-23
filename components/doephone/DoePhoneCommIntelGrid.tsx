"use client";

import { BLOG_LANDING_HERO } from "@/lib/blog/blog-landing-hero-colors";
import {
  DOEPHONE_SECTION_CAROUSEL_INSET_X,
  DOEPHONE_SECTION_CAROUSEL_RADIUS,
} from "@/lib/doephone/section-styles";

const B = BLOG_LANDING_HERO;

/* ─── Gradient cell definitions (corners + center, 5 cells) ─── */
const GRADIENT_DESIGNS = [
  {
    label: "Triage",
    gradient:
      "radial-gradient(circle at 45% 42%, #D4893F 0%, #D2774C 38%, #BF593D 62%, #1E343A 100%)",
    overlay: "dot" as const,
  },
  {
    label: "Routing",
    gradient:
      "linear-gradient(135deg, #D49D4F 0%, #D2774C 44%, #C47A5A 72%, #1E343A 100%)",
    overlay: "crosshatch" as const,
  },
  {
    label: "Autochart",
    gradient:
      "radial-gradient(ellipse 110% 95% at 50% 58%, #D49D4F 0%, #D2774C 46%, #8B4F38 80%, #1E343A 100%)",
    overlay: "rings" as const,
  },
  {
    label: "Voice",
    gradient:
      "linear-gradient(152deg, #C47A5A 0%, #D2774C 36%, #D49D4F 72%, #1E343A 100%)",
    overlay: "diagonal" as const,
  },
  {
    label: "Prior Auth",
    gradient:
      "linear-gradient(200deg, #D49D4F 0%, #BF593D 48%, #1E343A 100%)",
    overlay: "wave" as const,
  },
] as const;

const BEIGE_DESIGNS = [
  { label: "Intake" },
  { label: "Referrals" },
  { label: "Lab Orders" },
  { label: "Scheduling" },
] as const;

/* ─── Grid order: 0,2,4,6,8 → gradient; 1,3,5,7 → beige ─── */
const GRID_META = [
  { kind: "gradient" as const, design: 0 },
  { kind: "beige" as const, design: 0 },
  { kind: "gradient" as const, design: 1 },
  { kind: "beige" as const, design: 1 },
  { kind: "gradient" as const, design: 2 },
  { kind: "beige" as const, design: 2 },
  { kind: "gradient" as const, design: 3 },
  { kind: "beige" as const, design: 3 },
  { kind: "gradient" as const, design: 4 },
];

/* ─── SVG overlay for gradient cells ─── */
function GradientOverlay({ kind }: { kind: typeof GRADIENT_DESIGNS[number]["overlay"] }) {
  const stroke = "rgba(255,255,255,0.16)";
  const sw = "0.9";
  if (kind === "dot") {
    const pts: [number, number][] = [];
    for (let r = 0; r <= 5; r++) for (let c = 0; c <= 5; c++) pts.push([c * 20, r * 20]);
    return (
      <svg viewBox="0 0 100 100" fill="none" className="absolute inset-0 h-full w-full" aria-hidden>
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={1.4} fill={stroke} />
        ))}
      </svg>
    );
  }
  if (kind === "crosshatch") {
    const lines = [-20, 0, 20, 40, 60, 80, 100, 120];
    return (
      <svg viewBox="0 0 100 100" fill="none" className="absolute inset-0 h-full w-full" aria-hidden>
        {lines.map((d, i) => (
          <line key={`a${i}`} x1={d} y1={-10} x2={d + 110} y2={120} stroke={stroke} strokeWidth={sw} />
        ))}
        {lines.map((d, i) => (
          <line key={`b${i}`} x1={110 - d} y1={-10} x2={-d} y2={120} stroke={stroke} strokeWidth={sw} />
        ))}
      </svg>
    );
  }
  if (kind === "rings") {
    return (
      <svg viewBox="0 0 100 100" fill="none" className="absolute inset-0 h-full w-full" aria-hidden>
        {[18, 32, 46, 62, 78].map((r) => (
          <circle key={r} cx={50} cy={50} r={r} stroke={stroke} strokeWidth={sw} />
        ))}
      </svg>
    );
  }
  if (kind === "diagonal") {
    const xs = [-20, 0, 16, 32, 48, 64, 80, 96, 112];
    return (
      <svg viewBox="0 0 100 100" fill="none" className="absolute inset-0 h-full w-full" aria-hidden>
        {xs.map((x, i) => (
          <line key={i} x1={x} y1={-5} x2={x + 80} y2={105} stroke={stroke} strokeWidth={sw} />
        ))}
      </svg>
    );
  }
  /* wave */
  const waveYs = [16, 32, 48, 64, 80];
  return (
    <svg viewBox="0 0 100 100" fill="none" className="absolute inset-0 h-full w-full" aria-hidden>
      {waveYs.map((y, i) => (
        <path
          key={i}
          d={`M -5,${y} C 15,${y - 6} 25,${y + 6} 50,${y} C 75,${y - 6} 85,${y + 6} 105,${y}`}
          stroke={stroke}
          strokeWidth={sw}
        />
      ))}
    </svg>
  );
}

/* ─── SVG line art for beige cells ─── */
function BeigeLineArt({ design }: { design: number }) {
  const main = B.line;
  const soft = B.lineSoft;
  const sw = "0.85";
  const swSoft = "0.7";

  if (design === 0) {
    /* Dense diagonal parallels — NW→SE */
    const offsets = [-70, -56, -42, -28, -14, 0, 14, 28, 42, 56, 70, 84, 98, 112, 126];
    return (
      <svg viewBox="0 0 100 100" fill="none" className="absolute inset-0 h-full w-full" aria-hidden>
        {offsets.map((o, i) => (
          <line
            key={i}
            x1={o}
            y1={0}
            x2={o + 100}
            y2={100}
            stroke={i % 3 === 1 ? main : soft}
            strokeWidth={i % 3 === 1 ? sw : swSoft}
          />
        ))}
      </svg>
    );
  }

  if (design === 1) {
    /* Concentric arcs from top-right corner */
    const radii = [18, 34, 52, 70, 90, 110, 130];
    return (
      <svg viewBox="0 0 100 100" fill="none" className="absolute inset-0 h-full w-full" aria-hidden>
        {radii.map((r, i) => (
          <path
            key={r}
            d={`M ${100 - r},0 A ${r},${r} 0 0 1 100,${r}`}
            stroke={i % 2 === 0 ? main : soft}
            strokeWidth={sw}
          />
        ))}
      </svg>
    );
  }

  if (design === 2) {
    /* Horizontal wave lines across */
    const ys = [14, 24, 34, 44, 54, 64, 74, 84];
    return (
      <svg viewBox="0 0 100 100" fill="none" className="absolute inset-0 h-full w-full" aria-hidden>
        {ys.map((y, i) => {
          const amp = i % 2 === 0 ? 4 : 3;
          return (
            <path
              key={y}
              d={`M -5,${y} C 10,${y - amp} 20,${y + amp} 35,${y} C 50,${y - amp} 65,${y + amp} 80,${y} C 90,${y - amp} 100,${y + amp} 105,${y}`}
              stroke={i % 3 === 0 ? main : soft}
              strokeWidth={i % 3 === 0 ? sw : swSoft}
            />
          );
        })}
      </svg>
    );
  }

  /* design 3 — vertical parallel lines, slight gap variation */
  const xs = [10, 20, 30, 40, 50, 60, 70, 80, 90];
  return (
    <svg viewBox="0 0 100 100" fill="none" className="absolute inset-0 h-full w-full" aria-hidden>
      {xs.map((x, i) => (
        <line
          key={x}
          x1={x}
          y1={0}
          x2={x}
          y2={100}
          stroke={i % 2 === 0 ? main : soft}
          strokeWidth={i % 2 === 0 ? sw : swSoft}
        />
      ))}
    </svg>
  );
}

/* ─── Individual cell components ─── */
function GradientCell({ designIdx }: { designIdx: number }) {
  const d = GRADIENT_DESIGNS[designIdx];
  return (
    <div
      className={`relative aspect-square overflow-hidden ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
      style={{ background: d.gradient }}
    >
      <GradientOverlay kind={d.overlay} />
      <span
        className="absolute bottom-[8%] left-[10%] z-10 text-[clamp(0.48rem,1.8vmin,0.68rem)] font-normal uppercase tracking-[0.07em] text-white/70"
        aria-label={d.label}
      >
        {d.label}
      </span>
    </div>
  );
}

function BeigeCell({ designIdx }: { designIdx: number }) {
  const d = BEIGE_DESIGNS[designIdx];
  return (
    <div
      className={`relative aspect-square overflow-hidden ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
      style={{
        background: B.fill,
        border: `1px solid ${B.border}`,
      }}
    >
      <BeigeLineArt design={designIdx} />
      <span
        className="absolute bottom-[8%] left-[10%] z-10 text-[clamp(0.48rem,1.8vmin,0.68rem)] font-normal uppercase tracking-[0.07em]"
        style={{ color: B.focal }}
        aria-label={d.label}
      >
        {d.label}
      </span>
    </div>
  );
}

/* ─── Public grid component ─── */
export function DoePhoneCommIntelGrid() {
  return (
    <div className={DOEPHONE_SECTION_CAROUSEL_INSET_X}>
      <div className="grid w-full grid-cols-3 gap-[clamp(0.5rem,1.3vmin,0.85rem)]">
        {GRID_META.map((cell, i) =>
          cell.kind === "gradient" ? (
            <GradientCell key={i} designIdx={cell.design} />
          ) : (
            <BeigeCell key={i} designIdx={cell.design} />
          ),
        )}
      </div>
    </div>
  );
}
