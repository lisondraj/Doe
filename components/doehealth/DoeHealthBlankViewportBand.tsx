import { DoeHealthIncomingCallDiagram } from "@/components/doehealth/DoeHealthIncomingCallDiagram";
import { DOEHEALTH_CALL_HISTORY_TREE } from "@/lib/doehealth/doehealth-call-history-tree";
import { DOEHEALTH_INTRO_COPY } from "@/lib/doehealth/doehealth-intro-copy";
import { suisseIntl } from "@/lib/home/fonts";

/** Full viewport band — call history card (product2 brown console styling). */
export function DoeHealthBlankViewportBand() {
  const { line1, line2 } = DOEHEALTH_INTRO_COPY.sectionTitle;

  return (
    <section
      className="doehealth-intro-band doehealth-intro-band--initiatives relative z-10 flex w-full shrink-0 flex-col"
      aria-label={`${line1} ${line2}, ${DOEHEALTH_CALL_HISTORY_TREE.heroName}`}
    >
      <div className="doehealth-intro-band__shell relative z-[10] flex min-h-0 w-full flex-1 flex-col items-center justify-center">
        <div className="doehealth-intro-stage">
          <DoeHealthIncomingCallDiagram />
        </div>
      </div>

      <h2
        className={`doehealth-intro-band__section-title ${suisseIntl.className}`}
        aria-label={`${line1} ${line2}`}
      >
        <span className="doehealth-intro-band__section-title-line">{line1}</span>
        <span className="doehealth-intro-band__section-title-line">{line2}</span>
      </h2>
    </section>
  );
}
