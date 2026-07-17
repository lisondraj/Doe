"use client";

import {
  grainGradientFragmentShader,
  getShaderColorFromString,
  GrainGradientShapes,
  ShaderFitOptions,
  ShaderMount,
  type ShaderMountUniforms,
} from "@paper-design/shaders";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import {
  DOEPHONE_HOME_HERO_SHADER_SLOT,
  setHomeHeroBackgroundReady,
} from "@/lib/doephone/home-hero-shader-gate";
import {
  acquireHomeHeroBackgroundSlot,
  isDoePhoneWebGLBudgetActive,
  releaseShaderWebGLSlot,
} from "@/lib/doephone/shader-webgl-budget";
import { useShaderContextRecovery } from "@/lib/doephone/use-shader-context-recovery";
import { useReadyShaderNoiseTexture } from "@/lib/doephone/use-ready-shader-noise-texture";
import {
  PROTO_GRAIN_SHADER_MIN_PIXEL_RATIO,
  protoGrainColorStopsKey,
} from "@/lib/doephone/shader-grain-mount";
import {
  PROTO_GRAIN_GRADIENT_COLOR_BACK,
  PROTO_GRAIN_GRADIENT_COLORS,
  PROTO_GRAIN_GRADIENT_PRESETS,
  PROTO_GRAIN_GRADIENT_SPEED,
  PROTO_GRAIN_GRADIENT_WORLD_HEIGHT,
  PROTO_GRAIN_GRADIENT_WORLD_WIDTH,
  protoShaderMaxPixelCount,
  type ProtoGrainGradientVariant,
} from "@/lib/proto/proto-grain-gradient";

function buildGrainGradientUniforms({
  colors,
  colorBack,
  preset,
  noiseTexture,
}: {
  colors: readonly string[];
  colorBack: string;
  preset: (typeof PROTO_GRAIN_GRADIENT_PRESETS)[ProtoGrainGradientVariant];
  noiseTexture: HTMLImageElement;
}): ShaderMountUniforms {
  return {
    u_colorBack: getShaderColorFromString(colorBack),
    u_colors: colors.map(getShaderColorFromString),
    u_colorsCount: colors.length,
    u_softness: preset.softness,
    u_intensity: preset.intensity,
    u_noise: 0,
    u_shape: GrainGradientShapes[preset.shape],
    u_noiseTexture: noiseTexture,
    u_fit: ShaderFitOptions[preset.fit ?? "cover"],
    u_scale: preset.scale ?? 1,
    u_rotation: preset.rotation ?? 0,
    u_offsetX: preset.offsetX ?? 0,
    u_offsetY: preset.offsetY ?? 0,
    u_originX: 0.5,
    u_originY: 0.5,
    u_worldWidth: preset.worldWidth ?? PROTO_GRAIN_GRADIENT_WORLD_WIDTH,
    u_worldHeight: preset.worldHeight ?? PROTO_GRAIN_GRADIENT_WORLD_HEIGHT,
  };
}

/** Home hero — same Paper preset as ProtoGrainGradient; WebGL init in layout effect. */
export function DoePhoneHomeHeroGrainShader({
  variant,
  className = "",
  colors,
  colorBack,
}: {
  variant: ProtoGrainGradientVariant;
  className?: string;
  colors?: readonly string[];
  colorBack?: string;
}) {
  const preset = PROTO_GRAIN_GRADIENT_PRESETS[variant];
  const resolvedColors = colors ?? PROTO_GRAIN_GRADIENT_COLORS;
  const resolvedColorBack = colorBack ?? PROTO_GRAIN_GRADIENT_COLOR_BACK;
  const colorStopsKey = protoGrainColorStopsKey(resolvedColors);
  const noiseTexture = useReadyShaderNoiseTexture();
  const containerRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<ShaderMount | null>(null);
  const [shaderGeneration, setShaderGeneration] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  const targetSpeed = preset.speed ?? PROTO_GRAIN_GRADIENT_SPEED;
  const shouldAnimate = !reducedMotion && targetSpeed > 0 && isVisible && tabVisible;

  const resetShader = useCallback(() => {
    mountRef.current?.dispose();
    mountRef.current = null;
    releaseShaderWebGLSlot(DOEPHONE_HOME_HERO_SHADER_SLOT);
    setHomeHeroBackgroundReady(false);
    setShaderGeneration((current) => current + 1);
  }, []);

  useLayoutEffect(() => {
    const node = containerRef.current;
    if (!node || !noiseTexture) return;

    if (isDoePhoneWebGLBudgetActive() && !acquireHomeHeroBackgroundSlot(resetShader)) {
      setHomeHeroBackgroundReady(false);
      return;
    }

    const uniforms = buildGrainGradientUniforms({
      colors: resolvedColors,
      colorBack: resolvedColorBack,
      preset,
      noiseTexture,
    });

    try {
      mountRef.current = new ShaderMount(
        node,
        grainGradientFragmentShader,
        uniforms,
        undefined,
        shouldAnimate ? targetSpeed : 0,
        0,
        PROTO_GRAIN_SHADER_MIN_PIXEL_RATIO,
        protoShaderMaxPixelCount(variant),
      );
    } catch {
      releaseShaderWebGLSlot(DOEPHONE_HOME_HERO_SHADER_SLOT);
      setHomeHeroBackgroundReady(false);
      return;
    }

    setHomeHeroBackgroundReady(true);

    return () => {
      mountRef.current?.dispose();
      mountRef.current = null;
      releaseShaderWebGLSlot(DOEPHONE_HOME_HERO_SHADER_SLOT);
      setHomeHeroBackgroundReady(false);
    };
  }, [
    colorStopsKey,
    noiseTexture,
    resetShader,
    resolvedColorBack,
    shaderGeneration,
    variant,
  ]);

  useEffect(() => {
    mountRef.current?.setSpeed(shouldAnimate ? targetSpeed : 0);
  }, [shouldAnimate, targetSpeed]);

  useShaderContextRecovery(containerRef, true, resetShader);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const sync = () => setTabVisible(document.visibilityState === "visible");
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "20% 0px", threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shaderGeneration]);

  return (
    <div
      ref={containerRef}
      className={`proto-shader-surface pointer-events-none absolute inset-0 overflow-hidden ${className}`.trim()}
      style={{ backgroundColor: resolvedColorBack }}
      aria-hidden
    />
  );
}
