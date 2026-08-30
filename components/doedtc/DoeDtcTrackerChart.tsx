"use client";

import { useMemo, useState } from "react";

import type { ArtifactSeriesPoint } from "@/lib/doedtc/doedtc-artifacts";

type ChartRange = "7d" | "30d" | "all";

function filterPointsByRange(points: ArtifactSeriesPoint[], range: ChartRange): ArtifactSeriesPoint[] {
  if (range === "all") return points;
  const days = range === "7d" ? 7 : 30;
  const cutoff = Date.now() - days * 86_400_000;
  return points.filter((point) => Date.parse(point.at) >= cutoff);
}

type DoeDtcTrackerChartProps = {
  title: string;
  points: ArtifactSeriesPoint[];
  goal?: number | null;
};

export function DoeDtcTrackerChart({ title, points, goal }: DoeDtcTrackerChartProps) {
  const [range, setRange] = useState<ChartRange>("30d");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const filtered = useMemo(() => filterPointsByRange(points, range), [points, range]);

  if (filtered.length < 2) {
    return (
      <div className="doedtc-card doedtc-card--flat">
        <h3 className="doedtc-section-title">{title}</h3>
        <p className="doedtc-muted">Log at least two entries to see your trend.</p>
      </div>
    );
  }

  const width = 320;
  const height = 140;
  const padding = 16;
  const values = filtered.map((point) => point.value);
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (goal !== null && goal !== undefined) {
    min = Math.min(min, goal);
    max = Math.max(max, goal);
  }
  const rangeSpan = max - min || 1;

  const coords = filtered.map((point, index) => {
    const x = padding + (index / (filtered.length - 1)) * (width - padding * 2);
    const y = height - padding - ((point.value - min) / rangeSpan) * (height - padding * 2);
    return { x, y, point, index };
  });

  const polyline = coords.map((coord) => `${coord.x},${coord.y}`).join(" ");
  const area = `${padding},${height - padding} ${polyline} ${width - padding},${height - padding}`;
  const active = activeIndex !== null ? coords[activeIndex] : coords[coords.length - 1];

  const goalY =
    goal !== null && goal !== undefined
      ? height - padding - ((goal - min) / rangeSpan) * (height - padding * 2)
      : null;

  return (
    <div className="doedtc-card doedtc-card--flat doedtc-artifact__chart">
      <div className="doedtc-artifact__chart-header">
        <h3 className="doedtc-section-title">{title}</h3>
        <div className="doedtc-artifact__range-chips">
          {(["7d", "30d", "all"] as ChartRange[]).map((chip) => (
            <button
              key={chip}
              type="button"
              className={`doedtc-artifact__range-chip${range === chip ? " doedtc-artifact__range-chip--active" : ""}`}
              onClick={() => {
                setRange(chip);
                setActiveIndex(null);
              }}
            >
              {chip === "all" ? "All" : chip.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <svg
        className="doedtc-artifact__chart-svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`${title} chart`}
      >
        {goalY !== null ? (
          <line
            x1={padding}
            y1={goalY}
            x2={width - padding}
            y2={goalY}
            stroke="currentColor"
            strokeDasharray="4 4"
            opacity={0.45}
          />
        ) : null}
        <polygon points={area} fill="currentColor" opacity={0.08} />
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={polyline}
        />
        {coords.map((coord) => (
          <circle
            key={coord.index}
            cx={coord.x}
            cy={coord.y}
            r={activeIndex === coord.index ? 5 : 3.5}
            fill="currentColor"
            opacity={activeIndex === null || activeIndex === coord.index ? 1 : 0.35}
            onMouseEnter={() => setActiveIndex(coord.index)}
            onMouseLeave={() => setActiveIndex(null)}
            onClick={() => setActiveIndex(coord.index)}
            style={{ cursor: "pointer" }}
          />
        ))}
      </svg>
      {active ? (
        <div className="doedtc-artifact__chart-meta">
          <span>
            {new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(
              new Date(active.point.at),
            )}
          </span>
          <strong>{active.point.value}</strong>
        </div>
      ) : null}
    </div>
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
