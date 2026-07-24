import { DoePhoneCommunicationCarouselCard } from "@/components/doephone/DoePhoneCommunicationCarouselCard";
import { pickCommunicationSlides } from "@/lib/doephone/communication-carousel";
import { DOEPHONE_SECTION_CAROUSEL_HEIGHT } from "@/lib/doephone/section-styles";
import { protoGrainGradientVariant } from "@/lib/proto/proto-grain-gradient";
import "@/lib/doehealth/doehealth-initiatives.css";

const INBOX_SLIDE = pickCommunicationSlides(["inbox"])[0]!;

/** Main-page inbox shader card — 18 routed today call history UI on the brown band. */
export function DoeHealthRoutedCallsCard({ className = "" }: { className?: string }) {
  return (
    <div className={`doehealth-routed-calls${className ? ` ${className}` : ""}`}>
      <div
        className={`doehealth-routed-calls__shader-card home-feature-card-section__card ${DOEPHONE_SECTION_CAROUSEL_HEIGHT}`}
      >
        <DoePhoneCommunicationCarouselCard
          slide={INBOX_SLIDE}
          showExpandControls={false}
          uiInteractive={false}
          heroShaderColors
          heroShaderDusk
          protoShaderVariant={protoGrainGradientVariant("inbox")}
          uiScaleClass="home-feature-card-ui-scale home-feature-card-ui-scale--call-history"
        />
      </div>
    </div>
  );
}
