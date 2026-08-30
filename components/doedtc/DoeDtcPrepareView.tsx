"use client";

import type { DoeDtcPreparationPayload, DoeDtcPreparationWidget } from "@/lib/doedtc/doedtc-types";
import { DoeDtcPageHeader } from "@/components/doedtc/DoeDtcPageHeader";
import { DOEDTC_PREPARE } from "@/lib/doedtc/doedtc-copy";
import { dmSans } from "@/lib/home/fonts";

function TrackerSparkline({ widget }: { widget: DoeDtcPreparationWidget }) {
  const points = widget.points ?? [];
  if (points.length < 2) return null;

  const width = 320;
  const height = 120;
  const padding = 16;
  const values = points.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const coords = points.map((point, index) => {
    const x = padding + (index / (points.length - 1)) * (width - padding * 2);
    const y = height - padding - ((point.value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const latest = points[points.length - 1];
  const earliest = points[0];

  return (
    <div className="doedtc-card doedtc-card--flat doedtc-prepare__chart">
      <h3 className="doedtc-section-title">{widget.title}</h3>
      <svg
        className="doedtc-prepare__sparkline"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`${widget.title} trend`}
      >
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={coords.join(" ")}
        />
      </svg>
      <div className="doedtc-prepare__chart-meta">
        <span>
          Start: {earliest.value} ({formatShortDate(earliest.at)})
        </span>
        <span>
          Latest: {latest.value} ({formatShortDate(latest.at)})
        </span>
      </div>
    </div>
  );
}

function formatShortDate(value: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date(value));
  } catch {
    return value.slice(0, 10);
  }
}

function PreparationWidget({ widget }: { widget: DoeDtcPreparationWidget }) {
  if (widget.kind === "header") {
    return (
      <div className="doedtc-card doedtc-card--flat">
        <h2 className={`doedtc-headline ${dmSans.className}`}>{widget.title}</h2>
        {widget.body ? <p className="doedtc-body">{widget.body}</p> : null}
      </div>
    );
  }

  if (widget.kind === "tracker_series") {
    return <TrackerSparkline widget={widget} />;
  }

  if (!widget.items?.length) return null;

  return (
    <div className="doedtc-card doedtc-card--flat">
      <h3 className="doedtc-section-title">{widget.title}</h3>
      <ul className="doedtc-prepare__list">
        {widget.items.map((item) => (
          <li key={`${widget.kind}-${item}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

type DoeDtcPrepareViewProps = {
  code: string;
  payload: DoeDtcPreparationPayload;
  showCodeBanner?: boolean;
};

export function DoeDtcPrepareView({ code, payload, showCodeBanner = true }: DoeDtcPrepareViewProps) {
  return (
    <div className="doedtc-prepare">
      {showCodeBanner ? (
        <div className="doedtc-prepare__code-banner">
          <p className="doedtc-eyebrow">{DOEDTC_PREPARE.codeBannerTitle}</p>
          <p className="doedtc-prepare__code">{code}</p>
          <p className="doedtc-muted">{DOEDTC_PREPARE.codeBannerBody}</p>
        </div>
      ) : null}

      <DoeDtcPageHeader title={payload.title} />
      {payload.reason ? <p className="doedtc-muted">{payload.reason}</p> : null}

      {payload.widgets.length === 0 ? (
        <div className="doedtc-card">
          <strong>{DOEDTC_PREPARE.emptyTitle}</strong>
          <p>{DOEDTC_PREPARE.emptyBody}</p>
        </div>
      ) : (
        <div className="doedtc-prepare__widgets">
          {payload.widgets.map((widget, index) => (
            <PreparationWidget key={`${widget.kind}-${widget.title}-${index}`} widget={widget} />
          ))}
        </div>
      )}
    </div>
  );
}
