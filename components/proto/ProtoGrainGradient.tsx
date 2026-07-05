"use client";

import { GrainGradient } from "@paper-design/shaders-react";
import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";

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

function isHeroVariant(variant: ProtoGrainGradientVariant) {
  return variant === "home-hero" || variant === "build-hero" || variant === "about-hero";
}

function isNearViewport(node: HTMLElement, marginRatio = 0.75) {
  const rect = node.getBoundingClientRect();
  const vh = window.innerHeight;
  return rect.bottom > -vh * marginRatio && rect.top < vh * (1 + marginRatio);
}

/** /proto — sticky mount near viewport; animates when visible, pauses off-screen (no unmount). */
export const ProtoGrainGradient = memo(function ProtoGrainGradient({
  variant,
  className = "",
  static: staticShader = false,
  colors,
  colorBack,
}: {
  variant: ProtoGrainGradientVariant;
  className?: string;
  /** Desktop full-panel bands — freeze gradient motion. */
  static?: boolean;
  colors?: readonly string[];
  colorBack?: string;
}) {
  const preset = PROTO_GRAIN_GRADIENT_PRESETS[variant];
  const containerRef = useRef<HTMLDivElement>(null);
  const hero = isHeroVariant(variant);
  const [hasMounted, setHasMounted] = useState(hero);
  const [isVisible, setIsVisible] = useState(hero);
  const [tabVisible, setTabVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useLayoutEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    if (isNearViewport(node, hero ? 0.4 : 0.75)) {
      setHasMounted(true);
    }
  }, [hero]);

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

    const mountObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHasMounted(true);
      },
      { rootMargin: hero ? "40% 0px" : "80% 0px", threshold: 0 },
    );

    const animateObserver = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "12% 0px", threshold: 0 },
    );

    mountObserver.observe(node);
    animateObserver.observe(node);

    return () => {
      mountObserver.disconnect();
      animateObserver.disconnect();
    };
  }, [hero]);

  const targetSpeed = preset.speed ?? PROTO_GRAIN_GRADIENT_SPEED;
  const shouldAnimate =
    !staticShader && !reducedMotion && targetSpeed > 0 && isVisible && tabVisible && hasMounted;

  return (
    <div
      ref={containerRef}
      className={`proto-shader-surface pointer-events-none absolute inset-0 overflow-hidden ${className}`.trim()}
      style={{ backgroundColor: colorBack ?? PROTO_GRAIN_GRADIENT_COLOR_BACK }}
      aria-hidden
    >
      {hasMounted ? (
        <GrainGradient
          width="100%"
          height="100%"
          fit={preset.fit ?? "cover"}
          worldWidth={preset.worldWidth ?? PROTO_GRAIN_GRADIENT_WORLD_WIDTH}
          worldHeight={preset.worldHeight ?? PROTO_GRAIN_GRADIENT_WORLD_HEIGHT}
          colors={[...(colors ?? PROTO_GRAIN_GRADIENT_COLORS)]}
          colorBack={colorBack ?? PROTO_GRAIN_GRADIENT_COLOR_BACK}
          softness={preset.softness}
          intensity={preset.intensity}
          noise={0}
          shape={preset.shape}
          speed={shouldAnimate ? targetSpeed : 0}
          rotation={preset.rotation}
          offsetX={preset.offsetX}
          offsetY={preset.offsetY}
          scale={preset.scale}
          maxPixelCount={protoShaderMaxPixelCount(variant)}
        />
      ) : null}
    </div>
  );
});
