import { useId, type ReactNode } from "react";

const DOE_ORANGE = "#D2774C";
const DOE_ORANGE_SOFT = "#D49D4F";

const DOE_ORANGE_GRADIENT_STOPS = [
  { offset: "0%", color: "#E7A944" },
  { offset: "30%", color: "#D49D4F" },
  { offset: "62%", color: "#D2774C" },
  { offset: "100%", color: "#C47A5A" },
] as const;

const LINE_SOFT = "rgba(255,255,255,0.30)";
const LINE_FAINT = "rgba(255,255,255,0.15)";

/**
 * Canada — straight-line polygon (no bezier curves).
 * BC coast on the left, Maritimes on the right, flat 49th-parallel bottom.
 * In 480×440 viewBox space.
 */
const CANADA_PATH =
  "M 72 192 " +
  "L 68 168 L 64 142 L 66 115 L 73 90 L 85 68 L 98 57 " +
  "L 120 52 L 146 50 L 166 56 L 180 50 L 195 52 " +
  "L 218 50 L 240 54 L 260 62 L 275 72 " +
  "L 285 88 L 281 106 L 272 122 L 265 138 " +
  "L 263 154 L 263 170 L 259 184 L 255 192 " +
  "Z";

/**
 * USA lower 48 — straight-line polygon.
 * Shares northern border with Canada bottom, Florida peninsula SE, Gulf coast.
 * In 480×440 viewBox space.
 */
const US_PATH =
  "M 72 196 " +
  "L 255 196 " +
  "L 262 204 L 265 215 L 262 227 " +
  "L 265 239 L 268 252 L 270 264 L 270 274 " +
  "L 267 286 L 263 298 L 258 310 L 253 320 " +
  "L 247 328 L 241 323 L 239 311 L 241 298 " +
  "L 243 286 L 240 274 L 233 267 L 216 265 " +
  "L 196 267 L 176 271 L 156 274 L 138 278 " +
  "L 121 284 L 110 291 L 103 298 " +
  "L 100 291 L 103 278 L 106 264 " +
  "L 103 250 L 98 236 L 93 220 " +
  "L 85 212 L 70 214 L 58 207 " +
  "L 57 200 L 60 196 L 72 196 " +
  "Z";

const VIEW_W = 480;
const VIEW_H = 440;
const MAP_CENTER = { x: 215, y: 218 };
const ORBIT_RADIUS = 188;
const BOX_W = 54;
const BOX_H = 34;
const BOX_RX = 6;

// Fixed orbit positions — 6 boxes evenly around the cluster, starting from top
const ORBIT_POINTS = Array.from({ length: 6 }, (_, i) => {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 6;
  return {
    x: MAP_CENTER.x + ORBIT_RADIUS * Math.cos(angle),
    y: MAP_CENTER.y + ORBIT_RADIUS * Math.sin(angle),
  };
});

// Fixed targets inside country cluster for each connector line
const LINE_TARGETS = [
  { x: 215, y: 85 },   // top → Canada interior north
  { x: 262, y: 128 },  // top-right → Canada east
  { x: 252, y: 265 },  // bottom-right → USA east
  { x: 215, y: 310 },  // bottom → USA south
  { x: 115, y: 255 },  // bottom-left → USA west
  { x: 115, y: 128 },  // top-left → Canada west
];

function boxEdgeTow(from: { x: number; y: number }, to: { x: number; y: number }) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const scale = 1 / Math.max(Math.abs(ux) / (BOX_W / 2), Math.abs(uy) / (BOX_H / 2));
  return { x: from.x + ux * scale, y: from.y + uy * scale };
}

function diagonalLines(
  width: number,
  height: number,
  spacing: number,
  angleDeg: number,
  stroke: string,
  strokeWidth: number,
  opacity: number,
): ReactNode[] {
  const lines: ReactNode[] = [];
  const rad = (angleDeg * Math.PI) / 180;
  const span = width + height;
  for (let offset = -span; offset <= span; offset += spacing) {
    lines.push(
      <line
        key={`${angleDeg}-${offset}`}
        x1={offset} y1={height}
        x2={offset + Math.cos(rad) * span * 2}
        y2={height - Math.sin(rad) * span * 2}
        stroke={stroke} strokeWidth={strokeWidth} opacity={opacity}
        strokeLinecap="round"
      />,
    );
  }
  return lines;
}

function CountryFill({
  pathD, gradientId, clipId,
}: {
  pathD: string;
  gradientId: string;
  clipId: string;
}) {
  return (
    <>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          {DOE_ORANGE_GRADIENT_STOPS.map((s) => (
            <stop key={s.offset} offset={s.offset} stopColor={s.color} />
          ))}
        </linearGradient>
        <clipPath id={clipId}>
          <path d={pathD} />
        </clipPath>
      </defs>
      <path d={pathD} fill={`url(#${gradientId})`} />
      <g clipPath={`url(#${clipId})`}>
        {diagonalLines(VIEW_W, VIEW_H, 13, -38, LINE_SOFT, 0.6, 0.75)}
        {diagonalLines(VIEW_W, VIEW_H, 21, -52, LINE_FAINT, 0.45, 0.55)}
      </g>
    </>
  );
}

export function JoinHeroNorthAmericaSilhouettes({ variant }: { variant: "mobile" | "desktop" }) {
  const baseId = useId().replace(/:/g, "");

  const wrapperClass =
    variant === "mobile"
      ? "pointer-events-none absolute right-0 top-[42%] z-[2] -translate-y-1/2 pr-2 w-[min(64%,17rem)]"
      : "pointer-events-none absolute right-0 top-1/2 z-[2] -translate-y-1/2 pr-[clamp(0.5rem,1.5vw,1.5rem)] w-[min(52%,34rem)]";

  return (
    <div className={wrapperClass} aria-hidden>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full"
      >
        {/* Connector lines — behind countries */}
        {ORBIT_POINTS.map((pt, i) => {
          const target = LINE_TARGETS[i];
          const edge = boxEdgeTow(pt, target);
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

        {/* Canada */}
        <CountryFill
          pathD={CANADA_PATH}
          gradientId={`${baseId}-ca-grad`}
          clipId={`${baseId}-ca-clip`}
        />

        {/* USA */}
        <CountryFill
          pathD={US_PATH}
          gradientId={`${baseId}-us-grad`}
          clipId={`${baseId}-us-clip`}
        />

        {/* White orbit boxes — on top */}
        {ORBIT_POINTS.map((pt, i) => (
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
