"use client";

import { useMemo, useState } from "react";

import {
  buildDailyBarPoints,
  type ArtifactSeriesPoint,
  type ArtifactVisualKind,
} from "@/lib/doedtc/doedtc-artifacts";

type ChartRange = "7d" | "30d" | "all";

function filterPointsByRange(points: ArtifactSeriesPoint[], range: ChartRange): ArtifactSeriesPoint[] {
  if (range === "all") return points;
  const days = range === "7d" ? 7 : 30;
  const cutoff = Date.now() - days * 86_400_000;
  return points.filter((point) => Date.parse(point.at) >= cutoff);
}

function LineChartSvg({
  points,
  goal,
  width,
  height,
  padding,
  activeIndex,
  onSelect,
}: {
  points: ArtifactSeriesPoint[];
  goal?: number | null;
  width: number;
  height: number;
  padding: number;
  activeIndex: number | null;
  onSelect?: (index: number | null) => void;
}) {
  const values = points.map((point) => point.value);
  let min = values.length ? Math.min(...values) : 0;
  let max = values.length ? Math.max(...values) : 1;
  if (goal !== null && goal !== undefined) {
    min = Math.min(min, goal);
    max = Math.max(max, goal);
  }
  if (min === max) {
    min = Math.max(0, min - 1);
    max += 1;
  }
  const rangeSpan = max - min || 1;
  const plotWidth = width - padding * 2;
  const plotHeight = height - padding * 2;
  const coords = points.map((point, index) => {
    const x =
      points.length === 1
        ? width / 2
        : padding + (index / Math.max(1, points.length - 1)) * plotWidth;
    const y = height - padding - ((point.value - min) / rangeSpan) * plotHeight;
    return { x, y, point, index };
  });
  const polyline = coords.map((coord) => `${coord.x},${coord.y}`).join(" ");
  const area =
    coords.length > 0
      ? `${padding},${height - padding} ${polyline} ${width - padding},${height - padding}`
      : "";
  const goalY =
    goal !== null && goal !== undefined
      ? height - padding - ((goal - min) / rangeSpan) * plotHeight
      : null;

  return (
    <>
      <line
        x1={padding}
        y1={height - padding}
        x2={width - padding}
        y2={height - padding}
        stroke="currentColor"
        opacity={0.18}
      />
      {goalY !== null ? (
        <line
          x1={padding}
          y1={goalY}
          x2={width - padding}
          y2={goalY}
          stroke="currentColor"
          strokeDasharray="4 4"
          opacity={0.35}
        />
      ) : null}
      {coords.length >= 2 ? <polygon points={area} fill="currentColor" opacity={0.1} /> : null}
      {coords.length >= 2 ? (
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={polyline}
        />
      ) : null}
      {coords.map((coord) => (
        <circle
          key={coord.index}
          cx={coord.x}
          cy={coord.y}
          r={activeIndex === coord.index ? 5 : 4}
          fill="currentColor"
          opacity={activeIndex === null || activeIndex === coord.index ? 1 : 0.35}
          onMouseEnter={() => onSelect?.(coord.index)}
          onMouseLeave={() => onSelect?.(null)}
          onClick={(event) => {
            event.stopPropagation();
            onSelect?.(coord.index);
          }}
          style={{ cursor: onSelect ? "pointer" : undefined }}
        />
      ))}
    </>
  );
}

function BarsChartSvg({
  points,
  width,
  height,
  padding,
  activeIndex,
  onSelect,
}: {
  points: ArtifactSeriesPoint[];
  width: number;
  height: number;
  padding: number;
  activeIndex: number | null;
  onSelect?: (index: number | null) => void;
}) {
  const bars = buildDailyBarPoints({ points, days: 7 });
  const max = Math.max(1, ...bars.map((bar) => bar.value));
  const plotWidth = width - padding * 2;
  const plotHeight = height - padding * 2;
  const gap = 8;
  const barWidth = (plotWidth - gap * (bars.length - 1)) / bars.length;

  return (
    <>
      <line
        x1={padding}
        y1={height - padding}
        x2={width - padding}
        y2={height - padding}
        stroke="currentColor"
        opacity={0.18}
      />
      {bars.map((bar, index) => {
        const x = padding + index * (barWidth + gap);
        const barHeight = Math.max(bar.value > 0 ? 6 : 3, (bar.value / max) * plotHeight);
        const y = height - padding - barHeight;
        const active = activeIndex === index;
        return (
          <g key={bar.day}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={6}
              fill="currentColor"
              opacity={bar.value === 0 ? 0.16 : active || activeIndex === null ? 1 : 0.35}
              onMouseEnter={() => onSelect?.(index)}
              onMouseLeave={() => onSelect?.(null)}
              onClick={(event) => {
                event.stopPropagation();
                onSelect?.(index);
              }}
              style={{ cursor: onSelect ? "pointer" : undefined }}
            />
            <text
              x={x + barWidth / 2}
              y={height - 2}
              textAnchor="middle"
              fontSize="10"
              fill="currentColor"
              opacity={0.55}
            >
              {bar.label}
            </text>
          </g>
        );
      })}
    </>
  );
}

