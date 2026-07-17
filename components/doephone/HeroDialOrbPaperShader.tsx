"use client";

import {
  grainGradientFragmentShader,
  getShaderColorFromString,
  GrainGradientShapes,
  ShaderFitOptions,
  ShaderMount,
  type ShaderMountUniforms,
} from "@paper-design/shaders";
import { memo, useCallback, useId, useLayoutEffect, useRef, useState } from "react";

import {
  acquireShaderWebGLSlot,
  releaseShaderWebGLSlot,
} from "@/lib/doephone/shader-webgl-budget";
import { useShaderContextRecovery } from "@/lib/doephone/use-shader-context-recovery";
import { useReadyShaderNoiseTexture } from "@/lib/doephone/use-ready-shader-noise-texture";
import {
  PROTO_GRAIN_SHADER_MIN_PIXEL_RATIO,
  protoGrainColorStopsKey,
} from "@/lib/doephone/shader-grain-mount";
import {
  PROTO_GRAIN_GRADIENT_PRESETS,
  PROTO_GRAIN_GRADIENT_WORLD_HEIGHT,
  PROTO_GRAIN_GRADIENT_WORLD_WIDTH,
  PROTO_SHADER_MAX_PIXEL_COUNT_PHONE_CAROUSEL_ORB,
  type ProtoGrainGradientVariant,
} from "@/lib/proto/proto-grain-gradient";
import type { HeroDialOrbScheme } from "@/lib/doephone/hero-dial-orbs";

function buildOrbGrainUniforms({
  colors,
  colorBack,
  preset,
  intensity,
  noiseTexture,
}: {
  colors: readonly string[];
  colorBack: string;
  preset: (typeof PROTO_GRAIN_GRADIENT_PRESETS)[ProtoGrainGradientVariant];
  intensity: number;
  noiseTexture: HTMLImageElement;
}): ShaderMountUniforms {
  return {
    u_colorBack: getShaderColorFromString(colorBack),
    u_colors: colors.map(getShaderColorFromString),
    u_colorsCount: colors.length,
    u_softness: preset.softness,
    u_intensity: intensity,
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

/** iPhone carousel orb — Paper shader via layout-effect WebGL init. */
export const HeroDialOrbPaperShader = memo(function HeroDialOrbPaperShader({
  scheme,
  variant,
  slotPriority,
}: {
  scheme: HeroDialOrbScheme;
  variant: ProtoGrainGradientVariant;
  slotPriority: number;
}) {
  const preset = PROTO_GRAIN_GRADIENT_PRESETS[variant];
  const slotId = useId();
  const noiseTexture = useReadyShaderNoiseTexture();
  const shellRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<ShaderMount | null>(null);
  const [shaderGeneration, setShaderGeneration] = useState(0);
  const [containerReady, setContainerReady] = useState(false);

  const colors = [scheme.colors[0], scheme.colors[1], scheme.colors[2]];
  const colorStopsKey = protoGrainColorStopsKey(colors);
  const intensity = Math.max(preset.intensity, scheme.intensity ?? preset.intensity);

  const resetShader = useCallback(() => {
    mountRef.current?.dispose();
    mountRef.current = null;
    releaseShaderWebGLSlot(slotId);
    setShaderGeneration((current) => current + 1);
  }, [slotId]);

  const evictShader = useCallback(() => {
    resetShader();
  }, [resetShader]);

  useShaderContextRecovery(shellRef, containerReady && mountRef.current != null, resetShader);

  useLayoutEffect(() => {
    const node = shellRef.current;
    if (!node) {
      setContainerReady(false);
      return;
    }

    const syncReady = () => {
      const rect = node.getBoundingClientRect();
      setContainerReady(rect.width > 1 && rect.height > 1);
    };

    syncReady();
    const observer = new ResizeObserver(syncReady);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const node = shellRef.current;
    if (!node || !containerReady || !noiseTexture) {
      mountRef.current?.dispose();
      mountRef.current = null;
      node?.classList.remove("hero-speaking-orb__grain-shell--shader-ready");
      releaseShaderWebGLSlot(slotId);
      return;
    }

    if (!acquireShaderWebGLSlot(slotId, slotPriority, evictShader)) {
      mountRef.current?.dispose();
      mountRef.current = null;
      node.classList.remove("hero-speaking-orb__grain-shell--shader-ready");
      return;
    }

    const uniforms = buildOrbGrainUniforms({
      colors,
      colorBack: scheme.colorBack,
      preset,
      intensity,
      noiseTexture,
    });

    try {
      mountRef.current = new ShaderMount(
        node,
        grainGradientFragmentShader,
        uniforms,
        undefined,
        0,
        0,
        PROTO_GRAIN_SHADER_MIN_PIXEL_RATIO,
        PROTO_SHADER_MAX_PIXEL_COUNT_PHONE_CAROUSEL_ORB,
      );
      node.classList.add("hero-speaking-orb__grain-shell--shader-ready");
    } catch {
      node.classList.remove("hero-speaking-orb__grain-shell--shader-ready");
      releaseShaderWebGLSlot(slotId);
      mountRef.current = null;
      return;
    }

    return () => {
      mountRef.current?.dispose();
      mountRef.current = null;
      node.classList.remove("hero-speaking-orb__grain-shell--shader-ready");
      releaseShaderWebGLSlot(slotId);
    };
  }, [
    colorStopsKey,
    containerReady,
    evictShader,
    intensity,
    noiseTexture,
    preset,
    scheme.colorBack,
    shaderGeneration,
    slotId,
    slotPriority,
  ]);

  return (
    <div
      ref={shellRef}
      className="hero-speaking-orb__grain-shell hero-speaking-orb__grain-shell--paper hero-speaking-orb__grain-shell--painted pointer-events-none absolute inset-0 overflow-hidden rounded-full"
      style={{ background: "transparent" }}
      aria-hidden
    />
  );
});
