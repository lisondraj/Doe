"use client";

import { GrainGradient } from "@paper-design/shaders-react";
import { memo, useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";

import { PROTO_SHADER_MAX_PIXEL_COUNT_PHONE_CAROUSEL_ORB } from "@/lib/proto/proto-grain-gradient";
import {
  acquireShaderWebGLSlot,
  releaseShaderWebGLSlot,
} from "@/lib/doephone/shader-webgl-budget";
import { useShaderContextRecovery } from "@/lib/doephone/use-shader-context-recovery";
import {
  type HeroDialOrbPaperShaderConfig,
  type HeroDialOrbScheme,
} from "@/lib/doephone/hero-dial-orbs";

/** iPhone carousel orb overlay — static Paper grain shader over CSS base fill. */
export const HeroDialOrbPaperShader = memo(function HeroDialOrbPaperShader({
  scheme,
  shaderConfig,
  slotPriority,
}: {
  scheme: HeroDialOrbScheme;
  shaderConfig: HeroDialOrbPaperShaderConfig;
  slotPriority: number;
}) {
  const slotId = useId();
  const shellRef = useRef<HTMLDivElement>(null);
  const [budgetGranted, setBudgetGranted] = useState(false);
  const [shaderGeneration, setShaderGeneration] = useState(0);
  const [containerReady, setContainerReady] = useState(false);

  const colors = [scheme.colors[0], scheme.colors[1], scheme.colors[2]];
  const intensity = scheme.intensity ?? shaderConfig.intensity;

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

    const granted = acquireShaderWebGLSlot(slotId, slotPriority, evictShader);
    setBudgetGranted(granted);
    if (!granted) {
      return;
    }

    return () => releaseShaderWebGLSlot(slotId);
  }, [containerReady, slotId, slotPriority, evictShader]);

  const showShader = containerReady && budgetGranted;

  return (
    <div
      ref={shellRef}
      className="hero-speaking-orb__grain-shell hero-speaking-orb__grain-shell--paper hero-speaking-orb__grain-shell--painted pointer-events-none absolute inset-0 z-[1] overflow-hidden rounded-full"
      aria-hidden
    >
      {showShader ? (
        <GrainGradient
          key={shaderGeneration}
          width="100%"
          height="100%"
          fit={shaderConfig.fit ?? "cover"}
          worldWidth={shaderConfig.worldWidth ?? 960}
          worldHeight={shaderConfig.worldHeight ?? 960}
          colors={colors}
          colorBack={scheme.colorBack}
          softness={shaderConfig.softness}
          intensity={intensity}
          noise={0}
          shape={shaderConfig.shape}
          speed={0}
          rotation={shaderConfig.rotation}
          offsetX={shaderConfig.offsetX}
          offsetY={shaderConfig.offsetY}
          scale={shaderConfig.scale}
          maxPixelCount={PROTO_SHADER_MAX_PIXEL_COUNT_PHONE_CAROUSEL_ORB}
        />
      ) : null}
    </div>
  );
});
