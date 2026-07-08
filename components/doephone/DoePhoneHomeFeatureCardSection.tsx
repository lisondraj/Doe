"use client";

import { DoePhoneCommunicationCarouselCard } from "@/components/doephone/DoePhoneCommunicationCarouselCard";
import type { DoePhoneCommunicationSlide } from "@/lib/doephone/communication-carousel";
import { DOE_DESKTOP_FEATURE_TITLE_TW } from "@/lib/doephone/doe-desktop-layout-styles";
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
  variant = "mobile",
}: {
  slide: DoePhoneCommunicationSlide;
  titleLine1: string;
  titleLine2: string;
  shaderTheme?: "default" | "dusk";
  variant?: "mobile" | "desktop";
}) {
  const shaderVariant = protoGrainGradientVariant(slide.id);
  const isDesktop = variant === "desktop";

  return (
    <section
      className={`home-feature-card-section ${
        isDesktop
          ? "relative z-10 flex min-h-[100dvh] w-full flex-col bg-[var(--doe-page-surface,#EDE8DF)]"
          : DOEPHONE_MAIN_PAGE_BEIGE_SECTION
      }`}
      aria-label={slide.menuLabel}
    >
      <div className={`${DOEPHONE_SECTION_CONTENT_CENTER} home-feature-card-section__inner`}>
        <div className={`w-full ${isDesktop ? "" : DOEPHONE_SECTION_CAROUSEL_INSET_X}`}>
          <div
            className={`home-feature-card-section__card w-full ${
              isDesktop ? "" : DOEPHONE_SECTION_CAROUSEL_HEIGHT
            }`}
          >
            <DoePhoneCommunicationCarouselCard
              slide={slide}
              showExpandControls={false}
              uiInteractive={false}
              heroShaderColors
              heroShaderDusk={shaderTheme === "dusk"}
              protoShaderVariant={shaderVariant}
              uiScaleClass={isDesktop ? undefined : "home-feature-card-ui-scale"}
            />
          </div>

          <h2
            className={`home-feature-card-section__title ${
              isDesktop
                ? `mt-5 text-left ${DOE_DESKTOP_FEATURE_TITLE_TW}`
                : `mt-[clamp(1.35rem,0.9rem+1.85vmin,2.15rem)] text-left ${DOEPHONE_DISPLAY_WEIGHT_TW} leading-[1.02] tracking-[-0.03em] text-[#1E343A]`
            } ${suisseIntl.className}`}
          >
            <span className="block">{titleLine1}</span>
            <span className="block">{titleLine2}</span>
          </h2>
        </div>
      </div>
    </section>
  );
}
