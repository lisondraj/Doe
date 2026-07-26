import type { ReactNode } from "react";

import { dmSans, suisseIntl } from "@/lib/home/fonts";
import { PRODUCT2_CALL_HISTORY_RECENT_LABS } from "@/lib/product2/product2-copy";

type LabItem = (typeof PRODUCT2_CALL_HISTORY_RECENT_LABS.items)[number];

function clampPercent(value: number) {
  return Math.min(100, Math.max(0, value));
}

function LabRangeVisual({ lab }: { lab: LabItem }) {
  const span = lab.scaleMax - lab.scaleMin || 1;
  const markerPct = clampPercent(((lab.reading - lab.scaleMin) / span) * 100);
  const targetStart = clampPercent(((lab.targetMin - lab.scaleMin) / span) * 100);
  const targetEnd = clampPercent(((lab.targetMax - lab.scaleMin) / span) * 100);
  const targetWidth = Math.max(0, targetEnd - targetStart);
  const inTarget = lab.reading >= lab.targetMin && lab.reading <= lab.targetMax;

  return (
    <div className="product-call-history-panel__lab-range" aria-hidden>
      <div className="product-call-history-panel__lab-range-track">
        <span
          className="product-call-history-panel__lab-range-target"
          style={{ left: `${targetStart}%`, width: `${targetWidth}%` }}
        />
        <span
          className={`product-call-history-panel__lab-range-marker${
            inTarget ? " product-call-history-panel__lab-range-marker--in" : ""
          }`}
          style={{ left: `${markerPct}%` }}
        />
      </div>
    </div>
  );
}

function LabRow({
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
    <div className="product-call-history-panel__lab-row">
      <span className={`product-call-history-panel__lab-caption-label ${dmSans.className}`}>{label}</span>
      <div className="product-call-history-panel__lab-visual">{children}</div>
      <div className={`product-call-history-panel__lab-value-stack ${dmSans.className}`}>
        <div className="product-call-history-panel__lab-caption-value-wrap">
          <span className="product-call-history-panel__lab-caption-value">{value}</span>
          {unit ? <span className="product-call-history-panel__lab-caption-unit">{unit}</span> : null}
        </div>
        {trend ? <span className="product-call-history-panel__lab-caption-trend">{trend}</span> : null}
      </div>
    </div>
  );
}

/** Diabetes-focused recent labs with target-range visuals for call history aside column. */
export function Product2CallHistoryRecentLabs({
  items = PRODUCT2_CALL_HISTORY_RECENT_LABS.items,
}: {
  items?: readonly LabItem[];
} = {}) {
  return (
    <div className="product-call-history-panel__labs-shell">
      <div className="product-call-history-panel__labs-visuals">
        {items.map((lab) => (
          <LabRow
            key={lab.shortLabel}
            label={lab.shortLabel}
            value={lab.value}
            unit={lab.unit}
            trend={lab.trend}
          >
            <LabRangeVisual lab={lab} />
          </LabRow>
        ))}
      </div>
      <p className={`product-call-history-panel__labs-label m-0 ${suisseIntl.className}`}>
        {PRODUCT2_CALL_HISTORY_RECENT_LABS.label}
      </p>
      <div className="product-call-history-panel__labs-footer" aria-hidden />
    </div>
  );
}
