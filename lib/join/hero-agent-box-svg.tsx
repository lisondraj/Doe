"use client";

import { useId } from "react";
import { dmSans, suisseIntl, suisseIntlLight } from "@/lib/home/fonts";

const AGENT_INK = "#1E343A";
const DOE_ORANGE = "#D2774C";
const ON_ORANGE_INK = "#FFFFFF";
const ON_ORANGE_MUTED = "rgba(255, 255, 255, 0.82)";

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

export const HERO_AGENT_LABELS = [
  "Voice Agent",
  "Scheduling Agent",
  "Labs Agent",
  "Referrals Agent",
  "Live Appointment",
  "Billing Agent",
] as const;

export type HeroAgentIndex = 0 | 1 | 2 | 3 | 4 | 5;
export type HeroAgentPreviewIndex = 0 | 1 | 2 | 3;

export const HERO_AGENT_BOX_W = 614;
export const HERO_AGENT_BOX_H = 382;
export const HERO_AGENT_BOX_RX = 51;

const ORBIT_ICON_R = 16;
const ORBIT_LABEL_SIZE = 38;
const BOX_PAD_X = 42;
const BOX_PAD_Y = 40;
const ROW_ICON_TEXT_GAP = 16;
const BOX_W = HERO_AGENT_BOX_W;
const BOX_H = HERO_AGENT_BOX_H;
const BOX_RX = HERO_AGENT_BOX_RX;

