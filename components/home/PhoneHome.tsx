"use client";

import { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } from "react";
import {
  MOBILE_NAV_FOOTER_SLIDES,
} from "@/components/doe-nav-data";
import { usePathname } from "next/navigation";

import type {
  BentoBridgeSectionProps,
  BuiltForYouSectionProps,
  HeroSectionProps,
  QualityOrbitSectionProps,
  VerticalBentoSectionProps,
  WorkflowCarouselSectionProps,
} from "@/components/home/PhoneHomeTypes";
import { BentoBridgeSection } from "@/components/home/sections/BentoBridgeSection";
import { BuiltForYouSection } from "@/components/home/sections/BuiltForYouSection";
import { HeroSection } from "@/components/home/sections/HeroSection";
import { HomeFooter } from "@/components/home/sections/HomeFooter";
import { InquisaraTeaser } from "@/components/home/sections/InquisaraTeaser";
import { QualityOrbitSection } from "@/components/home/sections/QualityOrbitSection";
import { VerticalBentoSection } from "@/components/home/sections/VerticalBentoSection";
import { WorkflowCarouselSection } from "@/components/home/sections/WorkflowCarouselSection";
import { inter, lora } from "@/lib/home/fonts";
import { doeforvcRootZoom } from "@/lib/doeforvc-zoom";
import { useDisablePinchGestures } from "@/lib/useDisablePinchGestures";
import { WIDE_DESKTOP_MEDIA_QUERY } from "@/lib/wide-desktop-media";
import {
  QUALITY_ORBIT_CHOREO_ACCENT_AFTER_GREY_MS,
  QUALITY_ORBIT_CHOREO_DIAGRAM_DELAY_MS,
  QUALITY_ORBIT_CHOREO_ENTER_PAUSE_MS,
  QUALITY_ORBIT_CHOREO_HEADLINE_DELAY_MS,
  QUALITY_ORBIT_GREY_ARC_DRAW_MS,
  QUALITY_ORBIT_TILE_FIRST_MS,
  QUALITY_ORBIT_TILE_LABELS,
  QUALITY_ORBIT_TILE_STEP_MS,
  qualityOrbitIntersectionMinVisiblePx,
} from "@/lib/home/quality-orbit";
import {
  VBENTO_BRIDGE_TESTIMONIALS,
  VB_BENTO_SCROLL_BYPASS_ENTER_BOTTOM_PX,
  VB_BENTO_SCROLL_BYPASS_EXIT_TOP_FRAC,
  vbAppViewportPx,
  vbBridgeGraphemeLen,
  vbComputeScrollMetrics,
  vbDocumentRootPx,
  vbGateVerticalBentoUTimeline,
  vbIsVisualViewportPinching,
  vbRailsEffectiveInnerHeight,
  vbResizeViewportHeightPx,
  type VerticalBentoScrollMetrics,
} from "@/lib/home/vertical-bento";
import { WF_CAROUSEL_SCROLL_HOLD_FRAC, WF_CAROUSEL_SCROLL_STRETCH, wfScrollProgressFromUnitT } from "@/lib/home/workflow-carousel-scroll";

