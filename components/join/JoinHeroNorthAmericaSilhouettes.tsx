"use client";

/**
 * Canada + USA silhouettes.
 * Uses SVG <mask> + <feComponentTransfer> invert filter so the black-on-white
 * JPG images correctly mask an orange gradient fill (black country → shows orange,
 * white background → transparent).
 */
import { useId } from "react";
import { suisseIntl } from "@/lib/home/fonts";
import { useJoinHeroScrollReveal, joinHeroBoxRevealClass, joinHeroBoxRevealDelay, JOIN_HERO_BOX_RISE_DURATION_MS, JOIN_HERO_BOX_SEQUENCE_GAP_MS } from "@/lib/join/use-join-hero-scroll-reveal";

const AGENT_INK = "#1E343A";
const DOE_ORANGE = "#D2774C";
const ON_ORANGE_INK = "#FFFFFF";
const ON_ORANGE_MUTED = "rgba(255, 255, 255, 0.82)";
const DAY_MUTED = "rgba(30, 52, 58, 0.52)";

const SCHEDULING_WEEK = {
  range: "Jun 23 – Jun 27",
  days: [
    { label: "Mon", date: 23, status: "available" as const },
    { label: "Tue", date: 24, status: "unavailable" as const },
    { label: "Wed", date: 25, status: "available" as const },
    { label: "Thu", date: 26, status: "unavailable" as const },
    { label: "Fri", date: 27, status: "available" as const },
  ],
};

const ORBIT_AGENTS = [
  "Voice Agent",
  "Scheduling Agent",
  "Labs Agent",
  "Referrals Agent",
  "Live Appointment",
  "Billing Agent",
] as const;

const ORBIT_ICON_R = 16;
const ORBIT_LABEL_SIZE = 38;
const BOX_PAD_X = 42;
const BOX_PAD_Y = 40;
const ROW_ICON_TEXT_GAP = 16;

const GRADIENT_STOPS = [
  { offset: "0%",   color: "#E7A944" },
  { offset: "30%",  color: "#D49D4F" },
  { offset: "62%",  color: "#D2774C" },
  { offset: "100%", color: "#C47A5A" },
] as const;

const VW = 2100;
const VH = 1960;
const VOX = -860;
const VOY = -760;

// Canada + USA centered on the orbit hub (CX, CY) — scaled up within box clearance
const CA = { x: -225, y: -281, w: 850, h: 525 };
const US = { x: -232, y: 194, w: 864, h: 517 };

/** Zoom map art inside the fixed clip rects — larger silhouettes without moving white boxes. */
const COUNTRY_IMAGE_SCALE = 1.14;

function scaledMapImage(box: { x: number; y: number; w: number; h: number }) {
  const w = box.w * COUNTRY_IMAGE_SCALE;
  const h = box.h * COUNTRY_IMAGE_SCALE;
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  return { x: cx - w / 2, y: cy - h / 2, w, h };
}

const CA_MAP = scaledMapImage(CA);
const US_MAP = scaledMapImage(US);

// Composition center for orbit layout — elliptical so top/bottom rings sit closer
const CX = 200;
const CY = 215;
const RX = 792;
const RY = 652;

const BOX_W = 614;
const BOX_H = 382;
const BOX_RX = 51;

/** Extra radial push for individual orbit boxes (index → outset). */
const ORBIT_BOX_OUTSET: Partial<Record<number, number>> = {
  0: 42, // Voice Agent — top
  3: 42, // Referrals Agent — bottom
};

const ORBIT = Array.from({ length: 6 }, (_, i) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / 6;
  const d = ORBIT_BOX_OUTSET[i] ?? 0;
  return { x: CX + (RX + d) * Math.cos(a), y: CY + (RY + d) * Math.sin(a) };
});

