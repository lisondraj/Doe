import { DoeHealthActiveAgentsCard } from "@/components/doehealth/DoeHealthActiveAgentsCard";
import { DOEHEALTH_INTRO_COPY } from "@/lib/doehealth/doehealth-intro-copy";
import { suisseIntl } from "@/lib/home/fonts";

/** Third brown band — active agents orbit + gold section title. */
export function DoeHealthActiveAgentsBand() {
  const { line1, line2 } = DOEHEALTH_INTRO_COPY.activeAgentsSectionTitle;

  return (
    <section
      className="doehealth-intro-band doehealth-intro-band--initiatives doehealth-intro-band--active-agents relative z-10 flex w-full shrink-0 flex-col"
      aria-label={`${line1} ${line2}, active agents`}
    >
      <div className="doehealth-intro-band__shell relative z-[10] flex min-h-0 w-full flex-1 flex-col items-stretch justify-center">
        <div className="doehealth-intro-band__cluster">
          <div className="doehealth-intro-stage">
            <div className="doehealth-active-agents-sequence">
              <div className="doehealth-active-agents-sequence__stage">
                <DoeHealthActiveAgentsCard className="doehealth-active-agents-sequence__card" />
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
