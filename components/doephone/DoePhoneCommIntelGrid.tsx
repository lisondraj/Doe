"use client";

import { BLOG_LANDING_HERO } from "@/lib/blog/blog-landing-hero-colors";

const B = BLOG_LANDING_HERO;

/* Normal row height (~148px at 390px with 20vw extra bleed = 171px wide → 1.15:1 landscape) */
const CELL_H      = "h-[clamp(8.5rem,38vmin,14rem)] min-h-[clamp(8.5rem,38vmin,14rem)]";
/* Top-row cells taller so the fade-in has more physical height to look smooth */
const CELL_H_TALL = "h-[clamp(10.5rem,47vmin,17rem)] min-h-[clamp(10.5rem,47vmin,17rem)]";
const CELL_RADIUS = "rounded-[0.38rem]";

/* ─── Gradient cell definitions ─── */
const GRADIENT_DESIGNS = [
  {
    gradient:
      "radial-gradient(circle at 45% 42%, #D4893F 0%, #D2774C 38%, #BF593D 62%, #1E343A 100%)",
    overlay: "dot" as const,
  },
  {
    gradient:
      "linear-gradient(135deg, #D49D4F 0%, #D2774C 44%, #C47A5A 72%, #1E343A 100%)",
    overlay: "crosshatch" as const,
  },
  {
    gradient:
      "radial-gradient(ellipse 110% 95% at 50% 58%, #D49D4F 0%, #D2774C 46%, #8B4F38 80%, #1E343A 100%)",
    overlay: "rings" as const,
  },
  {
    gradient:
      "linear-gradient(152deg, #C47A5A 0%, #D2774C 36%, #D49D4F 72%, #1E343A 100%)",
    overlay: "diagonal" as const,
  },
  {
    gradient:
      "linear-gradient(200deg, #D49D4F 0%, #BF593D 48%, #1E343A 100%)",
    overlay: "wave" as const,
  },
] as const;

/* ─── Grid order: 0,2,4,6,8 → gradient; 1,3,5,7 → beige; row 0 = tall ─── */
const GRID_META = [
  { kind: "gradient" as const, design: 0, tall: true  },
  { kind: "beige"    as const, design: 0, tall: true  },
  { kind: "gradient" as const, design: 1, tall: true  },
  { kind: "beige"    as const, design: 1, tall: false },
  { kind: "gradient" as const, design: 2, tall: false },
  { kind: "beige"    as const, design: 2, tall: false },
  { kind: "gradient" as const, design: 3, tall: false },
  { kind: "beige"    as const, design: 3, tall: false },
  { kind: "gradient" as const, design: 4, tall: false },
];