function DayStatusIcon({ x, y, status }: { x: number; y: number; status: "available" | "unavailable" }) {
  const scale = 2.45;

  if (status === "available") {
    return (
      <g transform={`translate(${x}, ${y}) scale(${scale}) translate(-9, -9)`}>
        <path
          d="M2.5 5.2l2.2 2.2 5-5.4"
          stroke={ON_ORANGE_INK}
          strokeWidth="1.85"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    );
  }

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale}) translate(-9, -9)`}>
      <path d="M3 3l6 6M9 3L3 9" stroke={ON_ORANGE_MUTED} strokeWidth="1.8" strokeLinecap="round" />
    </g>
  );
}

function boxContentTop(boxY: number) {
  return boxY + BOX_PAD_Y + ORBIT_ICON_R * 2 + 18;
}

function LabsAgentChart({ boxX, boxY, fillGradId }: { boxX: number; boxY: number; fillGradId: string }) {
  const innerX = boxX + BOX_PAD_X;
  const innerW = BOX_W - BOX_PAD_X * 2;
  const chartTop = boxContentTop(boxY) + 12;
  const chartH = 196;
  const axisLeft = innerX + 24;
  const axisBottom = chartTop + chartH - 10;
  const axisRight = innerX + innerW - 6;
  const plotTop = chartTop + 10;
  const plotH = axisBottom - plotTop;

  const points: [number, number][] = [
    [axisLeft, axisBottom - plotH * 0.16],
    [axisLeft + (axisRight - axisLeft) * 0.2, axisBottom - plotH * 0.28],
    [axisLeft + (axisRight - axisLeft) * 0.42, axisBottom - plotH * 0.36],
    [axisLeft + (axisRight - axisLeft) * 0.66, axisBottom - plotH * 0.58],
    [axisRight, axisBottom - plotH * 0.84],
  ];

  const linePath = points.map(([x, y], idx) => `${idx === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
  const areaPath = `${linePath} L ${axisRight} ${axisBottom} L ${axisLeft} ${axisBottom} Z`;
  const axisStroke = "rgba(30, 52, 58, 0.16)";

  return (
    <g aria-hidden>
      <line x1={axisLeft} y1={plotTop} x2={axisLeft} y2={axisBottom} stroke={axisStroke} strokeWidth={2} strokeLinecap="round" />
      <line x1={axisLeft} y1={axisBottom} x2={axisRight} y2={axisBottom} stroke={axisStroke} strokeWidth={2} strokeLinecap="round" />
      <path d={areaPath} fill={`url(#${fillGradId})`} />
      <path
        d={linePath}
        fill="none"
        stroke={DOE_ORANGE}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

function SchedulingBookingLoading({ x, y, width }: { x: number; y: number; width: number }) {
  return (
    <foreignObject x={x} y={y} width={width} height={54}>
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        className={suisseIntl.className}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          height: "100%",
          borderRadius: "10px",
          background: "#FAFAF8",
          padding: "0 16px",
          boxSizing: "border-box",
        }}
      >
        <span
          className="shrink-0 animate-spin rounded-full border-[2px] border-[#D9D4CC] border-r-transparent border-b-transparent"
          style={{ width: 19, height: 19, animationDuration: "1.1s", display: "block" }}
          aria-hidden
        />
        <span style={{ fontSize: 27, color: "#78716C", fontWeight: 500, lineHeight: 1.2 }}>
          Booking Sarah Walsh for Wed...
        </span>
      </div>
    </foreignObject>
  );
}

