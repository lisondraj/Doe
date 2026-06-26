import { useId, type ReactNode } from "react";

const DOE_ORANGE = "#D2774C";
const DOE_ORANGE_SOFT = "#D49D4F";

const DOE_ORANGE_GRADIENT_STOPS = [
  { offset: "0%", color: "#E7A944" },
  { offset: "30%", color: "#D49D4F" },
  { offset: "62%", color: "#D2774C" },
  { offset: "100%", color: "#C47A5A" },
] as const;

const LINE_SOFT = "rgba(255, 255, 255, 0.30)";
const LINE_FAINT = "rgba(255, 255, 255, 0.16)";

/**
 * Canada — continental outline (no arctic islands).
 * Coordinates are in the 400×400 viewBox.
 * BC coast on west, Maritimes on east, flat 49th-parallel bottom.
 */
const CANADA_PATH =
  "M 44 168 " +
  "C 40 152 36 132 38 108 " +   // BC coast going north
  "C 40 86 48 66 58 52 " +       // Northern BC
  "C 68 38 84 28 104 22 " +      // NW corner
  "L 132 16 " +                   // Top north, NWT
  "C 150 13 164 20 178 16 " +    // Top middle (Hudson Bay region)
  "C 193 12 208 18 218 15 " +    // Top east
  "C 234 12 250 22 262 34 " +    // NE corner
  "C 270 46 270 64 265 80 " +    // East coast going down
  "C 260 96 254 110 250 124 " +  // Atlantic provinces
  "C 246 138 246 152 248 164 " + // Maritimes
  "L 244 168 " +                  // SE (NB/NS area)
  "Z";                            // closes across the flat US border

/**
 * USA lower 48 — continental outline.
 * West coast top-left, east coast top-right, Florida SE, TX/Gulf south.
 */
const US_PATH =
  "M 44 175 " +                   // NW (WA coast)
  "L 244 175 " +                  // straight northern border to NE
  "C 252 177 259 182 264 190 " +  // New England coast angle
  "C 268 200 266 214 262 226 " +  // Mid-Atlantic
  "C 258 238 256 250 258 260 " +  // NC coast
  "C 260 268 264 276 266 284 " +  // GA/FL border area
  "C 268 292 267 303 263 312 " +  // North Florida
  "C 259 321 254 327 249 327 " +  // FL tip (east)
  "C 244 327 240 322 239 314 " +  // FL very tip
  "C 238 306 239 295 241 285 " +  // FL west coast
  "C 243 275 246 265 243 256 " +  // FL panhandle
  "C 240 248 230 244 216 244 " +  // Gulf panhandle
  "C 200 244 185 250 172 256 " +  // AL/MS Gulf coast
  "C 157 262 144 264 133 268 " +  // LA coast
  "C 120 272 110 278 106 287 " +  // TX south coast
  "C 102 295 100 301 97 295 " +   // TX tip
  "C 94 289 95 278 99 267 " +     // TX west coast going up
  "C 103 256 107 241 102 228 " +  // TX/NM
  "C 97 215 86 209 75 212 " +     // NM
  "C 63 215 52 210 46 202 " +     // AZ / CA south
  "C 40 196 38 185 40 177 " +     // CA coast going north
  "Z";

const VIEW_W = 400;
const VIEW_H = 360;

// Center of the space between/over the two countries
const MAP_CENTER = { x: 200, y: 210 };
const ORBIT_RADIUS = 172;
const BOX_W = 50;
const BOX_H = 32;
const BOX_RX = 6;

function orbitPoint(index: number) {
  const angle = -Math.PI / 2 + (index * (2 * Math.PI)) / 6;
  return {
    x: MAP_CENTER.x + ORBIT_RADIUS * Math.cos(angle),
    y: MAP_CENTER.y + ORBIT_RADIUS * Math.sin(angle),
  };
}

function boxEdgeToward(from: { x: number; y: number }, to: { x: number; y: number }) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const halfW = BOX_W / 2;
  const halfH = BOX_H / 2;
  const scale = 1 / Math.max(Math.abs(ux) / halfW, Math.abs(uy) / halfH);

  return {
    x: from.x + ux * scale,
    y: from.y + uy * scale,
  };
}

