"use client";

import { DoeHealthPhoneReveal } from "@/components/doehealth/DoeHealthPhoneBandReveal";
import { DoePhoneHomePriorAuthVisual } from "@/components/doephone/DoePhoneHomePriorAuthVisual";
import { suisseIntl } from "@/lib/home/fonts";

/** Last left-bleed overlay — main-page prior auth brown UI (iPhone). */
export function DoeHealthPriorAuthBleedUi() {
  return (
    <div className="doehealth-prior-auth-bleed" aria-hidden>
      <DoeHealthPhoneReveal segment="title" className="doehealth-prior-auth-bleed__ui-reveal">
        <div className="home-feature-section__prior-auth relative z-[20] w-full min-h-0 flex-1">
          <DoePhoneHomePriorAuthVisual />
        </div>
      </DoeHealthPhoneReveal>
      <DoeHealthPhoneReveal segment="carousel" className="doehealth-prior-auth-bleed__title">
        <h2 className={`doehealth-prior-auth-bleed__title-text ${suisseIntl.className}`}>
          <span className="doehealth-prior-auth-bleed__title-line">Calls insurers</span>
          <span className="doehealth-prior-auth-bleed__title-line">on your behalf</span>
        </h2>
      </DoeHealthPhoneReveal>
    </div>
  );
}
