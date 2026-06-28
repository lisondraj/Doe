"use client";

import { DoePhoneDesktopFrostPlusBadge } from "@/components/doephone/DoePhoneDesktopFrostPlusBadge";
import { DoePhoneIntegrateVisual } from "@/components/doephone/DoePhoneIntegrateVisual";
import { DoePhoneSectionTitle } from "@/components/doephone/DoePhoneSectionText";
import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import {
  DESKTOP_HOME_BAND_H,
  DESKTOP_FULLSCREEN_SECTION_BADGE_INSET,
  DESKTOP_FULLSCREEN_SECTION_TITLE_PT,
  DESKTOP_FULLSCREEN_SECTION_TITLE_TW,
  DOEPHONE_DESKTOP_PAGE_INSET_RIGHT,
  DOEPHONE_DESKTOP_PAGE_INSET_X,
} from "@/lib/doephone/section-styles";
import { doephoneSectionRevealStyleVars } from "@/lib/doephone/section-reveal-timing";
import {
  doePhoneSectionRevealSegmentClass,
  useDoePhoneSectionReveal,
} from "@/lib/doephone/use-doe-phone-section-reveal";
import { DOEPHONE_DEPLOYMENTS_GRADIENT } from "@/lib/doephone/communication-carousel";
import { DIAGNOSTIC_ASSISTANT_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";
import type { CSSProperties } from "react";

const DESKTOP_INTEGRATIONS_UI_INSET = `pb-10 md:pb-14 lg:pb-16 xl:pb-20 ${DOEPHONE_DESKTOP_PAGE_INSET_RIGHT}`;

/** Desktop integrations band — gradient fill, title, + badge, integration tiles bottom-right. */
export function DoePhoneDesktopIntegrationsSection() {
  const { ref: sectionRef, revealed } = useDoePhoneSectionReveal();

  return (
    <section
      className={`relative isolate z-10 w-full overflow-hidden bg-[#1E343A] ${DESKTOP_HOME_BAND_H}`}
      style={doephoneSectionRevealStyleVars() as CSSProperties}
      aria-label="Integrations"
    >
      <div className="pointer-events-none absolute -inset-[3%] overflow-hidden" aria-hidden>
        <WorkflowCarouselDesignBackdrop
          backdrop={DIAGNOSTIC_ASSISTANT_BACKDROP}
          embedded
          gradientOverride={DOEPHONE_DEPLOYMENTS_GRADIENT}
          gradientScale={1}
          patternScale={1.12}
        />
      </div>

      <div
        ref={sectionRef}
        className={`relative z-[20] w-full ${DESKTOP_HOME_BAND_H} ${DOEPHONE_DESKTOP_PAGE_INSET_X}`}
      >
        <DoePhoneDesktopFrostPlusBadge
          className={`absolute z-30 ${DESKTOP_FULLSCREEN_SECTION_BADGE_INSET} ${doePhoneSectionRevealSegmentClass("badge", revealed)}`}
        />

        <div className={`relative z-[20] flex flex-col ${DESKTOP_FULLSCREEN_SECTION_TITLE_PT}`}>
          <div className="relative pr-[clamp(5.5rem,8vw,7rem)]">
            <DoePhoneSectionTitle
              line1="Intelligence built."
              line2="into your stack."
              color="text-white"
              copyClassName={DESKTOP_FULLSCREEN_SECTION_TITLE_TW}
              segmentedReveal
              revealed={revealed}
            />
          </div>
        </div>

        <div
          className={`absolute bottom-0 right-0 z-[20] ${DESKTOP_INTEGRATIONS_UI_INSET} ${doePhoneSectionRevealSegmentClass("input", revealed)}`}
        >
          <div className="pointer-events-auto origin-bottom-right scale-[0.76]">
            <DoePhoneIntegrateVisual layout="desktop" />
          </div>
        </div>
      </div>
    </section>
  );
}
