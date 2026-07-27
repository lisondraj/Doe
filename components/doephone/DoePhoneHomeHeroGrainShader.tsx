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
  isShaderMountContainerReady,
  protoGrainColorStopsKey,
} from "@/lib/doephone/shader-grain-mount";
import {
  PROTO_GRAIN_GRADIENT_COLOR_BACK,
  PROTO_GRAIN_GRADIENT_COLORS,
  PROTO_GRAIN_GRADIENT_PRESETS,
  PROTO_GRAIN_GRADIENT_SPEED,
  PROTO_GRAIN_GRADIENT_WORLD_HEIGHT,
  PROTO_GRAIN_GRADIENT_WORLD_WIDTH,
  protoHomeHeroBackgroundMaxPixelCount,
  type ProtoGrainGradientPreset,
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
  preset: ProtoGrainGradientPreset;
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
  presetOverrides,
  animate = true,
  forceVisible = false,
  /** Remotion export — drive ShaderMount time from the composition frame (ms). */
  remotionFrameMs,
  onMount,
}: {
  variant: ProtoGrainGradientVariant;
  className?: string;
  colors?: readonly string[];
  colorBack?: string;
  presetOverrides?: Partial<ProtoGrainGradientPreset>;
  /** When false, grain stays paused (Remotion intro handoff). */
  animate?: boolean;
  /** Remotion export — skip IntersectionObserver visibility gate. */
  forceVisible?: boolean;
  /** Remotion export — seek-safe shader time in milliseconds. */
  remotionFrameMs?: number;
  /** Fired once ShaderMount succeeds (Remotion delayRender handshake). */
  onMount?: () => void;
}) {
  const preset = { ...PROTO_GRAIN_GRADIENT_PRESETS[variant], ...presetOverrides };
  const presetFlowKey = JSON.stringify(presetOverrides ?? {});
  const resolvedColors = colors ?? PROTO_GRAIN_GRADIENT_COLORS;
  const resolvedColorBack = colorBack ?? PROTO_GRAIN_GRADIENT_COLOR_BACK;
  const colorStopsKey = protoGrainColorStopsKey(resolvedColors);
  const noiseTexture = useReadyShaderNoiseTexture();
  const containerRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<ShaderMount | null>(null);
  const [shaderGeneration, setShaderGeneration] = useState(0);
  const [containerReady, setContainerReady] = useState(false);
  const [isVisible, setIsVisible] = useState(forceVisible);
  const [tabVisible, setTabVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  const targetSpeed = preset.speed ?? PROTO_GRAIN_GRADIENT_SPEED;
  const remotionDriven = remotionFrameMs != null;
  const shouldAnimate =
    !remotionDriven && animate && !reducedMotion && targetSpeed > 0 && isVisible && tabVisible;

  const resetShader = useCallback(() => {
    mountRef.current?.dispose();
    mountRef.current = null;
    releaseShaderWebGLSlot(DOEPHONE_HOME_HERO_SHADER_SLOT);
    setHomeHeroBackgroundReady(false);
    setShaderGeneration((current) => current + 1);
  }, []);

  useLayoutEffect(() => {
    const node = containerRef.current;
    if (!node) {
      setContainerReady(false);
      return;
    }

    if (forceVisible) {
      setContainerReady(true);
      return;
    }

    const syncReady = () => {
      setContainerReady(isShaderMountContainerReady(node));
    };

    syncReady();
    const observer = new ResizeObserver(syncReady);
    observer.observe(node);
    return () => observer.disconnect();
  }, [forceVisible, shaderGeneration]);

  useLayoutEffect(() => {
    const node = containerRef.current;
    if (!node || !noiseTexture || !containerReady) return;

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

    const maxPixelCount = protoHomeHeroBackgroundMaxPixelCount(variant);
    const mountFrameMs = remotionFrameMs ?? 0;

    try {
      mountRef.current = new ShaderMount(
        node,
        grainGradientFragmentShader,
        uniforms,
        forceVisible ? { preserveDrawingBuffer: true } : undefined,
        remotionDriven ? 0 : shouldAnimate ? targetSpeed : 0,
        mountFrameMs,
        PROTO_GRAIN_SHADER_MIN_PIXEL_RATIO,
        maxPixelCount,
      );
      if (remotionDriven) {
        mountRef.current.setFrame(mountFrameMs);
        mountRef.current.setMaxPixelCount(maxPixelCount);
      }
    } catch {
      releaseShaderWebGLSlot(DOEPHONE_HOME_HERO_SHADER_SLOT);
      setHomeHeroBackgroundReady(false);
      onMount?.();
      return;
    }

    setHomeHeroBackgroundReady(true);
    onMount?.();

    return () => {
      mountRef.current?.dispose();
      mountRef.current = null;
      releaseShaderWebGLSlot(DOEPHONE_HOME_HERO_SHADER_SLOT);
      setHomeHeroBackgroundReady(false);
    };
  }, [
    colorStopsKey,
    containerReady,
    noiseTexture,
    presetFlowKey,
    resetShader,
    resolvedColorBack,
    shaderGeneration,
    variant,
    remotionFrameMs,
    shouldAnimate,
    targetSpeed,
  ]);

  useLayoutEffect(() => {
    if (!remotionDriven || !mountRef.current || remotionFrameMs == null) return;
    mountRef.current.setFrame(remotionFrameMs);
  }, [remotionDriven, remotionFrameMs, shaderGeneration]);

  useEffect(() => {
    if (!mountRef.current) {
      return;
    }

    mountRef.current.setMaxPixelCount(protoHomeHeroBackgroundMaxPixelCount(variant));
  }, [variant]);

  useEffect(() => {
    if (!mountRef.current || remotionDriven) return;
    mountRef.current.setSpeed(shouldAnimate ? targetSpeed : 0);
  }, [remotionDriven, shouldAnimate, targetSpeed]);

  useShaderContextRecovery(containerRef, containerReady && noiseTexture != null, resetShader);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (forceVisible) return undefined;

    const sync = () => setTabVisible(document.visibilityState === "visible");
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, [forceVisible]);

  useEffect(() => {
    if (forceVisible) {
      setIsVisible(true);
      return undefined;
    }

    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "20% 0px", threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [forceVisible, shaderGeneration]);

  return (
    <div
      ref={containerRef}
      className={`proto-shader-surface pointer-events-none absolute inset-0 overflow-hidden ${className}`.trim()}
      style={{
        backgroundColor: resolvedColorBack,
        width: forceVisible ? "100%" : undefined,
        height: forceVisible ? "100%" : undefined,
      }}
      aria-hidden
    />
  );
}
