import { DoeHealthPatientChartCard } from "@/components/doehealth/DoeHealthPatientChartCard";
import { DOEHEALTH_INTRO_COPY } from "@/lib/doehealth/doehealth-intro-copy";
import { suisseIntl } from "@/lib/home/fonts";

/** Pre-footer brown band — interlocking patient chart mosaic + section title. */
export function DoeHealthPatientChartBand() {
  const { line1, line2 } = DOEHEALTH_INTRO_COPY.patientChartSectionTitle;

  return (
    <section
      className="doehealth-intro-band doehealth-intro-band--initiatives doehealth-intro-band--patient-chart relative z-10 flex w-full shrink-0 flex-col"
      aria-label={`${line1} ${line2}, patient chart`}
    >
      <div className="doehealth-intro-band__shell relative z-[10] flex min-h-0 w-full flex-1 flex-col items-stretch justify-center">
        <div className="doehealth-intro-band__cluster">
          <div className="doehealth-intro-stage">
            <div className="doehealth-patient-chart-sequence doehealth-content-rail">
              <div className="doehealth-patient-chart-sequence__stage doehealth-content-rail__summary-edge">
                <DoeHealthPatientChartCard className="doehealth-patient-chart-sequence__card" />
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
