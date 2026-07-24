import { DoeHealthDaySummaryCard } from "@/components/doehealth/DoeHealthDaySummaryCard";
import { DOEHEALTH_INTRO_COPY } from "@/lib/doehealth/doehealth-intro-copy";
import { suisseIntl } from "@/lib/home/fonts";

/** Second brown band — /product2 Today summary card + gold section title. */
export function DoeHealthDaySummaryBand() {
  const { line1, line2 } = DOEHEALTH_INTRO_COPY.daySummarySectionTitle;

  return (
    <section
      className="doehealth-intro-band doehealth-intro-band--initiatives doehealth-intro-band--day-summary relative z-10 flex w-full shrink-0 flex-col"
      aria-label={`${line1} ${line2}, clinic day summary`}
    >
      <div className="doehealth-intro-band__shell relative z-[10] flex min-h-0 w-full flex-1 flex-col items-stretch justify-center">
        <div className="doehealth-intro-band__cluster">
          <div className="doehealth-intro-stage">
            <div className="doehealth-day-summary-sequence">
              <div className="doehealth-day-summary-sequence__stage">
                <DoeHealthDaySummaryCard className="doehealth-day-summary-sequence__card" />
              </div>
            </div>
          </div>

          <h2
            className={`doehealth-intro-band__section-title ${suisseIntl.className}`}
            aria-label={`${line1} ${line2}`}
          >
            <span className="doehealth-intro-band__section-title-line">{line1}</span>
            <span className="doehealth-intro-band__section-title-line">{line2}</span>
          </h2>
        </div>
      </div>
    </section>
  );
}
