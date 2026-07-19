import { DoeHealthFounderCircles } from "@/components/doehealth/DoeHealthFounderCircles";
import {
  DOEPHONE_DISPLAY_WEIGHT_TW,
  DOEPHONE_SECTION_CAROUSEL_INSET_X,
} from "@/lib/doephone/section-styles";
import { DOEHEALTH_INTRO_COPY } from "@/lib/doehealth/doehealth-intro-copy";
import { inter, suisseIntl } from "@/lib/home/fonts";

/** Full phone-viewport intro band — page surface, left-aligned sans copy. */
export function DoeHealthBlankViewportBand() {
  const [introLead, introClose] = DOEHEALTH_INTRO_COPY.body;

  return (
    <section
      className="doehealth-intro-band relative z-10 flex w-full shrink-0 flex-col bg-[var(--doe-page-surface,#EDE8DF)]"
      aria-label={`${DOEHEALTH_INTRO_COPY.title.line1} ${DOEHEALTH_INTRO_COPY.title.line2}`}
      style={{ minHeight: "var(--app-vh, 100lvh)" }}
    >
      <div className="doehealth-intro-band__shell relative z-[10] flex h-full min-h-0 w-full flex-col">
        <h2
          className={`doehealth-intro-band__title home-feature-card-section__title home-feature-card-section__title--feature-lead m-0 text-left ${DOEPHONE_DISPLAY_WEIGHT_TW} leading-[1.02] tracking-[-0.03em] ${DOEPHONE_SECTION_CAROUSEL_INSET_X} ${suisseIntl.className}`}
        >
          <span className="block">{DOEHEALTH_INTRO_COPY.title.line1}</span>
          <span className="block">{DOEHEALTH_INTRO_COPY.title.line2}</span>
        </h2>
        <div
          className={`doehealth-intro-band__content flex w-full min-w-0 flex-col items-start ${DOEPHONE_SECTION_CAROUSEL_INSET_X}`}
        >
          <p className={`doehealth-intro-band__body m-0 text-left ${inter.className}`}>{introLead}</p>
          <DoeHealthFounderCircles />
          <p className={`doehealth-intro-band__body m-0 text-left ${inter.className}`}>{introClose}</p>
        </div>
      </div>
    </section>
  );
}