function RingChartSvg({
  value,
  max,
  width,
  height,
}: {
  value: number;
  max: number;
  width: number;
  height: number;
}) {
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) / 2 - 18;
  const circumference = 2 * Math.PI * radius;
  const pct = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;
  return (
    <>
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth="10"
        opacity={0.14}
      />
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - pct)}
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      <text
        x={cx}
        y={cy - 2}
        textAnchor="middle"
        fontSize="28"
        fontWeight="700"
        fill="currentColor"
      >
        {value}
      </text>
      <text x={cx} y={cy + 18} textAnchor="middle" fontSize="11" fill="currentColor" opacity={0.55}>
        of {max}
      </text>
    </>
  );
}

function WeekChartSvg({
  points,
  width,
  height,
}: {
  points: ArtifactSeriesPoint[];
  width: number;
  height: number;
}) {
  const bars = buildDailyBarPoints({ points, days: 7 });
  const cell = Math.min(36, (width - 32) / 7);
  const startX = (width - cell * 7 - 8 * 6) / 2;
  const y = height / 2 - cell / 2;
  const days = new Set(points.map((point) => point.at.slice(0, 10)));
  return (
    <>
      {bars.map((bar, index) => {
        const x = startX + index * (cell + 8);
        const on = days.has(bar.day) || bar.value > 0;
        return (
          <g key={bar.day}>
            <rect
              x={x}
              y={y}
              width={cell}
              height={cell}
              rx={8}
              fill="currentColor"
              opacity={on ? 1 : 0.14}
            />
            <text
              x={x + cell / 2}
              y={y + cell + 16}
              textAnchor="middle"
              fontSize="10"
              fill="currentColor"
              opacity={0.55}
            >
              {bar.label}
            </text>
          </g>
        );
      })}
    </>
  );
}

type DoeDtcTrackerChartProps = {
  title: string;
  points: ArtifactSeriesPoint[];
  goal?: number | null;
  visual?: ArtifactVisualKind;
  max?: number;
  onOpen?: () => void;
};

