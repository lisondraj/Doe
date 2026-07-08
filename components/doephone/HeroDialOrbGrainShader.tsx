"use client";

import { GrainGradient } from "@paper-design/shaders-react";
import { memo, useCallback, useId, useLayoutEffect, useRef, useState } from "react";

import {
  HERO_DIAL_ORB_SHADER,
  type HeroDialOrbScheme,
  type HeroDialOrbShaderConfig,
} from "@/lib/doephone/hero-dial-orbs";
import {
  acquireShaderWebGLSlot,
  releaseShaderWebGLSlot,
  SHADER_WEBGL_SLOT_PRIORITY,
} from "@/lib/doephone/shader-webgl-budget";
import { useShaderContextRecovery } from "@/lib/doephone/use-shader-context-recovery";
import { useShaderViewportGate } from "@/lib/doephone/use-shader-viewport-gate";
import { PROTO_SHADER_MAX_PIXEL_COUNT_PHONE_ORB } from "@/lib/proto/proto-grain-gradient";

function hasRenderableSize(node: HTMLElement) {
  const { width, height } = node.getBoundingClientRect();
  if (width > 1 && height > 1) return true;

  const parent = node.parentElement;
  if (!parent) return false;
  const parentRect = parent.getBoundingClientRect();
  return parentRect.width > 1 && parentRect.height > 1;
}

/** Grain orb fill — waits for layout, caps WebGL per instance, fades in once painted. */
export const HeroDialOrbGrainShader = memo(function HeroDialOrbGrainShader({
  scheme,
  eager = false,
  enabled = true,
  mountDelayMs = 0,
  stickMounted = false,
  maxPixelCount = PROTO_SHADER_MAX_PIXEL_COUNT_PHONE_ORB,
  shaderConfig = HERO_DIAL_ORB_SHADER,
  shaderSlotId,
  shaderPriority = SHADER_WEBGL_SLOT_PRIORITY.HERO_ORB,
}: {
  scheme: HeroDialOrbScheme;
  /** Mount immediately when sized — hero focused orb, carousel center. */
  eager?: boolean;
  /** When false, only the palette fallback is shown (saves WebGL budget). */
  enabled?: boolean;
  /** Defer WebGL mount so hero background can claim a context first. */
  mountDelayMs?: number;
  /** Keep the grain shader after first mount while in view — avoids fallback flash on dial rotation. */
  stickMounted?: boolean;
  maxPixelCount?: number;
  shaderConfig?: HeroDialOrbShaderConfig;
  shaderSlotId?: string;
  shaderPriority?: number;
}) {
  const autoSlotId = useId();
  const slotId = shaderSlotId ?? autoSlotId;
  const shellRef = useRef<HTMLDivElement>(null);
  const hasShaderRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [painted, setPainted] = useState(false);
  const [budgetGranted, setBudgetGranted] = useState(false);
  const [shaderGeneration, setShaderGeneration] = useState(0);
  const inViewport = useShaderViewportGate(shellRef);
  const intensity = scheme.intensity ?? shaderConfig.intensity;
  const wantsShader = enabled || (stickMounted && hasShaderRef.current);
  const shouldMount = wantsShader && inViewport;

  const resetShader = useCallback(() => {
    hasShaderRef.current = false;
    setMounted(false);
    setPainted(false);
    setBudgetGranted(false);
    releaseShaderWebGLSlot(slotId);
    setShaderGeneration((current) => current + 1);
  }, [slotId]);

  const evictShader = useCallback(() => {
    resetShader();
  }, [resetShader]);

  useShaderContextRecovery(shellRef, shouldMount && mounted, resetShader);

  useLayoutEffect(() => {
    if (!shouldMount) {
      if (!stickMounted || !hasShaderRef.current) {
        setReady(false);
        setMounted(false);
        setPainted(false);
      }
      if (budgetGranted) {
        releaseShaderWebGLSlot(slotId);
        setBudgetGranted(false);
      }
      return;
    }

    const node = shellRef.current;
    if (!node) return;

    const syncReady = () => {
      if (!hasRenderableSize(node)) return false;
      setReady(true);
      return true;
    };

    if (syncReady()) return;

    const ro = new ResizeObserver(() => {
      if (syncReady()) ro.disconnect();
    });
    ro.observe(node);

    let raf2 = 0;
    let raf3 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        if (syncReady()) {
          ro.disconnect();
          return;
        }
        raf3 = requestAnimationFrame(() => {
          if (syncReady()) ro.disconnect();
        });
      });
    });

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      cancelAnimationFrame(raf3);
    };
  }, [budgetGranted, shouldMount, slotId, stickMounted]);

  useLayoutEffect(() => {
    if (!shouldMount || !ready) {
      if (budgetGranted) {
        releaseShaderWebGLSlot(slotId);
        setBudgetGranted(false);
      }
      return;
    }

    const granted = acquireShaderWebGLSlot(slotId, shaderPriority, evictShader);
    setBudgetGranted(granted);

    return () => {
      releaseShaderWebGLSlot(slotId);
      setBudgetGranted(false);
    };
  }, [evictShader, ready, shaderPriority, shouldMount, slotId]);

  useLayoutEffect(() => {
    if (!shouldMount || !ready || !budgetGranted || mounted) return;

    const delay = eager ? mountDelayMs : mountDelayMs + 120;
    if (delay <= 0) {
      const raf = requestAnimationFrame(() => {
        hasShaderRef.current = true;
        setMounted(true);
      });
      return () => cancelAnimationFrame(raf);
    }

    const timer = window.setTimeout(() => {
      hasShaderRef.current = true;
      setMounted(true);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [budgetGranted, eager, mountDelayMs, mounted, ready, shouldMount]);

  const showShader = shouldMount && budgetGranted && ready && mounted;

  useLayoutEffect(() => {
    if (!showShader) {
      setPainted(false);
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setPainted(true);
      return;
    }

    let raf2 = 0;
    let raf3 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        raf3 = requestAnimationFrame(() => setPainted(true));
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      cancelAnimationFrame(raf3);
      setPainted(false);
    };
  }, [showShader]);

  return (
    <div
      ref={shellRef}
      className={`hero-speaking-orb__grain-shell absolute inset-0 overflow-hidden rounded-full${
        painted ? " hero-speaking-orb__grain-shell--painted" : ""
      }`}
      style={{ backgroundColor: scheme.colorBack }}
      aria-hidden
    >
      {showShader ? (
        <GrainGradient
          key={shaderGeneration}
          width="100%"
          height="100%"
          fit={shaderConfig.fit}
          worldWidth={shaderConfig.worldWidth}
          worldHeight={shaderConfig.worldHeight}
          colors={[scheme.colors[0], scheme.colors[1], scheme.colors[2]]}
          colorBack={scheme.colorBack}
          softness={shaderConfig.softness}
          intensity={intensity}
          noise={shaderConfig.noise}
          shape={shaderConfig.shape}
          speed={shaderConfig.speed}
          rotation={shaderConfig.rotation}
          offsetX={shaderConfig.offsetX}
          offsetY={shaderConfig.offsetY}
          scale={shaderConfig.scale}
          maxPixelCount={maxPixelCount}
        />
      ) : null}
    </div>
  );
});
