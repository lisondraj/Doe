import { HomeBlogFeaturedCarouselSection } from "@/components/blog/HomeBlogFeaturedCarouselSection";
import { DoeHealthActiveAgentsBand } from "@/components/doehealth/DoeHealthActiveAgentsBand";
import { DoeHealthAgentsAnywhereBand } from "@/components/doehealth/DoeHealthAgentsAnywhereBand";
import { DoeHealthBlankViewportBand } from "@/components/doehealth/DoeHealthBlankViewportBand";
import { DoeHealthDaySummaryBand } from "@/components/doehealth/DoeHealthDaySummaryBand";
import { DoeHealthRoutedCallsBand } from "@/components/doehealth/DoeHealthRoutedCallsBand";
import { DoeHealthRoutedCallsLeft2Band } from "@/components/doehealth/DoeHealthRoutedCallsLeft2Band";
import { DoeHealthIntroVideoBand } from "@/components/doehealth/DoeHealthIntroVideoBand";
import { DoeHealthPatientChartBand } from "@/components/doehealth/DoeHealthPatientChartBand";
import { DoeHealthRoutedCallsRightBand } from "@/components/doehealth/DoeHealthRoutedCallsRightBand";
import "@/lib/doehealth/doehealth-initiatives.css";

/** Blog carousel + intro + routed calls + day summary + right bleed + active agents + left-2 + patient chart + agents anywhere (right) + intro video. */
export function DoeHealthBrownBandStack() {
  return (
    <div className="doehealth-brown-band-stack">
      <HomeBlogFeaturedCarouselSection />
      <DoeHealthBlankViewportBand />
      <DoeHealthRoutedCallsBand />
      <DoeHealthDaySummaryBand />
      <DoeHealthRoutedCallsRightBand />
      <DoeHealthActiveAgentsBand />
      <DoeHealthRoutedCallsLeft2Band />
      <DoeHealthPatientChartBand />
      <DoeHealthAgentsAnywhereBand />
      <DoeHealthIntroVideoBand />
    </div>
  );
}
