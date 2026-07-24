import { DoeHealthActiveAgentsBand } from "@/components/doehealth/DoeHealthActiveAgentsBand";
import { DoeHealthBlankViewportBand } from "@/components/doehealth/DoeHealthBlankViewportBand";
import { DoeHealthDaySummaryBand } from "@/components/doehealth/DoeHealthDaySummaryBand";
import { DoeHealthRoutedCallsBand } from "@/components/doehealth/DoeHealthRoutedCallsBand";
import "@/lib/doehealth/doehealth-initiatives.css";

/** Intro + routed calls + day summary + active agents — one continuous brown gradient stack. */
export function DoeHealthBrownBandStack() {
  return (
    <div className="doehealth-brown-band-stack">
      <DoeHealthBlankViewportBand />
      <DoeHealthRoutedCallsBand />
      <DoeHealthDaySummaryBand />
      <DoeHealthActiveAgentsBand />
    </div>
  );
}
