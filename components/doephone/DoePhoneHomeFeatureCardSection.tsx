"use client";

import { DoePhoneCommunicationCarouselCard } from "@/components/doephone/DoePhoneCommunicationCarouselCard";
import { DoePhoneHomeSpecialtyPillColumns } from "@/components/doephone/DoePhoneHomeSpecialtyPillColumns";
import type { DoePhoneCommunicationSlide } from "@/lib/doephone/communication-carousel";
import {
  DOEPHONE_DISPLAY_WEIGHT_TW,
  DOEPHONE_MAIN_PAGE_BEIGE_SECTION,
  DOEPHONE_SECTION_CAROUSEL_HEIGHT,
  DOEPHONE_SECTION_CAROUSEL_INSET_X,
  DOEPHONE_SECTION_CONTENT_CENTER,
} from "@/lib/doephone/section-styles";
import { suisseIntl } from "@/lib/home/fonts";
import { protoGrainGradientVariant } from "@/lib/proto/proto-grain-gradient";

/** Beige band — single shader card with hero-scale title underneath. */
export function DoePhoneHomeFeatureCardSection({
  slide,
  titleLine1,
  titleLine2,
  shaderTheme = "default",
  showSpecialtyColumns = false,
}: {
  slide: DoePhoneCommunicationSlide;
  titleLine1: string;
  titleLine2: string;
  shaderTheme?: "default" | "dusk";
  showSpecialtyColumns?: boolean;
}) {
  const shaderVariant = protoGrainGradientVariant(slide.id);

  return (
    <section
      className={`home-feature-card-section${showSpecialtyColumns ? " home-feature-card-section--specialties" : ""} ${DOEPHONE_MAIN_PAGE_BEIGE_SECTION}`}
      aria-label={slide.menuLabel}
    >
      <div className={`${DOEPHONE_SECTION_CONTENT_CENTER} home-feature-card-section__inner`}>
        <div
          className={`home-feature-card-section__content flex min-h-0 w-full shrink-0 flex-col ${DOEPHONE_SECTION_CAROUSEL_INSET_X} layout-desktop:h-full layout-desktop:min-h-0 layout-desktop:px-0${showSpecialtyColumns ? " home-feature-card-section__content--specialties" : ""}`}
        >
          {showSpecialtyColumns ? (
            <div className="home-feature-card-section__specialties-main flex min-h-0 w-full flex-1 flex-col justify-center">
              <h2
                className={`home-feature-card-section__title home-feature-card-section__title--specialties text-left ${DOEPHONE_DISPLAY_WEIGHT_TW} leading-[1.02] tracking-[-0.03em] text-[#1E343A] ${suisseIntl.className}`}
              >
                <span className="block">{titleLine1}</span>
                <span className="block">{titleLine2}</span>
              </h2>
              <DoePhoneHomeSpecialtyPillColumns />
            </div>
          ) : (
            <>
              <div
                className={`home-feature-card-section__card w-full ${DOEPHONE_SECTION_CAROUSEL_HEIGHT} layout-desktop:!h-full layout-desktop:!min-h-0 layout-desktop:!max-h-none layout-desktop:!flex-1 layout-desktop:!shrink`}
              >
                <DoePhoneCommunicationCarouselCard
                  slide={slide}
                  showExpandControls={false}
                  uiInteractive={false}
                  heroShaderColors
                  heroShaderDusk={shaderTheme === "dusk"}
                  protoShaderVariant={shaderVariant}
                  uiScaleClass="home-feature-card-ui-scale"
                />
              </div>

              <h2
                className={`home-feature-card-section__title mt-[clamp(1.35rem,0.9rem+1.85vmin,2.15rem)] text-left ${DOEPHONE_DISPLAY_WEIGHT_TW} leading-[1.02] tracking-[-0.03em] text-[#1E343A] ${suisseIntl.className}`}
              >
                <span className="block">{titleLine1}</span>
                <span className="block">{titleLine2}</span>
              </h2>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
