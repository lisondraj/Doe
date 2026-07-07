"use client";

import { DoePhoneCommunicationCarouselCard } from "@/components/doephone/DoePhoneCommunicationCarouselCard";
import type { DoePhoneCommunicationSlide } from "@/lib/doephone/communication-carousel";
import {
  DOEPHONE_DISPLAY_WEIGHT_TW,
  DOEPHONE_MAIN_PAGE_BEIGE_SECTION,
  DOEPHONE_SECTION_CAROUSEL_HEIGHT,
  DOEPHONE_SECTION_CAROUSEL_INSET_X,
  DOEPHONE_SECTION_CAROUSEL_RADIUS,
  DOEPHONE_SECTION_CONTENT_CENTER,
} from "@/lib/doephone/section-styles";
import { DOE_PAGE_INK, DOE_PAGE_SURFACE_SUNKEN_DEEP } from "@/lib/home/doe-page-colors";
import { suisseIntl } from "@/lib/home/fonts";
import { protoGrainGradientVariant } from "@/lib/proto/proto-grain-gradient";

/** Beige band — single shader card with hero-scale title underneath. */
export function DoePhoneHomeFeatureCardSection({
  slide,
  titleLine1,
  titleLine2,
  showTitle = true,
}: {
  slide: DoePhoneCommunicationSlide;
  titleLine1: string;
  titleLine2: string;
  showTitle?: boolean;
}) {
  const shaderVariant = protoGrainGradientVariant(slide.id);

  return (
    <section
      className={`home-feature-card-section ${DOEPHONE_MAIN_PAGE_BEIGE_SECTION}${slide.id === "agents" ? " home-feature-card-section--agents" : ""}`}
      aria-label={slide.menuLabel}
    >
      <div className={`${DOEPHONE_SECTION_CONTENT_CENTER} home-feature-card-section__inner`}>
        <div className={`w-full ${DOEPHONE_SECTION_CAROUSEL_INSET_X}`}>
          {slide.id === "agents" ? (
            <div className="home-feature-card-section__agents-stack flex w-full flex-col">
              <div
                className={`home-feature-card-section__shader-box home-feature-card-section__teal-panel relative flex min-h-0 w-full shrink-0 flex-col overflow-hidden ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
                style={{ backgroundColor: DOE_PAGE_INK }}
              >
                <div className="home-feature-card-section__teal-panel-inner relative min-h-0 flex-1 overflow-hidden">
                  <DoePhoneCommunicationCarouselCard
                    slide={slide}
                    showExpandControls={false}
                    uiInteractive={false}
                    heroShaderColors
                    protoShaderVariant={shaderVariant}
                    uiScaleClass="home-feature-card-ui-scale"
                    className="shadow-none"
                  />
                </div>
              </div>
              <div className="home-feature-card-section__agents-lower-stack flex w-full min-h-0 shrink-0 flex-col overflow-hidden">
                <div
                  className={`home-feature-card-section__sunken-tray relative flex min-h-0 w-full flex-1 flex-col items-center justify-center overflow-hidden ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
                  style={{ backgroundColor: DOE_PAGE_SURFACE_SUNKEN_DEEP }}
                >
                  <div className="home-feature-card-section__teal-stack flex w-full flex-col">
                    <div
                      aria-hidden
                      className={`home-feature-card-section__teal-square shrink-0 ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
                      style={{ backgroundColor: DOE_PAGE_INK }}
                    />
                    <div
                      aria-hidden
                      className={`home-feature-card-section__teal-short shrink-0 ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
                      style={{ backgroundColor: DOE_PAGE_INK }}
                    />
                  </div>
                </div>
                <div
                  aria-hidden
                  className="home-feature-card-section__card-plate w-full shrink-0"
                  style={{ backgroundColor: DOE_PAGE_SURFACE_SUNKEN_DEEP }}
                />
              </div>
            </div>
          ) : (
            <div className={`home-feature-card-section__card w-full ${DOEPHONE_SECTION_CAROUSEL_HEIGHT}`}>
              <DoePhoneCommunicationCarouselCard
                slide={slide}
                showExpandControls={false}
                uiInteractive={false}
                heroShaderColors
                protoShaderVariant={shaderVariant}
                uiScaleClass="home-feature-card-ui-scale"
              />
            </div>
          )}

          {showTitle ? (
            <h2
              className={`home-feature-card-section__title mt-[clamp(1.35rem,0.9rem+1.85vmin,2.15rem)] text-left ${DOEPHONE_DISPLAY_WEIGHT_TW} leading-[1.02] tracking-[-0.03em] text-[#1E343A] ${suisseIntl.className}`}
            >
              <span className="block">{titleLine1}</span>
              <span className="block">{titleLine2}</span>
            </h2>
          ) : null}
        </div>
      </div>
    </section>
  );
}
