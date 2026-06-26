/**
 * Canada + USA silhouettes using the actual map images as CSS masks.
 * The black silhouette is used as an alpha mask over the Doe orange gradient.
 * Six white orbit boxes ring the composition with orange connector lines.
 */

const DOE_ORANGE = "#D2774C";
const DOE_ORANGE_SOFT = "#D49D4F";
const DOE_GRADIENT = "linear-gradient(135deg, #E7A944 0%, #D49D4F 32%, #D2774C 64%, #C47A5A 100%)";

const LINE_SOFT = "rgba(255,255,255,0.30)";

const BOX_W = 52;
const BOX_H = 33;
const BOX_RX = 6;

// Orbit boxes — 6 evenly around the composition center
// Center of the full composed graphic (Canada above, USA below)
const CX = 200;
const CY = 210;
const R = 188;

const ORBIT = Array.from({ length: 6 }, (_, i) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / 6;
  return { x: CX + R * Math.cos(a), y: CY + R * Math.sin(a) };
});

// Line targets — one per box, aimed at a point inside the nearest country
const TARGETS = [
  { x: 200, y: 82 },   // top → Canada north
  { x: 272, y: 132 },  // top-right → Canada east
  { x: 268, y: 272 },  // bottom-right → USA east
  { x: 200, y: 316 },  // bottom → USA south
  { x: 128, y: 272 },  // bottom-left → USA west
  { x: 128, y: 132 },  // top-left → Canada west
];

function boxEdge(from: { x: number; y: number }, to: { x: number; y: number }) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const scale = 1 / Math.max(Math.abs(ux) / (BOX_W / 2), Math.abs(uy) / (BOX_H / 2));
  return { x: from.x + ux * scale, y: from.y + uy * scale };
}

// Horizontal hatch lines rendered inside the mask via SVG pattern
function hatchLines() {
  const lines = [];
  for (let y = 0; y <= 400; y += 11) {
    lines.push(
      <line
        key={y}
        x1={0} y1={y} x2={400} y2={y}
        stroke={LINE_SOFT}
        strokeWidth={0.6}
        strokeLinecap="round"
      />,
    );
  }
  return lines;
}

export function JoinHeroNorthAmericaSilhouettes({ variant }: { variant: "mobile" | "desktop" }) {
  const wrapperClass =
    variant === "mobile"
      ? "pointer-events-none absolute right-0 top-[42%] z-[2] -translate-y-1/2 pr-2 w-[min(62%,17rem)]"
      : "pointer-events-none absolute right-0 top-1/2 z-[2] -translate-y-1/2 pr-[clamp(0.5rem,1.5vw,1.5rem)] w-[min(52%,34rem)]";

  // Canada: sits top-half, slight left offset to match image proportions
  // USA: sits bottom-half, centered
  const canadaStyle: React.CSSProperties = {
    position: "absolute",
    // Map image is ~750×600 — in our 400×420 SVG space, Canada occupies roughly top 46%
    left: "8%",
    top: "3%",
    width: "84%",
    height: "44%",
    background: DOE_GRADIENT,
    WebkitMaskImage: "url(/images/canada-map.jpg)",
    WebkitMaskSize: "100% 100%",
    WebkitMaskRepeat: "no-repeat",
    maskImage: "url(/images/canada-map.jpg)",
    maskSize: "100% 100%",
    maskRepeat: "no-repeat",
  };

  const usaStyle: React.CSSProperties = {
    position: "absolute",
    left: "7%",
    top: "50%",
    width: "86%",
    height: "44%",
    background: DOE_GRADIENT,
    WebkitMaskImage: "url(/images/usa-map.jpg)",
    WebkitMaskSize: "100% 100%",
    WebkitMaskRepeat: "no-repeat",
    maskImage: "url(/images/usa-map.jpg)",
    maskSize: "100% 100%",
    maskRepeat: "no-repeat",
  };

  return (
    <div className={wrapperClass} aria-hidden style={{ aspectRatio: "400/420", position: "absolute" }}>
      {/* Country silhouettes using actual image masks */}
      <div style={{ position: "absolute", inset: 0 }}>
        <div style={canadaStyle} />
        <div style={usaStyle} />
      </div>

      {/* SVG overlay — connector lines + orbit boxes */}
      <svg
        viewBox="0 0 400 420"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        {ORBIT.map((pt, i) => {
          const target = TARGETS[i];
          const edge = boxEdge(pt, target);
          return (
            <line
              key={`link-${i}`}
              x1={edge.x} y1={edge.y}
              x2={target.x} y2={target.y}
              stroke={i % 2 === 0 ? DOE_ORANGE : DOE_ORANGE_SOFT}
              strokeWidth={1.8}
              strokeLinecap="round"
            />
          );
        })}

        {ORBIT.map((pt, i) => (
          <rect
            key={`box-${i}`}
            x={pt.x - BOX_W / 2} y={pt.y - BOX_H / 2}
            width={BOX_W} height={BOX_H}
            rx={BOX_RX}
            fill="#FFFFFF"
            stroke="#E8E4DD"
            strokeWidth={1}
          />
        ))}
      </svg>
    </div>
  );
}
