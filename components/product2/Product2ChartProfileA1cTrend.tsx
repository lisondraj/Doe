"use client";

import { useId } from "react";

import { dmSans } from "@/lib/home/fonts";

function buildSmoothChartPath(points: readonly { x: number; y: number }[]) {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const previous = points[Math.max(index - 1, 0)];
    const current = points[index];
    const next = points[index + 1];
    const following = points[Math.min(index + 2, points.length - 1)];
    const control1X = current.x + (next.x - previous.x) / 6;
    const control1Y = current.y + (next.y - previous.y) / 6;
    const control2X = next.x - (following.x - current.x) / 6;
    const control2Y = next.y - (following.y - current.y) / 6;
    path += ` C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${next.x} ${next.y}`;
  }

  return path;
}

export function Product2ChartProfileA1cTrend({
  label,
  readings,
  doseChanges = [],
}: {
  label: string;
  readings: readonly { date: string; value: number }[];
  doseChanges?: readonly { atIndex: number; dose: number }[];
}) {
  const gradientId = useId();
  const fillGradientId = `${gradientId}-fill`;
  const clipId = `${gradientId}-clip`;
  const width = 132;
  const height = 72;
  const marginLeft = 0;
  const marginRight = 2;
  const marginTop = 2;
  const marginBottom = 2;
  const plotLeft = marginLeft;
  const plotRight = width - marginRight;
  const plotTop = marginTop;
  const plotBottom = height - marginBottom;
  const plotWidth = plotRight - plotLeft;
  const plotHeight = plotBottom - plotTop;
  const values = readings.map((reading) => reading.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const yMin = Math.floor(minValue * 2) / 2 - 0.2;
  const yMax = Math.ceil(maxValue * 2) / 2 + 0.2;
  const yRange = yMax - yMin || 1;
  const yTicks = [yMax, (yMax + yMin) / 2, yMin];
  const stepX = plotWidth / Math.max(readings.length - 1, 1);

  const valueToY = (value: number) => plotTop + ((yMax - value) / yRange) * plotHeight;

  const coords = readings.map((reading, index) => ({
    x: plotLeft + index * stepX,
    y: valueToY(reading.value),
  }));

  const linePath = buildSmoothChartPath(coords);
  const areaPath = `${linePath} L ${coords[coords.length - 1]?.x ?? plotLeft} ${plotBottom} L ${coords[0]?.x ?? plotLeft} ${plotBottom} Z`;
  const doseChangeIndexes = new Set(doseChanges.map((change) => change.atIndex));

  const underAreaGridLines = yTicks.slice(1).map((tick) => ({
    tick,
    y: valueToY(tick),
  }));

  return (
    <div className="product-landing-live-quote__chart-profile-a1c">
      <div className="product-landing-live-quote__chart-profile-a1c-plot">
        <div className={`product-landing-live-quote__chart-profile-a1c-y-axis ${dmSans.className}`} aria-hidden>
          {yTicks.map((tick) => (
            <span key={tick} className="product-landing-live-quote__chart-profile-a1c-axis-label">
              {tick.toFixed(1)}%
            </span>
          ))}
        </div>
        <div className="product-landing-live-quote__chart-profile-a1c-canvas">
          <svg
            className="product-landing-live-quote__chart-profile-a1c-chart"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <clipPath id={clipId}>
                <path d={areaPath} />
              </clipPath>
              <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1={plotLeft} y1="0" x2={plotRight} y2="0">
                <stop offset="0%" stopColor="#e8c08e" />
                <stop offset="52%" stopColor="#d4a574" />
                <stop offset="100%" stopColor="#c99558" />
              </linearGradient>
              <linearGradient
                id={fillGradientId}
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1={plotTop}
                x2="0"
                y2={plotBottom}
              >
                <stop offset="0%" stopColor="rgba(232, 192, 142, 0.3)" />
                <stop offset="55%" stopColor="rgba(212, 165, 116, 0.12)" />
                <stop offset="100%" stopColor="rgba(212, 165, 116, 0)" />
              </linearGradient>
            </defs>
            <line
              className="product-landing-live-quote__chart-profile-a1c-axis-line"
              x1={plotLeft}
              y1={plotTop}
              x2={plotLeft}
              y2={plotBottom}
              vectorEffect="non-scaling-stroke"
            />
            <line
              className="product-landing-live-quote__chart-profile-a1c-axis-line"
              x1={plotLeft}
              y1={plotBottom}
              x2={plotRight}
              y2={plotBottom}
              vectorEffect="non-scaling-stroke"
            />
            <path className="product-landing-live-quote__chart-profile-a1c-area" d={areaPath} fill={`url(#${fillGradientId})`} />
            <g className="product-landing-live-quote__chart-profile-a1c-grid" clipPath={`url(#${clipId})`}>
              {underAreaGridLines.map(({ tick, y }) => (
                <line
                  key={tick}
                  className="product-landing-live-quote__chart-profile-a1c-grid-line"
                  x1={plotLeft}
                  y1={y}
                  x2={plotRight}
                  y2={y}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </g>
            <path
              className="product-landing-live-quote__chart-profile-a1c-line"
              d={linePath}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <div className={`product-landing-live-quote__chart-profile-a1c-markers ${dmSans.className}`} aria-hidden>
            {coords.map((coord, index) => (
              <span
                key={`a1c-point-${index}`}
                className={`product-landing-live-quote__chart-profile-a1c-point${
                  doseChangeIndexes.has(index)
                    ? " product-landing-live-quote__chart-profile-a1c-point--dose-change"
                    : ""
                }`}
                style={{
                  left: `${(coord.x / width) * 100}%`,
                  top: `${(coord.y / height) * 100}%`,
                }}
              />
            ))}
            {doseChanges.map((change) => {
              const coord = coords[change.atIndex];
              if (!coord) return null;
              return (
                <span
                  key={`dose-label-${change.atIndex}-${change.dose}`}
                  className="product-landing-live-quote__chart-profile-a1c-dose-label"
                  style={{
                    left: `${(coord.x / width) * 100}%`,
                    top: `${(coord.y / height) * 100}%`,
                  }}
                >
                  {change.dose}mg
                </span>
              );
            })}
          </div>
        </div>
      </div>
      <div className={`product-landing-live-quote__chart-profile-a1c-x-axis ${dmSans.className}`} aria-hidden>
        <span className="product-landing-live-quote__chart-profile-a1c-x-axis-spacer" />
        <div className="product-landing-live-quote__chart-profile-a1c-x-axis-labels">
          {readings.map((reading) => (
            <span key={reading.date} className="product-landing-live-quote__chart-profile-a1c-axis-label">
              {reading.date}
            </span>
          ))}
        </div>
      </div>
      <span className={`product-landing-live-quote__chart-profile-a1c-label ${dmSans.className}`}>{label}</span>
    </div>
  );
}
