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

/** Loaded Suisse weights only — avoids synthetic bold in foreignObject HTML. */
const SUISSE_FOREIGN_FONT = {
  fontFamily: suisseIntl.style.fontFamily,
  fontSynthesis: "none" as const,
  WebkitFontSmoothing: "antialiased" as const,
};

const SCHEDULING_WEEK = {
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

/** Pull side boxes toward center on Y — Scheduling, Labs, Live, Billing. */
const ORBIT_BOX_Y_INSET: Partial<Record<number, number>> = {
  1: 58, // Scheduling Agent
  2: 58, // Labs Agent
  4: 58, // Live Appointment
  5: 58, // Billing Agent
};

const ORBIT = Array.from({ length: 6 }, (_, i) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / 6;
  const d = ORBIT_BOX_OUTSET[i] ?? 0;
  let x = CX + (RX + d) * Math.cos(a);
  let y = CY + (RY + d) * Math.sin(a);
  const yInset = ORBIT_BOX_Y_INSET[i] ?? 0;
  if (yInset !== 0) {
    y = y > CY ? y - yInset : y + yInset;
  }
  return { x, y };
});

function DayStatusIcon({ x, y, status }: { x: number; y: number; status: "available" | "unavailable" }) {
  const iconSize = 30;
  const scale = iconSize / 12;

  if (status === "available") {
    return (
      <g transform={`translate(${x}, ${y}) scale(${scale}) translate(-6, -6)`}>
        <path
          d="M2 6l2.5 2.5 5.5-5.5"
          stroke={ON_ORANGE_INK}
          strokeWidth="1.85"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
    );
  }

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale}) translate(-6, -6)`}>
      <path
        d="M3 3l6 6M9 3L3 9"
        stroke={ON_ORANGE_MUTED}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
}

function boxContentTop(boxY: number) {
  return boxY + BOX_PAD_Y + ORBIT_ICON_R * 2 + 18;
}

function smoothChartPath(points: [number, number][], tension = 0.36): string {
  if (points.length < 2) return "";
  let path = `M ${points[0][0]} ${points[0][1]}`;

  for (let i = 0; i < points.length - 1; i++) {
    const prev = points[Math.max(0, i - 1)];
    const curr = points[i];
    const next = points[i + 1];
    const after = points[Math.min(points.length - 1, i + 2)];

    const cp1x = curr[0] + (next[0] - prev[0]) * tension;
    const cp1y = curr[1] + (next[1] - prev[1]) * tension;
    const cp2x = next[0] - (after[0] - curr[0]) * tension;
    const cp2y = next[1] - (after[1] - curr[1]) * tension;

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next[0]} ${next[1]}`;
  }

  return path;
}

function labsChartPoints(
  axisLeft: number,
  axisBottom: number,
  plotW: number,
  plotH: number,
): [number, number][] {
  const x = (pct: number) => axisLeft + plotW * pct;
  const y = (pct: number) => axisBottom - plotH * pct;

  return [
    [x(0), y(0.18)],
    [x(0.28), y(0.88)],
    [x(0.54), y(0.15)],
    [x(1), y(0.3)],
  ];
}

function LabsAgentStats({ x, y, width, height }: { x: number; y: number; width: number; height: number }) {
  return (
    <foreignObject x={x} y={y} width={width} height={height}>
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: DOE_ORANGE,
          textAlign: "center",
          ...SUISSE_FOREIGN_FONT,
        }}
      >
        <span style={{ fontSize: 34, fontWeight: 500, lineHeight: 1.1, letterSpacing: "-0.02em" }}>HbA1C</span>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 10 }}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden style={{ flexShrink: 0 }}>
            <path
              d="M12 5v12M7 14l5 5 5-5"
              stroke={DOE_ORANGE}
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span style={{ fontSize: 50, fontWeight: 600, lineHeight: 1.05, letterSpacing: "-0.03em", fontVariantNumeric: "lining-nums" }}>
            6.2%
          </span>
        </div>
      </div>
    </foreignObject>
  );
}

