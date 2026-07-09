"use client";

import { GrainGradient } from "@paper-design/shaders-react";
import { memo, useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from "react";

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

function orbFallbackBackground(scheme: HeroDialOrbScheme) {
  const [, mid, light] = scheme.colors;
  return `radial-gradient(circle at 52% 36%, ${light} 0%, ${mid} 54%, ${scheme.colorBack} 100%)`;
}

/** iPhone carousel orb fill — static Paper grain shader (page-family flow). */
export const HeroDialOrbPaperShader = memo(function HeroDialOrbPaperShader({
  scheme,
  shaderConfig,
  slotPriority,
  active = true,
}: {
  scheme: HeroDialOrbScheme;
  shaderConfig: HeroDialOrbPaperShaderConfig;
  slotPriority: number;
  active?: boolean;
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

  useShaderContextRecovery(shellRef, active && budgetGranted, resetShader);

  useLayoutEffect(() => {
    const node = shellRef.current;
    if (!node || !active) {
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
  }, [active]);

  useEffect(() => {
    if (!active || !containerReady) {
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
  }, [active, containerReady, slotId, slotPriority, evictShader]);

  const showShader = active && containerReady && budgetGranted;

  return (
    <div
      ref={shellRef}
      className="hero-speaking-orb__grain-shell hero-speaking-orb__grain-shell--paper hero-speaking-orb__grain-shell--painted absolute inset-0 overflow-hidden rounded-full"
      style={{ backgroundColor: scheme.colorBack } as CSSProperties}
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
      ) : (
        <div
          className="hero-speaking-orb__grain-shell-fallback absolute inset-0 rounded-full"
          style={{ background: orbFallbackBackground(scheme) }}
        />
      )}
    </div>
  );
});
