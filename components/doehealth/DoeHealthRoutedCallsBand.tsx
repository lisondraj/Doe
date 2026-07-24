import { DoeHealthRoutedCallsCard } from "@/components/doehealth/DoeHealthRoutedCallsCard";
import { DOEHEALTH_INTRO_COPY } from "@/lib/doehealth/doehealth-intro-copy";
import { suisseIntl } from "@/lib/home/fonts";

/** Brown band — inbox shader card (18 routed today) + gold section title underneath. */
export function DoeHealthRoutedCallsBand() {
  const { line1, line2 } = DOEHEALTH_INTRO_COPY.routedCallsSectionTitle;

  return (
    <section
      className="doehealth-intro-band doehealth-intro-band--initiatives doehealth-intro-band--routed-calls relative z-10 flex w-full shrink-0 flex-col"
      aria-label={`${line1} ${line2}, routed call history`}
    >
      <div className="doehealth-intro-band__shell relative z-[10] flex min-h-0 w-full flex-1 flex-col items-stretch justify-center">
        <div className="doehealth-intro-band__cluster">
          <div className="doehealth-intro-stage">
            <div className="doehealth-routed-calls-sequence">
              <div className="doehealth-routed-calls-sequence__stage">
                <DoeHealthRoutedCallsCard className="doehealth-routed-calls-sequence__card" />
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
