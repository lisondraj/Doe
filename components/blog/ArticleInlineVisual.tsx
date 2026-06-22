import { BLOG_FEATURE_BOX_TW } from "@/lib/blog/blog-layout-styles";
import { BLOG_LANDING_HERO } from "@/lib/blog/blog-landing-hero-colors";

const { lineSoft, line, lineStrong, accent, accentWarm, focal } = BLOG_LANDING_HERO;

/* ──────────────────────────────────────────────────────────────
   Design 0 — Engineering / Code Intelligence
   Clean node-edge network graph: 9 nodes in a deliberate layout
   connected by edges. Suggests a dependency graph or knowledge map.
────────────────────────────────────────────────────────────── */
function Design0() {
  // Node positions — hub at center, 6 outer, 2 mid-tier
  const nodes: [number, number][] = [
    [200, 200], // 0 hub (center)
    [200,  88], // 1 top
    [306, 144], // 2 top-right
    [306, 256], // 3 bottom-right
    [200, 312], // 4 bottom
    [ 94, 256], // 5 bottom-left
    [ 94, 144], // 6 top-left
    [200, 152], // 7 inner-top (between hub and 1)
    [200, 248], // 8 inner-bottom
  ];

  // Edges: pairs of node indices
  const edges: [number, number][] = [
    [0, 7], [7, 1],        // hub → inner-top → top
    [0, 8], [8, 4],        // hub → inner-bottom → bottom
    [0, 2], [0, 3],        // hub → right cluster
    [0, 5], [0, 6],        // hub → left cluster
    [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 1], // outer ring
    [7, 2], [7, 6],        // inner-top connects laterally
    [8, 3], [8, 5],        // inner-bottom connects laterally
  ];

  return (
    <svg viewBox="0 0 400 400" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden className="absolute inset-0 h-full w-full">
      {/* Edges */}
      {edges.map(([a, b], i) => (
        <line
          key={`e-${i}`}
          x1={nodes[a][0]} y1={nodes[a][1]}
          x2={nodes[b][0]} y2={nodes[b][1]}
          stroke={a === 0 || b === 0 ? line : lineSoft}
          strokeWidth={a === 0 || b === 0 ? "0.85" : "0.65"}
        />
      ))}
      {/* Outer nodes */}
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <circle key={`n-${i}`} cx={nodes[i][0]} cy={nodes[i][1]} r="5" stroke={lineStrong} strokeWidth="0.75" fill="transparent" />
      ))}
      {/* Inner-tier nodes */}
      {[7, 8].map((i) => (
        <circle key={`n-${i}`} cx={nodes[i][0]} cy={nodes[i][1]} r="3.5" fill={line} />
      ))}
      {/* Hub */}
      <circle cx={nodes[0][0]} cy={nodes[0][1]} r="9"   stroke={lineStrong} strokeWidth="0.9" fill={`${accentWarm}22`} />
      <circle cx={nodes[0][0]} cy={nodes[0][1]} r="3.5" fill={accentWarm} />
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────
   Design 1 — Clinical / Ambient Documentation
   Gentle stacked arcs like quiet breathing or a resting pulse —
   calm, human, organic.
