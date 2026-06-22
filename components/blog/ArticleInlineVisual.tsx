import { BLOG_FEATURE_BOX_TW } from "@/lib/blog/blog-layout-styles";
import { BLOG_LANDING_HERO } from "@/lib/blog/blog-landing-hero-colors";

const { lineSoft, line, lineStrong, accent, accentWarm, focal } = BLOG_LANDING_HERO;

/* ──────────────────────────────────────────────────────────────
   Design 0 — Engineering / Code Intelligence
   Radiating spokes from a focal point, dense on one side —
   suggests a technical knowledge graph.
────────────────────────────────────────────────────────────── */
function Design0() {
  const cx = 285;
  const cy = 210;
  const spokes = [
    { dx: -1,    dy: -1.4, len: 195 },
    { dx: -0.7,  dy: -1,   len: 185 },
    { dx: -0.3,  dy: -1,   len: 170 },
    { dx:  0.1,  dy: -1,   len: 160 },
    { dx:  0.55, dy: -1,   len: 150 },
    { dx:  1,    dy: -0.8, len: 145 },
    { dx:  1,    dy: -0.25,len: 140 },
    { dx:  1,    dy:  0.3, len: 135 },
    { dx:  1,    dy:  0.8, len: 140 },
    { dx:  0.6,  dy:  1,   len: 145 },
    { dx:  0.1,  dy:  1,   len: 155 },
    { dx: -0.3,  dy:  1,   len: 165 },
    { dx: -0.75, dy:  1,   len: 175 },
    { dx: -1,    dy:  0.75,len: 185 },
    { dx: -1,    dy:  0.25,len: 195 },
    { dx: -1,    dy: -0.4, len: 200 },
  ];
  const norm = ({ dx, dy }: { dx: number; dy: number }) => {
    const m = Math.hypot(dx, dy);
    return { dx: dx / m, dy: dy / m };
  };
  return (
    <svg viewBox="0 0 400 400" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden className="absolute inset-0 h-full w-full">
      {spokes.map((s, i) => {
        const { dx, dy } = norm(s);
        return (
          <line
            key={i}
            x1={cx} y1={cy}
            x2={cx + dx * s.len} y2={cy + dy * s.len}
            stroke={i % 4 === 0 ? line : i % 3 === 0 ? lineStrong : lineSoft}
            strokeWidth={i % 5 === 0 ? "0.85" : "0.65"}
            opacity={0.7 + (i % 3) * 0.1}
          />
        );
      })}
      {/* Dot ring around focal */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
        const r = 28;
        const a = (deg * Math.PI) / 180;
        return (
          <circle
            key={`ring-${i}`}
            cx={cx + Math.cos(a) * r} cy={cy + Math.sin(a) * r}
            r={i % 2 === 0 ? "2" : "1.5"}
            fill={i % 3 === 0 ? accentWarm : lineSoft}
          />
        );
      })}
      <circle cx={cx} cy={cy} r="4" fill={focal} />
      <circle cx={cx} cy={cy} r="8" stroke={lineStrong} strokeWidth="0.75" />
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
   A horizontal process-flow: nodes connected by lines with
   status markers — suggests an approval pipeline.
────────────────────────────────────────────────────────────── */
function Design2() {
  const nodes = [52, 140, 200, 260, 348];
  const cy = 200;
  return (
    <svg viewBox="0 0 400 400" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden className="absolute inset-0 h-full w-full">
      {/* Horizontal connector */}
      <line x1="52" y1={cy} x2="348" y2={cy} stroke={lineSoft} strokeWidth="0.8" />

      {/* Vertical tick marks above / below */}
      {[80, 120, 160, 200, 240, 280, 320].map((x) => (
        <line key={x} x1={x} y1={cy - 6} x2={x} y2={cy + 6} stroke={lineSoft} strokeWidth="0.65" />
      ))}

      {/* Secondary guide rails */}
      <line x1="52" y1={cy - 36} x2="348" y2={cy - 36} stroke={lineSoft} strokeWidth="0.5" opacity="0.5" />
      <line x1="52" y1={cy + 36} x2="348" y2={cy + 36} stroke={lineSoft} strokeWidth="0.5" opacity="0.5" />

      {/* Nodes */}
      {nodes.map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={cy} r="12" stroke={i === 2 ? accent : lineStrong} strokeWidth={i === 2 ? "1" : "0.75"} fill={i === 2 ? `${accent}18` : "transparent"} />
          <circle cx={x} cy={cy} r="3.5" fill={i === 2 ? accent : i < 2 ? accentWarm : lineStrong} />
        </g>
      ))}

      {/* Labels above nodes */}
      {nodes.slice(0, 4).map((x, i) => (
        <line key={`tick-${i}`} x1={x} y1={cy - 12} x2={x} y2={cy - 22} stroke={i === 2 ? accent : lineSoft} strokeWidth="0.8" strokeLinecap="round" />
      ))}

      {/* Decorative bounding box hint */}
      <rect x="28" y={cy - 72} width="344" height="144" rx="10" stroke={lineSoft} strokeWidth="0.5" opacity="0.35" />
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