function clusterTarget(from: { x: number; y: number }) {
  const dx = MAP_CENTER.x - from.x;
  const dy = MAP_CENTER.y - from.y;
  const len = Math.hypot(dx, dy) || 1;

  return {
    x: MAP_CENTER.x - (dx / len) * 52,
    y: MAP_CENTER.y - (dy / len) * 52,
  };
}

function diagonalLines(
  width: number,
  height: number,
  spacing: number,
  angleDeg: number,
  stroke: string,
  strokeWidth: number,
  opacity: number,
) {
  const lines: ReactNode[] = [];
  const rad = (angleDeg * Math.PI) / 180;
  const span = width + height;

  for (let offset = -span; offset <= span; offset += spacing) {
    const x1 = offset;
    const y1 = height;
    const x2 = offset + Math.cos(rad) * span * 2;
    const y2 = height - Math.sin(rad) * span * 2;
    lines.push(
      <line
        key={`${angleDeg}-${offset}`}
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={stroke} strokeWidth={strokeWidth} opacity={opacity}
        strokeLinecap="round"
      />,
    );
  }
  return lines;
}

function CountryFill({
  pathD,
  boundW,
  boundH,
  lineAngle,
  lineSpacing,
  gradientId,
  clipId,
}: {
  pathD: string;
  boundW: number;
  boundH: number;
  lineAngle: number;
  lineSpacing: number;
  gradientId: string;
  clipId: string;
}) {
  return (
    <>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          {DOE_ORANGE_GRADIENT_STOPS.map((stop) => (
            <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
          ))}
        </linearGradient>
        <clipPath id={clipId}>
          <path d={pathD} />
        </clipPath>
      </defs>

      <path d={pathD} fill={`url(#${gradientId})`} />

      <g clipPath={`url(#${clipId})`}>
        {diagonalLines(boundW, boundH, lineSpacing, lineAngle, LINE_SOFT, 0.6, 0.75)}
        {diagonalLines(boundW, boundH, lineSpacing * 1.7, lineAngle + 10, LINE_FAINT, 0.45, 0.55)}
      </g>
    </>
  );
}

export function JoinHeroNorthAmericaSilhouettes({ variant }: { variant: "mobile" | "desktop" }) {
  const baseId = useId().replace(/:/g, "");

  const wrapperClass =
    variant === "mobile"
      ? "pointer-events-none absolute right-0 top-[40%] z-[2] -translate-y-1/2 pr-3 w-[min(56%,15rem)]"
      : "pointer-events-none absolute right-0 top-1/2 z-[2] -translate-y-1/2 pr-[clamp(0.75rem,2vw,2rem)] w-[min(46%,30rem)]";

  const orbitBoxes = Array.from({ length: 6 }, (_, index) => {
    const center = orbitPoint(index);
    const target = clusterTarget(center);
    const lineStart = boxEdgeToward(center, target);
    return { index, center, target, lineStart };
  });

  return (
    <div className={wrapperClass} aria-hidden>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full"
      >
        {/* Connector lines — drawn first (behind countries) */}
        {orbitBoxes.map(({ index, lineStart, target }) => (
          <line
            key={`link-${index}`}
            x1={lineStart.x} y1={lineStart.y}
            x2={target.x} y2={target.y}
            stroke={index % 2 === 0 ? DOE_ORANGE : DOE_ORANGE_SOFT}
            strokeWidth={1.8}
            strokeLinecap="round"
          />
        ))}

        {/* Canada */}
        <CountryFill
          pathD={CANADA_PATH}
          boundW={VIEW_W}
          boundH={180}
          lineAngle={-38}
          lineSpacing={12}
          gradientId={`${baseId}-ca-grad`}
          clipId={`${baseId}-ca-clip`}
        />

        {/* USA */}
        <CountryFill
          pathD={US_PATH}
          boundW={VIEW_W}
          boundH={VIEW_H}
          lineAngle={-50}
          lineSpacing={11}
          gradientId={`${baseId}-us-grad`}
          clipId={`${baseId}-us-clip`}
        />

        {/* White orbit boxes — drawn on top */}
        {orbitBoxes.map(({ index, center }) => (
          <rect
            key={`box-${index}`}
            x={center.x - BOX_W / 2}
            y={center.y - BOX_H / 2}
            width={BOX_W}
            height={BOX_H}
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
