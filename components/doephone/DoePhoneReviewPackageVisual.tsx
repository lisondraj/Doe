"use client";

import { inter, suisseIntl, suisseIntlLight } from "@/lib/home/fonts";
import {
  DOEPHONE_DISPLAY_WEIGHT_TW,
  DOEPHONE_SECTION_CAROUSEL_INSET_X,
} from "@/lib/doephone/section-styles";

const WORKFLOW_PILLS = [
  "Booking an Appointment",
  "Handling Prior Auth",
  "Receiving a referral",
  "Speaking to allied-health",
  "Reviewing lab results",
] as const;

const DOCTOR_STATS = [
  { value: "<1s", label: "Latency" },
  { value: "30+", label: "languages" },
  { value: "99.9%", label: "uptime" },
  { value: "24/7", label: "coverage" },
] as const;

type VisualLayout = "phone" | "desktop";

function VolumeIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="home-active-agents-visual__workflow-pill-volume">
      <path
        d="M5.5 8.25v3.5M8.75 5.75L5.75 8.25H3.75v3.5h2l3 2.5V5.75z"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.25 8.25a2.25 2.25 0 010 3.5M13.75 6.75a4.5 4.5 0 010 6.5"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Active agents shader band — doctor-built stats + workflow pills. */
export function DoePhoneReviewPackageVisual({
  layout = "phone",
  showTitle = layout === "desktop",
}: {
  layout?: VisualLayout;
  showTitle?: boolean;
}) {
  return (
    <div
      className={`home-active-agents-visual home-active-agents-visual--${layout} flex h-full min-h-0 w-full flex-col ${suisseIntl.className}`}
      aria-hidden
    >
      {showTitle ? (
        <h2
          className={`home-active-agents-visual__title home-feature-card-section__title home-feature-card-section__title--feature-lead text-left ${DOEPHONE_DISPLAY_WEIGHT_TW} leading-[1.02] tracking-[-0.03em] ${DOEPHONE_SECTION_CAROUSEL_INSET_X}`}
        >
          <span className="block">Built by doctors,</span>
          <span className="block">for doctors</span>
        </h2>
      ) : null}

      <div className="home-active-agents-visual__body min-h-0 flex-1">
        <div className="home-active-agents-visual__stats-stage">
          <div className="home-active-agents-scale">
            <div className="home-active-agents-visual__stats">
              {DOCTOR_STATS.map((stat) => (
                <div key={stat.label} className="home-active-agents-visual__stat">
                  <p className={`home-active-agents-visual__stat-label ${inter.className}`}>{stat.label}</p>
                  <p className={`home-active-agents-visual__stat-value ${suisseIntlLight.className}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="home-active-agents-visual__pills">
          <div className="home-active-agents-pills-scale">
            {WORKFLOW_PILLS.map((label) => (
              <div key={label} className="home-active-agents-visual__workflow-pill">
                <span className="home-active-agents-visual__workflow-pill-icon" aria-hidden>
                  <VolumeIcon />
                </span>
                <span className={`home-active-agents-visual__workflow-pill-label ${inter.className}`}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