export function HeroAgentBoxGrainFilter({ id }: { id: string }) {
  return (
    <filter id={id} x="-8%" y="-8%" width="116%" height="116%" colorInterpolationFilters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="1.05" numOctaves="2" stitchTiles="stitch" result="noise" />
      <feColorMatrix in="noise" type="saturate" values="0" result="monoNoise" />
      <feComponentTransfer in="monoNoise" result="faintNoise">
        <feFuncA type="linear" slope="0.14" intercept="0" />
      </feComponentTransfer>
      <feComposite in="faintNoise" in2="SourceGraphic" operator="in" result="maskedNoise" />
      <feBlend in="SourceGraphic" in2="maskedNoise" mode="overlay" />
    </filter>
  );
}

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
  const cx = x + width / 2;
  const labelFontSize = 26;
  const valueFontSize = 50;
  const rowGap = 10;
  const arrowSize = 44;
  const valueLineH = valueFontSize * 1.05;
  const blockH = labelFontSize * 1.1 + rowGap + Math.max(arrowSize, valueLineH);
  const blockTop = y + (height - blockH) / 2;
  const rowCenterY = blockTop + labelFontSize * 1.1 + rowGap + Math.max(arrowSize, valueLineH) / 2;
  const valueApproxW = valueFontSize * 2.15;
  const gap = 12;
  const groupW = arrowSize + gap + valueApproxW;
  const groupLeft = cx - groupW / 2;
  const arrowX = groupLeft;
  const valueX = groupLeft + arrowSize + gap;
  const arrowScale = arrowSize / 24;

  return (
    <g aria-hidden>
      <text
        x={cx}
        y={blockTop}
        dominantBaseline="hanging"
        textAnchor="middle"
        fill="#78716C"
        fontSize={labelFontSize}
        fontWeight={500}
        fontFamily={suisseIntl.style.fontFamily}
        letterSpacing="0.14em"
      >
        HBA1C
      </text>
      <g transform={`translate(${arrowX}, ${rowCenterY - 12 * arrowScale}) scale(${arrowScale})`}>
        <path
          d="M12 5v12M7 14l5 5 5-5"
          stroke={DOE_ORANGE}
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
      <text
        x={valueX}
        y={rowCenterY}
        dominantBaseline="middle"
        textAnchor="start"
        fill={DOE_ORANGE}
        fontSize={valueFontSize}
        fontWeight={600}
        fontFamily={suisseIntl.style.fontFamily}
        letterSpacing="-0.03em"
      >
        6.2%
      </text>
    </g>
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
        <path d={areaPath} fill={DOE_ORANGE} />
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

const LIVE_APPT_STEPS = [
  { status: "done" as const, label: "AI scanning patient chart" },
  { status: "done" as const, label: "Pulling patient information" },
  { status: "loading" as const, label: "Gathering clinical evidence" },
];

function LiveAppointmentSteps({ boxX, boxY }: { boxX: number; boxY: number }) {
  const innerX = boxX + BOX_PAD_X;
  const innerW = BOX_W - BOX_PAD_X * 2;
  const contentTop = boxContentTop(boxY) + 8;
  const contentBottom = boxY + BOX_H - BOX_PAD_Y;
  const rowGap = 12;
  const rowCount = LIVE_APPT_STEPS.length;
  const rowH = Math.floor((contentBottom - contentTop - rowGap * (rowCount - 1)) / rowCount);

  return (
    <foreignObject x={innerX} y={contentTop} width={innerW} height={contentBottom - contentTop}>
      <div
        className={suisseIntl.className}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: rowGap,
          height: "100%",
          ...SUISSE_FOREIGN_FONT,
        }}
      >
        {LIVE_APPT_STEPS.map((step) => (
          <div
            key={step.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              flex: 1,
              minHeight: rowH,
              borderRadius: 12,
              background: "#FAFAF8",
              border: "1px solid #EDE9E2",
              padding: "0 18px",
              boxSizing: "border-box",
              overflow: "hidden",
            }}
          >
            {step.status === "done" ? (
              <svg width="24" height="24" viewBox="0 0 22 22" fill="none" aria-hidden style={{ flexShrink: 0 }}>
                <circle cx="11" cy="11" r="11" fill={DOE_ORANGE} />
                <path
                  d="M6.5 11.2l2.4 2.4 6.2-6.4"
                  stroke="#FFFFFF"
                  strokeWidth="1.85"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <span
                className="shrink-0 animate-spin rounded-full border-[2px] border-[#D9D4CC] border-r-transparent border-b-transparent"
                style={{ width: 22, height: 22, animationDuration: "1.1s", display: "block" }}
                aria-hidden
              />
            )}
            <span
              style={{
                flex: 1,
                minWidth: 0,
                fontSize: 30,
                color: step.status === "done" ? AGENT_INK : "#78716C",
                fontWeight: 500,
                lineHeight: 1.2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </foreignObject>
  );
}

function BillingAgentRevenue({
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
  const contentBottom = boxY + BOX_H - BOX_PAD_Y;
  const cardRx = 14;
  const rowGap = 10;
  const rowH = 56;
  const rowCount = 2;
  const rowsH = rowH * rowCount + rowGap * (rowCount - 1);
  const cardGap = 14;
  const cardH = (contentBottom - contentTop) - rowsH - cardGap;
  const cardPadX = 28;

  // Revenue card text positions
  const amountFontSize = 64;
  const labelFontSize = 26;
  const labelY = contentTop + cardPadX;
  const amountY = contentTop + cardH / 2 + 8;

  // Claim rows below the card
  const rowsTop = contentTop + cardH + cardGap;
  const rows = [
    { label: "6 claims processed",  done: true  },
    { label: "2 prior auths pending", done: false },
  ];

  return (
    <g aria-hidden>
      {/* Orange revenue card */}
      <g filter={`url(#${orbGrainId})`}>
        <rect x={innerX} y={contentTop} width={innerW} height={cardH} rx={cardRx} fill={DOE_ORANGE} />
      </g>
      <text
        x={innerX + cardPadX}
        y={amountY}
        dominantBaseline="middle"
        fill={ON_ORANGE_INK}
        fontSize={amountFontSize}
        letterSpacing="-0.03em"
      >
        <tspan fontFamily={suisseIntlLight.style.fontFamily} fontWeight={300}>
          $
        </tspan>
        <tspan fontFamily={dmSans.style.fontFamily} fontWeight={300}>
          8,640
        </tspan>
      </text>
      <text
        x={innerX + innerW - cardPadX}
        y={amountY}
        textAnchor="end"
        dominantBaseline="middle"
        fill={ON_ORANGE_MUTED}
        fontSize={labelFontSize}
        fontWeight={500}
        fontFamily={suisseIntl.style.fontFamily}
        letterSpacing="0.01em"
      >
        Approved today
      </text>

      {/* Claim rows */}
      {rows.map((row, i) => {
        const y = rowsTop + i * (rowH + rowGap);
        return (
          <foreignObject key={row.label} x={innerX} y={y} width={innerW} height={rowH}>
            <div
              className={suisseIntl.className}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                height: "100%",
                borderRadius: "10px",
                background: "#FAFAF8",
                border: "1px solid #EDE9E2",
                padding: "0 18px",
                boxSizing: "border-box",
                overflow: "hidden",
                ...SUISSE_FOREIGN_FONT,
              }}
            >
              {row.done ? (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden style={{ flexShrink: 0 }}>
                  <circle cx="11" cy="11" r="11" fill={DOE_ORANGE} />
                  <path d="M6.5 11.2l2.4 2.4 6.2-6.4" stroke="#FFFFFF" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <span
                  className="shrink-0 animate-spin rounded-full border-[2px] border-[#D9D4CC] border-r-transparent border-b-transparent"
                  style={{ width: 20, height: 20, animationDuration: "1.1s", display: "block" }}
                  aria-hidden
                />
              )}
              <span
                style={{
                  flex: 1,
                  minWidth: 0,
                  fontSize: 30,
                  color: row.done ? AGENT_INK : "#78716C",
                  fontWeight: 500,
                  lineHeight: 1.2,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {row.label}
              </span>
            </div>
          </foreignObject>
        );
      })}
    </g>
  );
}

function ReferralsAgentCard({
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
  const contentTop = boxContentTop(boxY) + 8;
  const nameFontSize = 48;
  const referralFontSize = 38;
  const cardPadY = 32;
  const cardPadX = 32;
  const cardLineGap = 18;
  const cardRx = 16;
  const nameLineH = nameFontSize * 1.12;
  const referralLineH = referralFontSize * 1.18;
  const cardH = cardPadY * 2 + nameLineH + cardLineGap + referralLineH;
  const dyspneaGap = 16;
  const dyspneaFontSize = 32;
  const dyspneaY = contentTop + cardH + dyspneaGap;

  return (
    <g aria-hidden>
      <g filter={`url(#${orbGrainId})`}>
        <rect x={innerX} y={contentTop} width={innerW} height={cardH} rx={cardRx} fill={DOE_ORANGE} />
      </g>
      <foreignObject x={innerX} y={contentTop} width={innerW} height={cardH}>
        <div
          className={suisseIntl.className}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: `${cardLineGap}px`,
            height: "100%",
            padding: `0 ${cardPadX}px`,
            boxSizing: "border-box",
            ...SUISSE_FOREIGN_FONT,
          }}
        >
          <span
            style={{
              fontSize: nameFontSize,
              color: ON_ORANGE_INK,
              fontWeight: 500,
              lineHeight: 1.12,
              letterSpacing: "-0.02em",
            }}
          >
            Sarah Walsh
          </span>
          <span
            style={{
              fontSize: referralFontSize,
              color: ON_ORANGE_INK,
              fontWeight: 500,
              lineHeight: 1.18,
              letterSpacing: "-0.015em",
            }}
          >
            Referral to Cardiology
          </span>
        </div>
      </foreignObject>
      <text
        x={innerX + cardPadX}
        y={dyspneaY}
        dominantBaseline="hanging"
        fill="#78716C"
        fontSize={dyspneaFontSize}
        fontWeight={500}
        fontFamily={suisseIntl.style.fontFamily}
        letterSpacing="-0.01em"
      >
        Recent dyspnea on exertion
      </text>
    </g>
  );
}

function SchedulingBookingLoading({ x, y, width }: { x: number; y: number; width: number }) {
  return (
    <foreignObject x={x} y={y} width={width} height={56}>
      <div
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
              <rect x={x} y={colsTop} width={colW} height={colH} rx={colRx} fill={DOE_ORANGE} />
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
  const phoneFontSize = 24;
  const phoneLineH = phoneFontSize * 1.2;
  const phoneQuoteGap = 10;
  const quoteBlockY = quoteY + phoneLineH + phoneQuoteGap;

  return (
    <g aria-hidden>
      <defs>
        <clipPath id={clipId}>
          <circle cx={cx} cy={cy} r={orbDrawR} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <g filter={`url(#${orbGrainId})`}>
          <circle cx={cx} cy={cy} r={orbDrawR} fill={DOE_ORANGE} />
        </g>
        <VoiceAgentMicIcon cx={cx} cy={cy} size={82} />
      </g>
      <text
        x={quoteX}
        y={quoteY}
        dominantBaseline="hanging"
        fill="#78716C"
        fontSize={phoneFontSize}
        fontWeight={600}
        fontFamily={suisseIntl.style.fontFamily}
        letterSpacing="0.16em"
      >
        (416) 555-0142
      </text>
      <foreignObject x={quoteX} y={quoteBlockY} width={quoteW} height={orbLayoutR * 2 - (quoteBlockY - quoteY)}>
        <div
          className={suisseIntl.className}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            height: "100%",
            ...SUISSE_FOREIGN_FONT,
          }}
        >
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

function DefaultOrbitAgentIcon() {
  return (
    <>
      <circle cx={0} cy={0} r={ORBIT_ICON_R * 0.78} stroke={AGENT_INK} strokeWidth={2.2} fill="none" />
      <circle cx={0} cy={0} r={ORBIT_ICON_R * 0.22} fill={AGENT_INK} />
      <path
        d={`M0 ${-ORBIT_ICON_R}v${ORBIT_ICON_R * 0.38}M0 ${ORBIT_ICON_R * 0.42}v${ORBIT_ICON_R * 0.58}M${-ORBIT_ICON_R} 0h${ORBIT_ICON_R * 0.38}M${ORBIT_ICON_R * 0.42} 0h${ORBIT_ICON_R * 0.58}`}
        stroke={AGENT_INK}
        strokeWidth={1.8}
        strokeLinecap="round"
        opacity={0.42}
      />
    </>
  );
}

function OrbitAgentTitleIcon({ agentIndex }: { agentIndex: number }) {
  const size = ORBIT_ICON_R * 2;
  const stroke = DOE_ORANGE;
  const sw = 1.55;
  const iconProps = {
    fill: "none" as const,
    stroke,
    strokeWidth: sw,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  let content: React.ReactNode = null;

  if (agentIndex === 0) {
    content = (
      <g {...iconProps}>
        <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
        <path d="M19 10v2a7 7 0 01-14 0v-2" />
        <path d="M12 19v4M8 23h8" />
      </g>
    );
  } else if (agentIndex === 1) {
    content = (
      <g {...iconProps}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" />
      </g>
    );
  } else if (agentIndex === 2) {
    content = (
      <g {...iconProps}>
        <path d="M4 19V5M4 19h16" />
        <path d="M4 15l5-6 4 4 7-9" />
      </g>
    );
  } else if (agentIndex === 3) {
    content = (
      <g {...iconProps}>
        <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </g>
    );
  } else if (agentIndex === 4) {
    content = (
      <g {...iconProps}>
        <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
      </g>
    );
  } else if (agentIndex === 5) {
    content = (
      <g {...iconProps}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16l3-1.5 3 1.5 3-1.5 3 1.5V4a2 2 0 0 0-2-2z" />
        <line x1="8" y1="9" x2="16" y2="9" />
        <line x1="8" y1="13" x2="13" y2="13" />
      </g>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      x={-ORBIT_ICON_R}
      y={-ORBIT_ICON_R}
      overflow="visible"
      aria-hidden
    >
      {content}
    </svg>
  );
}

function OrbitAgentRow({
  boxX,
  boxY,
  name,
  agentIndex,
}: {
  boxX: number;
  boxY: number;
  name: string;
  agentIndex: number;
}) {
  const iconCx = boxX + BOX_PAD_X + ORBIT_ICON_R;
  const iconCy = boxY + BOX_PAD_Y + ORBIT_ICON_R;
  const textX = iconCx + ORBIT_ICON_R + ROW_ICON_TEXT_GAP;
  const useSemanticIcon = agentIndex === 0 || agentIndex === 1 || agentIndex === 2 || agentIndex === 3 || agentIndex === 4 || agentIndex === 5;

  return (
    <g aria-hidden>
      <g transform={`translate(${iconCx}, ${iconCy})`}>
        {useSemanticIcon ? <OrbitAgentTitleIcon agentIndex={agentIndex} /> : <DefaultOrbitAgentIcon />}
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

export function HeroAgentBoxContent({
  agentIndex,
  boxX,
  boxY,
  grainFilterId,
  idPrefix,
}: {
  agentIndex: HeroAgentIndex;
  boxX: number;
  boxY: number;
  grainFilterId: string;
  idPrefix: string;
}) {
  return (
    <>
      <rect
        x={boxX}
        y={boxY}
        width={BOX_W}
        height={BOX_H}
        rx={BOX_RX}
        fill="#FFFFFF"
        stroke="none"
      />
      {agentIndex === 0 ? (
        <VoiceAgentSpeakingOrb
          boxX={boxX}
          boxY={boxY}
          orbGradId={idPrefix}
          orbShadeId={idPrefix}
          orbGrainId={grainFilterId}
        />
      ) : null}
      <OrbitAgentRow
        boxX={boxX}
        boxY={boxY}
        name={HERO_AGENT_LABELS[agentIndex]}
        agentIndex={agentIndex}
      />
      {agentIndex === 1 ? (
        <SchedulingAgentCalendar
          boxX={boxX}
          boxY={boxY}
          orbGradId={idPrefix}
          orbShadeId={idPrefix}
          orbGrainId={grainFilterId}
        />
      ) : null}
      {agentIndex === 2 ? (
        <LabsAgentChart
          boxX={boxX}
          boxY={boxY}
          orbGradId={idPrefix}
          orbShadeId={idPrefix}
          orbGrainId={grainFilterId}
        />
      ) : null}
      {agentIndex === 3 ? (
        <ReferralsAgentCard
          boxX={boxX}
          boxY={boxY}
          orbGradId={idPrefix}
          orbShadeId={idPrefix}
          orbGrainId={grainFilterId}
        />
      ) : null}
      {agentIndex === 4 ? <LiveAppointmentSteps boxX={boxX} boxY={boxY} /> : null}
      {agentIndex === 5 ? (
        <BillingAgentRevenue
          boxX={boxX}
          boxY={boxY}
          orbGradId={idPrefix}
          orbShadeId={idPrefix}
          orbGrainId={grainFilterId}
        />
      ) : null}
    </>
  );
}

export function HeroAgentBoxPreview({
  agentIndex,
  className,
  fit = "contain",
}: {
  agentIndex: HeroAgentPreviewIndex;
  className?: string;
  /** How the 614×382 agent art fits its container — contain scales to fit, slice fills and crops. */
  fit?: "contain" | "slice";
}) {
  const id = useId().replace(/:/g, "");
  const grainFilterId = `${id}-grain`;

  return (
    <svg
      viewBox={`0 0 ${HERO_AGENT_BOX_W} ${HERO_AGENT_BOX_H}`}
      fill="none"
      preserveAspectRatio={fit === "slice" ? "xMidYMid slice" : "xMidYMid meet"}
      className={className ?? "h-full w-full"}
      aria-hidden
    >
      <defs>
        <HeroAgentBoxGrainFilter id={grainFilterId} />
      </defs>
      <HeroAgentBoxContent
        agentIndex={agentIndex}
        boxX={0}
        boxY={0}
        grainFilterId={grainFilterId}
        idPrefix={id}
      />
    </svg>
  );
}
