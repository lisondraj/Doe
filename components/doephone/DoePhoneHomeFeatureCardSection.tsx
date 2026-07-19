"use client";

import { useLayoutEffect, useState, type CSSProperties } from "react";

import { DoePhoneCommunicationCarouselCard } from "@/components/doephone/DoePhoneCommunicationCarouselCard";
import { DoePhoneHomeAgentsCarousel } from "@/components/doephone/DoePhoneHomeAgentsCarousel";
import { DoePhoneHomeSpecialtyPillColumns } from "@/components/doephone/DoePhoneHomeSpecialtyPillColumns";
import { DoePhoneScrollRevealContent } from "@/components/doephone/DoePhoneScrollRevealLift";
import type { DoePhoneCommunicationSlide } from "@/lib/doephone/communication-carousel";
import {
  DOEPHONE_DISPLAY_WEIGHT_TW,
  DOEPHONE_MAIN_PAGE_BEIGE_SECTION,
  DOEPHONE_SECTION_CAROUSEL_HEIGHT,
  DOEPHONE_SECTION_CAROUSEL_INSET_X,
  DOEPHONE_SECTION_CONTENT_CENTER,
} from "@/lib/doephone/section-styles";
import { suisseIntl } from "@/lib/home/fonts";
import {
  DOEPHONE_DESKTOP_MEDIA_QUERY,
  readBootstrappedDoePhoneVariant,
  resolveDoePhoneVariant,
  type DoePhoneVariant,
} from "@/lib/doephone/resolve-doe-phone-variant";
import {
  doephoneAgentsRevealStyleVars,
  doephoneHomeScrollRevealStyleVars,
  doephoneHomeSectionRevealObserverOptions,
} from "@/lib/doephone/section-reveal-timing";
import { useDoePhoneSectionReveal } from "@/lib/doephone/use-doe-phone-section-reveal";
import { protoGrainGradientVariant } from "@/lib/proto/proto-grain-gradient";