function LabsAgentChart({
  boxX,
  boxY,
  orbGradId,
  orbShadeId,
  orbGrainId,
}: {
  boxX: number;
  boxY: number;
  orbGradId: string;
  orbShadeId: string;
  orbGrainId: string;
}) {
  const innerX = boxX + BOX_PAD_X;
  const innerW = BOX_W - BOX_PAD_X * 2;
  const contentBottom = boxY + BOX_H - BOX_PAD_Y;
  const chartTop = boxContentTop(boxY) + 8;
  const bottomGap = 14;
  const axisLeft = innerX + 24;
  const axisRight = innerX + innerW - 6;
  const statsW = 168;
  const statsGap = 14;
  const plotRight = axisRight - statsW - statsGap;
  const axisBottom = contentBottom - bottomGap;
  const plotTop = chartTop;
  const plotH = axisBottom - plotTop;
  const plotW = plotRight - axisLeft;
  const statsX = plotRight + statsGap;
  const axisStroke = "rgba(210, 119, 76, 0.55)";
  const gridLineStroke = "rgba(210, 119, 76, 0.14)";
  const gridRows = 4;
  const gridCols = 5;

  const points = labsChartPoints(axisLeft, axisBottom, plotW, plotH);
  const linePath = smoothChartPath(points);
  const areaPath = `${linePath} L ${plotRight} ${axisBottom} L ${axisLeft} ${axisBottom} Z`;
  const areaFadeId = `${orbGradId}-area-fade`;

  return (
    <g aria-hidden>
      <defs>
        <linearGradient
          id={areaFadeId}
          gradientUnits="userSpaceOnUse"
          x1={axisLeft}
          y1={plotTop}
          x2={axisLeft}
          y2={axisBottom}
        >
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="34%" stopColor="#FFFFFF" stopOpacity="0.1" />
          <stop offset="68%" stopColor="#FFFFFF" stopOpacity="0.58" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
        </linearGradient>
      </defs>
      <g filter={`url(#${orbGrainId})`}>
        <path d={areaPath} fill={`url(#${orbGradId})`} />
        <path d={areaPath} fill={`url(#${orbShadeId})`} />
      </g>
      <path d={areaPath} fill={`url(#${areaFadeId})`} />

      {Array.from({ length: gridRows - 1 }, (_, i) => {
        const y = plotTop + ((i + 1) / gridRows) * plotH;
        return (
          <line
            key={`labs-grid-h-${i}`}
            x1={axisLeft}
            y1={y}
            x2={plotRight}
            y2={y}
            stroke={gridLineStroke}
            strokeWidth={1}
          />
        );
      })}

      {Array.from({ length: gridCols - 1 }, (_, i) => {
        const x = axisLeft + ((i + 1) / gridCols) * plotW;
        return (
          <line
            key={`labs-grid-v-${i}`}
            x1={x}
            y1={plotTop}
            x2={x}
            y2={axisBottom}
            stroke={gridLineStroke}
            strokeWidth={1}
          />
        );
      })}

      <line x1={axisLeft} y1={plotTop} x2={axisLeft} y2={axisBottom} stroke={axisStroke} strokeWidth={2} strokeLinecap="round" />
      <line x1={axisLeft} y1={axisBottom} x2={plotRight} y2={axisBottom} stroke={axisStroke} strokeWidth={2} strokeLinecap="round" />
      <path
        d={linePath}
        fill="none"
        stroke={DOE_ORANGE}
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {points.map(([px, py], i) => (
        <circle
          key={`labs-point-${i}`}
          cx={px}
          cy={py}
          r={6.5}
          fill={DOE_ORANGE}
          stroke="#FFFFFF"
          strokeWidth={2.2}
        />
      ))}
      <LabsAgentStats x={statsX} y={plotTop} width={statsW} height={plotH} />
    </g>
  );
}

function SchedulingBookingLoading({ x, y, width }: { x: number; y: number; width: number }) {
  return (
    <foreignObject x={x} y={y} width={width} height={56}>
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
          overflow: "hidden",
        }}
      >
        <span
          className="shrink-0 animate-spin rounded-full border-[2px] border-[#D9D4CC] border-r-transparent border-b-transparent"
          style={{ width: 20, height: 20, animationDuration: "1.1s", display: "block" }}
          aria-hidden
        />
        <span
          style={{
            flex: 1,
            minWidth: 0,
            fontSize: 30,
            color: "#78716C",
            fontWeight: 500,
            lineHeight: 1.2,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          Booking Sarah Walsh for Wed...
        </span>
      </div>
    </foreignObject>
  );
}

