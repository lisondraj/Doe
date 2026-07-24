import { DoeHealthRoutedCallsCard } from "@/components/doehealth/DoeHealthRoutedCallsCard";

/** Brown band — doehealth routed-calls shader + Sarah Westfield / Last A1C UI. */
export function DoeHealthRoutedCallsBand() {
  return (
    <section
      className="doehealth-intro-band doehealth-intro-band--initiatives doehealth-intro-band--routed-calls relative z-10 flex w-full shrink-0 flex-col"
      aria-label="Sarah Westfield call history, last A1C"
    >
      <div className="doehealth-intro-band__shell relative z-[10] flex min-h-0 w-full flex-1 flex-col items-stretch justify-center">
        <div className="doehealth-intro-band__cluster">
          <div className="doehealth-intro-stage">
            <div className="doehealth-routed-calls-sequence doehealth-content-rail">
              <div className="doehealth-routed-calls-sequence__stage doehealth-content-rail__summary-edge">
                <DoeHealthRoutedCallsCard className="doehealth-routed-calls-sequence__card" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
