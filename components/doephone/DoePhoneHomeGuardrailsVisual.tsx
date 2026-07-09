"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";

const POLICIES = [
  {
    id: "prescribe",
    rule: "Prescribe without MD review",
    risk: "High",
    enabled: false,
  },
  {
    id: "phi",
    rule: "Share PHI outside care team",
    risk: "High",
    enabled: true,
  },
  {
    id: "hours",
    rule: "Schedule outside clinic hours",
    risk: "Medium",
    enabled: true,
    editing: true,
  },
  {
    id: "refill",
    rule: "Auto-approve controlled refills",
    risk: "High",
    enabled: false,
  },
] as const;

function Toggle({ on, editing }: { on: boolean; editing?: boolean }) {
  return (
    <span
      className={`home-guardrails-visual__toggle${on ? " home-guardrails-visual__toggle--on" : ""}${
        editing ? " home-guardrails-visual__toggle--editing" : ""
      }`}
      aria-hidden
    >
      <span className="home-guardrails-visual__toggle-knob" />
    </span>
  );
}

/** Agent guardrails policy matrix — prototype shader band. */
export function DoePhoneHomeGuardrailsVisual() {
  const activeCount = POLICIES.filter((policy) => policy.enabled).length;

  return (
    <div
      className={`home-guardrails-visual mx-auto w-full ${suisseIntl.className}`}
      style={{ maxWidth: CAROUSEL_MENU_UI.maxWidthPhone }}
      aria-hidden
    >
      <div className="home-guardrails-visual__card">
        <div className="home-guardrails-visual__header">
          <div>
            <p className={`home-guardrails-visual__eyebrow ${inter.className}`}>Rollout controls</p>
            <h3 className="home-guardrails-visual__title">Agent guardrails</h3>
          </div>
          <span className={`home-guardrails-visual__live ${inter.className}`}>Live</span>
        </div>

        <div className={`home-guardrails-visual__table-head ${inter.className}`}>
          <span>Policy</span>
          <span>Risk</span>
          <span>Status</span>
        </div>

        <ul className="home-guardrails-visual__list">
          {POLICIES.map((policy) => (
            <li
              key={policy.id}
              className={`home-guardrails-visual__row${
                "editing" in policy && policy.editing ? " home-guardrails-visual__row--editing" : ""
              }`}
            >
              <p className="home-guardrails-visual__rule">{policy.rule}</p>
              <span
                className={`home-guardrails-visual__risk home-guardrails-visual__risk--${policy.risk.toLowerCase()} ${inter.className}`}
              >
                {policy.risk}
              </span>
              <Toggle on={policy.enabled} editing={"editing" in policy && policy.editing} />
            </li>
          ))}
        </ul>

        <div className={`home-guardrails-visual__footer ${inter.className}`}>
          <span>{activeCount} policies active</span>
          <span className="home-guardrails-visual__footer-dot" aria-hidden>
            ·
          </span>
          <span>Last edit Dr. Chen</span>
        </div>
      </div>
    </div>
  );
}
