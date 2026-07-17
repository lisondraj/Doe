"use client";

import {
  grainGradientFragmentShader,
  getShaderColorFromString,
  GrainGradientShapes,
  ShaderFitOptions,
  ShaderMount,
  type ShaderMountUniforms,
} from "@paper-design/shaders";
import { memo, useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";

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

/** iPhone carousel orb — Paper shader; mount deferred so peek UI paints first. */
export const HeroDialOrbPaperShader = memo(function HeroDialOrbPaperShader({
  scheme,
  variant,
  slotPriority,
  slotKey,
  enabled = true,
}: {
  scheme: HeroDialOrbScheme;
  variant: ProtoGrainGradientVariant;
  slotPriority: number;
  /** Stable budget id — avoids remount churn when focus priority changes. */
  slotKey?: string;
  /** When false, defers first mount; after mount the WebGL context stays alive. */
  enabled?: boolean;
}) {
  const preset = PROTO_GRAIN_GRADIENT_PRESETS[variant];
  const reactId = useId();
  const slotId = slotKey ?? reactId;
  const noiseTexture = useReadyShaderNoiseTexture();
  const shellRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<ShaderMount | null>(null);
  const slotPriorityRef = useRef(slotPriority);
  const containerReadyRef = useRef(false);
  const [shaderGeneration, setShaderGeneration] = useState(0);
  const [containerReady, setContainerReady] = useState(false);
  const [mountAttempt, setMountAttempt] = useState(0);

  const colors = [scheme.colors[0], scheme.colors[1], scheme.colors[2]];
  const colorStopsKey = protoGrainColorStopsKey(colors);
  const intensity = Math.max(preset.intensity, scheme.intensity ?? preset.intensity);

  slotPriorityRef.current = slotPriority;

  const resetShader = useCallback(() => {
    mountRef.current?.dispose();
    mountRef.current = null;
    releaseShaderWebGLSlot(slotId);
    shellRef.current?.classList.remove("hero-speaking-orb__grain-shell--shader-ready");
    setShaderGeneration((current) => current + 1);
  }, [slotId]);

  const evictShader = useCallback(() => {
    resetShader();
  }, [resetShader]);

  useShaderContextRecovery(shellRef, containerReady && mountRef.current != null, resetShader);

  useLayoutEffect(() => {
    const node = shellRef.current;
    if (!node) {
      containerReadyRef.current = false;
      setContainerReady(false);
      return;
    }

    const syncReady = () => {
      const rect = node.getBoundingClientRect();
      const ready = rect.width > 1 && rect.height > 1;
      if (ready === containerReadyRef.current) {
        return;
      }
      containerReadyRef.current = ready;
      setContainerReady(ready);
    };

    syncReady();
    const observer = new ResizeObserver(syncReady);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (!mountRef.current) {
      return;
    }

    acquireShaderWebGLSlot(slotId, slotPriorityRef.current, evictShader);
  }, [evictShader, slotId, slotPriority]);

  useEffect(() => {
    return () => {
      resetShader();
    };
  }, [resetShader]);

  useEffect(() => {
    const node = shellRef.current;
    if (!node || !enabled || !noiseTexture || !containerReady) {
      return;
    }

    if (mountRef.current) {
      return;
    }

    let cancelled = false;
    let raf2 = 0;

    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        if (cancelled || mountRef.current || !shellRef.current) {
          return;
        }

        const mountNode = shellRef.current;

        if (!acquireShaderWebGLSlot(slotId, slotPriorityRef.current, evictShader)) {
          mountNode.classList.remove("hero-speaking-orb__grain-shell--shader-ready");
          setMountAttempt((current) => current + 1);
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
            mountNode,
            grainGradientFragmentShader,
            uniforms,
            undefined,
            0,
            0,
            PROTO_GRAIN_SHADER_MIN_PIXEL_RATIO,
            PROTO_SHADER_MAX_PIXEL_COUNT_PHONE_CAROUSEL_ORB,
          );
          mountNode.classList.add("hero-speaking-orb__grain-shell--shader-ready");
        } catch {
          mountNode.classList.remove("hero-speaking-orb__grain-shell--shader-ready");
          releaseShaderWebGLSlot(slotId);
          mountRef.current = null;
          setMountAttempt((current) => current + 1);
        }
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [
    colorStopsKey,
    containerReady,
    enabled,
    evictShader,
    intensity,
    mountAttempt,
    noiseTexture,
    preset,
    scheme.colorBack,
    shaderGeneration,
    slotId,
  ]);

  return (
    <div
      ref={shellRef}
      className="hero-speaking-orb__grain-shell hero-speaking-orb__grain-shell--paper hero-speaking-orb__grain-shell--painted pointer-events-none absolute inset-0 overflow-hidden rounded-full"
      style={{ backgroundColor: scheme.colorBack }}
      aria-hidden
    />
  );
});
