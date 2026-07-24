import { DoeHealthActiveAgentsBand } from "@/components/doehealth/DoeHealthActiveAgentsBand";
import { DoeHealthBlankViewportBand } from "@/components/doehealth/DoeHealthBlankViewportBand";
import { DoeHealthDaySummaryBand } from "@/components/doehealth/DoeHealthDaySummaryBand";
import { DoeHealthRoutedCallsBand } from "@/components/doehealth/DoeHealthRoutedCallsBand";
import { DoeHealthRoutedCallsLeft2Band } from "@/components/doehealth/DoeHealthRoutedCallsLeft2Band";
import { DoeHealthRoutedCallsRightBand } from "@/components/doehealth/DoeHealthRoutedCallsRightBand";
import "@/lib/doehealth/doehealth-initiatives.css";

/** Intro + routed calls + day summary + routed calls (right bleed) + active agents + second left bleed. */
export function DoeHealthBrownBandStack() {
  return (
    <div className="doehealth-brown-band-stack">
      <DoeHealthBlankViewportBand />
      <DoeHealthRoutedCallsBand />
      <DoeHealthDaySummaryBand />
      <DoeHealthRoutedCallsRightBand />
      <DoeHealthActiveAgentsBand />
      <DoeHealthRoutedCallsLeft2Band />
    </div>
  );
}