export function PhoneHome() {
  useDisablePinchGestures();

  const [colorShift, setColorShift] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  /** Coalesce scroll-driven reads + setState to one rAF per frame (smoother momentum scroll). */
  const scrollEffectsRafRef = useRef<number | null>(null);
  /** True while the user is actively scrolling — pauses global palette RAF so the page tree is not re-rendered in parallel. */
  const scrollWheelBusyRef = useRef(false);
  /** Browser timer id (`window.setTimeout`); avoid `NodeJS.Timeout` from `ReturnType<typeof setTimeout>`. */
  const scrollQuietTimerRef = useRef<number | null>(null);
  /** Skip redundant second-section intro setState once the band is fully past. */
  const scrollSecondPastIntroRef = useRef(false);
  /** Skip redundant “Built for you” intro setState once past. */
  const scrollCarouselPastIntroRef = useRef(false);
  /** After the vertical bento stack has cleared above the viewport, skip headline / rails / u updates (hysteresis). */
  const scrollVbPastBandRef = useRef(false);
  /** Monotonic scrub: prevents `vbGateVerticalBentoUTimeline` from briefly raising `u` while scrolling up. */
  const vbMonotonicPrevTopRef = useRef<number | null>(null);
  const vbMonotonicPrevURef = useRef<number>(0);
  /** Last committed VB metrics — ignore micro `visualViewport` height jitter when width unchanged. */
  const vbMetricsLocksRef = useRef<{ vvH: number; innerW: number } | null>(null);
  const vbMetricsResizeTimerRef = useRef<number | null>(null);
  /** Last VB metrics — stabilize `sectionMinPx` upward-only between commits. */
  const vbMetricsLastFullRef = useRef<VerticalBentoScrollMetrics | null>(null);
  /** Bypass transition — set latch effects only on edge. */
  const vbBypassPrevRef = useRef(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  /** Which top-level nav row is expanded in the phone menu sheet (accordion). */
  /** Featured strip carousel at bottom of the phone nav sheet */
  const [mobileNavFooterSlide, setMobileNavFooterSlide] = useState(0);
  const mobileNavFooterCarouselRef = useRef<HTMLDivElement>(null);
  /** Carousel width when the sheet first opens — `zoom` shrinks uniformly if the window gets narrower. */
  const mobileNavFooterWidthBaselineRef = useRef(0);
  const [mobileNavFooterZoom, setMobileNavFooterZoom] = useState(1);
  /** Body portal for the phone menu — keeps footer carousel out of the CSS-zoom root (matches blog / DoeIphoneSiteNav). */
  const [navPortalMounted, setNavPortalMounted] = useState(false);
  const [hoveredBox, setHoveredBox] = useState<number | null>(null);
  const [expandedBentoBox, setExpandedBentoBox] = useState<number | null>(null);
  const [hoveredBentoBox, setHoveredBentoBox] = useState<number | null>(null);
  const [selectedWordIndex, setSelectedWordIndex] = useState(2);
  const [carouselOffset, setCarouselOffset] = useState(0);
  const [isCarouselTransitioning, setIsCarouselTransitioning] = useState(false);
  const [uiMockupOpacity, setUiMockupOpacity] = useState(1);
  const [uiMockupTranslateY, setUiMockupTranslateY] = useState(0);
  const [uiMockupScale, setUiMockupScale] = useState(1);
  const carouselSectionRef = useRef<HTMLDivElement>(null);
  /** Latest `isCarouselTransitioning` for “Built for you” autoplay ticks */
  const builtForYouCarouselTransitioningSinkRef = useRef(false);
  /** Advance one word right — shared by next button + 3s interval */
  const builtForYouCarouselAdvanceRightRef = useRef<(() => void) | null>(null);
  const [carouselSectionOpacity, setCarouselSectionOpacity] = useState(0);
  const [carouselSectionTranslateY, setCarouselSectionTranslateY] = useState(40);
  const [activeWordVisible, setActiveWordVisible] = useState(true);
  const [isSlidingPaused, setIsSlidingPaused] = useState(false);
  /** Second-section workflow carousel: continuous scroll progress 0..(slideCount-1). */
  const [workflowCarouselProgress, setWorkflowCarouselProgress] = useState(0);
  /** When true, skip CSS transition (used on index wrap 5↔0). */
  const [workflowCarouselSkipMotion, setWorkflowCarouselSkipMotion] = useState(false);
  /** Full fixed `<nav>` — sheet top aligns to `<nav>` bottom (includes bar underline when menu open). */
  const navBarRowRef = useRef<HTMLElement>(null);
  const [iphoneMenuTopPx, setIphoneMenuTopPx] = useState(88);
  /** Scroll-driven vertical bento (after workflow carousel) */
  const verticalBentoSectionRef = useRef<HTMLElement | null>(null);
  const [verticalBentoU, setVerticalBentoU] = useState(0);
  const [vbMetrics, setVbMetrics] = useState<VerticalBentoScrollMetrics>(() =>
    vbComputeScrollMetrics(800, undefined, 1200),
  );
  const [verticalBentoTitleOpacity, setVerticalBentoTitleOpacity] = useState(0);
  const [verticalBentoTitleTranslateY, setVerticalBentoTitleTranslateY] = useState(40);
  const [verticalBentoRailsOpacity, setVerticalBentoRailsOpacity] = useState(0);
  const [verticalBentoRailsTranslateY, setVerticalBentoRailsTranslateY] = useState(40);
  const verticalBentoHeadlineRef = useRef<HTMLDivElement>(null);
  const bentoBridgeSectionRef = useRef<HTMLElement | null>(null);
  /** Bridge testimonial: in-view triggers staged reveal (disk → quote → meta) + typewriter */
  const [bentoBridgeInView, setBentoBridgeInView] = useState(false);
  /** Whole testimonial column fades/slides in once the bridge is allowed to animate (after vb cleared + in view). */
  const [bentoBridgeSectionEntered, setBentoBridgeSectionEntered] = useState(false);
  /** 0 idle, 1 disk, 2 quote (+ typewriter), 3 attribution */
  const [bentoBridgeStage, setBentoBridgeStage] = useState(0);
  const [bentoBridgeTypewriterOn, setBentoBridgeTypewriterOn] = useState(false);
  const [bentoBridgeTypedLen, setBentoBridgeTypedLen] = useState(0);
  /** Latched once the third vertical-bento dwell completes — bridge motion waits for this. */
  const [bentoBridgeVbCleared, setBentoBridgeVbCleared] = useState(false);
  const [bentoBridgeCardIndex, setBentoBridgeCardIndex] = useState(0);
  /** Bumps when the active card changes so the RAF typewriter restarts cleanly. */
  const [bentoBridgeTwEpoch, setBentoBridgeTwEpoch] = useState(0);
  /** Crossfade when auto-rotating or scrubbing testimonials (disk stays put). */
  const [bentoBridgeContentFade, setBentoBridgeContentFade] = useState(1);
  const bentoBridgeCard = useMemo(
    () => VBENTO_BRIDGE_TESTIMONIALS[bentoBridgeCardIndex] ?? VBENTO_BRIDGE_TESTIMONIALS[0],
    [bentoBridgeCardIndex],
  );
  /** “Only high-quality patient care” orbit — staged scroll-in choreography */
  const qualityOrbitSectionRef = useRef<HTMLElement | null>(null);
  const [qualityOrbitChoreography, setQualityOrbitChoreography] = useState({
    headline: false,
    accent: false,
    /** Orbit pills revealed clockwise from top; 0..6 */
    tilesShown: 0,
  });
  const secondSectionScrollDriverRef = useRef<HTMLDivElement>(null);
  const secondSectionRef = useRef<HTMLDivElement>(null);
  const [secondSectionTitleOpacity, setSecondSectionTitleOpacity] = useState(0);
  const [secondSectionTitleTranslateY, setSecondSectionTitleTranslateY] = useState(40);
  const [slidingBoxesOpacity, setSlidingBoxesOpacity] = useState(0);
  const [slidingBoxesTranslateY, setSlidingBoxesTranslateY] = useState(40);
  const [shouldStartSlidingAnimation, setShouldStartSlidingAnimation] = useState(false);
  const [activeTab, setActiveTab] = useState<'Inbox' | 'Calls' | 'Workflow'>('Inbox');
  const [hoveredDecisionCard, setHoveredDecisionCard] = useState<'context' | 'timeline' | 'decision' | null>(null);
  const [box2Title, setBox2Title] = useState('Smart Appointments');
  const [box2Description, setBox2Description] = useState(
    'Charts update live from what patients say in the room—medications, history, and visit goals surface before your next question.'
  );
  const [isEditingBox2Title, setIsEditingBox2Title] = useState(false);
  const [isEditingBox2Description, setIsEditingBox2Description] = useState(false);
  // Default positions - loaded from JSON file, updated when saved
  const [reportBoxPositions, setReportBoxPositions] = useState<Array<{ x: number; y: number }>>([
    { x: -85, y: -95 }, // First box initial position
    { x: 76, y: 79 }     // Second box initial position (relative to first)
  ]);
  const [positionHistory, setPositionHistory] = useState<Array<Array<{ x: number; y: number }>>>([]);
  const latestPositionsRef = useRef<Array<{ x: number; y: number }>>(reportBoxPositions);
  const descriptionEditRef = useRef<HTMLTextAreaElement | null>(null);

  /** Hero intro choreography: phases 1–5 staged on hover (fine pointer) or on scroll-into-view (coarse); runs once */
  const [heroIntroPhase, setHeroIntroPhase] = useState(0); // 0 idle, 1 logo … 5 CTA visible
  const heroIntroLatchRef = useRef(false);
  const heroIntroTimeoutsRef = useRef<number[]>([]);
  const heroRevealShellRef = useRef<HTMLDivElement>(null);
  /** Fine pointer prefers hover-trigger; coarse/touch uses intersection observer */
  const [heroIntroTriggerFineHover, setHeroIntroTriggerFineHover] = useState(false);
  const [prefersReducedMotionHero, setPrefersReducedMotionHero] = useState(false);

  const runHeroIntroSequence = useCallback(() => {
    if (heroIntroLatchRef.current) return;
    heroIntroLatchRef.current = true;

    heroIntroTimeoutsRef.current.forEach((id) => window.clearTimeout(id));
    heroIntroTimeoutsRef.current = [];

    if (prefersReducedMotionHero) {
      setHeroIntroPhase(5);
      return;
    }

    const gaps = [920, 960, 960, 1000];
    let when = gaps[0]!;
    setHeroIntroPhase(1);
    for (let p = 2; p <= 5; p++) {
      const next = p as 2 | 3 | 4 | 5;
      heroIntroTimeoutsRef.current.push(window.setTimeout(() => setHeroIntroPhase(next), when));
      when += gaps[p - 1] ?? gaps[gaps.length - 1]!;
    }
  }, [prefersReducedMotionHero]);

  useEffect(() => {
    return () => {
      heroIntroTimeoutsRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => {
      const red = mq.matches;
      setPrefersReducedMotionHero(red);
      if (red) {
        heroIntroLatchRef.current = true;
        setHeroIntroPhase(5);
      }
    };
    syncMotion();
    mq.addEventListener("change", syncMotion);
    return () => mq.removeEventListener("change", syncMotion);
  }, []);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const syncHover = () => setHeroIntroTriggerFineHover(mq.matches);
    syncHover();
    mq.addEventListener("change", syncHover);
    return () => mq.removeEventListener("change", syncHover);
  }, []);

  useEffect(() => {
    if (heroIntroTriggerFineHover || prefersReducedMotionHero) return;
    const el = heroRevealShellRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.22) {
            runHeroIntroSequence();
          }
        }
      },
      { threshold: [0, 0.22, 0.4] },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [heroIntroTriggerFineHover, prefersReducedMotionHero, runHeroIntroSequence]);

  const pathname = usePathname();
  const isMainpageRoute = pathname === "/mainpage";
  /** Phone canvas on `/`; full desktop layout on `/mainpage` (wide screens only). */
  const isPhoneLayout = !isMainpageRoute;
  const [isWideDesktop, setIsWideDesktop] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(1200);
  /** Visible viewport (matches `visualViewport`); drives hero sizing + `--app-vh` / `--app-vw`. */
  const [appViewport, setAppViewport] = useState({ width: 1200, height: 800 });
  /** Last committed app viewport — hysteresis so hero / workflow driver heights don't shrink mid-scroll on iOS. */
  const appViewportStableRef = useRef<{ width: number; height: number } | null>(null);
  const appViewportSettleTimerRef = useRef<number | null>(null);
  const appViewportScrollActiveRef = useRef(false);
  const appViewportScrollQuietTimerRef = useRef<number | null>(null);
  /** Sliding cards on phone: logical px inside zoomed root (= visible px ÷ root zoom). */
  const [phoneSlideSize, setPhoneSlideSize] = useState({ w: 850, h: 1090 });

  useEffect(() => {
    const updateWidth = () => setViewportWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    if (!isMainpageRoute) return;
    const mq = window.matchMedia(WIDE_DESKTOP_MEDIA_QUERY);
    const update = () => setIsWideDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [isMainpageRoute]);

  useLayoutEffect(() => {
    const APP_VIEWPORT_SHRINK_DEFER_PX = 120;
    const APP_VIEWPORT_SETTLE_MS = 220;

    const commitAppViewport = (next: { width: number; height: number }) => {
      appViewportStableRef.current = next;
      setAppViewport(next);
    };

    const updatePhoneSlideSize = (vw: number) => {
      const zoom = Math.max(0.38, doeforvcRootZoom(window.innerWidth));
      /** Slide width from viewport; height taller than width for portrait cards */
      const phoneSlideScale = 1;
      /** Match `narrowHorizontalInset`: max(1.5rem, safe-area) per side — safe-area not available in JS; 1.5rem tracks typical gutters and aligns with the Built-for-you orange panel. */
      const rootPx = vbDocumentRootPx();
      const sidePadPx = Math.max(1.5 * rootPx, 0);
      const w = Math.max(200, ((vw - 2 * sidePadPx) / zoom) * phoneSlideScale);
      /** Taller than wide — extra vertical presence in the carousel band */
      const phoneSlideHeightRatio = 1.28;
      const h = w * phoneSlideHeightRatio;
      setPhoneSlideSize({ w, h });
    };

    const measure = (force = false) => {
      const { width: vw, height: vhVis } = vbAppViewportPx();
      if (typeof document !== "undefined") {
        document.documentElement.style.setProperty("--app-vw", `${vw}px`);
        document.documentElement.style.setProperty("--app-vh", `${vhVis}px`);
        const vv = window.visualViewport;
        if (vv) {
          document.documentElement.style.setProperty("--app-vv-offset-top", `${Math.round(vv.offsetTop)}px`);
        }
      }

      if (force) {
        commitAppViewport({ width: vw, height: vhVis });
      } else {
        const stable = appViewportStableRef.current;
        if (stable === null) {
          commitAppViewport({ width: vw, height: vhVis });
        } else if (vw !== stable.width) {
          commitAppViewport({ width: vw, height: vhVis });
        } else if (vhVis >= stable.height) {
          commitAppViewport({ width: vw, height: vhVis });
        } else {
          const shrinkPx = stable.height - vhVis;
          if (appViewportScrollActiveRef.current || shrinkPx < APP_VIEWPORT_SHRINK_DEFER_PX) {
            if (appViewportSettleTimerRef.current !== null) {
              window.clearTimeout(appViewportSettleTimerRef.current);
            }
            appViewportSettleTimerRef.current = window.setTimeout(() => {
              appViewportSettleTimerRef.current = null;
              if (appViewportScrollActiveRef.current) {
                measure(false);
                return;
              }
              const remeasure = vbAppViewportPx();
              const curStable = appViewportStableRef.current;
              if (curStable !== null && remeasure.height < curStable.height) {
                commitAppViewport({ width: remeasure.width, height: remeasure.height });
              }
            }, APP_VIEWPORT_SETTLE_MS);
          } else {
            commitAppViewport({ width: vw, height: vhVis });
          }
        }
      }

      updatePhoneSlideSize(vw);
    };

    const onScrollForViewport = () => {
      appViewportScrollActiveRef.current = true;
      if (appViewportScrollQuietTimerRef.current !== null) {
        window.clearTimeout(appViewportScrollQuietTimerRef.current);
      }
      appViewportScrollQuietTimerRef.current = window.setTimeout(() => {
        appViewportScrollQuietTimerRef.current = null;
        appViewportScrollActiveRef.current = false;
        measure(false);
      }, APP_VIEWPORT_SETTLE_MS);
    };

    const onOrientation = () => {
      if (appViewportSettleTimerRef.current !== null) {
        window.clearTimeout(appViewportSettleTimerRef.current);
        appViewportSettleTimerRef.current = null;
      }
      measure(true);
    };

    measure(true);
    const onWindowResize = () => measure(false);
    const onVVResize = () => {
      if (vbIsVisualViewportPinching()) return;
      measure(false);
    };
    window.addEventListener("resize", onWindowResize);
    window.visualViewport?.addEventListener("resize", onVVResize);
    window.addEventListener("scroll", onScrollForViewport, { passive: true });
    window.addEventListener("orientationchange", onOrientation);
    /** Do not listen to `visualViewport` scroll: iOS updates height/offset every pan frame, which
     *  reflows `--app-vh` / slide metrics and fights native scroll (snap/jump when scrolling quickly). */
    return () => {
      window.removeEventListener("resize", onWindowResize);
      window.visualViewport?.removeEventListener("resize", onVVResize);
      window.removeEventListener("scroll", onScrollForViewport);
      window.removeEventListener("orientationchange", onOrientation);
      if (appViewportSettleTimerRef.current !== null) {
        window.clearTimeout(appViewportSettleTimerRef.current);
        appViewportSettleTimerRef.current = null;
      }
      if (appViewportScrollQuietTimerRef.current !== null) {
        window.clearTimeout(appViewportScrollQuietTimerRef.current);
        appViewportScrollQuietTimerRef.current = null;
      }
    };
  }, [viewportWidth]);

  useLayoutEffect(() => {
    const navEl = navBarRowRef.current;
    if (!navEl) return;
    const update = () => {
      const raw = navEl.getBoundingClientRect().bottom;
      /** Pull sheet slightly under measured chrome to kill subpixel/zoom seam above list */
      setIphoneMenuTopPx(Math.max(0, Math.floor(raw) - 6));
    };
    const onVVResize = () => {
      if (vbIsVisualViewportPinching()) return;
      update();
    };
    update();
    let raf1 = 0;
    let raf2 = 0;
    if (mobileNavOpen) {
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(update);
      });
    }
    const ro = new ResizeObserver(update);
    ro.observe(navEl);
    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", onVVResize);
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      ro.disconnect();
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", onVVResize);
    };
  }, [mobileNavOpen, viewportWidth, appViewport.width, appViewport.height]);

  useLayoutEffect(() => {
    if (!mobileNavOpen) return;
    const fit = () => {
      const el = mobileNavFooterCarouselRef.current;
      if (!el) return;
      const cw = el.clientWidth;
      if (cw <= 0) return;
      if (mobileNavFooterWidthBaselineRef.current <= 0) {
        mobileNavFooterWidthBaselineRef.current = cw;
      }
      const base = mobileNavFooterWidthBaselineRef.current;
      const z = Math.min(1, cw / base);
      setMobileNavFooterZoom((prev) => (Math.abs(prev - z) < 0.002 ? prev : z));
    };
    const onVVResize = () => {
      if (vbIsVisualViewportPinching()) return;
      fit();
    };

    fit();
    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(fit);
    });
    const el = mobileNavFooterCarouselRef.current;
    const ro = new ResizeObserver(fit);
    if (el) ro.observe(el);
    window.addEventListener("resize", fit);
    window.visualViewport?.addEventListener("resize", onVVResize);
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      ro.disconnect();
      window.removeEventListener("resize", fit);
      window.visualViewport?.removeEventListener("resize", onVVResize);
    };
  }, [mobileNavOpen, appViewport.width, appViewport.height]);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const ih = window.innerHeight;
    const vvH = vbResizeViewportHeightPx();
    const iw = window.innerWidth;
    const fresh = vbComputeScrollMetrics(vvH, vbRailsEffectiveInnerHeight(iw, ih), iw);
    vbMetricsLastFullRef.current = fresh;
    vbMetricsLocksRef.current = { vvH, innerW: iw };
    setVbMetrics(fresh);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const applyVbMetrics = (forceShrink: boolean) => {
      const ih = window.innerHeight;
      const vvH = vbResizeViewportHeightPx();
      const iw = window.innerWidth;
      let next = vbComputeScrollMetrics(vvH, vbRailsEffectiveInnerHeight(iw, ih), iw);
      const snap = vbMetricsLastFullRef.current;
      if (!forceShrink && snap !== null && next.sectionMinPx < snap.sectionMinPx) {
        next = { ...next, sectionMinPx: snap.sectionMinPx };
      }
      vbMetricsLastFullRef.current = next;
      vbMetricsLocksRef.current = { vvH, innerW: iw };
      setVbMetrics(next);
    };

    const queueVbMetrics = () => {
      const lk = vbMetricsLocksRef.current;
      if (lk !== null) {
        const vvHNow = vbResizeViewportHeightPx();
        const iwNow = window.innerWidth;
        if (Math.abs(vvHNow - lk.vvH) < 72 && iwNow === lk.innerW) return;
      }
      if (vbMetricsResizeTimerRef.current !== null) {
        window.clearTimeout(vbMetricsResizeTimerRef.current);
      }
      vbMetricsResizeTimerRef.current = window.setTimeout(() => {
        vbMetricsResizeTimerRef.current = null;
        applyVbMetrics(false);
      }, 210);
    };

    const onResize = queueVbMetrics;
    /** `visualViewport.resize` only — avoid scroll listeners so iOS won’t churn min-heights every pan frame. */
    const onVVResize = () => {
      if (vbIsVisualViewportPinching()) return;
      queueVbMetrics();
    };
    const onOrientation = () => {
      if (vbMetricsResizeTimerRef.current !== null) {
        window.clearTimeout(vbMetricsResizeTimerRef.current);
        vbMetricsResizeTimerRef.current = null;
      }
      applyVbMetrics(true);
    };

    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onVVResize);
    window.addEventListener("orientationchange", onOrientation);
    return () => {
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onVVResize);
      window.removeEventListener("orientationchange", onOrientation);
      if (vbMetricsResizeTimerRef.current !== null) {
        window.clearTimeout(vbMetricsResizeTimerRef.current);
        vbMetricsResizeTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileNavOpen]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileNavOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileNavOpen]);

  useEffect(() => {
  }, [mobileNavOpen]);

  useEffect(() => {
    if (!mobileNavOpen) {
      setMobileNavFooterSlide(0);
      mobileNavFooterWidthBaselineRef.current = 0;
      setMobileNavFooterZoom(1);
    }
  }, [mobileNavOpen]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const id = window.setInterval(() => {
      const el = mobileNavFooterCarouselRef.current;
      if (!el) return;
      const w = el.clientWidth;
      if (w <= 0) return;
      const len = MOBILE_NAV_FOOTER_SLIDES.length;
      const i = Math.min(len - 1, Math.max(0, Math.round(el.scrollLeft / w)));
      const next = (i + 1) % len;
      el.scrollTo({ left: next * w, behavior: "smooth" });
      setMobileNavFooterSlide(next);
    }, 4000);
    return () => window.clearInterval(id);
  }, [mobileNavOpen]);

  useEffect(() => {
    setNavPortalMounted(true);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      builtForYouCarouselAdvanceRightRef.current?.();
    }, 3000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const el = qualityOrbitSectionRef.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timers: number[] = [];
    const clearTimers = () => {
      timers.forEach((tid) => window.clearTimeout(tid));
      timers.length = 0;
    };

    let seen = false;

    const beginChoreography = () => {
      clearTimers();
      if (mq.matches) {
        setQualityOrbitChoreography({
          headline: true,
          accent: true,
          tilesShown: QUALITY_ORBIT_TILE_LABELS.length,
        });
        return;
      }
      timers.push(
        window.setTimeout(() => {
          setQualityOrbitChoreography((c) => ({ ...c, headline: true }));
        }, QUALITY_ORBIT_CHOREO_HEADLINE_DELAY_MS),
      );
      const nTiles = QUALITY_ORBIT_TILE_LABELS.length;
      for (let i = 0; i < nTiles; i++) {
        timers.push(
          window.setTimeout(() => {
            setQualityOrbitChoreography((c) => ({ ...c, tilesShown: Math.max(c.tilesShown, i + 1) }));
          }, QUALITY_ORBIT_CHOREO_DIAGRAM_DELAY_MS + QUALITY_ORBIT_TILE_FIRST_MS + i * QUALITY_ORBIT_TILE_STEP_MS),
        );
      }
      const lastTileMs =
        QUALITY_ORBIT_CHOREO_DIAGRAM_DELAY_MS +
        QUALITY_ORBIT_TILE_FIRST_MS +
        (nTiles - 1) * QUALITY_ORBIT_TILE_STEP_MS;
      const accentAfterDiagramMs =
        lastTileMs + QUALITY_ORBIT_GREY_ARC_DRAW_MS + QUALITY_ORBIT_CHOREO_ACCENT_AFTER_GREY_MS;
      timers.push(
        window.setTimeout(() => {
          setQualityOrbitChoreography((c) => ({ ...c, accent: true }));
        }, accentAfterDiagramMs),
      );
    };

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!e || seen) return;
        if (!e.isIntersecting) return;

        const vh = vbAppViewportPx().height;
        const { top, bottom } = e.boundingClientRect;
        const visiblePx = Math.min(bottom, vh) - Math.max(top, 0);
        const minVisiblePx = qualityOrbitIntersectionMinVisiblePx(vh);

        // Enough real overlap inside the viewport — avoids firing off eager IO slack while section 2 fills the frame
        if (visiblePx < minVisiblePx) return;
        if (e.intersectionRatio < 0.06) return;

        // Section top must move meaningfully above the bottom edge (not just a sliver while still “in” carousel land)
        if (top > vh * 0.82) return;

        seen = true;
        io.disconnect();
        timers.push(
          window.setTimeout(() => {
            beginChoreography();
          }, QUALITY_ORBIT_CHOREO_ENTER_PAUSE_MS),
        );
      },
      { threshold: [0, 0.06, 0.08, 0.12, 0.18, 0.24], rootMargin: "0px" },
    );

    io.observe(el);
    return () => {
      io.disconnect();
      clearTimers();
    };
  }, []);

  useEffect(() => {
    const el = bentoBridgeSectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!e?.isIntersecting) return;
        if (e.intersectionRatio < 0.08) return;
        setBentoBridgeInView(true);
      },
      { rootMargin: "0px 0px -8% 0px", threshold: [0, 0.08, 0.14, 0.22] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (bentoBridgeVbCleared) return;
    if (verticalBentoU + 1e-9 >= vbMetrics.milestones.uDw2End) setBentoBridgeVbCleared(true);
  }, [verticalBentoU, vbMetrics.milestones.uDw2End, bentoBridgeVbCleared]);

  useEffect(() => {
    if (!bentoBridgeInView || !bentoBridgeVbCleared) return;
    let alive = true;
    const full = VBENTO_BRIDGE_TESTIMONIALS[0].quote;
    const mq =
      typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    if (mq?.matches) {
      setBentoBridgeSectionEntered(true);
      setBentoBridgeStage(3);
      setBentoBridgeTypedLen(vbBridgeGraphemeLen(full));
      setBentoBridgeTypewriterOn(false);
      return;
    }
    setBentoBridgeSectionEntered(true);
    /** Medallion is stage 1 immediately so it leads the column fade; quote and meta follow. */
    setBentoBridgeStage(1);
    const tQuote = window.setTimeout(() => {
      if (!alive) return;
      setBentoBridgeTypedLen(0);
      setBentoBridgeStage(2);
      setBentoBridgeTypewriterOn(true);
    }, 580);
    const tMeta = window.setTimeout(() => {
      if (!alive) return;
      setBentoBridgeStage(3);
    }, 1280);
    return () => {
      alive = false;
      window.clearTimeout(tQuote);
      window.clearTimeout(tMeta);
    };
  }, [bentoBridgeInView, bentoBridgeVbCleared]);

  useEffect(() => {
    if (!bentoBridgeTypewriterOn) return;
    const full = bentoBridgeCard.quote;
    const cap = vbBridgeGraphemeLen(full);
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setBentoBridgeTypedLen(cap);
      return;
    }
    let acc = 0;
    let last = performance.now();
    const cps = 13.5;
    let rafId = 0;
    const step = (now: number) => {
      acc += ((now - last) / 1000) * cps;
      last = now;
      const next = Math.min(cap, Math.floor(acc));
      setBentoBridgeTypedLen((prev) => (next > prev ? next : prev));
      if (next < cap) rafId = requestAnimationFrame(step);
    };
    setBentoBridgeTypedLen(0);
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [bentoBridgeTypewriterOn, bentoBridgeCardIndex, bentoBridgeTwEpoch, bentoBridgeCard]);

  /** After a testimonial finishes typing, hold 2s, then crossfade to the next card (no fixed interval while typing). */
  useEffect(() => {
    if (bentoBridgeStage < 3) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cap = vbBridgeGraphemeLen(VBENTO_BRIDGE_TESTIMONIALS[bentoBridgeCardIndex].quote);
    if (bentoBridgeTypedLen < cap) return;

    let cancelled = false;
    let innerId: number | null = null;
    const holdMs = 2000;
    const swapMs = 420;
    const holdId = window.setTimeout(() => {
      if (cancelled) return;
      setBentoBridgeContentFade(0);
      innerId = window.setTimeout(() => {
        if (cancelled) return;
        setBentoBridgeCardIndex((i) => (i + 1) % VBENTO_BRIDGE_TESTIMONIALS.length);
        setBentoBridgeTypedLen(0);
        setBentoBridgeTwEpoch((e) => e + 1);
        setBentoBridgeTypewriterOn(true);
        setBentoBridgeContentFade(1);
      }, swapMs);
    }, holdMs);

    return () => {
      cancelled = true;
      window.clearTimeout(holdId);
      if (innerId != null) window.clearTimeout(innerId);
    };
  }, [bentoBridgeStage, bentoBridgeTypedLen, bentoBridgeCardIndex]);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    /** Throttle palette drift so we do not re-render the whole page at display refresh while scrolling. */
    let colorAccumMs = 0;
    const colorStepMs = 200;

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      if (document.visibilityState === "visible" && !scrollWheelBusyRef.current) {
        colorAccumMs += deltaTime;
        if (colorAccumMs >= colorStepMs) {
          const steps = Math.floor(colorAccumMs / colorStepMs);
          colorAccumMs -= steps * colorStepMs;
          const delta = steps * colorStepMs * 0.02;
          setColorShift((prev) => (prev + delta) % 100);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  useEffect(() => {
    const runScrollEffects = () => {
      scrollEffectsRafRef.current = null;
      setScrollY(window.scrollY);
      const viewportHeight = vbAppViewportPx().height;

      // Calculate second section title fade-in and scroll-driven slide index
      if (secondSectionScrollDriverRef.current) {
        const driverRect = secondSectionScrollDriverRef.current.getBoundingClientRect();
        const driverTop = driverRect.top;
        const fadeStart = viewportHeight * 0.9;  // driver top enters viewport
        const fadeEnd = viewportHeight * 0.1;    // driver top near viewport top (just before sticky)

        if (driverTop > fadeStart + 6) {
          scrollSecondPastIntroRef.current = false;
        }

        if (driverTop < fadeEnd - 2 && scrollSecondPastIntroRef.current) {
          // already fully visible — skip redundant setState
        } else if (driverTop <= fadeStart && driverTop >= fadeEnd) {
          scrollSecondPastIntroRef.current = false;
          const progress = Math.min(1, Math.max(0, (fadeStart - driverTop) / (fadeStart - fadeEnd)));
          setSecondSectionTitleOpacity(progress);
          setSecondSectionTitleTranslateY(20 * (1 - progress));
          setSlidingBoxesOpacity(progress);
          setSlidingBoxesTranslateY(20 * (1 - progress));
        } else if (driverTop < fadeEnd) {
          scrollSecondPastIntroRef.current = true;
          setSecondSectionTitleOpacity(1);
          setSecondSectionTitleTranslateY(0);
          setSlidingBoxesOpacity(1);
          setSlidingBoxesTranslateY(0);
        } else {
          setSecondSectionTitleOpacity(0);
          setSecondSectionTitleTranslateY(20);
          setSlidingBoxesOpacity(0);
          setSlidingBoxesTranslateY(20);
        }

        // Scroll-linked carousel — each slide dwells, then transitions (stretched driver height)
        const scrolledIntoDriver = -driverRect.top;
        const scrollableInDriver = driverRect.height - viewportHeight;
        if (scrollableInDriver > 0) {
          const t = Math.min(1, Math.max(0, scrolledIntoDriver / scrollableInDriver));
          setWorkflowCarouselProgress(
            wfScrollProgressFromUnitT(t, carouselSlideCount, WF_CAROUSEL_SCROLL_HOLD_FRAC),
          );
        } else {
          setWorkflowCarouselProgress(0);
        }
      }

      // Calculate carousel section fade-in and slide-up animation
      if (carouselSectionRef.current) {
        const rect = carouselSectionRef.current.getBoundingClientRect();
        const sectionTop = rect.top;

        // Start animation when section enters viewport (when top is at 85% of viewport)
        // Complete animation when section is at 60% from top of viewport
        const startPoint = viewportHeight * 0.85;
        const endPoint = viewportHeight * 0.6;
        const distance = startPoint - endPoint;

        if (sectionTop > startPoint + 6) {
          scrollCarouselPastIntroRef.current = false;
        }

        if (sectionTop < endPoint - 2 && scrollCarouselPastIntroRef.current) {
          // Past intro — idle
        } else {
          if (sectionTop <= startPoint && sectionTop >= endPoint) {
            scrollCarouselPastIntroRef.current = false;
            // Section is in animation range
            const progress = (startPoint - sectionTop) / distance;
            const clampedProgress = Math.min(Math.max(progress, 0), 1);

            // Fade in: 0 to 1
            setCarouselSectionOpacity(clampedProgress);
            // Slide up: 40px to 0px
            setCarouselSectionTranslateY(40 * (1 - clampedProgress));
          } else if (sectionTop < endPoint) {
            scrollCarouselPastIntroRef.current = true;
            // Section is past animation point - fully visible
            setCarouselSectionOpacity(1);
            setCarouselSectionTranslateY(0);
          } else {
            // Section hasn't reached animation point yet
            setCarouselSectionOpacity(0);
            setCarouselSectionTranslateY(40);
          }
        }
      }

      const vbEl = verticalBentoSectionRef.current;
      const vbRect = vbEl?.getBoundingClientRect();

      let vbBypass = scrollVbPastBandRef.current;
      if (vbRect) {
        if (vbBypass) {
          if (vbRect.top > viewportHeight * VB_BENTO_SCROLL_BYPASS_EXIT_TOP_FRAC) {
            vbBypass = scrollVbPastBandRef.current = false;
            vbMonotonicPrevTopRef.current = null;
          }
        } else if (vbRect.bottom < VB_BENTO_SCROLL_BYPASS_ENTER_BOTTOM_PX) {
          vbBypass = scrollVbPastBandRef.current = true;
        }
      }

      const bypassEdgeOn = vbBypass && !vbBypassPrevRef.current;
      const bypassEdgeOff = !vbBypass && vbBypassPrevRef.current;
      vbBypassPrevRef.current = vbBypass;

      if (vbBypass) {
        if (bypassEdgeOn) {
          setVerticalBentoTitleOpacity(1);
          setVerticalBentoTitleTranslateY(0);
          setVerticalBentoRailsOpacity(1);
          setVerticalBentoRailsTranslateY(0);
          setVerticalBentoU(1);
          vbMonotonicPrevURef.current = 1;
          vbMonotonicPrevTopRef.current = null;
        }
      } else {
        // Vertical bento headline (bridge band under workflow carousel): fade/slide-in
        if (verticalBentoHeadlineRef.current) {
          const rect = verticalBentoHeadlineRef.current.getBoundingClientRect();
          const sectionTop = rect.top;
          const startPoint = viewportHeight * 0.85;
          const endPoint = viewportHeight * 0.6;
          const distance = startPoint - endPoint;

          if (sectionTop <= startPoint && sectionTop >= endPoint) {
            const progress = (startPoint - sectionTop) / distance;
            const clampedProgress = Math.min(Math.max(progress, 0), 1);
            setVerticalBentoTitleOpacity(clampedProgress);
            setVerticalBentoTitleTranslateY(40 * (1 - clampedProgress));
          } else if (sectionTop < endPoint) {
            setVerticalBentoTitleOpacity(1);
            setVerticalBentoTitleTranslateY(0);
          } else {
            setVerticalBentoTitleOpacity(0);
            setVerticalBentoTitleTranslateY(40);
          }
        }

        // Vertical bento rails: staggered fade-in + scrub timeline (stack ref only)
        if (verticalBentoSectionRef.current) {
          const el = verticalBentoSectionRef.current;
          const rect = el.getBoundingClientRect();
          const sectionTop = rect.top;
          const startPoint = viewportHeight * 0.85;
          const endPoint = viewportHeight * 0.6;
          const distance = startPoint - endPoint;

          if (sectionTop <= startPoint && sectionTop >= endPoint) {
            const progress = (startPoint - sectionTop) / distance;
            const clampedProgress = Math.min(Math.max(progress, 0), 1);
            if (clampedProgress >= 0.6) {
              const railsProgress = (clampedProgress - 0.6) / 0.4;
              const clampedRails = Math.min(Math.max(railsProgress, 0), 1);
              setVerticalBentoRailsOpacity(clampedRails);
              setVerticalBentoRailsTranslateY(40 * (1 - clampedRails));
            } else {
              setVerticalBentoRailsOpacity(0);
              setVerticalBentoRailsTranslateY(40);
            }
          } else if (sectionTop < endPoint) {
            setVerticalBentoRailsOpacity(1);
            setVerticalBentoRailsTranslateY(0);
          } else {
            setVerticalBentoRailsOpacity(0);
            setVerticalBentoRailsTranslateY(40);
          }

          const { scrollablePx, anchor, milestones } = vbMetrics;
          const sp = Math.max(scrollablePx, 1e-6);
          const scrolled = Math.min(Math.max(-rect.top + anchor, 0), sp);
          const uRaw = scrolled / sp;
          let uMono = vbGateVerticalBentoUTimeline(uRaw, milestones, sectionTop, viewportHeight);
          if (bypassEdgeOff) {
            vbMonotonicPrevTopRef.current = sectionTop;
            vbMonotonicPrevURef.current = uMono;
          } else {
            const prevTopMono = vbMonotonicPrevTopRef.current;
            const prevUMono = vbMonotonicPrevURef.current;
            if (prevTopMono !== null && Number.isFinite(prevTopMono)) {
              const deltaTop = sectionTop - prevTopMono;
              if (deltaTop > 0.65) {
                uMono = Math.min(uMono, prevUMono + 1e-9);
              } else if (deltaTop < -0.65) {
                uMono = Math.max(uMono, prevUMono - 1e-9);
              }
            }
          }
          vbMonotonicPrevTopRef.current = sectionTop;

          const uEps = rect.bottom < 0 ? 0.035 : 0.0025;
          setVerticalBentoU((prev) => {
            let next = uMono;
            if (Math.abs(prev - next) < uEps) next = prev;
            vbMonotonicPrevURef.current = next;
            return next;
          });
        }
      }
    };

    const onScrollOrWheel = () => {
      scrollWheelBusyRef.current = true;
      if (scrollQuietTimerRef.current != null) {
        clearTimeout(scrollQuietTimerRef.current);
      }
      scrollQuietTimerRef.current = window.setTimeout(() => {
        scrollQuietTimerRef.current = null;
        scrollWheelBusyRef.current = false;
      }, 110);

      if (scrollEffectsRafRef.current != null) return;
      scrollEffectsRafRef.current = requestAnimationFrame(runScrollEffects);
    };

    runScrollEffects();

    window.addEventListener("scroll", onScrollOrWheel, { passive: true });
    window.addEventListener("wheel", onScrollOrWheel, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScrollOrWheel);
      window.removeEventListener("wheel", onScrollOrWheel);
      if (scrollQuietTimerRef.current != null) {
        clearTimeout(scrollQuietTimerRef.current);
        scrollQuietTimerRef.current = null;
      }
      if (scrollEffectsRafRef.current != null) {
        cancelAnimationFrame(scrollEffectsRafRef.current);
        scrollEffectsRafRef.current = null;
      }
    };
  }, [vbMetrics]);



  useEffect(() => {
    // Add bento expand and sliding animation styles
    const style = document.createElement('style');
    const boxWidth = 700;
    const boxGap = 32;
    const boxTotalWidth = boxWidth + boxGap;
    const totalBoxes = 6;
    const maxScroll = -(boxTotalWidth * (totalBoxes - 1));
    
    style.textContent = `
      @keyframes bentoExpand {
        0% { transform: scale(0.08); opacity: 0; }
        40% { opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes slide-left-continuous {
        0% { transform: translateX(0px); }
        100% { transform: translateX(${maxScroll}px); }
      }
      @keyframes slide-text-right {
        0% { transform: translateX(0px); }
        100% { transform: translateX(2000px); }
      }
    `;
    if (!document.head.querySelector('style[data-slide-animation]')) {
      style.setAttribute('data-slide-animation', 'true');
      document.head.appendChild(style);
    }
  }, []);

  // Dynamic color calculation - modern purple gradient palette (gender-neutral, vibrant)
  const getColor1 = () => {
    const shift = Math.sin(colorShift * Math.PI / 50) * 5;
    return `hsl(${245 + shift}, 85%, ${68 + shift * 0.3}%)`; // Vibrant light blue-purple
  };

  const getColor2 = () => {
    const shift = Math.sin((colorShift + 33) * Math.PI / 50) * 5;
    return `hsl(${250 + shift}, 80%, ${58 + shift * 0.3}%)`; // Vibrant medium blue-purple
  };

  const getColor3 = () => {
    const shift = Math.sin((colorShift + 66) * Math.PI / 50) * 5;
    return `hsl(${255 + shift}, 75%, ${52 + shift * 0.3}%)`; // Vibrant darker blue-purple
  };

  // Sliding boxes gradient - vibrant purple matching screenshot (#7A5AF2 to #5C40E2)
  const getSlidingBoxColor1 = () => {
    const shift = Math.sin(colorShift * Math.PI / 50) * 3;
    return `hsl(${255 + shift}, 85%, ${68 + shift * 0.2}%)`; // Light vibrant purple (#7A5AF2)
  };

  const getSlidingBoxColor2 = () => {
    const shift = Math.sin((colorShift + 33) * Math.PI / 50) * 3;
    return `hsl(${255 + shift}, 80%, ${60 + shift * 0.2}%)`; // Medium vibrant purple
  };

  const getSlidingBoxColor3 = () => {
    const shift = Math.sin((colorShift + 66) * Math.PI / 50) * 3;
    return `hsl(${255 + shift}, 75%, ${57 + shift * 0.2}%)`; // Dark vibrant purple (#5C40E2)
  };

  // Second box gradient - similar but slightly different
  const getSecondBoxColor1 = () => {
    const shift = Math.sin(colorShift * Math.PI / 50) * 5;
    return `hsl(${195 + shift}, 80%, ${68 + shift * 0.3}%)`; // Light blue (slightly shifted)
  };

  const getSecondBoxColor2 = () => {
    const shift = Math.sin((colorShift + 33) * Math.PI / 50) * 5;
    return `hsl(${200 + shift}, 75%, ${58 + shift * 0.3}%)`; // Medium light blue (slightly shifted)
  };

  const getSecondBoxColor3 = () => {
    const shift = Math.sin((colorShift + 66) * Math.PI / 50) * 5;
    return `hsl(${205 + shift}, 70%, ${53 + shift * 0.3}%)`; // Dark light blue (slightly shifted)
  };

  // Second gradient colors - blue-focused palette
  const getSecondGradientColor1 = () => {
    const shift = Math.sin(colorShift * Math.PI / 50) * 4;
    return `hsl(${219 + shift}, 75%, ${65 + shift * 0.3}%)`; // Lighter medium blue
  };

  const getSecondGradientColor2 = () => {
    const shift = Math.sin((colorShift + 33) * Math.PI / 50) * 4;
    return `hsl(${210 + shift}, 75%, ${60 + shift * 0.3}%)`; // Lighter medium blue
  };

  const getSecondGradientColor3 = () => {
    const shift = Math.sin((colorShift + 66) * Math.PI / 50) * 4;
    return `hsl(${220 + shift}, 80%, ${55 + shift * 0.3}%)`; // Lighter deep blue
  };

  // Lighter version of hero gradient for hover boxes (same hue, higher lightness)
  const getHoverColor1 = () => {
    const shift = Math.sin(colorShift * Math.PI / 50) * 5;
    return `hsl(${205 + shift}, 90%, ${75 + shift * 0.3}%)`; // Light cyan-blue
  };

  const getHoverColor2 = () => {
    const shift = Math.sin((colorShift + 33) * Math.PI / 50) * 5;
    return `hsl(${210 + shift}, 85%, ${70 + shift * 0.3}%)`; // Medium blue (lighter)
  };

  const getHoverColor3 = () => {
    const shift = Math.sin((colorShift + 66) * Math.PI / 50) * 5;
    return `hsl(${225 + shift}, 80%, ${65 + shift * 0.3}%)`; // Deep purple-blue (lighter)
  };

  // Sliding box scroll functions — card step uses portrait dimensions on iPhone
  const slideBoxW = isPhoneLayout ? phoneSlideSize.w : 760;
  const slideBoxH = isPhoneLayout ? phoneSlideSize.h : 760;
  const slideGap = isPhoneLayout ? 12 : 32;
  const carouselSlideCount = 6;
  const workflowCarouselActiveIndex = Math.round(workflowCarouselProgress);
  /** Uniform scale only — use max(...) so the 700² design covers the portrait slot (no stretch). */
  const slideUniformScale = Math.max(slideBoxW / 700, slideBoxH / 700);
  const scaledSide = 700 * slideUniformScale;
  const boxTotalWidth = slideBoxW + slideGap;
  /**
   * The inner 700×700 design div is centred inside each card with `overflow:hidden`.
   * On portrait-phone the scaled height > card width, so the left/right edges of the
   * 700px space extend OUTSIDE the visible card.  We compute the minimum left/right
   * offset (in 700px coordinates) needed to stay inside the visible card area, then
   * add a small margin so the text isn't flush against the edge.
   */
  const xStart700 = (slideBoxW - scaledSide) / 2; // negative when card is narrower than scaled content
  const visibleMargin = 22; // desired gap (in card pixels) between card edge and caption
  const captionLeft700 = Math.ceil((visibleMargin - xStart700) / slideUniformScale);
  const captionRight700 = captionLeft700; // symmetric
  /** Shift workflow slide captions slightly right (design px on 700² canvas). */
  const WF_CAPTION_NUDGE_RIGHT_PX = 22;
  const captionLeftWorkflow = captionLeft700 + WF_CAPTION_NUDGE_RIGHT_PX;
  const captionRightWorkflow = Math.max(8, captionRight700 - WF_CAPTION_NUDGE_RIGHT_PX);
  /** Visible width slice of the 700² mock inside each slide card (design px). */
  const slideVisibleWidth700 = Math.max(
    148,
    Math.min(700, Math.round(slideBoxW / slideUniformScale)),
  );
  /** Inbox mock — shrink on narrowest phones so UI + captions stay inside the gradient card. */
  const carouselInboxUiWidth700 = Math.min(
    320,
    Math.max(252, Math.round(slideVisibleWidth700 * 0.92)),
  );
  /** AI Receptionist single “thinking” panel */
  const carouselReceptionThinkingWidth700 = Math.min(
    310,
    Math.max(258, Math.round(slideVisibleWidth700 * 0.84)),
  );
  /** Smart Appointments — wider strip; interior spacing/type tightened below */
  const carouselSmartApptPanelWidth700 = Math.min(
    448,
    Math.max(296, Math.round(slideVisibleWidth700 * 0.985)),
  );
  /** Multi-disciplinary horizontal ribbon */
  const carouselMultidiscRibbonWidth700 = Math.min(
    438,
    Math.max(304, Math.round(slideVisibleWidth700 * 0.96)),
  );
  /** Prior auth overlapping cards (box 5): scale entire composition */
  const priorAuthComposeScale = Math.min(1, Math.max(0.62, slideVisibleWidth700 / 478));
  /** Step transition for workflow carousel (one card at a time, next from the right). */
  const workflowCarouselTransitionMs = 480;

  const advanceWorkflowCarousel = useCallback(
    (delta: 1 | -1) => {
      setWorkflowCarouselProgress((p) => {
        const i = Math.round(p);
        if (delta === 1) return Math.min(carouselSlideCount - 1, i + 1);
        return Math.max(0, i - 1);
      });
    },
    [carouselSlideCount],
  );

  const goWorkflowCarouselNext = useCallback(() => {
    advanceWorkflowCarousel(1);
  }, [advanceWorkflowCarousel]);

  const goWorkflowCarouselPrev = useCallback(() => {
    advanceWorkflowCarousel(-1);
  }, [advanceWorkflowCarousel]);

  useLayoutEffect(() => {
    if (!workflowCarouselSkipMotion) return;
    const id = requestAnimationFrame(() => {
      setWorkflowCarouselSkipMotion(false);
    });
    return () => cancelAnimationFrame(id);
  }, [workflowCarouselProgress, workflowCarouselSkipMotion]);

  // Auto-advance removed — carousel is now driven by scroll position

  const showLeftArrow = true;
  const showRightArrow = true;

  // Load positions, history, and box 2 text from API on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/save-box-positions');
        const data = await response.json();
        if (data.positions) {
          setReportBoxPositions(data.positions);
          latestPositionsRef.current = data.positions;
        }
        if (data.history) {
          setPositionHistory(data.history);
        }
        if (data.box2Title) {
          setBox2Title(data.box2Title);
        }
        if (data.box2Description) {
          setBox2Description(data.box2Description);
        }
      } catch (e) {
        console.error('Failed to load data from API:', e);
      }
    };
    loadData();
  }, []);

  // Keep ref in sync with state
  useEffect(() => {
    latestPositionsRef.current = reportBoxPositions;
  }, [reportBoxPositions]);

  // Update textarea when editing starts
  useEffect(() => {
    if (isEditingBox2Description && descriptionEditRef.current) {
      descriptionEditRef.current.value = box2Description;
      // Set cursor to end
      setTimeout(() => {
        if (descriptionEditRef.current) {
          descriptionEditRef.current.setSelectionRange(
            descriptionEditRef.current.value.length,
            descriptionEditRef.current.value.length
          );
        }
      }, 0);
    }
  }, [isEditingBox2Description, box2Description]);

  // Save function - saves positions, title, and description to codebase via API
  const handleSave = async () => {
    try {
      // Update history
      const newHistory = [...positionHistory, JSON.parse(JSON.stringify(reportBoxPositions))];
      const historyToSave = newHistory.slice(-10); // Keep last 10 states
      setPositionHistory(historyToSave);
      
      // Save everything to codebase via API (positions, title, description)
      const response = await fetch('/api/save-box-positions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          positions: reportBoxPositions,
          history: historyToSave,
          box2Title: box2Title,
          box2Description: box2Description,
          updateCodebase: true, // Update TypeScript file
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save');
      }
      
      // Close editing modes
      setIsEditingBox2Title(false);
      setIsEditingBox2Description(false);
    } catch (e) {
      alert('Failed to save. Please try again.');
    }
  };

  

  

  // Undo function - reverts to previous position from history
  const handleUndo = async () => {
    if (positionHistory.length > 0) {
      const previousPositions = positionHistory[positionHistory.length - 1];
      setReportBoxPositions(previousPositions);
      latestPositionsRef.current = previousPositions;
      
      // Update history
      const newHistory = positionHistory.slice(0, -1);
      setPositionHistory(newHistory);
      
      // Save updated state to codebase via API
      try {
        const response = await fetch('/api/save-box-positions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            positions: previousPositions,
            history: newHistory,
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to save undo state');
        }
      } catch (e) {
        console.error('Failed to save undo state:', e);
        alert('Failed to save undo state. Please try again.');
      }
    }
  };

  builtForYouCarouselTransitioningSinkRef.current = isCarouselTransitioning;
  builtForYouCarouselAdvanceRightRef.current = () => {
    if (builtForYouCarouselTransitioningSinkRef.current) return;
    setIsCarouselTransitioning(true);
    requestAnimationFrame(() => {
      setUiMockupOpacity(0);
      setUiMockupTranslateY(10);
      setUiMockupScale(0.96);
    });
    setCarouselOffset(1);
    window.setTimeout(() => {
      setSelectedWordIndex((prev) => (prev + 1) % 8);
      setCarouselOffset(0);
      requestAnimationFrame(() => {
        setUiMockupOpacity(1);
        setUiMockupTranslateY(0);
        setUiMockupScale(1);
      });
      window.setTimeout(() => {
        setIsCarouselTransitioning(false);
      }, 50);
    }, 400);
  };

  // Calculate if we should show shadow (in hero section, after scrolling a bit)
  const viewportHeight = typeof window !== "undefined" ? appViewport.height : 1000;
  const showNavShadow = scrollY > 100 && scrollY < viewportHeight * 0.9;
  const isSecondSection = scrollY >= viewportHeight * 0.9;
  const showBackgroundBox = scrollY >= viewportHeight * 0.85;
  // Nav bar turns black closer to when beige backdrop shows
  const hitsWhiteBox = scrollY >= viewportHeight * 0.8;
  const isDropdownOpen = activeDropdown !== null;
  /** Nav wordmark after leaving the gradient hero, desktop mega-menu, or iPhone sheet open (hero needs branding in bar). */
  const showNavLogo =
    hitsWhiteBox || isDropdownOpen || (isPhoneLayout && mobileNavOpen);
  const phoneMenuChrome =
    isPhoneLayout && mobileNavOpen;
  const navTextColor =
    isSecondSection || isDropdownOpen || hitsWhiteBox || phoneMenuChrome ? "#000" : "#fff";
  const navTextShadow =
    showNavShadow && !isDropdownOpen && !hitsWhiteBox && !phoneMenuChrome
      ? "0 2px 4px rgba(0, 0, 0, 0.1)"
      : "none";
  const loginButtonBg =
    isSecondSection || isDropdownOpen || hitsWhiteBox ? "#000" : "#fff";
  const loginButtonText =
    isSecondSection || isDropdownOpen || hitsWhiteBox ? "#fff" : "#000";
  const loginButtonShadow =
    showNavShadow && !isDropdownOpen && !hitsWhiteBox ? "0 2px 4px rgba(0, 0, 0, 0.1)" : "none";

  const rootZoom = doeforvcRootZoom(viewportWidth);
  const applyRootZoom =
    isPhoneLayout && Math.abs(rootZoom - 1) > 0.001;
  /** Hero fills visible viewport after CSS `zoom`. */
  const heroLogicalHeightPx = Math.round(
    applyRootZoom ? appViewport.height / rootZoom : appViewport.height,
  );

  const heroSectionProps: HeroSectionProps = {
    heroRevealShellRef,
    heroLogicalHeightPx,
    heroIntroTriggerFineHover,
    runHeroIntroSequence,
    navBarRowRef,
    isPhoneLayout,
    mobileNavOpen,
    showBackgroundBox,
    isDropdownOpen,
    scrollY,
    viewportHeight,
    setActiveDropdown,
    activeDropdown,
    showNavLogo,
    navTextColor,
    navTextShadow,
    loginButtonBg,
    loginButtonText,
    loginButtonShadow,
    setMobileNavOpen,
    hoveredBox,
    setHoveredBox,
    navPortalMounted,
    iphoneMenuTopPx,
    mobileNavFooterCarouselRef,
    setMobileNavFooterSlide,
    mobileNavFooterZoom,
    mobileNavFooterSlide,
    prefersReducedMotionHero,
    heroIntroPhase,
    lora,
    inter,
  };

  const workflowCarouselSectionProps: WorkflowCarouselSectionProps = {
    secondSectionScrollDriverRef,
    secondSectionRef,
    descriptionEditRef,
    heroLogicalHeightPx,
    carouselSlideCount,
    iphoneMenuTopPx,
    rootZoom,
    secondSectionTitleOpacity,
    secondSectionTitleTranslateY,
    slidingBoxesOpacity,
    slidingBoxesTranslateY,
    slideBoxW,
    slideBoxH,
    workflowCarouselActiveIndex,
    workflowCarouselProgress,
    slideUniformScale,
    scaledSide,
    slideVisibleWidth700,
    carouselReceptionThinkingWidth700,
    priorAuthComposeScale,
    carouselSmartApptPanelWidth700,
    carouselMultidiscRibbonWidth700,
    carouselInboxUiWidth700,
    captionLeftWorkflow,
    captionRightWorkflow,
    box2Title,
    box2Description,
    isEditingBox2Title,
    isEditingBox2Description,
    setBox2Title,
    setBox2Description,
    setIsEditingBox2Title,
    setIsEditingBox2Description,
    handleSave,
    handleUndo,
    lora,
  };

  const qualityOrbitSectionProps: QualityOrbitSectionProps = {
    qualityOrbitSectionRef,
    qualityOrbitChoreography,
  };

  const verticalBentoSectionProps: VerticalBentoSectionProps = {
    verticalBentoSectionRef,
    verticalBentoHeadlineRef,
    vbMetrics,
    verticalBentoU,
    verticalBentoTitleOpacity,
    verticalBentoTitleTranslateY,
    verticalBentoRailsOpacity,
    verticalBentoRailsTranslateY,
  };

  const bentoBridgeSectionProps: BentoBridgeSectionProps = {
    bentoBridgeSectionRef,
    bentoBridgeSectionEntered,
    bentoBridgeStage,
    bentoBridgeContentFade,
    bentoBridgeTypedLen,
    bentoBridgeCardIndex,
    bentoBridgeCard,
    setBentoBridgeCardIndex,
    setBentoBridgeTypedLen,
    setBentoBridgeTypewriterOn,
    setBentoBridgeContentFade,
    setBentoBridgeTwEpoch,
  };

  const builtForYouSectionProps: BuiltForYouSectionProps = {
    appViewport,
    carouselSectionRef,
    carouselSectionOpacity,
    carouselSectionTranslateY,
    selectedWordIndex,
    carouselOffset,
    isCarouselTransitioning,
    uiMockupOpacity,
    uiMockupTranslateY,
    uiMockupScale,
    builtForYouCarouselAdvanceRightRef,
    setIsCarouselTransitioning,
    setUiMockupOpacity,
    setUiMockupTranslateY,
    setUiMockupScale,
    setCarouselOffset,
    setSelectedWordIndex,
  };

  if (isMainpageRoute && !isWideDesktop) {
    return (
      <div
        className="min-h-[100dvh] w-full bg-[#F7F6F3]"
        aria-hidden
        suppressHydrationWarning
      />
    );
  }

  return (
    <div
      className={`relative overflow-x-hidden overflow-y-visible overscroll-y-contain${isPhoneLayout ? " doeforvc-iphone-root" : ""}`}
      data-doeforvc-view={isPhoneLayout ? "iphone" : "desktop"}
      style={{
        backgroundColor: "#F7F6F3",
        ...(applyRootZoom ? { zoom: rootZoom } : {}),
      }}
      suppressHydrationWarning
    >
      <HeroSection {...heroSectionProps} />

      {/* Horizontal line at bottom of hero section */}
      <div className="w-full border-t border-[#E6E6E6]" />

      <WorkflowCarouselSection {...workflowCarouselSectionProps} />

      <QualityOrbitSection {...qualityOrbitSectionProps} />

      <VerticalBentoSection {...verticalBentoSectionProps} />

      <BentoBridgeSection {...bentoBridgeSectionProps} />

      <BuiltForYouSection {...builtForYouSectionProps} />

      <InquisaraTeaser />

      <HomeFooter />
    </div>
  );
}
