"use client";

import { DoeHealthPhoneReveal } from "@/components/doehealth/DoeHealthPhoneBandReveal";
import { DoePhoneCallHistoryVisual } from "@/components/doephone/DoePhoneCallHistoryVisual";
import { suisseIntl } from "@/lib/home/fonts";

function RoutedCallsCursor({ label, motionClass }: { label: string; motionClass: string }) {
  return (
    <div className={`doehealth-routed-calls-cursor ${motionClass}`} aria-hidden>
      <svg
        className="doehealth-routed-calls-cursor__pointer"
        width="22"
        height="26"
        viewBox="0 0 22 26"
        fill="none"
      >
        <path
          d="M4.25 2.75 4.25 19.5c0 .62.72.98 1.24.62l4.38-2.72 2.85 5.58c.32.62 1.14.68 1.54.12l1.48-2.02-2.2-4.3 5.01-1.38c.64-.18.98-.92.62-1.52L5.47 2.89c-.48-.78-1.47-.42-1.47.62Z"
          fill="#1a1208"
          stroke="#d4a574"
          strokeWidth="1.15"
          strokeLinejoin="round"
        />
      </svg>
      <span className={`doehealth-routed-calls-cursor__pill ${suisseIntl.className}`}>{label}</span>
    </div>
  );
}

/** Right-bleed routed calls — 18 routed UI with agent/human cursor loop + section gold type. */
export function DoeHealthRoutedCallsBleedRightScene({ layout = "phone" }: { layout?: "phone" | "desktop" }) {
  return (
    <div className="doehealth-routed-calls-bleed-right" aria-hidden>
      <DoeHealthPhoneReveal segment="title" className="doehealth-routed-calls-bleed-right__reveal-ui">
        <div className="doehealth-routed-calls-bleed-right__ui">
          <DoePhoneCallHistoryVisual layout={layout} />
        </div>

        <div className="doehealth-routed-calls-cursors">
          <RoutedCallsCursor label="Agent" motionClass="doehealth-routed-calls-cursor--agent" />
          <RoutedCallsCursor label="Human" motionClass="doehealth-routed-calls-cursor--human" />
        </div>
      </DoeHealthPhoneReveal>

      <DoeHealthPhoneReveal segment="carousel" className="doehealth-routed-calls-bleed-right__title">
        <h2 className={`doehealth-routed-calls-bleed-right__title-text ${suisseIntl.className}`}>
          <span className="doehealth-routed-calls-bleed-right__title-line">Agents &amp; humans,</span>
          <span className="doehealth-routed-calls-bleed-right__title-line">together</span>
        </h2>
      </DoeHealthPhoneReveal>
    </div>
  );
}