function SchedulingAgentCalendar({
  boxX,
  boxY,
  orbGradId,
  orbShadeId,
  orbGrainId,
}: {
  boxX: number;
  boxY: number;
  orbGradId: string;
  orbShadeId: string;
  orbGrainId: string;
}) {
  const innerX = boxX + BOX_PAD_X;
  const innerW = BOX_W - BOX_PAD_X * 2;
  const contentTop = boxContentTop(boxY) + 6;
  const loadingH = 56;
  const loadingGap = 12;
  const colH = 176;
  const colGap = 12;
  const colW = (innerW - colGap * 4) / 5;
  const colRx = 12;
  const colsTop = contentTop;
  const colLabelY = colsTop + 22;
  const colDateY = colsTop + 64;
  const colDateFontSize = 44;
  const statusZoneTop = colDateY + colDateFontSize / 2;
  const statusZoneBottom = colsTop + colH;
  const colStatusY = (statusZoneTop + statusZoneBottom) / 2;
  const loadingY = colsTop + colH + loadingGap;

  return (
    <g aria-hidden>
      {SCHEDULING_WEEK.days.map((day, i) => {
        const x = innerX + i * (colW + colGap);
        const cx = x + colW / 2;

        return (
          <g key={day.label}>
            <g filter={`url(#${orbGrainId})`}>
              <rect x={x} y={colsTop} width={colW} height={colH} rx={colRx} fill={`url(#${orbGradId})`} />
              <rect x={x} y={colsTop} width={colW} height={colH} rx={colRx} fill={`url(#${orbShadeId})`} />
            </g>
            <text
              x={cx}
              y={colLabelY}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={ON_ORANGE_MUTED}
              fontSize={24}
              fontWeight={500}
              fontFamily={suisseIntl.style.fontFamily}
            >
              {day.label}
            </text>
            <text
              x={cx}
              y={colDateY}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={ON_ORANGE_INK}
              fontSize={colDateFontSize}
              fontWeight={500}
              fontFamily={suisseIntl.style.fontFamily}
              letterSpacing="-0.02em"
            >
              {day.date}
            </text>
            <DayStatusIcon x={cx} y={colStatusY} status={day.status} />
          </g>
        );
      })}

      <SchedulingBookingLoading x={innerX} y={loadingY} width={innerW} />
    </g>
  );
}

function VoiceAgentMicIcon({ cx, cy, size }: { cx: number; cy: number; size: number }) {
  const scale = size / 24;

  return (
    <g
      transform={`translate(${cx}, ${cy}) scale(${scale}) translate(-12, -12)`}
      fill="none"
      stroke="#FFFFFF"
      strokeWidth={1.35}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={0.94}
    >
      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
      <path d="M19 10v2a7 7 0 01-14 0v-2" />
      <path d="M12 19v4M8 23h8" />
    </g>
  );
}

