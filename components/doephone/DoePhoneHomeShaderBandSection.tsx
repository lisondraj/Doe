"use client";

import { DoePhoneCommunicationCarouselCard } from "@/components/doephone/DoePhoneCommunicationCarouselCard";
import { ProtoGrainGradient } from "@/components/proto/ProtoGrainGradient";
import type { DoePhoneCommunicationSlide } from "@/lib/doephone/communication-carousel";
import { HERO_DIAL_ORBS } from "@/lib/doephone/hero-dial-orbs";
import {
  DOEPHONE_DISPLAY_WEIGHT_TW,
  DOEPHONE_MAIN_PAGE_VIEWPORT_SECTION,
  DOEPHONE_SECTION_CAROUSEL_INSET_X,
} from "@/lib/doephone/section-styles";
import { suisseIntl } from "@/lib/home/fonts";
import { doeHomeDuskShaderBandSurface, doeHomeShaderBandSurface } from "@/lib/proto/proto-shader-backdrop-colors";
import { protoGrainGradientVariant } from "@/lib/proto/proto-grain-gradient";

const SPECIALTY_COLUMNS = [
  [
    "Primary Care",
    "Internal Medicine",
    "Family Medicine",
    "Pediatrics",
    "Urgent Care",
    "Emergency Medicine",
    "Geriatrics",
    "Hospital Medicine",
    "Infectious Disease",
    "Nephrology",
    "Pulmonology",
    "Rheumatology",
  ],
  [
    "Cardiology",
    "Dermatology",
    "Endocrinology",
    "Gastroenterology",
    "Hematology",
    "Neurology",
    "Oncology",
    "Ophthalmology",
    "Psychiatry",
    "Radiology",
    "Sleep Medicine",
    "Urology",
  ],
  [
    "Obstetrics",
    "Gynecology",
    "Orthopedics",
    "ENT",
    "Pain Medicine",
    "Physical Therapy",
    "Plastic Surgery",
    "Podiatry",
    "Sports Medicine",
    "Surgery",
    "Vascular Care",
    "Behavioral Health",
  ],
] as const;

function specialtyPillStyle(index: number) {
  const scheme = HERO_DIAL_ORBS[index % HERO_DIAL_ORBS.length];
  return {
    background: `linear-gradient(135deg, ${scheme.colors[2]}F2 0%, ${scheme.colors[1]}D9 100%)`,
    borderColor: `${scheme.colors[2]}66`,
    color: scheme.colors[0],
    boxShadow: `0 18px 40px ${scheme.colors[0]}22, inset 0 1px 0 rgba(255,255,255,0.4)`,
  };
}

/** Full-viewport shader band — empty spacer between feature cards. */
export function DoePhoneHomeShaderBandSection({
  slideId,
  shaderTheme = "default",
  featureSlide,
  titleLine1,
  titleLine2,
}: {
  slideId: DoePhoneCommunicationSlide["id"];
  shaderTheme?: "default" | "dusk";
  featureSlide?: DoePhoneCommunicationSlide;
  titleLine1?: string;
  titleLine2?: string;
}) {
  const shader =
    shaderTheme === "dusk"
      ? doeHomeDuskShaderBandSurface(slideId)
      : doeHomeShaderBandSurface(slideId);
  const shaderVariant = featureSlide ? protoGrainGradientVariant(featureSlide.id) : null;
  const isSpecialtiesBand = slideId === "front-desk" && featureSlide && titleLine1 && titleLine2;

  return (
    <section
      className={`home-feature-shader-band ${DOEPHONE_MAIN_PAGE_VIEWPORT_SECTION}`}
      aria-hidden={!isSpecialtiesBand}
    >
      {shader ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <ProtoGrainGradient
            variant={shader.variant}
            colors={shader.colors}
            colorBack={shader.colorBack}
            static
          />
        </div>
      ) : null}

      {isSpecialtiesBand ? (
        <div className="home-feature-specialties relative z-[1] flex h-full min-h-0 flex-col">
          <div
            className={`home-feature-specialties__content flex h-full min-h-0 flex-col ${DOEPHONE_SECTION_CAROUSEL_INSET_X}`}
          >
            <div className="home-feature-specialties__hero mx-auto w-full max-w-[42rem] shrink-0">
              <div className="home-feature-specialties__card mx-auto w-full">
                <DoePhoneCommunicationCarouselCard
                  slide={featureSlide}
                  showExpandControls={false}
                  uiInteractive={false}
                  heroShaderColors
                  heroShaderDusk={shaderTheme === "dusk"}
                  protoShaderVariant={shaderVariant ?? undefined}
                  uiScaleClass="home-feature-card-ui-scale"
                />
              </div>
              <h2
                className={`home-feature-specialties__title ${DOEPHONE_DISPLAY_WEIGHT_TW} ${suisseIntl.className}`}
              >
                <span className="block">{titleLine1}</span>
                <span className="block">{titleLine2}</span>
              </h2>
            </div>

            <div className="home-feature-specialties__pill-stage relative min-h-0 flex-1 overflow-hidden">
              <div className="home-feature-specialties__fade home-feature-specialties__fade--top" />
              <div className="home-feature-specialties__fade home-feature-specialties__fade--bottom" />
              <div className="home-feature-specialties__columns h-full">
                {SPECIALTY_COLUMNS.map((column, columnIndex) => {
                  const sequence = [...column, ...column];
                  const directionClass =
                    columnIndex === 1
                      ? "home-feature-specialties__track--down"
                      : "home-feature-specialties__track--up";

                  return (
                    <div key={`specialty-column-${columnIndex}`} className="home-feature-specialties__column">
                      <div className={`home-feature-specialties__track ${directionClass}`}>
                        {sequence.map((label, pillIndex) => (
                          <div
                            key={`${label}-${pillIndex}`}
                            className="home-feature-specialties__pill"
                            style={specialtyPillStyle(columnIndex + pillIndex)}
                          >
                            {label}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
