"use client";

import { GrainGradient } from "@paper-design/shaders-react";
import { memo, useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";

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
import {
  acquireShaderWebGLSlot,
  releaseShaderWebGLSlot,
  SHADER_WEBGL_SLOT_PRIORITY,
} from "@/lib/doephone/shader-webgl-budget";
import { useShaderContextRecovery } from "@/lib/doephone/use-shader-context-recovery";
import { useShaderViewportGate } from "@/lib/doephone/use-shader-viewport-gate";

function isHeroVariant(variant: ProtoGrainGradientVariant) {
  return (
    variant === "home-hero" ||
    variant === "home-hero-phone" ||
    variant === "build-hero" ||
    variant === "about-hero"
  );
}

function isPhoneLayout() {
  if (typeof document === "undefined") return false;
  return (
    document.documentElement.getAttribute("data-doeforvc-always-phone") === "true" ||
    document.querySelector("[data-doeforvc-view='iphone']") != null
  );
}

function hasRenderableSize(node: HTMLElement) {
  const { width, height } = node.getBoundingClientRect();
  if (width > 1 && height > 1) return true;

  const parent = node.parentElement;
  if (!parent) return false;
  const parentRect = parent.getBoundingClientRect();
  return parentRect.width > 1 && parentRect.height > 1;
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
  const slotId = useId();
  const hero = isHeroVariant(variant);
  const phone = isPhoneLayout();
  const hasMountedRef = useRef(hero);
  const [hasMounted, setHasMounted] = useState(hero);
  const [containerReady, setContainerReady] = useState(hero);
  const [isVisible, setIsVisible] = useState(hero);
  const [tabVisible, setTabVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [budgetGranted, setBudgetGranted] = useState(false);
  const [shaderGeneration, setShaderGeneration] = useState(0);
  const inViewport = useShaderViewportGate(containerRef, hero ? "120% 0px" : "75% 0px");
  const shaderPriority = hero
    ? SHADER_WEBGL_SLOT_PRIORITY.HERO_BACKGROUND
    : SHADER_WEBGL_SLOT_PRIORITY.SECTION_BAND;

  const resetShader = useCallback(() => {
    hasMountedRef.current = false;
    setHasMounted(false);
    setBudgetGranted(false);
    releaseShaderWebGLSlot(slotId);
    setShaderGeneration((current) => current + 1);
  }, [slotId]);

  const evictShader = useCallback(() => {
    resetShader();
  }, [resetShader]);

  const requestMount = () => {
    if (hasMountedRef.current) return;
    hasMountedRef.current = true;
    setHasMounted(true);
  };

  const releaseMount = useCallback(() => {
    if (!phone || hero) return;
    hasMountedRef.current = false;
    setHasMounted(false);
    setBudgetGranted(false);
    releaseShaderWebGLSlot(slotId);
  }, [hero, phone, slotId]);

  useLayoutEffect(() => {
    if (hero) requestMount();
  }, [hero]);

  useEffect(() => {
    if (!phone || hero) return;
    if (inViewport) {
      requestMount();
      return;
    }
    releaseMount();
  }, [hero, inViewport, phone, releaseMount]);

  useLayoutEffect(() => {
    if (!hasMounted || !containerReady || !inViewport) {
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
  }, [containerReady, evictShader, hasMounted, inViewport, shaderPriority, slotId]);

  useShaderContextRecovery(containerRef, hasMounted && budgetGranted && containerReady, resetShader);

  useLayoutEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const inHomeFeatureCard = node.closest(".home-feature-card-section__card") != null;

    const syncReady = () => {
      if (!hasRenderableSize(node)) return false;
      setContainerReady(true);

      const mountMargin = phone ? 2 : hero ? 0.5 : 0.85;
      if (hero || inHomeFeatureCard || isNearViewport(node, mountMargin)) {
        requestMount();
      }
      return true;
    };

    if (syncReady()) return;

    const ro = new ResizeObserver(() => {
      syncReady();
    });
    ro.observe(node);

    let raf2 = 0;
    let raf3 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        syncReady();
        raf3 = requestAnimationFrame(() => syncReady());
      });
    });

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      cancelAnimationFrame(raf3);
    };
  }, [hero, phone]);

  useEffect(() => {
    if (!phone) return;

    const retry = () => {
      const node = containerRef.current;
      if (!node || !hasRenderableSize(node)) return;
      setContainerReady(true);
      const inHomeFeatureCard = node.closest(".home-feature-card-section__card") != null;
      if (hero || inHomeFeatureCard || isNearViewport(node, 2.5)) requestMount();
    };

    const t = window.setTimeout(retry, 320);
    return () => window.clearTimeout(t);
  }, [hero, phone]);

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

    const mountMargin = phone ? "120% 0px" : hero ? "40% 0px" : "85% 0px";

    const inHomeFeatureCard = node.closest(".home-feature-card-section__card") != null;

    const mountObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) requestMount();
      },
      { rootMargin: mountMargin, threshold: 0 },
    );

    const animateObserver = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "20% 0px", threshold: 0 },
    );

    mountObserver.observe(node);
    animateObserver.observe(node);

    const raf = requestAnimationFrame(() => {
      if (hero || inHomeFeatureCard || isNearViewport(node, phone ? 2 : hero ? 0.5 : 0.85)) {
        requestMount();
      }
    });

    return () => {
      cancelAnimationFrame(raf);
      mountObserver.disconnect();
      animateObserver.disconnect();
    };
  }, [hero, phone]);

  const targetSpeed = preset.speed ?? PROTO_GRAIN_GRADIENT_SPEED;
  const shouldAnimate =
    !staticShader && !reducedMotion && targetSpeed > 0 && isVisible && tabVisible && hasMounted;
  const showGradient = hasMounted && containerReady && inViewport && budgetGranted;

  return (
    <div
      ref={containerRef}
      className={`proto-shader-surface pointer-events-none absolute inset-0 overflow-hidden ${className}`.trim()}
      style={{ backgroundColor: colorBack ?? PROTO_GRAIN_GRADIENT_COLOR_BACK }}
      aria-hidden
    >
      {showGradient ? (
        <GrainGradient
          key={shaderGeneration}
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
