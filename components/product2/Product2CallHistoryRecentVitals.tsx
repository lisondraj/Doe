import type { ReactNode } from "react";
import { useId } from "react";

import { dmSans, suisseIntl } from "@/lib/home/fonts";
import { PRODUCT2_CALL_HISTORY_RECENT_VITALS } from "@/lib/product2/product2-copy";

type BpReading = { date: string; systolic: number; diastolic: number };

function vitalBarHeight(value: number, min: number, max: number) {
  const span = max - min || 1;
  return 18 + ((value - min) / span) * 82;
}

function VitalRow({
  label,
  value,
  unit,
  trend,
  children,
}: {
  label: string;
  value: string;
  unit?: string;
  trend?: string;
  children: ReactNode;
}) {
  return (
    <div className="product-call-history-panel__vital-row">
      <span className={`product-call-history-panel__vital-caption-label ${dmSans.className}`}>{label}</span>
      <div className="product-call-history-panel__vital-visual">{children}</div>
      <div className={`product-call-history-panel__vital-value-stack ${dmSans.className}`}>
        <div className="product-call-history-panel__vital-caption-value-wrap">
          <span className="product-call-history-panel__vital-caption-value">{value}</span>
          {unit ? <span className="product-call-history-panel__vital-caption-unit">{unit}</span> : null}
        </div>
        {trend ? <span className="product-call-history-panel__vital-caption-trend">{trend}</span> : null}
      </div>
    </div>
  );
}

function VitalBpVisual({ readings }: { readings: readonly BpReading[] }) {
  const fillGradientId = useId();

  if (readings.length === 0) {
    return null;
  }

  const width = 120;
  const height = 36;
  const padX = 6;
  const padY = 5;

  const sysValues = readings.map((reading) => reading.systolic);
  const diaValues = readings.map((reading) => reading.diastolic);
  const yMin = Math.min(...diaValues) - 10;
  const yMax = Math.max(...sysValues) + 6;
  const ySpan = yMax - yMin || 1;

  const plotW = width - padX * 2;
  const plotH = height - padY * 2;
  const step = readings.length > 1 ? plotW / (readings.length - 1) : 0;

  const xAt = (index: number) => padX + index * step;
  const yAt = (value: number) => padY + (1 - (value - yMin) / ySpan) * plotH;

  const sysPoints = readings.map((reading, index) => ({
    x: xAt(index),
    y: yAt(reading.systolic),
  }));
  const diaPoints = readings.map((reading, index) => ({
    x: xAt(index),
    y: yAt(reading.diastolic),
  }));

  const linePath = (points: { x: number; y: number }[]) =>
    points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(" ");

  const sysPath = linePath(sysPoints);
  const diaPath = linePath(diaPoints);
  const areaPath = [
    sysPath,
    ...[...diaPoints].reverse().map((point) => `L ${point.x.toFixed(2)} ${point.y.toFixed(2)}`),
    "Z",
  ].join(" ");

  const latestIndex = readings.length - 1;
  const latestSys = sysPoints[latestIndex];
  const latestDia = diaPoints[latestIndex];

  return (
    <div className="product-call-history-panel__vital-bp" aria-hidden>
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id={fillGradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(232, 192, 142, 0.34)" />
            <stop offset="100%" stopColor="rgba(212, 165, 116, 0.1)" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#${fillGradientId})`} />
        <path
          d={sysPath}
          className="product-call-history-panel__vital-bp-line product-call-history-panel__vital-bp-line--sys"
        />
        <path
          d={diaPath}
          className="product-call-history-panel__vital-bp-line product-call-history-panel__vital-bp-line--dia"
        />
        <circle
          cx={latestSys.x}
          cy={latestSys.y}
          r="2.15"
          className="product-call-history-panel__vital-bp-dot product-call-history-panel__vital-bp-dot--sys"
        />
        <circle
          cx={latestDia.x}
          cy={latestDia.y}
          r="2.15"
          className="product-call-history-panel__vital-bp-dot product-call-history-panel__vital-bp-dot--dia"
        />
      </svg>
    </div>
  );
}

function VitalSparkline({ readings }: { readings: readonly { value: number }[] }) {
  const values = readings.map((reading) => reading.value);
  const min = Math.min(...values);
  const max = Math.max(...values);

  return (
    <div className="product-call-history-panel__vital-spark" aria-hidden>
      {readings.map((reading, index) => (
        <span
          key={index}
          className={`product-call-history-panel__vital-spark-cell${
            index === readings.length - 1 ? " product-call-history-panel__vital-spark-cell--latest" : ""
          }`}
        >
          <span
            className="product-call-history-panel__vital-spark-bar"
            style={{ height: `${vitalBarHeight(reading.value, min, max)}%` }}
          />
        </span>
      ))}
    </div>
  );
}

/** Compact recent vitals — BP corridor spark plus HR/weight spark bars for call history header. */
export function Product2CallHistoryRecentVitals() {
  const { label, bp, heartRate, weight } = PRODUCT2_CALL_HISTORY_RECENT_VITALS;
  const bpReadings = bp.readings.slice(-5);
  const latestBp = bpReadings[bpReadings.length - 1];

  return (
    <div className="product-call-history-panel__vitals-shell">
      <div className="product-call-history-panel__vitals-visuals">
        <VitalRow
          label="BP"
          value={`${latestBp.systolic}/${latestBp.diastolic}`}
          unit="mmHg"
        >
          <VitalBpVisual readings={bpReadings} />
        </VitalRow>
        <VitalRow
          label={heartRate.shortLabel}
          value={String(heartRate.latest)}
          unit={heartRate.unit}
          trend={heartRate.trend}
        >
          <VitalSparkline readings={heartRate.readings} />
        </VitalRow>
        <VitalRow label={weight.shortLabel} value={String(weight.latest)} unit={weight.unit} trend={weight.trend}>
          <VitalSparkline readings={weight.readings} />
        </VitalRow>
      </div>
      <p className={`product-call-history-panel__vitals-label m-0 ${suisseIntl.className}`}>{label}</p>
    </div>
  );
}