export function DoeDtcTrackerChart({
  title,
  points,
  goal,
  visual = "line",
  max,
  onOpen,
}: DoeDtcTrackerChartProps) {
  const [range, setRange] = useState<ChartRange>("30d");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (visual === "bars" || visual === "week" || visual === "ring") return points;
    const next = filterPointsByRange(points, range);
    return next.length > 0 || range === "all" ? next : points;
  }, [points, range, visual]);
  const featured = Boolean(onOpen);
  const width = 320;
  const height = featured ? 168 : visual === "ring" ? 180 : 148;
  const padding = 16;
  const latest = filtered[filtered.length - 1]?.value ?? 0;
  const ringMax = max ?? goal ?? 10;
  const bars = visual === "bars" ? buildDailyBarPoints({ points: filtered, days: 7 }) : [];
  const activeBar = activeIndex !== null ? bars[activeIndex] : bars[bars.length - 1];
  const activePoint =
    activeIndex !== null ? filtered[activeIndex] : filtered[filtered.length - 1];

  return (
    <div
      className={`doedtc-card doedtc-card--flat doedtc-artifact__chart doedtc-artifact__chart--${visual}${featured ? " doedtc-artifact__chart--featured" : ""}`}
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onClick={onOpen}
      onKeyDown={
        onOpen
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onOpen();
              }
            }
          : undefined
      }
    >
      <div className="doedtc-artifact__chart-header">
        <h3 className="doedtc-section-title">{title}</h3>
        {visual === "line" ? (
          <div className="doedtc-artifact__range-chips">
            {(["7d", "30d", "all"] as ChartRange[]).map((chip) => (
              <button
                key={chip}
                type="button"
                className={`doedtc-artifact__range-chip${range === chip ? " doedtc-artifact__range-chip--active" : ""}`}
                onClick={(event) => {
                  event.stopPropagation();
                  setRange(chip);
                  setActiveIndex(null);
                }}
              >
                {chip === "all" ? "All" : chip.toUpperCase()}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <svg
        className="doedtc-artifact__chart-svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`${title} chart`}
      >
        {visual === "bars" ? (
          <BarsChartSvg
            points={filtered}
            width={width}
            height={height}
            padding={padding}
            activeIndex={activeIndex}
            onSelect={setActiveIndex}
          />
        ) : visual === "ring" ? (
          <RingChartSvg value={latest} max={ringMax} width={width} height={height} />
        ) : visual === "week" ? (
          <WeekChartSvg points={filtered} width={width} height={height} />
        ) : (
          <LineChartSvg
            points={filtered}
            goal={goal}
            width={width}
            height={height}
            padding={padding}
            activeIndex={activeIndex}
            onSelect={setActiveIndex}
          />
        )}
      </svg>
      {visual === "bars" ? (
        <div className="doedtc-artifact__chart-meta">
          <span>{activeBar ? "Today-to-week" : "This week"}</span>
          <strong>{activeBar?.value ?? 0}</strong>
        </div>
      ) : visual === "ring" ? (
        <div className="doedtc-artifact__chart-meta">
          <span>Latest</span>
          <strong>
            {latest} / {ringMax}
          </strong>
        </div>
      ) : visual === "week" ? (
        <div className="doedtc-artifact__chart-meta">
          <span>{filtered.length === 0 ? "No entries yet" : `${filtered.length} logged`}</span>
        </div>
      ) : activePoint ? (
        <div className="doedtc-artifact__chart-meta">
          <span>
            {new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(
              new Date(activePoint.at),
            )}
          </span>
          <strong>{activePoint.value}</strong>
        </div>
      ) : (
        <div className="doedtc-artifact__chart-meta">
          <span>No entries yet</span>
        </div>
      )}
    </div>
  );
}

type DoeDtcTrackerCarouselChartProps = {
  points: ArtifactSeriesPoint[];
  goal?: number | null;
  visual?: ArtifactVisualKind;
  max?: number;
};

export function DoeDtcTrackerCarouselChart({
  points,
  goal,
  visual = "line",
  max,
}: DoeDtcTrackerCarouselChartProps) {
  const width = 320;
  const height = 120;
  const padding = 12;
  const latest = points[points.length - 1]?.value ?? 0;
  const ringMax = max ?? goal ?? 10;

  return (
    <svg
      className="doedtc-tracker-carousel__chart-svg"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio={visual === "ring" || visual === "week" ? "xMidYMid meet" : "none"}
      role="img"
      aria-hidden
    >
      {visual === "bars" ? (
        <BarsChartSvg
          points={points}
          width={width}
          height={height}
          padding={padding}
          activeIndex={null}
        />
      ) : visual === "ring" ? (
        <RingChartSvg value={latest} max={ringMax} width={width} height={height} />
      ) : visual === "week" ? (
        <WeekChartSvg points={points} width={width} height={height} />
      ) : (
        <LineChartSvg
          points={points}
          goal={goal}
          width={width}
          height={height}
          padding={padding}
          activeIndex={null}
        />
      )}
    </svg>
  );
}

export function DoeDtcArtifactMiniSparkline({ points }: { points: ArtifactSeriesPoint[] }) {
  if (points.length < 2) return null;
  const width = 96;
  const height = 28;
  const values = points.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const coords = points.map((point, index) => {
    const x = (index / (points.length - 1)) * width;
    const y = height - ((point.value - min) / range) * height;
    return `${x},${y}`;
  });
  return (
    <svg className="doedtc-artifact__mini-sparkline" viewBox={`0 0 ${width} ${height}`} aria-hidden>
      <polyline fill="none" stroke="currentColor" strokeWidth="2" points={coords.join(" ")} />
    </svg>
  );
}
