import { useId, type ReactNode } from "react";

const DOE_ORANGE = "#D2774C";
const DOE_ORANGE_SOFT = "#D49D4F";

const DOE_ORANGE_GRADIENT_STOPS = [
  { offset: "0%", color: "#E7A944" },
  { offset: "30%", color: "#D49D4F" },
  { offset: "62%", color: "#D2774C" },
  { offset: "100%", color: "#C47A5A" },
] as const;

const LINE = "rgba(255, 255, 255, 0.46)";
const LINE_SOFT = "rgba(255, 255, 255, 0.26)";
const LINE_FAINT = "rgba(255, 255, 255, 0.18)";

/** Continental Canada — single path with a soft Hudson Bay notch on the northern edge. */
const CANADA_PATH =
  "M 38 120 L 46 98 L 58 76 L 74 56 L 94 40 L 116 30 L 132 38 L 148 30 L 168 24 L 190 26 L 208 38 L 218 54 L 220 70 L 210 86 L 190 100 L 164 110 L 136 116 L 108 114 L 82 110 L 58 114 L 42 118 Z";

/** Lower 48 — single closed path; Maine nub, Gulf coast, and Florida peninsula. */
const US_PATH =
  "M 32 38 L 36 24 L 46 14 L 62 8 L 82 4 L 104 2 L 128 4 L 152 10 L 170 20 L 180 28 L 186 22 L 192 30 L 184 42 L 188 54 L 182 60 L 166 64 L 154 66 L 150 76 L 154 84 L 146 88 L 138 78 L 142 66 L 124 64 L 102 62 L 80 60 L 58 56 L 42 48 L 34 38 L 30 28 L 32 18 L 38 12 L 46 16 L 50 24 L 44 32 Z";

const VIEW_SIZE = 400;
const MAP_CENTER = { x: 200, y: 208 };
const ORBIT_RADIUS = 162;
const BOX_W = 46;
const BOX_H = 30;
const BOX_RX = 5;

const CANADA_TRANSFORM = "translate(76 44) scale(1.22)";
const US_TRANSFORM = "translate(76 168) scale(1.22)";

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
  const inset = from.y < MAP_CENTER.y ? 44 : 40;

  return {
    x: MAP_CENTER.x - (dx / len) * inset,
    y: MAP_CENTER.y - (dy / len) * inset,
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
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={stroke}
        strokeWidth={strokeWidth}
        opacity={opacity}
        strokeLinecap="round"
      />,
    );
  }

  return lines;
}

function CountrySilhouette({
  pathD,
  viewBox,
  lineAngle,
  lineSpacing,
  accentLines,
  transform,
  gradientId,
  clipId,
}: {
  pathD: string;
  viewBox: string;
  lineAngle: number;
  lineSpacing: number;
  accentLines?: ReactNode;
  transform: string;
  gradientId: string;
  clipId: string;
}) {
  const [, , widthStr, heightStr] = viewBox.split(" ");
  const width = Number(widthStr);
  const height = Number(heightStr);

  return (
    <g transform={transform}>
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
        {diagonalLines(width, height, lineSpacing, lineAngle, LINE_SOFT, 0.55, 0.72)}
        {diagonalLines(width, height, lineSpacing * 1.65, lineAngle + 8, LINE_FAINT, 0.45, 0.55)}
        {accentLines}
      </g>
    </g>
  );
}

/** Canada + US with six white orbit boxes and orange connector lines. */
export function JoinHeroNorthAmericaSilhouettes({ variant }: { variant: "mobile" | "desktop" }) {
  const baseId = useId().replace(/:/g, "");
  const canadaGradId = `${baseId}-canada-grad`;
  const canadaClipId = `${baseId}-canada-clip`;
  const usGradId = `${baseId}-us-grad`;
  const usClipId = `${baseId}-us-clip`;

  const wrapperClass =
    variant === "mobile"
      ? "pointer-events-none absolute right-0 top-[38%] z-[2] aspect-square w-[min(52%,13.5rem)] -translate-y-1/2 pr-4"
      : "pointer-events-none absolute right-0 top-1/2 z-[2] aspect-square w-[min(42%,28rem)] -translate-y-1/2 pr-[clamp(1rem,2.4vw,2.5rem)]";

  const orbitBoxes = Array.from({ length: 6 }, (_, index) => {
    const center = orbitPoint(index);
    const target = clusterTarget(center);
    const lineStart = boxEdgeToward(center, target);

    return { index, center, target, lineStart };
  });

  return (
    <div className={wrapperClass} aria-hidden>
      <svg
        viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full"
      >
        {orbitBoxes.map(({ index, center, target, lineStart }) => (
          <line
            key={`link-${index}`}
            x1={lineStart.x}
            y1={lineStart.y}
            x2={target.x}
            y2={target.y}
            stroke={index % 2 === 0 ? DOE_ORANGE : DOE_ORANGE_SOFT}
            strokeWidth={2.1}
            strokeLinecap="round"
          />
        ))}

        <CountrySilhouette
          pathD={CANADA_PATH}
          viewBox="0 0 240 132"
          lineAngle={-42}
          lineSpacing={11}
          gradientId={canadaGradId}
          clipId={canadaClipId}
          transform={CANADA_TRANSFORM}
          accentLines={
            <>
              <path
                d="M 24 98 C 78 90 138 92 210 98"
                stroke={LINE}
                strokeWidth={0.65}
                opacity={0.42}
                strokeLinecap="round"
              />
              <path
                d="M 40 68 C 92 62 148 64 204 68"
                stroke={LINE_SOFT}
                strokeWidth={0.55}
                opacity={0.34}
                strokeLinecap="round"
              />
            </>
          }
        />

        <CountrySilhouette
          pathD={US_PATH}
          viewBox="0 0 220 88"
          lineAngle={-56}
          lineSpacing={10}
          gradientId={usGradId}
          clipId={usClipId}
          transform={US_TRANSFORM}
          accentLines={
            <>
              <line x1={20} y1={44} x2={200} y2={44} stroke={LINE} strokeWidth={0.6} opacity={0.38} strokeLinecap="round" />
              <line x1={28} y1={30} x2={184} y2={30} stroke={LINE_SOFT} strokeWidth={0.5} opacity={0.28} strokeLinecap="round" />
            </>
          }
        />

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
