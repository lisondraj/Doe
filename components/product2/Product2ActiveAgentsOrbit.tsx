"use client";

import type { CSSProperties, ReactNode } from "react";

import {
  PRODUCT2_LANDING_CALL_HISTORY_ORBIT,
  PRODUCT2_LANDING_CALL_HISTORY_ORBIT_AGENTS,
} from "@/lib/product2/product2-copy";
import { dmSans, suisseIntl } from "@/lib/home/fonts";

const CALL_HISTORY_ORBIT_AGENTS = PRODUCT2_LANDING_CALL_HISTORY_ORBIT_AGENTS;
const CALL_HISTORY_ORBIT_COUNT = CALL_HISTORY_ORBIT_AGENTS.length;

type CallHistoryOrbitAgentIcon = (typeof CALL_HISTORY_ORBIT_AGENTS)[number]["icon"];

function VoiceCallHistoryOrbitAgentIcon({ kind }: { kind: CallHistoryOrbitAgentIcon }) {
  const sw = 1.2;

  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="product-landing-workspace__orbit-circle-icon">
      {kind === "voice" && (
        <>
          <rect x="7.5" y="3" width="5" height="8.5" rx="2.5" stroke="currentColor" strokeWidth={sw} />
          <path d="M5.5 11a4.5 4.5 0 009 0" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" />
          <path d="M10 15.5v2.5" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" />
        </>
      )}
      {kind === "research" && (
        <>
          <path d="M8 3v4.6L5.6 14.4a2 2 0 001.72 3h5.36a2 2 0 001.72-3L12 7.6V3" stroke="currentColor" strokeWidth={sw} strokeLinejoin="round" />
          <path d="M7 3h6" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" />
          <path d="M8.2 11.2h3.6" stroke="currentColor" strokeWidth={sw * 0.9} strokeLinecap="round" />
        </>
      )}
      {kind === "calendar" && (
        <>
          <rect x="3.5" y="4.5" width="13" height="12.5" rx="1.5" stroke="currentColor" strokeWidth={sw} />
          <path d="M3.5 8.5h13" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" />
          <path d="M7 2.5v3M13 2.5v3" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" />
          <circle cx="7.1" cy="11.6" r="1.05" stroke="currentColor" strokeWidth={sw * 0.85} />
          <circle cx="11" cy="11.6" r="1.05" stroke="currentColor" strokeWidth={sw * 0.85} />
        </>
      )}
      {kind === "billing" && (
        <>
          <rect x="4.5" y="5.5" width="11" height="9" rx="1.5" stroke="currentColor" strokeWidth={sw} />
          <path d="M4.5 8.5h11" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" />
          <rect x="6.5" y="10.25" width="2.5" height="1.75" rx="0.35" stroke="currentColor" strokeWidth={sw * 0.9} />
          <path d="M11 10.75h2.5M11 12.75h1.75" stroke="currentColor" strokeWidth={sw * 0.9} strokeLinecap="round" />
        </>
      )}
      {kind === "inbox" && (
        <>
          <path d="M3.5 5.5h13v9a1.5 1.5 0 01-1.5 1.5H5a1.5 1.5 0 01-1.5-1.5v-9z" stroke="currentColor" strokeWidth={sw} />
          <path d="M3.5 8.5l4.2 2.8a1.2 1.2 0 001.2 0l4.1-2.8" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" />
        </>
      )}
      {kind === "referrals" && (
        <>
          <path d="M4 10h8.5M10.5 7.5L13 10l-2.5 2.5" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6.5 5.5h5a2 2 0 012 2v7.5a2 2 0 01-2 2h-5" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" />
        </>
      )}
      {kind === "prior-auth" && (
        <>
          <rect x="5.5" y="3.5" width="9" height="13" rx="1.5" stroke="currentColor" strokeWidth={sw} />
          <path d="M8 7.5h4M8 10.5h4M8 13.5h2.5" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

function callHistoryOrbitGradient(index: number) {
  const step = index / CALL_HISTORY_ORBIT_COUNT;
  const r = Math.round(212 + (38 - 212) * step);
  const g = Math.round(165 + (24 - 165) * step);
  const b = Math.round(116 + (14 - 116) * step);
  const rLight = Math.min(255, r + 22);
  const gLight = Math.min(255, g + 16);
  const bLight = Math.min(255, b + 10);
  const rDeep = Math.round(r * 0.52 + 20 * 0.48);
  const gDeep = Math.round(g * 0.52 + 12 * 0.48);
  const bDeep = Math.round(b * 0.52 + 8 * 0.48);

  return `linear-gradient(180deg, rgb(${rLight}, ${gLight}, ${bLight}) 0%, rgb(${rDeep}, ${gDeep}, ${bDeep}) 100%)`;
}

/** Brown console card tones — matches doehealth initiative cards with a slight per-agent shift. */
function brownConsoleAgentShade(index: number) {
  const step = index / Math.max(CALL_HISTORY_ORBIT_COUNT - 1, 1);
  const fromR = Math.round(42 + step * 9);
  const fromG = Math.round(33 + step * 7);
  const fromB = Math.round(24 + step * 5);
  const toR = Math.round(23 + step * 7);
  const toG = Math.round(16 + step * 5);
  const toB = Math.round(8 + step * 4);

  return `linear-gradient(${168 + Math.round(step * 10)}deg, rgb(${fromR}, ${fromG}, ${fromB}) 0%, rgb(${toR}, ${toG}, ${toB}) 100%)`;
}

function agentCircleShade(index: number, variant: "default" | "brown-console") {
  return variant === "brown-console" ? brownConsoleAgentShade(index) : callHistoryOrbitGradient(index);
}

function VoiceCallHistoryOrbitStats() {
  return (
    <div className="product-landing-workspace__orbit-stat">
      <span className={`product-landing-workspace__orbit-stat-value ${dmSans.className}`}>
        {CALL_HISTORY_ORBIT_COUNT}
      </span>
      <div className={`product-landing-workspace__orbit-stat-label-stack ${suisseIntl.className}`}>
        {PRODUCT2_LANDING_CALL_HISTORY_ORBIT.labelLines.map((line) => (
          <span key={line} className="product-landing-workspace__orbit-stat-label">
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}

/** /product2 Today — seven active agent orbit with center stat. */
export function Product2ActiveAgentsOrbit({
  children,
  showEditButton = true,
  showAgentIcons = true,
  variant = "default",
  className = "",
}: {
  children?: ReactNode;
  showEditButton?: boolean;
  showAgentIcons?: boolean;
  variant?: "default" | "brown-console";
  className?: string;
}) {
  const orbitVariantClass =
    variant === "brown-console" ? " product-landing-workspace__orbit--brown-console" : "";

  return (
    <div className={`product-landing-workspace__orbit${orbitVariantClass}${className ? ` ${className}` : ""}`}>
      {showEditButton ? (
        <button
          type="button"
          className={`product-landing-workspace__orbit-edit ${suisseIntl.className}`}
          tabIndex={-1}
        >
          {PRODUCT2_LANDING_CALL_HISTORY_ORBIT.editAgentsLabel}
        </button>
      ) : null}
      <div className="product-landing-workspace__orbit-ring">
        <div className="product-landing-workspace__orbit-center">{children ?? <VoiceCallHistoryOrbitStats />}</div>
        <div className="product-landing-workspace__orbit-circles">
          {CALL_HISTORY_ORBIT_AGENTS.map((agent, index) => (
            <span
              key={agent.id}
              className="product-landing-workspace__orbit-circle"
              style={
                {
                  "--orbit-angle": `${(index / CALL_HISTORY_ORBIT_COUNT) * 360}deg`,
                  "--orbit-shade": agentCircleShade(index, variant),
                  "--orbit-z": CALL_HISTORY_ORBIT_COUNT - index,
                } as CSSProperties
              }
            >
              <span className="product-landing-workspace__orbit-circle-content">
                {showAgentIcons ? <VoiceCallHistoryOrbitAgentIcon kind={agent.icon} /> : null}
                <span className={`product-landing-workspace__orbit-circle-name ${dmSans.className}`}>
                  {agent.nameLines.map((line) => (
                    <span key={line} className="product-landing-workspace__orbit-circle-name-line">
                      {line}
                    </span>
                  ))}
                </span>
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