function VoiceAgentSpeakingOrb({
  boxX,
  boxY,
  orbGradId,
  orbShadeId,
  orbGrainId,
}: {
  boxX: number;
  boxY: number;
  orbGradId: string;
  orbShadeId: string;
  orbGrainId: string;
}) {
  const contentTop = boxContentTop(boxY);
  const orbLayoutR = 96;
  const orbDrawR = 110;
  const cx = boxX + BOX_PAD_X + orbLayoutR + 8;
  const cy = contentTop + 28 + orbLayoutR;
  const clipId = `${orbGrainId}-clip`;
  const quoteGap = 34;
  const quoteX = cx + orbDrawR + quoteGap;
  const quoteW = boxX + BOX_W - BOX_PAD_X - quoteX;
  const quoteY = cy - orbLayoutR;

  return (
    <g aria-hidden>
      <defs>
        <clipPath id={clipId}>
          <circle cx={cx} cy={cy} r={orbDrawR} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <g filter={`url(#${orbGrainId})`}>
          <circle cx={cx} cy={cy} r={orbDrawR} fill={`url(#${orbGradId})`} />
          <circle cx={cx} cy={cy} r={orbDrawR} fill={`url(#${orbShadeId})`} />
        </g>
        <VoiceAgentMicIcon cx={cx} cy={cy} size={82} />
      </g>
      <foreignObject x={quoteX} y={quoteY} width={quoteW} height={orbLayoutR * 2}>
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          className={suisseIntl.className}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "10px",
            height: "100%",
            ...SUISSE_FOREIGN_FONT,
          }}
        >
          <span
            style={{
              ...SUISSE_FOREIGN_FONT,
              alignSelf: "flex-start",
              display: "inline-flex",
              fontSize: 32,
              color: "#78716C",
              fontWeight: 400,
              lineHeight: 1.2,
              letterSpacing: "0.02em",
              fontFeatureSettings: '"lnum" 1',
              fontVariantNumeric: "lining-nums",
              background: "#FAFAF8",
              border: "1px solid #EDE9E2",
              borderRadius: "10px",
              padding: "8px 14px",
              boxSizing: "border-box",
            }}
          >
            (416) 555-0142
          </span>
          <span
            style={{
              ...SUISSE_FOREIGN_FONT,
              fontSize: 36,
              color: AGENT_INK,
              fontWeight: 500,
              lineHeight: 1.28,
              letterSpacing: "-0.02em",
            }}
          >
            &ldquo;Hi this is Sarah Walsh, can I get a refill?&rdquo;
          </span>
        </div>
      </foreignObject>
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
  const voiceOrbGrad = `${id}-voice-orb-grad`;
  const voiceOrbShade = `${id}-voice-orb-shade`;
  const voiceOrbGrain = `${id}-voice-orb-grain`;
  const countryGrain = `${id}-country-grain`;

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

          <radialGradient id={voiceOrbGrad} cx="38%" cy="34%" fx="34%" fy="28%" r="72%">
            <stop offset="0%" stopColor="#E7A944" />
            <stop offset="38%" stopColor="#D49D4F" />
            <stop offset="72%" stopColor="#D2774C" />
            <stop offset="100%" stopColor="#C47A5A" />
          </radialGradient>

          <radialGradient id={voiceOrbShade} cx="74%" cy="80%" r="58%">
            <stop offset="0%" stopColor="#D2774C" stopOpacity="0.38" />
            <stop offset="55%" stopColor="#C47A5A" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#C47A5A" stopOpacity="0" />
          </radialGradient>

          <filter id={voiceOrbGrain} x="-8%" y="-8%" width="116%" height="116%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="1.05" numOctaves="2" stitchTiles="stitch" result="noise" />
            <feColorMatrix in="noise" type="saturate" values="0" result="monoNoise" />
            <feComponentTransfer in="monoNoise" result="faintNoise">
              <feFuncA type="linear" slope="0.14" intercept="0" />
            </feComponentTransfer>
            <feComposite in="faintNoise" in2="SourceGraphic" operator="in" result="maskedNoise" />
            <feBlend in="SourceGraphic" in2="maskedNoise" mode="overlay" />
          </filter>

          <filter id={countryGrain} x="-4%" y="-4%" width="108%" height="108%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="3" stitchTiles="stitch" result="noise" />
            <feColorMatrix in="noise" type="saturate" values="0" result="monoNoise" />
            <feComponentTransfer in="monoNoise" result="faintNoise">
              <feFuncA type="linear" slope="0.22" intercept="0" />
            </feComponentTransfer>
            <feComposite in="faintNoise" in2="SourceGraphic" operator="in" result="maskedNoise" />
            <feBlend in="SourceGraphic" in2="maskedNoise" mode="overlay" />
          </filter>
        </defs>

        <g
          className={joinHeroBoxRevealClass(revealed)}
          style={{ animationDelay: joinHeroBoxRevealDelay(revealed, 0) }}
          filter={`url(#${countryGrain})`}
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
            {i === 0 ? (
              <VoiceAgentSpeakingOrb
                boxX={pt.x - BOX_W / 2}
                boxY={pt.y - BOX_H / 2}
                orbGradId={voiceOrbGrad}
                orbShadeId={voiceOrbShade}
                orbGrainId={voiceOrbGrain}
              />
            ) : null}
            <OrbitAgentRow
              boxX={pt.x - BOX_W / 2}
              boxY={pt.y - BOX_H / 2}
              name={ORBIT_AGENTS[i]}
            />
            {i === 1 ? (
              <SchedulingAgentCalendar
                boxX={pt.x - BOX_W / 2}
                boxY={pt.y - BOX_H / 2}
                orbGradId={voiceOrbGrad}
                orbShadeId={voiceOrbShade}
                orbGrainId={voiceOrbGrain}
              />
            ) : null}
            {i === 2 ? (
              <LabsAgentChart
                boxX={pt.x - BOX_W / 2}
                boxY={pt.y - BOX_H / 2}
                orbGradId={voiceOrbGrad}
                orbShadeId={voiceOrbShade}
                orbGrainId={voiceOrbGrain}
              />
            ) : null}
          </g>
          );
        })}
      </svg>
    </div>
  );
}