/** Beige band — single shader card with hero-scale title underneath. */
export function DoePhoneHomeFeatureCardSection({
  slide,
  titleLine1,
  titleLine2,
  shaderTheme = "default",
  showSpecialtyColumns = false,
  showAgentsCarousel = false,
  showAgentsCarouselTitle = false,
  isFirstBelowHero = false,
  disableCarouselInteractions = false,
  freezeSpecialtyMarquee = false,
}: {
  slide: DoePhoneCommunicationSlide;
  titleLine1: string;
  titleLine2: string;
  shaderTheme?: "default" | "dusk";
  showSpecialtyColumns?: boolean;
  showAgentsCarousel?: boolean;
  /** /doehealth workflow band — title above carousel; main home keeps carousel-only layout. */
  showAgentsCarouselTitle?: boolean;
  isFirstBelowHero?: boolean;
  disableCarouselInteractions?: boolean;
  freezeSpecialtyMarquee?: boolean;
}) {
  const shaderVariant = protoGrainGradientVariant(slide.id);
  const bootVariant = readBootstrappedDoePhoneVariant();
  const revealObserver = doephoneHomeSectionRevealObserverOptions(bootVariant);
  const [layoutVariant, setLayoutVariant] = useState<DoePhoneVariant>(bootVariant);
  const { ref: revealRef, revealed } = useDoePhoneSectionReveal(revealObserver.threshold, {
    skipInitialReveal: isFirstBelowHero,
    rootMargin: revealObserver.rootMargin,
  });
  const revealStyle = (
    showAgentsCarousel
      ? doephoneAgentsRevealStyleVars(layoutVariant)
      : doephoneHomeScrollRevealStyleVars(layoutVariant)
  ) as CSSProperties;

  useLayoutEffect(() => {
    setLayoutVariant(readBootstrappedDoePhoneVariant());
    const sync = () => setLayoutVariant(resolveDoePhoneVariant());
    const mq = window.matchMedia(DOEPHONE_DESKTOP_MEDIA_QUERY);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const isUiPanel = !showSpecialtyColumns && !showAgentsCarousel;
  const isDesktop = layoutVariant === "desktop";

  return (
    <section
      className={`home-feature-card-section${showSpecialtyColumns ? " home-feature-card-section--specialties" : ""}${showSpecialtyColumns && freezeSpecialtyMarquee ? " home-feature-card-section--specialties-frozen-marquee" : ""}${isUiPanel ? " home-feature-card-section--ui-panel" : ""} ${DOEPHONE_MAIN_PAGE_BEIGE_SECTION}`}
      aria-label={slide.menuLabel}
    >
      <div className={`${DOEPHONE_SECTION_CONTENT_CENTER} home-feature-card-section__inner`}>
        <div
          ref={revealRef}
          className={`home-feature-card-section__content flex min-h-0 w-full shrink-0 flex-col layout-desktop:h-full layout-desktop:min-h-0 layout-desktop:px-0${showSpecialtyColumns ? " home-feature-card-section__content--specialties" : ` ${DOEPHONE_SECTION_CAROUSEL_INSET_X}`}`}
          style={revealStyle}
        >
          {showSpecialtyColumns ? (
            <div className="home-feature-card-section__specialties-main flex min-h-0 w-full flex-1 flex-col justify-center">
              <DoePhoneScrollRevealContent revealed={revealed} segment="title">
                <h2
                  className={`home-feature-card-section__title home-feature-card-section__title--specialties home-feature-card-section__title--feature-lead m-0 text-left ${DOEPHONE_DISPLAY_WEIGHT_TW} leading-[1.02] tracking-[-0.03em] ${DOEPHONE_SECTION_CAROUSEL_INSET_X} ${suisseIntl.className}`}
                >
                  <span className="block">{titleLine1}</span>
                  <span className="block">{titleLine2}</span>
                </h2>
              </DoePhoneScrollRevealContent>
              <DoePhoneScrollRevealContent revealed={revealed} segment="carousel">
                <DoePhoneHomeSpecialtyPillColumns variant={layoutVariant} freezeMarquee={freezeSpecialtyMarquee} />
              </DoePhoneScrollRevealContent>
            </div>
          ) : showAgentsCarousel ? (
            showAgentsCarouselTitle ? (
              <div className="home-feature-card-section__agents-main flex w-full min-w-0 flex-col items-stretch">
                <DoePhoneScrollRevealContent revealed={revealed} segment="title">
                  <h2
                    className={`home-feature-card-section__title home-feature-card-section__title--agents-lead home-feature-card-section__title--section-lead text-left ${DOEPHONE_DISPLAY_WEIGHT_TW} leading-[1.02] tracking-[-0.03em] text-[#1E343A] ${suisseIntl.className}`}
                  >
                    <span className="block">{titleLine1}</span>
                    <span className="block">{titleLine2}</span>
                  </h2>
                </DoePhoneScrollRevealContent>
                <div className="home-feature-card-section__card home-feature-card-section__card--agents-carousel flex w-full items-center justify-center layout-desktop:!h-full layout-desktop:!min-h-0 layout-desktop:!max-h-none layout-desktop:!flex-1 layout-desktop:!shrink">
                  <DoePhoneScrollRevealContent revealed={revealed} segment="carousel" className="w-full">
                    <DoePhoneHomeAgentsCarousel
                      revealed={revealed}
                      disableInteractions={disableCarouselInteractions}
                    />
                  </DoePhoneScrollRevealContent>
                </div>
              </div>
            ) : (
              <div className="home-feature-card-section__card home-feature-card-section__card--agents-carousel flex w-full items-center justify-center layout-desktop:!h-full layout-desktop:!min-h-0 layout-desktop:!max-h-none layout-desktop:!flex-1 layout-desktop:!shrink">
                <DoePhoneHomeAgentsCarousel
                  revealed={revealed}
                  disableInteractions={disableCarouselInteractions}
                />
              </div>
            )
          ) : (
            <>
              <DoePhoneScrollRevealContent
                revealed={revealed}
                segment="title"
                className={isDesktop ? "home-feature-card-section__ui-panel-reveal" : ""}
              >
                <div
                  className={`home-feature-card-section__card w-full ${DOEPHONE_SECTION_CAROUSEL_HEIGHT} layout-desktop:!h-full layout-desktop:!min-h-0 layout-desktop:!max-h-none layout-desktop:!flex-1 layout-desktop:!shrink`}
                >
                  <DoePhoneCommunicationCarouselCard
                    slide={slide}
                    layout={layoutVariant}
                    showExpandControls={false}
                    uiInteractive={false}
                    heroShaderColors
                    heroShaderDusk={shaderTheme === "dusk"}
                    protoShaderVariant={shaderVariant}
                    uiScaleClass={
                      slide.id === "inbox"
                        ? "home-feature-card-ui-scale home-feature-card-ui-scale--call-history"
                        : slide.id === "ambient"
                          ? "home-feature-card-ui-scale home-feature-card-ui-scale--no-shows"
                          : "home-feature-card-ui-scale"
                    }
                  />
                </div>
              </DoePhoneScrollRevealContent>

              {!isDesktop ? (
                <DoePhoneScrollRevealContent revealed={revealed} segment="carousel">
                  <h2
                    className={`home-feature-card-section__title mt-[clamp(1.35rem,0.9rem+1.85vmin,2.15rem)] text-left ${DOEPHONE_DISPLAY_WEIGHT_TW} leading-[1.02] tracking-[-0.03em] text-[#1E343A] ${suisseIntl.className}`}
                  >
                    <span className="block">{titleLine1}</span>
                    <span className="block">{titleLine2}</span>
                  </h2>
                </DoePhoneScrollRevealContent>
              ) : null}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
