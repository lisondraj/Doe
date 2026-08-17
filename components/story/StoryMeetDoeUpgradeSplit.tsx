import { dmSans, suisseIntl } from "@/lib/home/fonts";
import type { CSSProperties } from "react";

const INTERACTION_BREAKDOWN = [
  { label: "Documents processed", value: 58, share: 1 },
  { label: "Phone calls handled", value: 41, share: 0.71 },
  { label: "Appointments", value: 26, share: 0.45 },
] as const;

const MODEL_ACCURACY = 94;
const DONUT_RADIUS = 40;
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;

const ACCURACY_LEGEND = [
  { label: "Scheduling", value: "96%" },
  { label: "Docs", value: "92%" },
  { label: "Billing", value: "91%" },
] as const;

/** Meet Doe row-1 — twin clinic-model dashboards: training recap + model accuracy. */
export function StoryMeetDoeUpgradeSplit() {
  return (
    <div className={`story-puzzle-tile__inner-split story-meet-doe-upgrade__split ${dmSans.className}`} aria-hidden="true">
      <div className="story-puzzle-tile__inner-box story-puzzle-tile__inner-box--narrow story-meet-doe-upgrade__profile-box">
        <div className="story-meet-doe-upgrade__head">
          <span className="story-meet-doe-upgrade__avatar" />
          <div className="story-meet-doe-upgrade__copy">
            <p className={`story-meet-doe-upgrade__greeting m-0 ${suisseIntl.className}`}>Dr. Rogers</p>
            <span className="story-meet-doe-upgrade__role">Harbor Ortho</span>
          </div>
        </div>

        <div className="story-meet-doe-upgrade__breakdown">
          {INTERACTION_BREAKDOWN.map((row) => (
            <div key={row.label} className="story-meet-doe-upgrade__breakdown-row">
              <div className="story-meet-doe-upgrade__breakdown-head">
                <span className="story-meet-doe-upgrade__breakdown-label">{row.label}</span>
                <span className={`story-meet-doe-upgrade__breakdown-value ${dmSans.className}`}>{row.value}</span>
              </div>
              <span className="story-meet-doe-upgrade__breakdown-track">
                <span
                  className="story-meet-doe-upgrade__breakdown-fill"
                  style={{ "--story-meet-doe-share": row.share } as CSSProperties}
                />
              </span>
            </div>
          ))}
        </div>

        <div className="story-meet-doe-upgrade__footer">
          <div className="story-meet-doe-upgrade__metric">
            <p className={`story-meet-doe-upgrade__metric-value m-0 ${dmSans.className}`}>125</p>
            <span className={`story-meet-doe-upgrade__metric-label ${dmSans.className}`}>
              interactions collected
            </span>
          </div>

          <span className={`story-meet-doe-upgrade__cta ${dmSans.className}`}>Train</span>
        </div>
      </div>

      <div className="story-puzzle-tile__inner-box story-puzzle-tile__inner-box--wide story-meet-doe-upgrade__companion-box">
        <div className="story-meet-doe-upgrade__companion-head">
          <span className="story-meet-doe-upgrade__companion-title">Model performance</span>
          <span className={`story-meet-doe-upgrade__companion-chip ${dmSans.className}`}>v2.4</span>
        </div>

        <div className="story-meet-doe-upgrade__donut-row">
          <div className="story-meet-doe-upgrade__donut-wrap">
            <svg className="story-meet-doe-upgrade__donut" viewBox="0 0 100 100" aria-hidden="true">
              <defs>
                <linearGradient id="story-meet-doe-donut" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f0d4a2" />
                  <stop offset="55%" stopColor="#e8a060" />
                  <stop offset="100%" stopColor="#bf593d" />
                </linearGradient>
              </defs>
              <circle className="story-meet-doe-upgrade__donut-track" cx="50" cy="50" r={DONUT_RADIUS} />
              <circle
                className="story-meet-doe-upgrade__donut-progress"
                cx="50"
                cy="50"
                r={DONUT_RADIUS}
                strokeDasharray={`${(MODEL_ACCURACY / 100) * DONUT_CIRCUMFERENCE} ${DONUT_CIRCUMFERENCE}`}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="story-meet-doe-upgrade__donut-center">
              <p className={`story-meet-doe-upgrade__donut-value m-0 ${dmSans.className}`}>{MODEL_ACCURACY}%</p>
              <span className={`story-meet-doe-upgrade__donut-label ${dmSans.className}`}>accuracy</span>
            </div>
          </div>

          <div className="story-meet-doe-upgrade__donut-legend">
            {ACCURACY_LEGEND.map((item) => (
              <span key={item.label} className={`story-meet-doe-upgrade__donut-legend-item ${dmSans.className}`}>
                <i />
                {item.label} {item.value}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
