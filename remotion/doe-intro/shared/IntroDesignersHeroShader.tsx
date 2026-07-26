"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, getInputProps } from "remotion";

import { DoePhoneHomeHeroGrainShader } from "@/components/doephone/DoePhoneHomeHeroGrainShader";
import { DESIGNERS_HERO_GRADIENT_FLOWS } from "@/lib/designers/designers-hero-gradient-flows";
import { doeHomeHeroDuskShaderSurface } from "@/lib/proto/proto-shader-backdrop-colors";

import { DOE_LAUNCH_BROWN_BG } from "../constants";

const homeHeroShader = doeHomeHeroDuskShaderSurface();
const defaultHeroFlow = DESIGNERS_HERO_GRADIENT_FLOWS[0];

type IntroShaderInputProps = {
  embedPreview?: boolean;
};

function IntroDesignersHeroShaderWebGL({ animate }: { animate: boolean }) {
  const [handle] = useState(() => delayRender("Loading dusk grain shader"));
  const releasedRef = useRef(false);

  const release = useCallback(() => {
    if (releasedRef.current) return;
    releasedRef.current = true;
    continueRender(handle);
  }, [handle]);

  useEffect(() => {
    const timeout = window.setTimeout(release, 20_000);
    return () => window.clearTimeout(timeout);
  }, [release]);

  return (
    <AbsoluteFill className="motion4-intro-shader-root">
      <DoePhoneHomeHeroGrainShader
        variant={homeHeroShader.variant}
        colors={homeHeroShader.colors}
        colorBack={homeHeroShader.colorBack}
        presetOverrides={defaultHeroFlow.preset}
        animate={animate}
        forceVisible
        onMount={release}
      />
    </AbsoluteFill>
  );
}

/** Designers /doehome dusk hero grain — same preset as production home hero. */
export function IntroDesignersHeroShader({ animate = true }: { animate?: boolean }) {
  const { embedPreview = false } = getInputProps<IntroShaderInputProps>();

  if (embedPreview) {
    return (
      <AbsoluteFill
        className="motion4-intro-shader-root"
        style={{ background: DOE_LAUNCH_BROWN_BG }}
      />
    );
  }

  return <IntroDesignersHeroShaderWebGL animate={animate} />;
}
