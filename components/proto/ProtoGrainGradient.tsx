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
  acquireAboutHeroBackgroundSlot,
  acquireShaderWebGLSlot,
  isShaderWebGLBudgetActive,
  releaseShaderWebGLSlot,
  SHADER_WEBGL_SLOT_PRIORITY,
} from "@/lib/doephone/shader-webgl-budget";
import {
  DOEPHONE_ABOUT_HERO_SHADER_SLOT,
  DOEPHONE_HOME_HERO_SHADER_SLOT,
  setHomeHeroBackgroundReady,
  subscribeHomeHeroBackgroundReady,
} from "@/lib/doephone/home-hero-shader-gate";
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

function findBlogCarouselScrollRoot(node: HTMLElement) {
  const carousel = node.closest(".blog-article-related-carousel");
  if (!carousel) return null;
  return carousel.querySelector(".blog-article-related-carousel__scroll");
}

function isInBlogLandingCarousel(node: HTMLElement) {
  return findBlogCarouselScrollRoot(node) != null;
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
  /** Re-read phone/about attrs after parent layout effects (e.g. /premed router) set document flags. */
  const [layoutContextEpoch, setLayoutContextEpoch] = useState(0);
  void layoutContextEpoch;
  const phone = isPhoneLayout();
  const reactSlotId = useId();
  const homeHeroBackground = hero && phone && variant === "home-hero";
  /** about-hero is only used on about-style article heroes — don't gate on data-about-page timing. */
  const aboutHeroBackground = hero && phone && variant === "about-hero";
  const dedicatedHeroBackground = homeHeroBackground || aboutHeroBackground;
  const slotId = homeHeroBackground
    ? DOEPHONE_HOME_HERO_SHADER_SLOT
    : aboutHeroBackground
      ? DOEPHONE_ABOUT_HERO_SHADER_SLOT
      : reactSlotId;
  const hasMountedRef = useRef(hero);
  const [hasMounted, setHasMounted] = useState(hero);
  const [containerReady, setContainerReady] = useState(hero);
  const [isVisible, setIsVisible] = useState(hero);
  const [tabVisible, setTabVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [budgetGranted, setBudgetGranted] = useState(false);
  const [shaderGeneration, setShaderGeneration] = useState(0);
  const [inCarouselRange, setInCarouselRange] = useState(true);
  const [inBlogCarouselCard, setInBlogCarouselCard] = useState(false);
  const [homeHeroGateEpoch, setHomeHeroGateEpoch] = useState(0);
  const inViewport = useShaderViewportGate(containerRef, hero ? "120% 0px" : "75% 0px");
  const shaderPriority = hero
    ? SHADER_WEBGL_SLOT_PRIORITY.HERO_BACKGROUND
    : inBlogCarouselCard
      ? SHADER_WEBGL_SLOT_PRIORITY.CAROUSEL_ADJACENT
      : SHADER_WEBGL_SLOT_PRIORITY.SECTION_BAND;
  const effectiveInViewport = inCarouselRange && inViewport;

  const resetShader = useCallback(() => {
    hasMountedRef.current = false;
    setHasMounted(false);
    setBudgetGranted(false);
    releaseShaderWebGLSlot(slotId);
    if (dedicatedHeroBackground) {
      setHomeHeroBackgroundReady(false);
    }
    setShaderGeneration((current) => current + 1);
  }, [dedicatedHeroBackground, slotId]);

  /** Budget eviction — drop the slot but keep mount intent so we can re-acquire in viewport. */
  const evictShader = useCallback(() => {
    releaseShaderWebGLSlot(slotId);
    setBudgetGranted(false);
    setShaderGeneration((current) => current + 1);
  }, [slotId]);

  const requestMount = () => {
    if (hasMountedRef.current) return;
    hasMountedRef.current = true;
    setHasMounted(true);
  };

  const releaseMount = useCallback(() => {
    if (hero) return;
    hasMountedRef.current = false;
    setHasMounted(false);
    setBudgetGranted(false);
    releaseShaderWebGLSlot(slotId);
  }, [hero, slotId]);

  useLayoutEffect(() => {
    if (hero) requestMount();
  }, [hero]);

  useLayoutEffect(() => {
    let raf = 0;
    const syncLayoutContext = () => setLayoutContextEpoch((current) => current + 1);
    syncLayoutContext();
    raf = requestAnimationFrame(syncLayoutContext);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (hero) return;
    if (effectiveInViewport) {
      requestMount();
      return;
    }
    releaseMount();
  }, [effectiveInViewport, hero, releaseMount]);

  useEffect(() => {
    if (!isShaderWebGLBudgetActive()) return;
    if (typeof document === "undefined") return;
    // Dedicated hero shaders register the gate — subscribing here loops (React #185).
    if (dedicatedHeroBackground) return;
    const onAboutPage = document.documentElement.getAttribute("data-about-page") === "true";
    if (document.documentElement.getAttribute("data-home-page") !== "true" && !onAboutPage) return;

    return subscribeHomeHeroBackgroundReady(() => {
      setHomeHeroGateEpoch((current) => current + 1);
    });
  }, [dedicatedHeroBackground]);

  useLayoutEffect(() => {
    if (!hasMounted || !containerReady) {
      if (budgetGranted) {
        releaseShaderWebGLSlot(slotId);
        setBudgetGranted(false);
      }
      if (dedicatedHeroBackground) {
        setHomeHeroBackgroundReady(false);
      }
      return;
    }

    if (!dedicatedHeroBackground && !effectiveInViewport) {
      if (budgetGranted) {
        releaseShaderWebGLSlot(slotId);
        setBudgetGranted(false);
      }
      return;
    }

    const granted = aboutHeroBackground
      ? acquireAboutHeroBackgroundSlot(evictShader)
      : acquireShaderWebGLSlot(slotId, shaderPriority, evictShader);
    if (granted) {
      setBudgetGranted(true);
    }
    if (dedicatedHeroBackground) {
      setHomeHeroBackgroundReady(granted);
    }

    return () => {
      releaseShaderWebGLSlot(slotId);
      setBudgetGranted(false);
      if (dedicatedHeroBackground) {
        setHomeHeroBackgroundReady(false);
      }
    };
  }, [
    aboutHeroBackground,
    containerReady,
    dedicatedHeroBackground,
    effectiveInViewport,
    evictShader,
    hasMounted,
    homeHeroGateEpoch,
    layoutContextEpoch,
    shaderPriority,
    slotId,
  ]);

  useEffect(() => {
    if (!isShaderWebGLBudgetActive() || !dedicatedHeroBackground) return;
    if (!hasMounted || !containerReady || budgetGranted) return;

    let cancelled = false;
    let retryTimer = 0;
    let retryDelayMs = 32;

    const tryAcquire = () => {
      if (cancelled) return;
      const granted = aboutHeroBackground
        ? acquireAboutHeroBackgroundSlot(evictShader)
        : acquireShaderWebGLSlot(slotId, shaderPriority, evictShader);
      if (granted) {
        setBudgetGranted(true);
        setHomeHeroBackgroundReady(true);
        return;
      }
      retryDelayMs = Math.min(retryDelayMs * 2, 2000);
      retryTimer = window.setTimeout(tryAcquire, retryDelayMs);
    };

    tryAcquire();

    return () => {
      cancelled = true;
      window.clearTimeout(retryTimer);
    };
  }, [
    aboutHeroBackground,
    budgetGranted,
    containerReady,
    dedicatedHeroBackground,
    evictShader,
    hasMounted,
    layoutContextEpoch,
    shaderPriority,
    slotId,
  ]);

  useEffect(() => {
    if (!isShaderWebGLBudgetActive() || hero) return;
    if (!hasMounted || !containerReady || !effectiveInViewport || budgetGranted) return;

    let cancelled = false;
    let retryTimer = 0;
    let retryDelayMs = 32;

    const tryAcquire = () => {
      if (cancelled) return;
      const granted = acquireShaderWebGLSlot(slotId, shaderPriority, evictShader);
      if (granted) {
        setBudgetGranted(true);
        return;
      }
      retryDelayMs = Math.min(retryDelayMs * 2, 2000);
      retryTimer = window.setTimeout(tryAcquire, retryDelayMs);
    };

    tryAcquire();

    return () => {
      cancelled = true;
      window.clearTimeout(retryTimer);
    };
  }, [
    budgetGranted,
    containerReady,
    effectiveInViewport,
    evictShader,
    hasMounted,
    hero,
    homeHeroGateEpoch,
    shaderPriority,
    slotId,
  ]);

  useShaderContextRecovery(containerRef, hasMounted && budgetGranted && containerReady, resetShader);

  useLayoutEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const inHomeFeatureCard = node.closest(".home-feature-card-section__card") != null;
    const inAboutFeatureCard = node.closest(".about-style-feature-card__shader") != null;
    const inBlogCarousel = isInBlogLandingCarousel(node);

    const syncReady = () => {
      if (!hasRenderableSize(node)) return false;
      setContainerReady(true);

      const mountMargin = phone ? 2 : hero ? 0.5 : 0.85;
      if (
        hero ||
        inHomeFeatureCard ||
        inAboutFeatureCard ||
        (!inBlogCarousel && isNearViewport(node, mountMargin))
      ) {
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
      const inAboutFeatureCard = node.closest(".about-style-feature-card__shader") != null;
      const inBlogCarousel = isInBlogLandingCarousel(node);
      if (
        hero ||
        inHomeFeatureCard ||
        inAboutFeatureCard ||
        (!inBlogCarousel && isNearViewport(node, 2.5))
      ) {
        requestMount();
      }
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
    const inAboutFeatureCard = node.closest(".about-style-feature-card__shader") != null;
    const inBlogCarousel = isInBlogLandingCarousel(node);
    const carouselScrollRoot = findBlogCarouselScrollRoot(node);

    const mountObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) requestMount();
      },
      carouselScrollRoot
        ? { root: carouselScrollRoot, rootMargin: "75% 0px", threshold: 0 }
        : { rootMargin: mountMargin, threshold: 0 },
    );

    const animateObserver = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "20% 0px", threshold: 0 },
    );

    mountObserver.observe(node);
    animateObserver.observe(node);

    const raf = requestAnimationFrame(() => {
      if (
        hero ||
        inHomeFeatureCard ||
        inAboutFeatureCard ||
        (!inBlogCarousel && isNearViewport(node, phone ? 2 : hero ? 0.5 : 0.85))
      ) {
        requestMount();
      }
    });

    return () => {
      cancelAnimationFrame(raf);
      mountObserver.disconnect();
      animateObserver.disconnect();
    };
  }, [hero, phone]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const carouselScrollRoot = findBlogCarouselScrollRoot(node);
    setInBlogCarouselCard(carouselScrollRoot != null);
    if (!carouselScrollRoot) {
      setInCarouselRange(true);
      return;
    }

    const syncCarouselRange = (entry?: IntersectionObserverEntry) => {
      if (entry) {
        setInCarouselRange(entry.isIntersecting);
        return;
      }
      const rect = node.getBoundingClientRect();
      const rootRect = carouselScrollRoot.getBoundingClientRect();
      setInCarouselRange(rect.right > rootRect.left - rootRect.width * 0.75 && rect.left < rootRect.right + rootRect.width * 0.75);
    };

    const onCarouselScroll = () => {
      syncCarouselRange();
    };

    const observer = new IntersectionObserver(
      ([entry]) => syncCarouselRange(entry),
      { root: carouselScrollRoot, rootMargin: "75% 0px", threshold: 0 },
    );
    observer.observe(node);
    syncCarouselRange();

    carouselScrollRoot.addEventListener("scroll", onCarouselScroll, { passive: true });
    window.addEventListener("resize", onCarouselScroll);

    return () => {
      observer.disconnect();
      carouselScrollRoot.removeEventListener("scroll", onCarouselScroll);
      window.removeEventListener("resize", onCarouselScroll);
    };
  }, []);

  const targetSpeed = preset.speed ?? PROTO_GRAIN_GRADIENT_SPEED;
  const shouldAnimate =
    !staticShader && !reducedMotion && targetSpeed > 0 && isVisible && tabVisible && hasMounted;
  const showGradient =
    hasMounted && containerReady && (dedicatedHeroBackground || effectiveInViewport) && budgetGranted;

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
