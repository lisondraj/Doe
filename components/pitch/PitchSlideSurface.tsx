"use client";

import type { RefObject } from "react";

import { PitchBoxCenterLines } from "@/components/pitch/PitchBoxCenterLines";
import { PitchSlideContent } from "@/components/pitch/PitchSlideContent";
import { ProtoGrainGradient } from "@/components/proto/ProtoGrainGradient";
import { DoePhoneHomeHeroGrainShader } from "@/components/doephone/DoePhoneHomeHeroGrainShader";
import { HERO_CAROUSEL_SQUARE_GRID_STYLE } from "@/components/hero-carousel-texture";
import { DESIGNERS_HERO_GRADIENT_FLOWS } from "@/lib/designers/designers-hero-gradient-flows";
import { lora } from "@/lib/home/fonts";
import { type PitchSlideInstance } from "@/lib/pitch/pitch-slide-instance";
import {
  doeHomeDuskShaderBandSurface,
  doeHomeHeroDuskShaderSurface,
} from "@/lib/proto/proto-shader-backdrop-colors";

const homeHeroShader = doeHomeHeroDuskShaderSurface();
const builtByDoctorsShader = doeHomeDuskShaderBandSurface("agents");
const defaultHeroFlow = DESIGNERS_HERO_GRADIENT_FLOWS[0];

function PitchHeroWordmark() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[10] flex items-center justify-center">
      <p
        className={`m-0 select-none text-center font-normal leading-none tracking-[-0.04em] ${lora.className}`}
        style={{
          color: "#f5e6d0",
          fontSize: "clamp(4.5rem, 2.5rem + 6vw, 8.5rem)",
          textShadow: "0 0 80px rgba(26, 18, 8, 0.28)",
        }}
      >
        Doe
      </p>
    </div>
  );
}

function PitchLineGridOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1]"
      style={HERO_CAROUSEL_SQUARE_GRID_STYLE}
      aria-hidden
    />
  );
}

function PitchSlideBackground({
  slide,
  heroSectionRef,
}: {
  slide: PitchSlideInstance;
  heroSectionRef?: RefObject<HTMLElement | null>;
}) {
  if (slide.theme === "active-agents-band" && builtByDoctorsShader) {
    return (
      <div className="absolute inset-0 overflow-hidden scale-y-[-1]">
        <ProtoGrainGradient
          variant={builtByDoctorsShader.variant}
          colors={builtByDoctorsShader.colors}
          colorBack={builtByDoctorsShader.colorBack}
          static
        />
      </div>
    );
  }

  if (slide.theme === "hero") {
    return (
      <div ref={heroSectionRef as RefObject<HTMLDivElement>} className="absolute inset-0">
        <DoePhoneHomeHeroGrainShader
          variant={homeHeroShader.variant}
          colors={homeHeroShader.colors}
          colorBack={homeHeroShader.colorBack}
          presetOverrides={defaultHeroFlow.preset}
        />
      </div>
    );
  }

  const style = {
    backgroundColor: slide.background,
    background: slide.background,
    ...slide.backgroundStyle,
  };

  return (
    <div className="absolute inset-0" style={style}>
      {slide.lineGrid ? <PitchLineGridOverlay /> : null}
    </div>
  );
}

export function PitchSlideSurface({
  slide,
  heroSectionRef,
}: {
  slide: PitchSlideInstance;
  heroSectionRef?: RefObject<HTMLElement | null>;
}) {
  return (
    <section className="relative h-full w-full overflow-hidden" aria-label={slide.label}>
      <PitchSlideBackground slide={slide} heroSectionRef={heroSectionRef} />
      {slide.slideId === "solution" ? <PitchBoxCenterLines /> : null}
      {slide.slideId === "welcome" ? (
        <PitchHeroWordmark />
      ) : (
        <PitchSlideContent slideId={slide.slideId} />
      )}
    </section>
  );
}