/* ─── SVG overlays for gradient cells ─── */
function GradientOverlay({ kind }: { kind: typeof GRADIENT_DESIGNS[number]["overlay"] }) {
  const stroke = "rgba(255,255,255,0.16)";
  const sw = "0.9";

  if (kind === "dot") {
    const pts: [number, number][] = [];
    for (let r = 0; r <= 7; r++) for (let c = 0; c <= 5; c++) pts.push([c * 20, r * 16]);
    return (
      <svg viewBox="0 0 100 112" preserveAspectRatio="none" fill="none" className="absolute inset-0 h-full w-full" aria-hidden>
        {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.3} fill={stroke} />)}
      </svg>
    );
  }
  if (kind === "crosshatch") {
    const lines = [-20, 0, 20, 40, 60, 80, 100, 120];
    return (
      <svg viewBox="0 0 100 160" preserveAspectRatio="none" fill="none" className="absolute inset-0 h-full w-full" aria-hidden>
        {lines.map((d, i) => (
          <line key={`a${i}`} x1={d} y1={-10} x2={d + 170} y2={170} stroke={stroke} strokeWidth={sw} />
        ))}
        {lines.map((d, i) => (
          <line key={`b${i}`} x1={110 - d} y1={-10} x2={-60 - d} y2={170} stroke={stroke} strokeWidth={sw} />
        ))}
      </svg>
    );
  }
  if (kind === "rings") {
    return (
      <svg viewBox="0 0 100 160" preserveAspectRatio="none" fill="none" className="absolute inset-0 h-full w-full" aria-hidden>
        {[20, 38, 58, 78, 100, 124].map((r) => (
          <ellipse key={r} cx={50} cy={80} rx={r} ry={r * 1.2} stroke={stroke} strokeWidth={sw} />
        ))}
      </svg>
    );
  }
  if (kind === "diagonal") {
    const xs = [-20, 0, 16, 32, 48, 64, 80, 96, 112];
    return (
      <svg viewBox="0 0 100 160" preserveAspectRatio="none" fill="none" className="absolute inset-0 h-full w-full" aria-hidden>
        {xs.map((x, i) => (
          <line key={i} x1={x} y1={-5} x2={x + 130} y2={165} stroke={stroke} strokeWidth={sw} />
        ))}
      </svg>
    );
  }
  /* wave */
  const waveYs = [20, 44, 68, 92, 116, 140];
  return (
    <svg viewBox="0 0 100 160" preserveAspectRatio="none" fill="none" className="absolute inset-0 h-full w-full" aria-hidden>
      {waveYs.map((y, i) => (
        <path
          key={i}
          d={`M -5,${y} C 15,${y - 7} 25,${y + 7} 50,${y} C 75,${y - 7} 85,${y + 7} 105,${y}`}
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
    /* Dense diagonal parallels NW→SE, portrait viewBox */
    const offsets = [-90, -72, -54, -36, -18, 0, 18, 36, 54, 72, 90, 108, 126, 144, 162];
    return (
      <svg viewBox="0 0 100 160" preserveAspectRatio="none" fill="none" className="absolute inset-0 h-full w-full" aria-hidden>
        {offsets.map((o, i) => (
          <line key={i} x1={o} y1={0} x2={o + 160} y2={160} stroke={i % 3 === 1 ? main : soft} strokeWidth={i % 3 === 1 ? sw : swSoft} />
        ))}
      </svg>
    );
  }

  if (design === 1) {
    /* Concentric arcs from top-right corner, portrait */
    const radii = [20, 40, 62, 86, 112, 140, 170];
    return (
      <svg viewBox="0 0 100 160" preserveAspectRatio="none" fill="none" className="absolute inset-0 h-full w-full" aria-hidden>
        {radii.map((r, i) => (
          <path key={r} d={`M ${100 - r},0 A ${r},${r} 0 0 1 100,${r}`} stroke={i % 2 === 0 ? main : soft} strokeWidth={sw} />
        ))}
      </svg>
    );
  }

  if (design === 2) {
    /* Horizontal wave lines, portrait */
    const ys = [14, 26, 38, 50, 62, 74, 86, 98, 110, 122, 134, 146];
    return (
      <svg viewBox="0 0 100 160" preserveAspectRatio="none" fill="none" className="absolute inset-0 h-full w-full" aria-hidden>
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

  /* design 3 — vertical lines, portrait */
  const xs = [10, 20, 30, 40, 50, 60, 70, 80, 90];
  return (
    <svg viewBox="0 0 100 160" preserveAspectRatio="none" fill="none" className="absolute inset-0 h-full w-full" aria-hidden>
      {xs.map((x, i) => (
        <line key={x} x1={x} y1={0} x2={x} y2={160} stroke={i % 2 === 0 ? main : soft} strokeWidth={i % 2 === 0 ? sw : swSoft} />
      ))}
    </svg>
  );
}

/* ─── Individual cell components ─── */
function GradientCell({ designIdx, tall }: { designIdx: number; tall: boolean }) {
  const d = GRADIENT_DESIGNS[designIdx];
  const h = tall ? CELL_H_TALL : CELL_H;
  return (
    <div
      className={`relative ${h} overflow-hidden ${CELL_RADIUS}`}
      style={{ background: d.gradient }}
    >
      <GradientOverlay kind={d.overlay} />
    </div>
  );
}

function BeigeCell({ designIdx, tall }: { designIdx: number; tall: boolean }) {
  const h = tall ? CELL_H_TALL : CELL_H;
  return (
    <div
      className={`relative ${h} overflow-hidden ${CELL_RADIUS}`}
      style={{ background: B.fill, border: `1px solid ${B.border}` }}
    >
      <BeigeLineArt design={designIdx} />
    </div>
  );
}

/* ─── Public grid component ─── */
export function DoePhoneCommIntelGrid() {
  return (
    /*
     * Mask and 3D transform on the same element → mask applied to the flat
     * grid BEFORE rotation, so the top fade covers the taller top-row cells
     * smoothly. Vertical-only mask — left/right edges are hard-cut by the
     * section's overflow-hidden, so top corners are cleanly cropped.
     */
    <div
      style={{
        marginLeft: "-20vw",
        marginRight: "-20vw",
        width: "calc(100% + 40vw)",
        transform: "perspective(540px) rotateX(46deg)",
        transformOrigin: "50% 50%",
        transformStyle: "preserve-3d",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 30%, black 80%, transparent 100%)",
        maskImage: "linear-gradient(to bottom, transparent 0%, black 30%, black 80%, transparent 100%)",
      }}
    >
      <div className="grid w-full grid-cols-3 gap-[clamp(0.45rem,1.2vmin,0.75rem)]">
        {GRID_META.map((cell, i) =>
          cell.kind === "gradient" ? (
            <GradientCell key={i} designIdx={cell.design} tall={cell.tall} />
          ) : (
            <BeigeCell key={i} designIdx={cell.design} tall={cell.tall} />
          ),
        )}
      </div>
    </div>
  );
}
