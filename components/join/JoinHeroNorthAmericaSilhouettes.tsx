import { useId, type ReactNode } from "react";

const DOE_ORANGE_GRADIENT_STOPS = [
  { offset: "0%", color: "#E7A944" },
  { offset: "30%", color: "#D49D4F" },
  { offset: "62%", color: "#D2774C" },
  { offset: "100%", color: "#C47A5A" },
] as const;

const LINE = "rgba(255, 255, 255, 0.46)";
const LINE_SOFT = "rgba(255, 255, 255, 0.26)";
const LINE_FAINT = "rgba(255, 255, 255, 0.18)";

/** Stylized continental Canada — Hudson Bay cutout via even-odd fill. */
const CANADA_PATH =
  "M 28 108 L 34 88 L 42 68 L 52 50 L 66 34 L 84 22 L 106 14 L 130 10 L 154 10 L 176 16 L 194 28 L 206 44 L 210 60 L 206 76 L 194 90 L 176 100 L 152 106 L 126 108 L 98 106 L 72 102 L 50 104 Z M 98 48 C 108 42 122 40 134 44 C 142 50 144 58 138 66 C 128 74 112 72 102 64 C 96 58 94 52 98 48 Z";

/** Stylized lower 48 — separate silhouette from Canada. */
const US_PATH =
  "M 12 54 L 18 38 L 28 26 L 42 18 L 60 12 L 80 8 L 102 6 L 126 8 L 150 14 L 170 24 L 184 36 L 190 50 L 186 62 L 172 68 L 152 70 L 128 68 L 102 66 L 76 64 L 52 60 L 32 54 L 20 48 L 14 38 Z M 42 18 L 36 10 L 32 16 M 184 36 L 194 30 L 192 40 M 152 70 L 160 80 L 154 84 L 146 76 M 76 64 L 70 74 L 64 70";

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
  className,
  gradientId,
  clipId,
}: {
  pathD: string;
  viewBox: string;
  lineAngle: number;
  lineSpacing: number;
  accentLines?: ReactNode;
  className?: string;
  gradientId: string;
  clipId: string;
}) {
  const [, , widthStr, heightStr] = viewBox.split(" ");
  const width = Number(widthStr);
  const height = Number(heightStr);

  return (
    <svg
      viewBox={viewBox}
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
      className={className}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          {DOE_ORANGE_GRADIENT_STOPS.map((stop) => (
            <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
          ))}
        </linearGradient>
        <clipPath id={clipId}>
          <path d={pathD} fillRule="evenodd" />
        </clipPath>
      </defs>

      <path d={pathD} fill={`url(#${gradientId})`} fillRule="evenodd" />

      <g clipPath={`url(#${clipId})`}>
        {diagonalLines(width, height, lineSpacing, lineAngle, LINE_SOFT, 0.55, 0.72)}
        {diagonalLines(width, height, lineSpacing * 1.65, lineAngle + 8, LINE_FAINT, 0.45, 0.55)}
        {accentLines}
      </g>
    </svg>
  );
}

/** Canada over US — Doe orange gradient silhouettes with internal line art, hero right side. */
export function JoinHeroNorthAmericaSilhouettes({ variant }: { variant: "mobile" | "desktop" }) {
  const baseId = useId().replace(/:/g, "");
  const canadaGradId = `${baseId}-canada-grad`;
  const canadaClipId = `${baseId}-canada-clip`;
  const usGradId = `${baseId}-us-grad`;
  const usClipId = `${baseId}-us-clip`;

  const wrapperClass =
    variant === "mobile"
      ? "pointer-events-none absolute right-0 top-[38%] z-[2] flex w-[min(48%,12rem)] -translate-y-1/2 flex-col gap-2 pr-5"
      : "pointer-events-none absolute right-0 top-1/2 z-[2] flex h-[min(80%,22rem)] w-[min(38%,26rem)] -translate-y-1/2 flex-col justify-center gap-[0.65rem] pr-[clamp(1.25rem,2.8vw,2.75rem)]";

  return (
    <div className={wrapperClass} aria-hidden>
      <CountrySilhouette
        pathD={CANADA_PATH}
        viewBox="0 0 220 120"
        lineAngle={-42}
        lineSpacing={11}
        gradientId={canadaGradId}
        clipId={canadaClipId}
        className="h-[52%] w-full min-h-0"
        accentLines={
          <>
            <path
              d="M 18 92 C 70 84 130 86 202 94"
              stroke={LINE}
              strokeWidth={0.65}
              opacity={0.42}
              strokeLinecap="round"
            />
            <path
              d="M 32 62 C 88 56 142 58 196 64"
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
        viewBox="0 0 220 92"
        lineAngle={-56}
        lineSpacing={10}
        gradientId={usGradId}
        clipId={usClipId}
        className="h-[42%] w-full min-h-0"
        accentLines={
          <>
            <line x1={16} y1={46} x2={204} y2={46} stroke={LINE} strokeWidth={0.6} opacity={0.38} strokeLinecap="round" />
            <line x1={24} y1={32} x2={188} y2={32} stroke={LINE_SOFT} strokeWidth={0.5} opacity={0.28} strokeLinecap="round" />
          </>
        }
      />
    </div>
  );
}
