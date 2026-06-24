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
   Diagonal parallel lines sweeping bottom-left to top-right —
   evenly spaced, varying weight and indent, with small terminal
   dots. Same modern/boho language as the landing hero.
────────────────────────────────────────────────────────────── */
function Design2() {
  // Lines defined as [y-at-left-edge, y-at-right-edge, leftX, rightX, color, strokeWidth, opacity]
  // All lines run from (leftX, y_left) to (rightX, y_right)
  // Gentle diagonal: each line rises ~80px from left to right across 400px
  type DiagLine = [number, number, number, number, string, number, number];

  const rise = 80; // px rise across the full width
  const spacing = 22; // vertical spacing between lines at left edge
  const baseY = 330; // bottom-most line left-edge y

  const rows: { leftY: number; leftX: number; rightX: number; col: string; sw: number; op: number }[] = [
    { leftY: baseY -  0, leftX:  0,  rightX: 400, col: lineSoft,   sw: 0.55, op: 0.55 },
    { leftY: baseY - 22, leftX:  0,  rightX: 400, col: lineSoft,   sw: 0.6,  op: 0.62 },
    { leftY: baseY - 44, leftX: 18,  rightX: 400, col: line,       sw: 0.7,  op: 0.7  },
    { leftY: baseY - 66, leftX:  0,  rightX: 382, col: line,       sw: 0.75, op: 0.75 },
    { leftY: baseY - 88, leftX:  0,  rightX: 400, col: lineStrong, sw: 0.8,  op: 0.82 },
    { leftY: baseY -110, leftX: 32,  rightX: 400, col: lineStrong, sw: 0.85, op: 0.88 },
    { leftY: baseY -132, leftX:  0,  rightX: 400, col: lineStrong, sw: 0.85, op: 0.85 },
    { leftY: baseY -154, leftX:  0,  rightX: 368, col: line,       sw: 0.8,  op: 0.78 },
    { leftY: baseY -176, leftX: 20,  rightX: 400, col: line,       sw: 0.7,  op: 0.72 },
    { leftY: baseY -198, leftX:  0,  rightX: 400, col: lineSoft,   sw: 0.65, op: 0.65 },
    { leftY: baseY -220, leftX:  0,  rightX: 390, col: lineSoft,   sw: 0.6,  op: 0.58 },
    { leftY: baseY -242, leftX: 14,  rightX: 400, col: lineSoft,   sw: 0.55, op: 0.52 },
    { leftY: baseY -264, leftX:  0,  rightX: 400, col: lineSoft,   sw: 0.5,  op: 0.45 },
    { leftY: baseY -286, leftX:  0,  rightX: 376, col: lineSoft,   sw: 0.5,  op: 0.38 },
    { leftY: baseY -308, leftX: 22,  rightX: 400, col: lineSoft,   sw: 0.45, op: 0.32 },
    // Accent overlay lines — same diagonals, very light
    { leftY: baseY - 88, leftX:  0,  rightX: 400, col: accentWarm, sw: 0.4,  op: 0.2  },
    { leftY: baseY -176, leftX: 20,  rightX: 400, col: accentWarm, sw: 0.35, op: 0.15 },
  ];

  const dots: { x: number; y: number; r: number; col: string }[] = [
    { x: 18,  y: rows[2].leftY  + 0,           r: 1.8, col: line      },
    { x: 382, y: rows[3].leftY  - rise * 382/400, r: 1.8, col: line    },
    { x: 32,  y: rows[5].leftY  + 0,           r: 2.2, col: lineStrong },
    { x: 368, y: rows[7].leftY  - rise * 368/400, r: 2,  col: lineStrong },
    { x: 20,  y: rows[8].leftY  + 0,           r: 2,   col: line       },
    { x: 200, y: rows[6].leftY  - rise * 0.5,  r: 2.5, col: accentWarm },
    { x: 390, y: rows[10].leftY - rise * 390/400, r: 1.8, col: lineSoft },
    { x: 14,  y: rows[11].leftY + 0,           r: 1.8, col: lineSoft   },
  ];

  return (
    <svg viewBox="0 0 400 400" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden className="absolute inset-0 h-full w-full">
      {rows.map(({ leftY, leftX, rightX, col, sw, op }, i) => (
        <line
          key={i}
          x1={leftX}  y1={leftY}
          x2={rightX} y2={leftY - rise * (rightX - leftX) / 400}
          stroke={col} strokeWidth={sw} opacity={op} strokeLinecap="round"
        />
      ))}
      {dots.map(({ x, y, r, col }, i) => (
        <circle key={`d${i}`} cx={x} cy={y} r={r} fill={col} opacity={0.8} />
      ))}
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

export function ArticleGraphicDesign({ design }: { design: number }) {
  const Graphic = DESIGNS[design % DESIGNS.length];
  return <Graphic />;
}

export function ArticleInlineVisual({ design }: { design: number }) {
  return (
    <div
      className={`relative w-full overflow-hidden ${BLOG_FEATURE_BOX_TW} border border-[#D9D4CC] bg-[#EBE7E0]`}
    >
      <ArticleGraphicDesign design={design} />
    </div>
  );
}
