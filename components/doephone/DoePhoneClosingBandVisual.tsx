import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import { DOEPHONE_SECTION_CLOSING_FEATURE_HEIGHT } from "@/lib/doephone/closing-section-styles";
import { DOEPHONE_SECTION_CAROUSEL_RADIUS } from "@/lib/doephone/section-styles";
import type {
  WorkflowCarouselDesignBackdrop as WorkflowCarouselDesignBackdropType,
  WorkflowCarouselSurface,
} from "@/lib/workflow-carousel-design-backdrops";

/** Join hero band backdrop — same grids as /join, sized for closing section cards. */
export function DoePhoneClosingBandVisual({
  backdrop,
  surface,
}: {
  backdrop: WorkflowCarouselDesignBackdropType;
  surface: WorkflowCarouselSurface;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden ${DOEPHONE_SECTION_CLOSING_FEATURE_HEIGHT} ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
      aria-hidden
    >
      <WorkflowCarouselDesignBackdrop
        backdrop={backdrop}
        embedded
        surface={surface}
        className={DOEPHONE_SECTION_CAROUSEL_RADIUS}
      />
    </div>
  );
}
