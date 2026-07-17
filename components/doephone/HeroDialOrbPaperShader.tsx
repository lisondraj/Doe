"use client";

import { GrainGradient } from "@paper-design/shaders-react";
import { memo, useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";

import {
  isHomeHeroBackgroundReady,
  subscribeHomeHeroBackgroundReady,
} from "@/lib/doephone/home-hero-shader-gate";
import {
  acquireShaderWebGLSlot,
  releaseShaderWebGLSlot,
} from "@/lib/doephone/shader-webgl-budget";
import { useShaderContextRecovery } from "@/lib/doephone/use-shader-context-recovery";
import {
  PROTO_GRAIN_GRADIENT_PRESETS,
  PROTO_GRAIN_GRADIENT_WORLD_HEIGHT,
  PROTO_GRAIN_GRADIENT_WORLD_WIDTH,
  PROTO_SHADER_MAX_PIXEL_COUNT_PHONE_CAROUSEL_ORB,
  type ProtoGrainGradientVariant,
} from "@/lib/proto/proto-grain-gradient";
import type { HeroDialOrbScheme } from "@/lib/doephone/hero-dial-orbs";

/** iPhone carousel orb — static section-band Paper shader with orb palette. */
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
  const shellRef = useRef<HTMLDivElement>(null);
  const [budgetGranted, setBudgetGranted] = useState(false);
  const [shaderGeneration, setShaderGeneration] = useState(0);
  const [containerReady, setContainerReady] = useState(false);

  const colors = [scheme.colors[0], scheme.colors[1], scheme.colors[2]];
  const intensity = Math.max(preset.intensity, scheme.intensity ?? preset.intensity);

  const resetShader = useCallback(() => {
    setBudgetGranted(false);
    releaseShaderWebGLSlot(slotId);
    setShaderGeneration((current) => current + 1);
  }, [slotId]);

  const evictShader = useCallback(() => {
    resetShader();
  }, [resetShader]);

  useShaderContextRecovery(shellRef, budgetGranted, resetShader);

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

  useEffect(() => {
    if (!containerReady) {
      setBudgetGranted(false);
      releaseShaderWebGLSlot(slotId);
      return;
    }

    let cancelled = false;
    let retryTimer = 0;
    let retryCount = 0;
    const maxRetries = 48;

    const tryAcquire = () => {
      if (cancelled || !isHomeHeroBackgroundReady()) return false;
      const granted = acquireShaderWebGLSlot(slotId, slotPriority, evictShader);
      setBudgetGranted(granted);
      return granted;
    };

    const scheduleRetry = () => {
      if (cancelled || tryAcquire()) return;
      retryCount += 1;
      if (retryCount >= maxRetries) return;
      retryTimer = window.setTimeout(scheduleRetry, 96);
    };

    if (tryAcquire()) {
      return () => {
        cancelled = true;
        window.clearTimeout(retryTimer);
        releaseShaderWebGLSlot(slotId);
      };
    }

    scheduleRetry();
    const unsubscribe = subscribeHomeHeroBackgroundReady(() => {
      if (!cancelled) scheduleRetry();
    });

    return () => {
      cancelled = true;
      unsubscribe();
      window.clearTimeout(retryTimer);
      releaseShaderWebGLSlot(slotId);
    };
  }, [containerReady, evictShader, slotId, slotPriority]);

  const showShader = containerReady && budgetGranted;

  return (
    <div
      ref={shellRef}
      className="hero-speaking-orb__grain-shell hero-speaking-orb__grain-shell--paper hero-speaking-orb__grain-shell--painted pointer-events-none absolute inset-0 overflow-hidden rounded-full"
      style={{ background: "transparent" }}
      aria-hidden
    >
      {showShader ? (
        <GrainGradient
          key={shaderGeneration}
          width="100%"
          height="100%"
          fit={preset.fit ?? "cover"}
          worldWidth={preset.worldWidth ?? PROTO_GRAIN_GRADIENT_WORLD_WIDTH}
          worldHeight={preset.worldHeight ?? PROTO_GRAIN_GRADIENT_WORLD_HEIGHT}
          colors={colors}
          colorBack={scheme.colorBack}
          softness={preset.softness}
          intensity={intensity}
          noise={0}
          shape={preset.shape}
          speed={0}
          rotation={preset.rotation}
          offsetX={preset.offsetX}
          offsetY={preset.offsetY}
          scale={preset.scale}
          maxPixelCount={PROTO_SHADER_MAX_PIXEL_COUNT_PHONE_CAROUSEL_ORB}
        />
      ) : null}
    </div>
  );
});
