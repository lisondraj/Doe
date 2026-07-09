"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";

const ALERT_ACCENT = "#E85D4C";
const ALERT_BG = "rgba(232, 93, 76, 0.14)";
const CARD_SHADOW = "0 12px 32px rgba(30, 52, 58, 0.09), 0 1px 6px rgba(30, 52, 58, 0.04)";

const METRICS = [
  {
    id: "k",
    label: "Potassium",
    value: "6.1",
    unit: "mEq/L",
    status: "critical" as const,
    spark: "M2 14 L6 10 L10 12 L14 6 L18 8",
  },
  {
    id: "t",
    label: "Troponin",
    value: "0.42",
    unit: "ng/mL",
    status: "high" as const,
    spark: "M2 12 L6 11 L10 9 L14 10 L18 5",
  },
  {
    id: "inr",
    label: "INR",
    value: "4.8",
    unit: "",
    status: "critical" as const,
    spark: "M2 13 L6 12 L10 8 L14 9 L18 4",
  },
] as const;

function Sparkline({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 20 16" fill="none" aria-hidden className="home-lab-alerts-visual__spark h-[1.65em] w-full">
      <path d={path} stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Critical lab monitoring dashboard — ambient shader band. */
export function DoePhoneHomeLabAlertsVisual() {
  return (
    <div
      className={`home-lab-alerts-visual mx-auto w-full ${suisseIntl.className}`}
      style={{ maxWidth: CAROUSEL_MENU_UI.maxWidthPhone }}
      aria-hidden
    >
      <div className="home-lab-alerts-visual__card">
        <div
          className="home-lab-alerts-visual__banner"
          style={{ background: ALERT_BG, borderColor: "rgba(232, 93, 76, 0.28)" }}
        >
          <span className="home-lab-alerts-visual__banner-dot" aria-hidden />
          <div className="home-lab-alerts-visual__banner-copy">
            <p className={`home-lab-alerts-visual__banner-title ${inter.className}`}>2 critical values unreviewed</p>
            <p className={`home-lab-alerts-visual__banner-meta ${inter.className}`}>Inpatient panel · updated 4m ago</p>
          </div>
          <span className={`home-lab-alerts-visual__banner-count ${inter.className}`}>2</span>
        </div>

        <div className="home-lab-alerts-visual__metrics">
          {METRICS.map((metric) => (
            <div
              key={metric.id}
              className={`home-lab-alerts-visual__metric home-lab-alerts-visual__metric--${metric.status}`}
            >
              <p className={`home-lab-alerts-visual__metric-label ${inter.className}`}>{metric.label}</p>
              <p className="home-lab-alerts-visual__metric-value">
                {metric.value}
                {metric.unit ? (
                  <span className={`home-lab-alerts-visual__metric-unit ${inter.className}`}>{metric.unit}</span>
                ) : null}
              </p>
              <Sparkline path={metric.spark} />
            </div>
          ))}
        </div>

        <div className="home-lab-alerts-visual__focus">
          <div className="home-lab-alerts-visual__focus-head">
            <div>
              <p className="home-lab-alerts-visual__patient">Maria Lopez · 58F</p>
              <p className={`home-lab-alerts-visual__focus-detail ${inter.className}`}>
                K+ 6.1 · CKD stage 3 · on lisinopril
              </p>
            </div>
            <span className={`home-lab-alerts-visual__focus-badge ${inter.className}`}>Critical</span>
          </div>
          <div className={`home-lab-alerts-visual__actions ${inter.className}`}>
            <span className="home-lab-alerts-visual__action home-lab-alerts-visual__action--primary">Acknowledge</span>
            <span className="home-lab-alerts-visual__action">Notify covering MD</span>
            <span className="home-lab-alerts-visual__action">Repeat BMP</span>
          </div>
        </div>
      </div>
    </div>
  );
}