function SchedulingAgentCalendar({ boxX, boxY }: { boxX: number; boxY: number }) {
  const innerX = boxX + BOX_PAD_X;
  const innerW = BOX_W - BOX_PAD_X * 2;
  const headerBottom = boxContentTop(boxY);
  const rangeBoxTop = headerBottom + 22;
  const rangeBoxH = 44;
  const rangeBoxW = 248;
  const colsTop = rangeBoxTop + rangeBoxH + 18;
  const colH = 132;
  const colGap = 12;
  const colW = (innerW - colGap * 4) / 5;
  const colRx = 12;
  const dayLabelY = colsTop + 26;
  const dateY = colsTop + 68;
  const statusY = colsTop + colH - 22;
  const loadingY = colsTop + colH + 14;

  return (
    <g aria-hidden>
      <rect
        x={innerX}
        y={rangeBoxTop}
        width={rangeBoxW}
        height={rangeBoxH}
        rx={10}
        fill="#FAFAF8"
        stroke="rgba(30, 52, 58, 0.1)"
        strokeWidth={1.2}
      />
      <text
        x={innerX + 18}
        y={rangeBoxTop + rangeBoxH / 2}
        dominantBaseline="middle"
        fill={DAY_MUTED}
        fontSize={28}
        fontWeight={500}
        fontFamily={suisseIntl.style.fontFamily}
        letterSpacing="-0.01em"
      >
        {SCHEDULING_WEEK.range}
      </text>

      {SCHEDULING_WEEK.days.map((day, i) => {
        const x = innerX + i * (colW + colGap);
        const cx = x + colW / 2;

        return (
          <g key={day.label}>
            <rect x={x} y={colsTop} width={colW} height={colH} rx={colRx} fill={DOE_ORANGE} />
            <text
              x={cx}
              y={dayLabelY}
              textAnchor="middle"
              fill={ON_ORANGE_MUTED}
              fontSize={24}
              fontWeight={500}
              fontFamily={suisseIntl.style.fontFamily}
            >
              {day.label}
            </text>
            <text
              x={cx}
              y={dateY}
              textAnchor="middle"
              fill={ON_ORANGE_INK}
              fontSize={42}
              fontWeight={500}
              fontFamily={suisseIntl.style.fontFamily}
              letterSpacing="-0.02em"
            >
              {day.date}
            </text>
            <DayStatusIcon x={cx} y={statusY} status={day.status} />
          </g>
        );
      })}

      <SchedulingBookingLoading x={innerX} y={loadingY} width={innerW} />
    </g>
  );
}

function OrbitAgentRow({ boxX, boxY, name }: { boxX: number; boxY: number; name: string }) {
  const iconCx = boxX + BOX_PAD_X + ORBIT_ICON_R;
  const iconCy = boxY + BOX_PAD_Y + ORBIT_ICON_R;
  const textX = iconCx + ORBIT_ICON_R + ROW_ICON_TEXT_GAP;

  return (
    <g aria-hidden>
      <g transform={`translate(${iconCx}, ${iconCy})`}>
        <circle cx={0} cy={0} r={ORBIT_ICON_R * 0.78} stroke={AGENT_INK} strokeWidth={2.2} fill="none" />
        <circle cx={0} cy={0} r={ORBIT_ICON_R * 0.22} fill={AGENT_INK} />
        <path
          d={`M0 ${-ORBIT_ICON_R}v${ORBIT_ICON_R * 0.38}M0 ${ORBIT_ICON_R * 0.42}v${ORBIT_ICON_R * 0.58}M${-ORBIT_ICON_R} 0h${ORBIT_ICON_R * 0.38}M${ORBIT_ICON_R * 0.42} 0h${ORBIT_ICON_R * 0.58}`}
          stroke={AGENT_INK}
          strokeWidth={1.8}
          strokeLinecap="round"
          opacity={0.42}
        />
      </g>
      <text
        x={textX}
        y={iconCy}
        dominantBaseline="middle"
        textAnchor="start"
        fill={AGENT_INK}
        fontSize={ORBIT_LABEL_SIZE}
        fontWeight={500}
        fontFamily={suisseIntl.style.fontFamily}
        letterSpacing="-0.02em"
      >
        {name}
      </text>
    </g>
  );
}