────────────────────────────────────────────────────────────── */
function Design1() {
  const arcs = [
    { rx: 55,  ry: 28,  stroke: lineSoft,   sw: "0.7" },
    { rx: 85,  ry: 42,  stroke: lineSoft,   sw: "0.75" },
    { rx: 118, ry: 58,  stroke: line,       sw: "0.8" },
    { rx: 155, ry: 76,  stroke: line,       sw: "0.85" },
    { rx: 195, ry: 96,  stroke: lineStrong, sw: "0.9" },
    { rx: 238, ry: 118, stroke: lineStrong, sw: "0.85" },
    { rx: 284, ry: 142, stroke: line,       sw: "0.8" },
    { rx: 332, ry: 168, stroke: lineSoft,   sw: "0.7" },
  ];
  const cx = 200;
  const cy = 390;
  return (
    <svg viewBox="0 0 400 400" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden className="absolute inset-0 h-full w-full">
      {arcs.map((a, i) => (
        <ellipse
          key={i}
          cx={cx} cy={cy}
          rx={a.rx} ry={a.ry}
          stroke={a.stroke} strokeWidth={a.sw}
        />
      ))}
      {/* Two accent dots at the top of the innermost and outermost arcs */}
      <circle cx={cx} cy={cy - 28}  r="2.5" fill={accentWarm} />
      <circle cx={cx} cy={cy - 168} r="2"   fill={lineSoft}   />
      <circle cx={cx - 284} cy={cy} r="2"   fill={line}       />
      <circle cx={cx + 284} cy={cy} r="2"   fill={line}       />
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────
   Design 2 — Revenue Cycle / Prior Auth
   Concentric rounded rectangles expanding outward from center —
   like a scan, target, or review process closing in. Clean, precise.
────────────────────────────────────────────────────────────── */
function Design2() {
  const cx = 200;
  const cy = 200;

  // Each level: [half-width, half-height, rx, stroke-color, stroke-width]
  const levels: [number, number, number, string, string][] = [
    [ 22,  16,  5, focal,      "0.9"],
    [ 50,  38,  8, lineStrong, "0.8"],
    [ 90,  67, 12, line,       "0.75"],
    [132,  98, 16, line,       "0.7"],
    [174, 128, 20, lineSoft,   "0.65"],
    [216, 158, 24, lineSoft,   "0.55"],
  ];

  // Corner dots on outermost rect
  const [ow, oh] = [216, 158];
  const cornerDots = [
    { x: cx - ow, y: cy - oh },
    { x: cx + ow, y: cy - oh },
    { x: cx + ow, y: cy + oh },
    { x: cx - ow, y: cy + oh },
  ];

  // Mid-side ticks on outermost rect (short perpendicular lines inside the edge)
  const midTicks = [
    { x1: cx,      y1: cy - oh, x2: cx,      y2: cy - oh + 10 }, // top
    { x1: cx,      y1: cy + oh, x2: cx,      y2: cy + oh - 10 }, // bottom
    { x1: cx - ow, y1: cy,      x2: cx - ow + 10, y2: cy },      // left
    { x1: cx + ow, y1: cy,      x2: cx + ow - 10, y2: cy },      // right
  ];

  return (
    <svg viewBox="0 0 400 400" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden className="absolute inset-0 h-full w-full">
      {levels.map(([hw, hh, rx, stroke, sw], i) => (
        <rect
          key={i}
          x={cx - hw} y={cy - hh}
          width={hw * 2} height={hh * 2}
          rx={rx}
          stroke={stroke} strokeWidth={sw}
        />
      ))}
      {/* Corner dots */}
      {cornerDots.map(({ x, y }, i) => (
        <circle key={`cd-${i}`} cx={x} cy={y} r="2.5" fill={lineSoft} />
      ))}
      {/* Mid-side ticks */}
      {midTicks.map((t, i) => (
        <line key={`mt-${i}`} {...t} stroke={lineStrong} strokeWidth="0.75" strokeLinecap="round" />
      ))}
      {/* Center dot */}
      <circle cx={cx} cy={cy} r="3.5" fill={focal} />
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────
   Design 3 — Messaging / One Inbox
   Many parallel lines converging from both sides to a narrow
   channel at center — multiple channels becoming one.
────────────────────────────────────────────────────────────── */
function Design3() {
  const cy = 200;
  const gapAt200 = 6;
  const lines = [
    -60, -48, -36, -26, -17, -9, -3, 0, 3, 9, 17, 26, 36, 48, 60,
  ];
  return (
    <svg viewBox="0 0 400 400" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden className="absolute inset-0 h-full w-full">
      {lines.map((offset, i) => {
        const yAtEdge = cy + offset;
        const yAtCenter = cy + (offset > 0 ? gapAt200 : offset < 0 ? -gapAt200 : 0) * (Math.abs(offset) / 60);
        const isCenter = i === 7;
        const col = isCenter ? accent : Math.abs(offset) > 30 ? lineSoft : i % 3 === 0 ? lineStrong : line;
        const sw = isCenter ? "1" : Math.abs(offset) > 40 ? "0.6" : "0.75";
        return (
          <path
            key={i}
            d={`M 28,${yAtEdge} C 120,${yAtEdge} 160,${yAtCenter} 200,${yAtCenter} C 240,${yAtCenter} 280,${yAtEdge} 372,${yAtEdge}`}
            stroke={col} strokeWidth={sw}
          />
        );
      })}
      {/* Focal rect at center */}
      <rect x="194" y={cy - 5} width="12" height="10" rx="2" fill={focal} />
      {/* Dot markers at edges */}
      <circle cx="28"  cy={cy - 60} r="2"   fill={lineSoft}  />
      <circle cx="28"  cy={cy + 60} r="2"   fill={lineSoft}  />
      <circle cx="372" cy={cy - 60} r="2"   fill={lineSoft}  />
      <circle cx="372" cy={cy + 60} r="2"   fill={lineSoft}  />
      <circle cx="28"  cy={cy}      r="2.5" fill={accentWarm}/>
      <circle cx="372" cy={cy}      r="2.5" fill={accentWarm}/>
    </svg>
  );
}

const DESIGNS = [Design0, Design1, Design2, Design3];

export function ArticleInlineVisual({ design }: { design: number }) {
  const Graphic = DESIGNS[design % DESIGNS.length];
  return (
    <div
      className={`relative w-full overflow-hidden ${BLOG_FEATURE_BOX_TW} border border-[#D9D4CC] bg-[#EBE7E0]`}
    >
      <Graphic />
    </div>
  );
}
