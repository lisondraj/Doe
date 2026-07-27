"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, useCurrentFrame, useVideoConfig } from "remotion";

import { DoePhoneHomeHeroGrainShader } from "@/components/doephone/DoePhoneHomeHeroGrainShader";
import {
  getReadyShaderNoiseTexture,
  preloadShaderNoiseTexture,
} from "@/lib/doephone/shader-noise-texture";
import { DESIGNERS_HERO_GRADIENT_FLOWS } from "@/lib/designers/designers-hero-gradient-flows";
import { doeHomeHeroDuskShaderSurface } from "@/lib/proto/proto-shader-backdrop-colors";

import { DOE_LAUNCH_BROWN_BG } from "../constants";

const homeHeroShader = doeHomeHeroDuskShaderSurface();
const defaultHeroFlow = DESIGNERS_HERO_GRADIENT_FLOWS[0];

function IntroDesignersHeroShaderWebGL({ animate }: { animate: boolean }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const remotionFrameMs = (frame / fps) * 1000;
  const [handle] = useState(() => delayRender("Loading dusk grain shader"));
  const [noiseReady, setNoiseReady] = useState(() => getReadyShaderNoiseTexture() != null);
  const releasedRef = useRef(false);

  const release = useCallback(() => {
    if (releasedRef.current) return;
    releasedRef.current = true;
    continueRender(handle);
  }, [handle]);

  useLayoutEffect(() => {
    if (noiseReady) return;

    const ready = getReadyShaderNoiseTexture();
    if (ready) {
      setNoiseReady(true);
      return;
    }

    let cancelled = false;
    preloadShaderNoiseTexture()
      ?.then(() => {
        if (!cancelled) setNoiseReady(true);
      })
      .catch(() => {
        if (!cancelled) setNoiseReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [noiseReady]);

  useEffect(() => {
    const timeout = window.setTimeout(release, 20_000);
    return () => window.clearTimeout(timeout);
  }, [release]);

  if (!noiseReady) {
    return <AbsoluteFill className="motion4-intro-shader-root" style={{ background: homeHeroShader.colorBack }} />;
  }

  return (
    <AbsoluteFill className="motion4-intro-shader-root">
      <DoePhoneHomeHeroGrainShader
        variant={homeHeroShader.variant}
        colors={homeHeroShader.colors}
        colorBack={homeHeroShader.colorBack}
        presetOverrides={defaultHeroFlow.preset}
        animate={animate}
        forceVisible
        remotionFrameMs={remotionFrameMs}
        onMount={release}
      />
    </AbsoluteFill>
  );
}

/** Designers /doehome dusk hero grain — same preset as production home hero. */
export function IntroDesignersHeroShader({
  animate = true,
  embedPreview = false,
}: {
  animate?: boolean;
  embedPreview?: boolean;
}) {

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
