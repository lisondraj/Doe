"use client";

import { DoeHealthPhoneBandCluster } from "@/components/doehealth/DoeHealthPhoneBandReveal";
import { DoeHealthRoutedCallsCard } from "@/components/doehealth/DoeHealthRoutedCallsCard";

/** Brown band — right-bleed iPhone silhouette with /product Today (Access your agents anywhere). */
export function DoeHealthAgentsAnywhereBand() {
  return (
    <section
      className="doehealth-intro-band doehealth-intro-band--initiatives doehealth-intro-band--routed-calls doehealth-intro-band--agents-anywhere relative z-10 flex w-full shrink-0 flex-col"
      aria-label="Access your agents anywhere"
    >
      <div className="doehealth-intro-band__shell relative z-[10] flex min-h-0 w-full flex-1 flex-col items-stretch justify-center">
        <DoeHealthPhoneBandCluster>
          <div className="doehealth-intro-stage">
            <div className="doehealth-routed-calls-sequence doehealth-content-rail">
              <div className="doehealth-routed-calls-sequence__stage doehealth-content-rail__summary-edge">
                <DoeHealthRoutedCallsCard
                  bleedRight
                  shaderPreset="right-2"
                  className="doehealth-routed-calls-sequence__card"
                />
              </div>
            </div>
          </div>
        </DoeHealthPhoneBandCluster>
      </div>
    </section>
  );
}
