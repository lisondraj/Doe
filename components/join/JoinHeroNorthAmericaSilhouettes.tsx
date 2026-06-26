/**
 * Canada + USA silhouettes.
 * Uses SVG <mask> + <feComponentTransfer> invert filter so the black-on-white
 * JPG images correctly mask an orange gradient fill (black country → shows orange,
 * white background → transparent).
 */
import { useId } from "react";

const DOE_ORANGE = "#D2774C";
const DOE_ORANGE_SOFT = "#D49D4F";

const GRADIENT_STOPS = [
  { offset: "0%",   color: "#E7A944" },
  { offset: "30%",  color: "#D49D4F" },
  { offset: "62%",  color: "#D2774C" },
  { offset: "100%", color: "#C47A5A" },
] as const;

const VW = 560;
const VH = 580;
const VOX = -80;
const VOY = -80;

// Canada occupies the top half, USA the bottom — expanded to fill viewBox
const CA = { x: 6,  y: 0,   w: 388, h: 218 };
const US = { x: 2,  y: 218, w: 396, h: 212 };

// Composition center for orbit layout — larger radius keeps boxes outside countries
const CX = 200;
const CY = 215;
const R  = 232;

const BOX_W = 140;
const BOX_H = 90;
const BOX_RX = 13;

const ORBIT = Array.from({ length: 6 }, (_, i) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / 6;
  return { x: CX + R * Math.cos(a), y: CY + R * Math.sin(a) };
});

// Line targets — one per orbit box, aimed inside the nearest country
const TARGETS = [
  { x: 200, y: 55  },  // top → Canada north
  { x: 300, y: 115 },  // top-right → Canada east
  { x: 304, y: 300 },  // bottom-right → USA east
  { x: 200, y: 370 },  // bottom → USA south
  { x: 96,  y: 300 },  // bottom-left → USA west
  { x: 96,  y: 115 },  // top-left → Canada west
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

export function JoinHeroNorthAmericaSilhouettes({ variant }: { variant: "mobile" | "desktop" }) {
  const id = useId().replace(/:/g, "");

  const wrapperClass =
    variant === "mobile"
      ? "pointer-events-none absolute right-[clamp(1.5rem,5vw,4rem)] top-[42%] z-[2] -translate-y-1/2 w-[min(68%,19rem)] overflow-visible"
      : "pointer-events-none absolute right-[clamp(4rem,10vw,8rem)] top-1/2 z-[2] -translate-y-1/2 w-[min(60%,42rem)] overflow-visible";

  const caGrad  = `${id}-ca-grad`;
  const usGrad  = `${id}-us-grad`;
  const caMask  = `${id}-ca-mask`;
  const usMask  = `${id}-us-mask`;
  const invertF = `${id}-invert`;

  return (
    <div className={wrapperClass} aria-hidden>
      <svg
        viewBox={`${VOX} ${VOY} ${VW} ${VH}`}
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full overflow-visible"
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Invert filter — turns black-on-white silhouette into white-on-black so SVG mask shows the country */}
          <filter id={invertF} colorInterpolationFilters="sRGB">
            <feComponentTransfer>
              <feFuncR type="linear" slope="-1" intercept="1" />
              <feFuncG type="linear" slope="-1" intercept="1" />
              <feFuncB type="linear" slope="-1" intercept="1" />
            </feComponentTransfer>
          </filter>

          {/* Orange gradient — shared */}
          <linearGradient id={caGrad} x1="0%" y1="0%" x2="100%" y2="100%">
            {GRADIENT_STOPS.map((s) => (
              <stop key={s.offset} offset={s.offset} stopColor={s.color} />
            ))}
          </linearGradient>
          <linearGradient id={usGrad} x1="0%" y1="0%" x2="100%" y2="100%">
            {GRADIENT_STOPS.map((s) => (
              <stop key={s.offset} offset={s.offset} stopColor={s.color} />
            ))}
          </linearGradient>

          {/* Canada mask — image inverted so black country = white (visible) in mask */}
          <mask id={caMask}>
            <image
              href="/images/canada-map.jpg"
              x={CA.x} y={CA.y}
              width={CA.w} height={CA.h}
              preserveAspectRatio="xMidYMid meet"
              filter={`url(#${invertF})`}
            />
          </mask>

          {/* USA mask */}
          <mask id={usMask}>
            <image
              href="/images/usa-map.jpg"
              x={US.x} y={US.y}
              width={US.w} height={US.h}
              preserveAspectRatio="xMidYMid meet"
              filter={`url(#${invertF})`}
            />
          </mask>
        </defs>

        {/* Country fills — rects filled with gradient, clipped to each mask */}
        <rect x={CA.x} y={CA.y} width={CA.w} height={CA.h} fill={`url(#${caGrad})`} mask={`url(#${caMask})`} />
        <rect x={US.x} y={US.y} width={US.w} height={US.h} fill={`url(#${usGrad})`} mask={`url(#${usMask})`} />

        {/* Connector lines — behind boxes so overlap reads cleanly */}
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

        {/* Animation + hover styles — scoped to this instance */}
        <style>{`
          @keyframes ${id}-unblur {
            from { filter: blur(8px); opacity: 0; transform: translateY(6px); }
            to   { filter: blur(0px); opacity: 1; transform: translateY(0px);  }
          }
          .${id}-box {
            pointer-events: auto;
            transform-box: fill-box;
            transform-origin: center;
            animation: ${id}-unblur 0.55s cubic-bezier(0.22,1,0.36,1) both;
            transition: filter 0.28s ease, transform 0.28s cubic-bezier(0.22,1,0.36,1);
          }
          .${id}-box:hover {
            filter: blur(0px);
            transform: translateY(-7px);
          }
        `}</style>

        {/* White orbit boxes — each wrapped in <g> for CSS transitions */}
        {ORBIT.map((pt, i) => (
          <g
            key={`box-${i}`}
            className={`${id}-box`}
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            <rect
              x={pt.x - BOX_W / 2} y={pt.y - BOX_H / 2}
              width={BOX_W} height={BOX_H}
              rx={BOX_RX}
              fill="#FFFFFF"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
