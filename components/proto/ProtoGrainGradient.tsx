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
  isAboutHeroSlotPending,
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
  const phone = isPhoneLayout();
  const reactSlotId = useId();
  /**
   * Deliberately NOT gated on `isShaderWebGLBudgetActive()` here. That reads a
   * `data-doeforvc-always-phone` attribute that an ancestor (`useAboutPageVariant`)
   * sets via its own `useLayoutEffect` in the very same commit that first mounts this
   * hero — and layout effects fire bottom-up, so this component's effects run before
   * that attribute exists. Gating the dedicated-path choice on that live DOM read made
   * the hero flip from the dedicated slot path to the generic path on its first render,
   * then flip back once the attribute landed — and the generic path's now-stale effect
   * cleanup fired afterward and clobbered `budgetGranted` back to false, permanently
   * blanking the hero. The acquire*Slot functions already no-op safely when the budget
   * isn't active, so the dedicated-path choice only needs to depend on `variant`.
   */
  const homeHeroBackground = hero && variant === "home-hero";
  const aboutHeroBackground = hero && variant === "about-hero";
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
  /** Hero bands sit at the fold — never gate mount/show on intersection churn (iOS first paint). */
  const effectiveInViewport = hero ? true : inCarouselRange && inViewport;

  /**
   * WebGL context loss recovery (iOS drops contexts under memory pressure far more
   * aggressively than desktop). Every effect below that calls `requestMount()` only
   * fires once — each is keyed on `hero`/`phone`/`effectiveInViewport` values that
   * never change again after the initial mount — so if we drop `hasMounted` to false
   * here, nothing ever brings it back and the shader stays a blank colorBack fill
   * forever. Re-assert current mount intent instead of clearing it.
   */
  const resetShader = useCallback(() => {
    const shouldStayMounted = hero || effectiveInViewport;
    hasMountedRef.current = shouldStayMounted;
    setHasMounted(shouldStayMounted);
    setBudgetGranted(false);
    releaseShaderWebGLSlot(slotId);
    if (dedicatedHeroBackground) {
      setHomeHeroBackgroundReady(false);
    }
    setShaderGeneration((current) => current + 1);
  }, [dedicatedHeroBackground, effectiveInViewport, hero, slotId]);

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
    if (dedicatedHeroBackground) return;

    const onHomePage = document.documentElement.getAttribute("data-home-page") === "true";
    const waitForAboutHero = isAboutHeroSlotPending();
    if (!onHomePage && !waitForAboutHero) return;

    return subscribeHomeHeroBackgroundReady(() => {
      setHomeHeroGateEpoch((current) => current + 1);
    });
  }, [dedicatedHeroBackground]);

  useLayoutEffect(() => {
    if (!dedicatedHeroBackground) return;

    if (!hasMounted || !containerReady) {
      if (budgetGranted) {
        releaseShaderWebGLSlot(slotId);
        setBudgetGranted(false);
      }
      setHomeHeroBackgroundReady(false);
      return;
    }

    const granted = aboutHeroBackground
      ? acquireAboutHeroBackgroundSlot(evictShader)
      : acquireShaderWebGLSlot(slotId, shaderPriority, evictShader);
    if (granted) {
      setBudgetGranted(true);
    }
    setHomeHeroBackgroundReady(granted);

    return () => {
      releaseShaderWebGLSlot(slotId);
      setBudgetGranted(false);
      setHomeHeroBackgroundReady(false);
    };
  }, [
    aboutHeroBackground,
    containerReady,
    dedicatedHeroBackground,
    evictShader,
    hasMounted,
    shaderPriority,
    slotId,
  ]);

  useLayoutEffect(() => {
    if (dedicatedHeroBackground) return;

    if (!hasMounted || !containerReady) {
      if (budgetGranted) {
        releaseShaderWebGLSlot(slotId);
        setBudgetGranted(false);
      }
      return;
    }

    if (!effectiveInViewport) {
      if (budgetGranted) {
        releaseShaderWebGLSlot(slotId);
        setBudgetGranted(false);
      }
      return;
    }

    if (isAboutHeroSlotPending()) {
      if (budgetGranted) {
        releaseShaderWebGLSlot(slotId);
        setBudgetGranted(false);
      }
      return;
    }

    const granted = acquireShaderWebGLSlot(slotId, shaderPriority, evictShader);
    if (granted) {
      setBudgetGranted(true);
    }

    return () => {
      releaseShaderWebGLSlot(slotId);
      setBudgetGranted(false);
    };
  }, [
    containerReady,
    dedicatedHeroBackground,
    effectiveInViewport,
    evictShader,
    hasMounted,
    homeHeroGateEpoch,
    shaderPriority,
    slotId,
  ]);

  useEffect(() => {
    if (!isShaderWebGLBudgetActive() || !dedicatedHeroBackground) return;
    if (!hasMounted || !containerReady || budgetGranted) return;

    let cancelled = false;
    let retryTimer = 0;
    let retryDelayMs = 16;

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
      retryDelayMs = Math.min(retryDelayMs * 2, 500);
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
  const showGradient = hasMounted && containerReady && (hero || effectiveInViewport) && budgetGranted;

  /**
   * Cold-start WebGL context verification — hero only. `useShaderContextRecovery` above
   * only fires on `webglcontextlost`, an event for a context that WAS working and then
   * got reclaimed. It never fires if the very first `getContext()` call silently failed
   * or came back already dead, which real iOS Safari does on a cold GPU process — e.g.
   * the hero is often the first WebGL consumer in a fresh tab on a direct landing hit,
   * while a page reached by navigating past another shader first gets a warm GPU
   * process. That's exactly the "iPhone, initial load only" failure pattern. With no
   * event to react to, the canvas then sits blank forever. Poll the live context a
   * couple of times shortly after mount and force a fresh canvas (new key) if it never
   * comes up healthy.
   */
  useEffect(() => {
    if (!hero || !showGradient) return;

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 4;

    const check = () => {
      if (cancelled) return;
      const canvas = containerRef.current?.querySelector("canvas");
      const gl = canvas
        ? (canvas.getContext("webgl2") as WebGLRenderingContext | null) ??
          (canvas.getContext("webgl") as WebGLRenderingContext | null)
        : null;
      const healthy = !!gl && !gl.isContextLost();

      attempts += 1;
      if (healthy || attempts >= maxAttempts) return;

      setShaderGeneration((current) => current + 1);
      window.setTimeout(check, 350);
    };

    const initialCheck = window.setTimeout(check, 400);

    return () => {
      cancelled = true;
      window.clearTimeout(initialCheck);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- retries locally; shaderGeneration bump shouldn't reset the attempt loop
  }, [hero, showGradient]);

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
