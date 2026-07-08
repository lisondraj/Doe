"use client";

import { GrainGradient } from "@paper-design/shaders-react";
import { memo, useLayoutEffect, useRef, useState } from "react";

import {
  HERO_DIAL_ORB_SHADER,
  type HeroDialOrbScheme,
} from "@/lib/doephone/hero-dial-orbs";
import { PROTO_SHADER_MAX_PIXEL_COUNT_PHONE_ORB } from "@/lib/proto/proto-grain-gradient";

function hasRenderableSize(node: HTMLElement) {
  const { width, height } = node.getBoundingClientRect();
  if (width > 1 && height > 1) return true;

  const parent = node.parentElement;
  if (!parent) return false;
  const parentRect = parent.getBoundingClientRect();
  return parentRect.width > 1 && parentRect.height > 1;
}

/** Grain orb fill — waits for layout, shows palette fallback, caps WebGL per instance. */
export const HeroDialOrbGrainShader = memo(function HeroDialOrbGrainShader({
  scheme,
  eager = false,
  enabled = true,
  mountDelayMs = 0,
  stickMounted = false,
}: {
  scheme: HeroDialOrbScheme;
  /** Mount immediately when sized — hero focused orb, carousel center. */
  eager?: boolean;
  /** When false, only the palette fallback is shown (saves WebGL budget). */
  enabled?: boolean;
  /** Defer WebGL mount so hero background can claim a context first. */
  mountDelayMs?: number;
  /** Keep the grain shader after first mount — avoids fallback flash on dial rotation. */
  stickMounted?: boolean;
}) {
  const shellRef = useRef<HTMLDivElement>(null);
  const hasShaderRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [mounted, setMounted] = useState(false);
  const intensity = scheme.intensity ?? HERO_DIAL_ORB_SHADER.intensity;
  const [, mid, light] = scheme.colors;
  const shouldMount = enabled || (stickMounted && hasShaderRef.current);
  const showShader = shouldMount && ready && mounted;

  useLayoutEffect(() => {
    if (!shouldMount) {
      if (!stickMounted || !hasShaderRef.current) {
        setReady(false);
        setMounted(false);
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
  }, [shouldMount, stickMounted]);

  useLayoutEffect(() => {
    if (!shouldMount || !ready || mounted) return;

    const delay = eager ? mountDelayMs : mountDelayMs + 180;
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
  }, [eager, mountDelayMs, mounted, ready, shouldMount]);

  return (
    <div
      ref={shellRef}
      className="hero-speaking-orb__grain-shell absolute inset-0 overflow-hidden rounded-full"
      style={{
        background: showShader
          ? scheme.colorBack
          : `radial-gradient(circle at 42% 38%, ${light} 0%, ${mid} 52%, ${scheme.colorBack} 100%)`,
      }}
      aria-hidden
    >
      {showShader ? (
        <GrainGradient
          width="100%"
          height="100%"
          fit={HERO_DIAL_ORB_SHADER.fit}
          worldWidth={HERO_DIAL_ORB_SHADER.worldWidth}
          worldHeight={HERO_DIAL_ORB_SHADER.worldHeight}
          colors={[scheme.colors[0], scheme.colors[1], scheme.colors[2]]}
          colorBack={scheme.colorBack}
          softness={HERO_DIAL_ORB_SHADER.softness}
          intensity={intensity}
          noise={HERO_DIAL_ORB_SHADER.noise}
          shape={HERO_DIAL_ORB_SHADER.shape}
          speed={HERO_DIAL_ORB_SHADER.speed}
          rotation={HERO_DIAL_ORB_SHADER.rotation}
          offsetX={HERO_DIAL_ORB_SHADER.offsetX}
          offsetY={HERO_DIAL_ORB_SHADER.offsetY}
          scale={HERO_DIAL_ORB_SHADER.scale}
          maxPixelCount={PROTO_SHADER_MAX_PIXEL_COUNT_PHONE_ORB}
        />
      ) : null}
    </div>
  );
});