export function JoinHeroNorthAmericaSilhouettes({ variant }: { variant: "mobile" | "desktop" }) {
  const id = useId().replace(/:/g, "");
  const { ref, revealed } = useJoinHeroScrollReveal();

  const wrapperClass =
    variant === "mobile"
      ? "pointer-events-none absolute right-[clamp(0,0.75vw,0.75rem)] top-[42%] z-[2] -translate-y-1/2 translate-x-3 scale-[0.965] w-[min(78%,26rem)] overflow-visible origin-center"
      : "pointer-events-none absolute right-[clamp(0.25rem,1.5vw,1.25rem)] top-1/2 z-[2] -translate-y-1/2 translate-x-6 scale-[0.965] w-[min(72%,58rem)] overflow-visible origin-center";

  const caGrad  = `${id}-ca-grad`;
  const usGrad  = `${id}-us-grad`;
  const caMask  = `${id}-ca-mask`;
  const usMask  = `${id}-us-mask`;
  const invertF = `${id}-invert`;
  const labsFillGrad = `${id}-labs-fill`;

  return (
    <div ref={ref} className={`${wrapperClass} ${suisseIntl.className}`} aria-hidden>
      <svg
        viewBox={`${VOX} ${VOY} ${VW} ${VH}`}
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full overflow-visible"
        style={{ overflow: "visible" }}
      >
        <defs>
          <filter id={invertF} colorInterpolationFilters="sRGB">
            <feComponentTransfer>
              <feFuncR type="linear" slope="-1" intercept="1" />
              <feFuncG type="linear" slope="-1" intercept="1" />
              <feFuncB type="linear" slope="-1" intercept="1" />
            </feComponentTransfer>
          </filter>

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

          <mask id={caMask}>
            <image
              href="/images/canada-map.jpg"
              x={CA_MAP.x} y={CA_MAP.y}
              width={CA_MAP.w} height={CA_MAP.h}
              preserveAspectRatio="xMidYMid meet"
              filter={`url(#${invertF})`}
            />
          </mask>

          <mask id={usMask}>
            <image
              href="/images/usa-map.jpg"
              x={US_MAP.x} y={US_MAP.y}
              width={US_MAP.w} height={US_MAP.h}
              preserveAspectRatio="xMidYMid meet"
              filter={`url(#${invertF})`}
            />
          </mask>

          <linearGradient id={labsFillGrad} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D2774C" stopOpacity="0.42" />
            <stop offset="52%" stopColor="#D2774C" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#D2774C" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g
          className={joinHeroBoxRevealClass(revealed)}
          style={{ animationDelay: joinHeroBoxRevealDelay(revealed, 0) }}
        >
          <rect x={CA.x} y={CA.y} width={CA.w} height={CA.h} fill={`url(#${caGrad})`} mask={`url(#${caMask})`} />
          <rect x={US.x} y={US.y} width={US.w} height={US.h} fill={`url(#${usGrad})`} mask={`url(#${usMask})`} />
        </g>

        <style>{`
          .${id}-box rect {
            stroke: none;
          }
        `}</style>

        {ORBIT.map((pt, i) => {
          const boxRevealBase = JOIN_HERO_BOX_RISE_DURATION_MS + JOIN_HERO_BOX_SEQUENCE_GAP_MS;

          return (
          <g
            key={`box-${i}`}
            className={`${joinHeroBoxRevealClass(revealed)} ${id}-box`}
            style={{ animationDelay: joinHeroBoxRevealDelay(revealed, i, boxRevealBase) }}
          >
            <rect
              x={pt.x - BOX_W / 2} y={pt.y - BOX_H / 2}
              width={BOX_W} height={BOX_H}
              rx={BOX_RX}
              fill="#FFFFFF"
              stroke="none"
            />
            <OrbitAgentRow
              boxX={pt.x - BOX_W / 2}
              boxY={pt.y - BOX_H / 2}
              name={ORBIT_AGENTS[i]}
            />
            {i === 1 ? (
              <SchedulingAgentCalendar boxX={pt.x - BOX_W / 2} boxY={pt.y - BOX_H / 2} />
            ) : null}
            {i === 2 ? (
              <LabsAgentChart
                boxX={pt.x - BOX_W / 2}
                boxY={pt.y - BOX_H / 2}
                fillGradId={labsFillGrad}
              />
            ) : null}
          </g>
          );
        })}
      </svg>
    </div>
  );
}
