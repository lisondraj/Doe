"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

const floatingCardClass =
  "absolute rounded-xl bg-white p-4 shadow-[0_16px_30px_rgba(0,0,0,0.22),0_6px_14px_rgba(0,0,0,0.18)] opacity-40 hover:z-40 hover:-translate-y-2 hover:opacity-100 z-10 select-none [&_*]:pointer-events-none [&_*]:select-none max-[480px]:hover:!translate-y-0 max-[480px]:hover:!z-10 max-[480px]:hover:!opacity-40 max-[480px]:p-3 max-[480px]:[&_h3]:text-sm max-[480px]:[&_p]:text-xs max-[480px]:[&_span]:text-[10px] max-[480px]:[&_button]:px-2 max-[480px]:[&_button]:py-1.5 max-[480px]:[&_button]:text-[10px] max-[480px]:[&_.text-base]:text-sm";
/** iPhone: no hover lift / sticky :hover, no taps on decorative buttons (Billing + Schedule cards). */
const iphoneFloatingCardStatic =
  "pointer-events-none cursor-default hover:!translate-y-0 hover:!z-10 hover:!opacity-40";
const previewCardClass =
  "pointer-events-none absolute rounded-lg border border-white/20 bg-white/70 p-2.5 shadow-[0_8px_18px_rgba(0,0,0,0.16)] select-none max-[480px]:p-2";
/** Center headlines — slightly larger on narrow viewports (between old 3xl and prior 6xl) */
const waitlistHeadlineClass =
  "bg-gradient-to-b from-white from-0% via-white via-[66%] to-gray-100 to-100% bg-clip-text text-center text-4xl font-thin leading-tight text-transparent max-[480px]:text-5xl max-[480px]:leading-snug sm:text-5xl md:text-6xl lg:text-7xl";
const STAGE_WIDTH = 1440;
const STAGE_HEIGHT = 900;
/** Fraction of page scroll over which headline story runs (0–1 internal phases); larger = more scroll time per beat. */
const STORY_SCROLL_END = 0.78;
/** Story-phase progress when line 6 is fully visible (fade-in complete). */
const SIXTH_LINE_STORY_END = 0.998;
/**
 * Extra page scroll (0–1) after line 6 is on screen before card explosion starts —
 * hold “It’s to take care of your patients” before fly-out.
 */
const SIXTH_HOLD_BEFORE_EXPLODE_SCROLL = 0.095;
/** Page scroll position where explosion motion begins (after sixth-line hold). */
const EXPLODE_SCROLL_START =
  SIXTH_LINE_STORY_END * STORY_SCROLL_END + SIXTH_HOLD_BEFORE_EXPLODE_SCROLL;
/** Min scroll (0–1) left after explosion for sixth fade-out + Doe; must stay > 0. */
const POST_CTA_SCROLL = 0.082;
/** After cards are gone: hold sixth headline full, then fade it out over scroll before Doe. */
const SIXTH_HOLD_AFTER_EXPLODE_SCROLL = 0.024;
const SIXTH_LINE_FADE_OUT_SCROLL = 0.036;
/** Explosion band width; if `Math.max(0.06, …)` hid a negative value, `explodeProgress` could never reach 1. */
const EXPLODE_SCROLL_RANGE = Math.max(
  0.05,
  1 - EXPLODE_SCROLL_START - POST_CTA_SCROLL,
);
/** Scroll progress where explosion finishes; clamp so layout math never exceeds page. */
const EXPLODE_END_SCROLL = Math.min(1, EXPLODE_SCROLL_START + EXPLODE_SCROLL_RANGE);
/** >1: same scroll advances flight more slowly (gentler explode-out). */
const EXPLODE_MOTION_POW = 1.22;

type HeroCardKind = "diag" | "report" | "inbox";

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [stageScale, setStageScale] = useState(1);
  const [ctaDoeOpaqueLocked, setCtaDoeOpaqueLocked] = useState(false);
  const [heroOpen, setHeroOpen] = useState<HeroCardKind | null>(null);
  const [heroExpanded, setHeroExpanded] = useState(false);
  const [isIPhone, setIsIPhone] = useState(false);
  const [heroRect, setHeroRect] = useState<{ left: number; top: number; width: number; height: number } | null>(null);
  /** Layout box of the card (CSS px) — same as on-canvas so line breaks & spacing match */
  const [heroLayout, setHeroLayout] = useState<{ w: number; h: number } | null>(null);
  const diagCardRef = useRef<HTMLDivElement>(null);
  const reportCardRef = useRef<HTMLDivElement>(null);
  const inboxCardRef = useRef<HTMLDivElement>(null);
  const closeHero = useCallback(() => {
    setHeroExpanded(false);
    setTimeout(() => {
      setHeroOpen(null);
      setHeroRect(null);
      setHeroLayout(null);
    }, 550);
  }, []);

  const openHero = (kind: HeroCardKind) => {
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 480px)").matches) return;
    const ref = kind === "diag" ? diagCardRef : kind === "report" ? reportCardRef : inboxCardRef;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setHeroLayout({ w: el.offsetWidth, h: el.offsetHeight });
    setHeroRect({ left: r.left, top: r.top, width: r.width, height: r.height });
    setHeroOpen(kind);
    requestAnimationFrame(() => requestAnimationFrame(() => setHeroExpanded(true)));
  };

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 480px)");
    const onViewportChange = () => {
      if (mq.matches) closeHero();
    };
    mq.addEventListener("change", onViewportChange);
    return () => mq.removeEventListener("change", onViewportChange);
  }, [closeHero]);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setIsIPhone(/iPhone/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    const updateScale = () => {
      const fitScale = Math.min(window.innerWidth / STAGE_WIDTH, window.innerHeight / STAGE_HEIGHT);
      // Keep the same "zoomed out" look while remaining consistent across desktop sizes.
      setStageScale(Math.max(0.68, Math.min(fitScale * 0.88, 1)));
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const reveal = (delay: number): React.CSSProperties => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0px)" : "translateY(10px)",
    transition: `opacity 0.9s ease ${delay}s, transform 0.9s ease ${delay}s`,
  });

  const clamp = (v: number, min = 0, max = 1) => Math.min(Math.max(v, min), max);
  const storyProgress = clamp(scrollProgress / STORY_SCROLL_END, 0, 1);
  const storyPhase = (start: number, end: number) => clamp((storyProgress - start) / (end - start));
  /** Linear explosion phase; snap to 1 once past end so float / subpixel scroll never stalls the waitlist. */
  const explodeProgress =
    scrollProgress <= EXPLODE_SCROLL_START
      ? 0
      : scrollProgress >= EXPLODE_END_SCROLL
        ? 1
        : clamp((scrollProgress - EXPLODE_SCROLL_START) / EXPLODE_SCROLL_RANGE, 0, 1);
  /**
   * 0 at explosion complete, 1 at bottom — drives waitlist Doe / lift / buttons so reveals track
   * scroll instead of progress from the story boundary (which snapped when the CTA first mounted).
   */
  const postCtaBand = 1 - EXPLODE_END_SCROLL;
  const ctaPostExplode = (() => {
    if (scrollProgress < EXPLODE_END_SCROLL) return 0;
    if (postCtaBand <= 1e-5) return 1;
    return clamp((scrollProgress - EXPLODE_END_SCROLL) / postCtaBand, 0, 1);
  })();
  /** Sixth line stays through explosion + hold, then fades out on scroll before Doe. */
  const sixthLineHoldEndScroll = EXPLODE_END_SCROLL + SIXTH_HOLD_AFTER_EXPLODE_SCROLL;
  const sixthTextGoneScroll = sixthLineHoldEndScroll + SIXTH_LINE_FADE_OUT_SCROLL;
  const sixthPostExplodeOpacity =
    scrollProgress < sixthLineHoldEndScroll
      ? 1
      : scrollProgress >= sixthTextGoneScroll
        ? 0
        : 1 -
          (scrollProgress - sixthLineHoldEndScroll) /
            Math.max(SIXTH_LINE_FADE_OUT_SCROLL, 1e-5);
  /** Doe / waitlist only after sixth headline has scrolled away. */
  const doeScrollRevealLinear = clamp(
    (scrollProgress - sixthTextGoneScroll) / Math.max(1e-5, 1 - sixthTextGoneScroll),
    0,
    1,
  );
  const smoothReveal = (t: number) => {
    const x = clamp(t, 0, 1);
    return x * x * (3 - 2 * x);
  };
  /** Headline stack eases up with Doe reveal (post–sixth line). */
  const ctaTextLift = smoothReveal(clamp(doeScrollRevealLinear / 0.88, 0, 1));
  const ctaDoeOpacity =
    ctaDoeOpaqueLocked
      ? 1
      : scrollProgress < sixthTextGoneScroll
        ? 0
        : smoothReveal(doeScrollRevealLinear);
  /** Buttons trail Doe. */
  const ctaButtonsRevealLinear = clamp((doeScrollRevealLinear - 0.32) / 0.68, 0, 1);
  const ctaButtonsReveal = smoothReveal(ctaButtonsRevealLinear);
  /** Lines 1–5 fade with exploding UI; line 6 uses its own scroll-out. */
  const headlineExplodeFade = 1 - Math.min(1, explodeProgress * 1.2);

  // Longer scroll fades + longer holds between lines (storyProgress 0–1)
  // Line 1: long hold, slower fade out
  const firstFadeProgress = storyPhase(0.12, 0.2);
  // Line 2 — ~0.11 in / ~0.10 out
  const secondInProgress = storyPhase(0.22, 0.33);
  const secondOutProgress = storyPhase(0.335, 0.435);
  // Line 3 — ~0.11 in / ~0.08 out
  const thirdInProgress = storyPhase(0.445, 0.555);
  const thirdOutProgress = storyPhase(0.555, 0.635);
  // Line 4 — ~0.09 in / ~0.08 out
  const fourthInProgress = storyPhase(0.645, 0.735);
  const fourthOutProgress = storyPhase(0.735, 0.815);
  // Line 5 (“millions of phone calls”) — match line 2–3: ~0.11 in, ~0.08 out
  const fifthInProgress = storyPhase(0.825, 0.935);
  const fifthOutProgress = storyPhase(0.935, 0.996);
  // Line 6: must start after line 5 fade-out ends (0.996) or both sit at full opacity stacked
  const sixthFadeProgress = storyPhase(0.996, SIXTH_LINE_STORY_END);
  const sixthLineOpacity = sixthFadeProgress;

  /**
   * `progressDelay` staggers hero cards on linear scroll progress.
   * `baseOpacity` caps peak opacity during explode so dim cards never jump to full opacity.
   * `staticRotDeg` must match the card’s Tailwind `rotate-*` so inline `transform` doesn’t snap the card to 0° when the explosion starts.
   */
  const explodeStyle = (
    dx: number,
    dy: number,
    spinRotDeg = 0,
    progressDelay = 0,
    baseOpacity = 1,
    staticRotDeg = 0,
  ): React.CSSProperties => {
    if (explodeProgress === 0) return {};
    const tLinear =
      progressDelay > 0
        ? clamp((explodeProgress - progressDelay) / (1 - progressDelay), 0, 1)
        : explodeProgress;
    if (tLinear === 0) return {};
    const t = Math.pow(tLinear, EXPLODE_MOTION_POW);
    const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const fade = Math.max(0, 1 - eased * 2.15);
    const angleDeg = staticRotDeg + spinRotDeg * eased;
    return {
      transform: `translate(${dx * eased}px, ${dy * eased}px) rotate(${angleDeg}deg) scale(${Math.max(0, 1 - eased * 0.34)})`,
      opacity: Math.max(0, baseOpacity * fade),
      // No CSS transition — motion follows scroll; CSS transitions made floating cards lag preview cards.
      transition: "none",
      pointerEvents: "none" as const,
    };
  };

  const firstLineOpacity  = 1 - firstFadeProgress;
  const secondLineOpacity = secondInProgress * (1 - secondOutProgress);
  const thirdLineOpacity  = thirdInProgress  * (1 - thirdOutProgress);
  const fourthLineOpacity = fourthInProgress * (1 - fourthOutProgress);
  const fifthLineOpacity = fifthInProgress * (1 - fifthOutProgress);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) {
        setScrollProgress(0);
        return;
      }
      // Browsers often stop a few px short of maxScroll; treat as full progress so explosion + CTA can finish.
      const y = window.scrollY;
      const nearBottom = y >= maxScroll - 3;
      const progress = nearBottom ? 1 : Math.min(Math.max(y / maxScroll, 0), 1);
      setScrollProgress(progress);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (scrollProgress < sixthTextGoneScroll || scrollProgress <= STORY_SCROLL_END) {
      setCtaDoeOpaqueLocked(false);
      return;
    }
    if (doeScrollRevealLinear >= 0.55) {
      setCtaDoeOpaqueLocked(true);
    }
  }, [scrollProgress, sixthTextGoneScroll, doeScrollRevealLinear]);

  return (
    <div className="relative min-h-[460vh] overflow-x-hidden">
      {/* iPhone: extend past viewport + use dvh so gradient covers safe areas / dynamic toolbar gaps */}
      <div
        className="fixed left-0 right-0 top-0 bottom-0 z-0 overflow-hidden max-[480px]:-top-[max(3rem,env(safe-area-inset-top,0px))] max-[480px]:-bottom-[max(3rem,env(safe-area-inset-bottom,0px))] max-[480px]:min-h-[100dvh]"
      >
      {/* Sliding-box gradient fills the full page */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #E7A944 0%, #D49D4F 30%, #D2774C 60%, #1E343A 100%)",
        }}
      />

      {/* Grain overlay (same treatment used on sliding boxes) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
          opacity: 1,
          mixBlendMode: "overlay",
        }}
      />

      {/* Line overlay switched to soft contour curves */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg
          className="absolute inset-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid slice"
        >
          <path d="M -80 180 C 160 60, 360 60, 620 180 S 1080 300, 1280 180" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.1" />
          <path d="M -80 280 C 140 170, 360 170, 620 290 S 1080 410, 1280 290" fill="none" stroke="rgba(255,255,255,0.095)" strokeWidth="1.1" />
          <path d="M -80 390 C 120 290, 360 290, 620 410 S 1080 530, 1280 410" fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="1.05" />
          <path d="M -80 500 C 100 410, 360 410, 620 530 S 1080 650, 1280 530" fill="none" stroke="rgba(255,255,255,0.085)" strokeWidth="1.05" />
          <path d="M -80 610 C 120 530, 360 530, 620 650 S 1080 770, 1280 650" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <path d="M -80 720 C 140 650, 360 650, 620 770 S 1080 890, 1280 770" fill="none" stroke="rgba(255,255,255,0.075)" strokeWidth="1" />
          <path d="M -80 830 C 160 770, 360 770, 620 890 S 1080 1010, 1280 890" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.95" />
        </svg>
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-30 flex flex-col items-center justify-end pb-8 font-ui"
        style={{
          opacity: firstLineOpacity * (mounted ? 1 : 0) * (1 - Math.min(1, explodeProgress * 1.5)),
          transition: "none",
        }}
      >
        <div
          className="absolute bottom-0 left-0 right-0 h-44"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 100%)" }}
        />
        <div className="relative z-10 flex flex-col items-center gap-2">
          <span className="text-xs font-medium uppercase text-white/60 max-[480px]:text-[10px]" style={{ letterSpacing: "0.2em" }}>
            scroll
          </span>
          <svg
            width="20"
            height="28"
            viewBox="0 0 20 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="animate-bounce"
            style={{ animationDuration: "1.4s" }}
          >
            <rect x="1" y="1" width="18" height="26" rx="9" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
            <rect x="8.5" y="5" width="3" height="6" rx="1.5" fill="rgba(255,255,255,0.7)" />
          </svg>
        </div>
      </div>

      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: `${STAGE_WIDTH}px`,
          height: `${STAGE_HEIGHT}px`,
          transform: `translate(-50%, -50%) scale(${stageScale})`,
          transformOrigin: "center center",
        }}
      >

      <div
        className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
        style={{
          opacity: mounted ? 1 : 0,
          transform: "translateY(0px)",
          transition: "none",
        }}
      >
        <div className="relative">
          <h1
            className={waitlistHeadlineClass}
            style={{
              fontFamily: "var(--font-lora), serif",
              textShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
              opacity: firstLineOpacity * headlineExplodeFade,
              transform: `translateY(${-14 * firstFadeProgress}px)`,
            }}
          >
            <span className="block">Doe knows why you went</span>
            <span className="block">to medical school.</span>
          </h1>

          <h2
            className={`absolute inset-0 flex items-center justify-center ${waitlistHeadlineClass}`}
            style={{
              fontFamily: "var(--font-lora), serif",
              textShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
              opacity: secondLineOpacity * headlineExplodeFade,
              transform: `translateY(${20 - 20 * secondInProgress}px)`,
            }}
          >
            It&apos;s not to do paperwork.
          </h2>

          <h2
            className={`absolute inset-0 flex items-center justify-center ${waitlistHeadlineClass}`}
            style={{
              fontFamily: "var(--font-lora), serif",
              textShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
              opacity: thirdLineOpacity * headlineExplodeFade,
              transform: `translateY(${24 - 24 * thirdInProgress}px)`,
            }}
          >
            It&apos;s not to deal with payment denials.
          </h2>

          <h2
            className={`absolute inset-0 flex items-center justify-center ${waitlistHeadlineClass}`}
            style={{
              fontFamily: "var(--font-lora), serif",
              textShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
              opacity: fourthLineOpacity * headlineExplodeFade,
              transform: `translateY(${24 - 24 * fourthInProgress}px)`,
            }}
          >
            It&apos;s not to hunt down pages of lab results.
          </h2>

          <h2
            className={`absolute inset-0 flex items-center justify-center ${waitlistHeadlineClass}`}
            style={{
              fontFamily: "var(--font-lora), serif",
              textShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
              opacity: fifthLineOpacity * headlineExplodeFade,
              transform: `translateY(${24 - 24 * fifthInProgress}px)`,
            }}
          >
            It&apos;s not to answer millions of phone calls.
          </h2>

          <h2
            className={`absolute inset-0 flex items-center justify-center ${waitlistHeadlineClass}`}
            style={{
              fontFamily: "var(--font-lora), serif",
              textShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
              opacity: sixthLineOpacity * sixthPostExplodeOpacity,
              transform: `translateY(${24 - 24 * sixthFadeProgress}px)`,
            }}
          >
            It&apos;s to take care of your patients.
          </h2>
        </div>
      </div>

      {/* Background preview cards: small, faint, dispersed */}
      <div className="pointer-events-none absolute inset-0 z-[6] font-ui" style={reveal(0)}>
        <div className={`${previewCardClass} left-[0%] top-[30%] w-[170px] -rotate-3 opacity-20`} style={explodeStyle(-800, -100, -20, 0, 0.2, -3)}>
          <div className="h-2 w-16 rounded bg-gray-700/40" />
          <div className="mt-2 h-1.5 w-full rounded bg-gray-500/35" />
          <div className="mt-1 h-1.5 w-4/5 rounded bg-gray-500/30" />
        </div>
        <div className={`${previewCardClass} left-[3%] top-[47%] w-[155px] rotate-2 opacity-18`} style={explodeStyle(-700, 300, 10, 0, 0.18, 2)}>
          <div className="h-2 w-12 rounded bg-gray-700/35" />
          <div className="mt-2 h-1.5 w-full rounded bg-gray-500/30" />
          <div className="mt-2 h-5 w-20 rounded bg-gray-700/25" />
        </div>
        <div className={`${previewCardClass} left-[42%] top-[2%] w-[140px] -rotate-2 opacity-14`} style={explodeStyle(100, -800, -8, 0, 0.14, -2)}>
          <div className="h-2 w-14 rounded bg-gray-700/35" />
          <div className="mt-2 h-1.5 w-full rounded bg-gray-500/30" />
          <div className="mt-1 h-1.5 w-3/4 rounded bg-gray-500/25" />
        </div>
        <div className={`${previewCardClass} left-[76%] top-[30%] w-[160px] rotate-3 opacity-19`} style={explodeStyle(700, -300, 15, 0, 0.19, 3)}>
          <div className="h-2 w-20 rounded bg-gray-700/40" />
          <div className="mt-2 h-1.5 w-full rounded bg-gray-500/35" />
          <div className="mt-1 h-1.5 w-5/6 rounded bg-gray-500/30" />
        </div>
        <div className={`${previewCardClass} right-[1%] top-[58%] w-[135px] -rotate-2 opacity-14`} style={explodeStyle(900, 200, -12, 0, 0.14, -2)}>
          <div className="h-2 w-10 rounded bg-gray-700/35" />
          <div className="mt-2 h-1.5 w-full rounded bg-gray-500/30" />
          <div className="mt-2 h-5 w-16 rounded bg-gray-700/25" />
        </div>
        <div className={`${previewCardClass} left-[1%] top-[93%] w-[165px] rotate-2 opacity-17`} style={explodeStyle(-600, 700, 18, 0, 0.17, 2)}>
          <div className="h-2 w-16 rounded bg-gray-700/35" />
          <div className="mt-2 h-1.5 w-full rounded bg-gray-500/30" />
          <div className="mt-1 h-1.5 w-2/3 rounded bg-gray-500/25" />
        </div>
        <div className={`${previewCardClass} left-[52%] top-[94%] w-[150px] -rotate-3 opacity-16`} style={explodeStyle(200, 900, -10, 0, 0.16, -3)}>
          <div className="h-2 w-14 rounded bg-gray-700/35" />
          <div className="mt-2 h-1.5 w-full rounded bg-gray-500/30" />
          <div className="mt-2 h-5 w-14 rounded bg-gray-700/25" />
        </div>
        <div className={`${previewCardClass} right-[5%] top-[94%] w-[165px] rotate-2 opacity-19`} style={explodeStyle(600, 600, 14, 0, 0.19, 2)}>
          <div className="h-2 w-20 rounded bg-gray-700/35" />
          <div className="mt-2 h-1.5 w-full rounded bg-gray-500/30" />
          <div className="mt-1 h-1.5 w-4/5 rounded bg-gray-500/25" />
        </div>
      </div>

      {/* Scattered UI cards — dim until hover, lift on hover */}
      <div className="pointer-events-auto absolute inset-0 z-10 font-ui" style={reveal(0.5)}>
        <div
          ref={inboxCardRef}
          className={`${floatingCardClass} left-[-4%] top-[2%] w-[310px] -rotate-6 max-[480px]:!pointer-events-none max-[480px]:cursor-default cursor-pointer !pointer-events-auto`}
          style={{ ...explodeStyle(-900, -600, -18, 0, 0.4, -6), ...(heroOpen === "inbox" ? { opacity: 0 } : {}) }}
          onClick={() => openHero("inbox")}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">Inbox Summary</h3>
            <span className="text-xs font-semibold text-gray-500">3 new</span>
          </div>
          <div className="space-y-3">
            <div className="rounded-lg border border-gray-100 p-3">
              <p className="text-sm font-semibold text-gray-900">Dr. Sarah Chen</p>
              <p className="mt-1 text-xs font-medium text-gray-600">Patient follow-up request for post-op consultation.</p>
            </div>
            <div className="rounded-lg border border-gray-100 p-3">
              <p className="text-sm font-semibold text-gray-900">Hospital Admin</p>
              <p className="mt-1 text-xs font-medium text-gray-600">Urgent: schedule change for tomorrow&apos;s surgery.</p>
            </div>
          </div>
          <div className="absolute -bottom-1 left-6 right-6 h-2 rounded-full bg-black/10 blur-sm" />
        </div>

        <div
          ref={reportCardRef}
          className={`${floatingCardClass} left-[53%] top-[1%] w-[300px] rotate-4 max-[480px]:!pointer-events-none max-[480px]:cursor-default cursor-pointer !pointer-events-auto md:left-[55%]`}
          style={{ ...explodeStyle(700, -700, 14, 0, 0.4, 4), ...(heroOpen === "report" ? { opacity: 0 } : {}) }}
          onClick={() => openHero("report")}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">Report Queue</h3>
            <span className="text-xs font-semibold text-gray-500">2 pending</span>
          </div>
          <div className="space-y-2 text-xs font-medium text-gray-600">
            <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
              <span>Patient #2847 • CT Chest</span><span>2h ago</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
              <span>Patient #9132 • MRI Brain</span><span>4h ago</span>
            </div>
            <div className="mt-3 flex gap-2">
              <button className="flex-1 rounded-md bg-gray-800 px-3 py-2 text-xs font-semibold text-white">Review</button>
              <button className="flex-1 rounded-md bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700">Defer</button>
            </div>
          </div>
          <div className="absolute -bottom-1 left-6 right-6 h-2 rounded-full bg-black/10 blur-sm" />
        </div>

        <div
          ref={diagCardRef}
          className={`${floatingCardClass} left-[24%] top-[10%] w-[325px] -rotate-2 max-[480px]:!pointer-events-none max-[480px]:cursor-default cursor-pointer !pointer-events-auto`}
          style={{ ...explodeStyle(-300, -800, -10, 0, 0.4, -2), ...(heroOpen === "diag" ? { opacity: 0 } : {}) }}
          onClick={() => openHero("diag")}
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">Diagnostic Assistant</h3>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">Live</span>
          </div>
          <p className="mb-3 text-sm font-medium text-gray-700">Potential interaction flagged between current meds and newly prescribed antibiotic.</p>
          <div className="space-y-2 rounded-lg bg-gray-50 p-3 text-xs font-medium text-gray-600">
            <p>Risk: Moderate (renal function warning)</p>
            <p>Suggestion: Consider dose adjustment and monitor eGFR.</p>
          </div>
          <div className="mt-3 flex gap-2">
            <button className="rounded-md bg-gray-800 px-3 py-2 text-xs font-semibold text-white">Apply Suggestion</button>
            <button className="rounded-md bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700">Dismiss</button>
          </div>
          <div className="absolute -bottom-1 left-6 right-6 h-2 rounded-full bg-black/10 blur-sm" />
        </div>

        <div className={`${floatingCardClass} left-[0%] top-[69%] w-[305px] rotate-3`} style={explodeStyle(-900, 400, -12, 0, 0.4, 3)}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">Referral Intake</h3>
            <span className="text-xs font-semibold text-gray-500">Auto-routed</span>
          </div>
          <div className="space-y-2 text-xs font-medium text-gray-600">
            <div className="rounded-lg border border-gray-100 px-3 py-2">Cardiology consult → Dr. Alvarez</div>
            <div className="rounded-lg border border-gray-100 px-3 py-2">ENT follow-up → Sam Rivera, PA</div>
            <div className="rounded-lg border border-gray-100 px-3 py-2">Urgent ortho referral → Trauma desk</div>
          </div>
          <div className="mt-3 h-2 w-full rounded bg-gray-100">
            <div className="h-2 w-4/5 rounded bg-gray-700" />
          </div>
          <div className="absolute -bottom-1 left-6 right-6 h-2 rounded-full bg-black/10 blur-sm" />
        </div>

        <div
          className={`${floatingCardClass} left-[50%] top-[65%] w-[305px] -rotate-4 md:left-[52%] ${isIPhone ? iphoneFloatingCardStatic : ""}`}
          style={explodeStyle(800, 500, 15, 0, 0.4, -4)}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">Billing Snapshot</h3>
            <span className="text-xs font-semibold text-gray-500">Updated</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-medium text-gray-700">
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-[11px] text-gray-500">Claims Submitted</p>
              <p className="mt-1 text-base font-bold text-gray-900">148</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-[11px] text-gray-500">Denials</p>
              <p className="mt-1 text-base font-bold text-gray-900">12</p>
            </div>
          </div>
          <p className="mt-3 text-xs font-medium text-gray-600">Denials surfaced with suggested appeal language and payer references.</p>
          <div className="absolute -bottom-1 left-6 right-6 h-2 rounded-full bg-black/10 blur-sm" />
        </div>

        <div
          className={`${floatingCardClass} left-[28%] top-[81%] w-[325px] rotate-2 ${isIPhone ? iphoneFloatingCardStatic : ""}`}
          style={explodeStyle(-100, 900, 8, 0, 0.4, 2)}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">Schedule Changes</h3>
            <span className="text-xs font-semibold text-gray-500">Today</span>
          </div>
          <div className="space-y-2 text-xs font-medium text-gray-600">
            <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
              <span>Knee surgery moved</span><span>09:00 → 10:30</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
              <span>Post-op consult moved</span><span>14:00 → 15:00</span>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button type="button" className="flex-1 rounded-md bg-gray-800 px-3 py-2 text-xs font-semibold text-white">
              Notify Team
            </button>
            <button type="button" className="flex-1 rounded-md bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700">
              View Timeline
            </button>
          </div>
          <div className="absolute -bottom-1 left-6 right-6 h-2 rounded-full bg-black/10 blur-sm" />
        </div>

        {/* 7th card — anchors the right edge */}
        <div className={`${floatingCardClass} right-[0%] top-[8%] w-[325px] rotate-3 max-md:right-[1%] max-md:top-[20%] max-md:w-[290px]`} style={explodeStyle(900, -500, 20, 0, 0.4, 3)}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">Active Sessions</h3>
            <span className="text-xs font-semibold text-gray-500">Live</span>
          </div>
          <div className="space-y-2 text-xs font-medium text-gray-600">
            <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
              <span>Dr. Chen reviewing</span>
              <span className="text-gray-500">247 files</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
              <span>Pattern detected</span>
              <span className="text-gray-500">3 insights</span>
            </div>
            <div className="rounded-lg border border-gray-100 px-3 py-2">
              Queue stable — next sync in <span className="font-semibold text-gray-800">12m</span>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button type="button" className="flex-1 rounded-md bg-gray-800 px-3 py-2 text-xs font-semibold text-white">
              Open
            </button>
            <button type="button" className="flex-1 rounded-md bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700">
              Details
            </button>
          </div>
          <div className="absolute -bottom-1 left-6 right-6 h-2 rounded-full bg-black/10 blur-sm" />
        </div>

        {/* 8th card — bottom right */}
        <div
          className={`${floatingCardClass} bottom-[7%] right-[2%] w-[290px] -rotate-2 max-md:bottom-[8%] max-md:right-[2%] max-md:w-[260px]`}
          style={explodeStyle(800, 700, -16, 0, 0.4, -2)}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">Lab &amp; Imaging</h3>
            <span className="text-xs font-semibold text-gray-500">New</span>
          </div>
          <div className="space-y-2 text-xs font-medium text-gray-600">
            <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
              <span>CBC + metabolic panel</span>
              <span className="text-gray-500">Ready</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
              <span>MRI lumbar — contrast</span>
              <span className="text-amber-700">Review</span>
            </div>
            <div className="rounded-lg border border-gray-100 px-3 py-2">
              2 results auto-linked to today&apos;s encounters.
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button type="button" className="flex-1 rounded-md bg-gray-800 px-3 py-2 text-xs font-semibold text-white">
              Open chart
            </button>
            <button type="button" className="flex-1 rounded-md bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700">
              Archive
            </button>
          </div>
          <div className="absolute -bottom-1 left-6 right-6 h-2 rounded-full bg-black/10 blur-sm" />
        </div>
        </div>

      {explodeProgress >= 1 && (
        <div className="pointer-events-none absolute inset-0 z-[22] flex items-center justify-center">
          <div
            className="flex max-w-lg flex-col items-center px-6 text-center"
            style={{
              transform: `translateY(${(1 - ctaTextLift) * 26 - ctaTextLift * 14}px)`,
              transition: "none",
            }}
          >
            <h2
              className={waitlistHeadlineClass}
              style={{
                fontFamily: "var(--font-lora), serif",
                opacity: ctaDoeOpacity,
                textShadow: "0 8px 20px rgba(0,0,0,0.35)",
                transition: "none",
              }}
            >
              Doe
            </h2>
            <div
              className="mt-10 flex flex-col items-center sm:mt-12"
              style={{
                opacity: ctaButtonsReveal,
                transform: `translateY(${(1 - ctaButtonsReveal) * 32 + 12}px)`,
                pointerEvents: ctaButtonsReveal > 0.18 ? "auto" : "none",
                transition: "none",
              }}
            >
              <div className="flex flex-col gap-5 font-ui sm:flex-row sm:gap-6">
                <div className="relative">
                  <a
                    href="https://form.typeform.com/to/JKpekoCE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pointer-events-auto relative z-[1] flex min-h-[112px] min-w-[112px] items-center justify-center rounded-2xl bg-white px-6 py-5 text-base font-semibold text-gray-900 shadow-[0_14px_32px_rgba(0,0,0,0.22)] transition hover:shadow-[0_18px_40px_rgba(0,0,0,0.28)] sm:min-h-[124px] sm:min-w-[124px]"
                  >
                    Provider
                  </a>
                  <div
                    className="pointer-events-none absolute -bottom-2 left-1/2 z-0 h-3 w-[78%] -translate-x-1/2 rounded-full bg-black/20 blur-md"
                    aria-hidden
                  />
                </div>
                <div className="relative">
                  <a
                    href="https://form.typeform.com/to/PXM9TKk7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pointer-events-auto relative z-[1] flex min-h-[112px] min-w-[112px] items-center justify-center rounded-2xl bg-white px-6 py-5 text-base font-semibold text-gray-900 shadow-[0_14px_32px_rgba(0,0,0,0.22)] transition hover:shadow-[0_18px_40px_rgba(0,0,0,0.28)] sm:min-h-[124px] sm:min-w-[124px]"
                  >
                    Student
                  </a>
                  <div
                    className="pointer-events-none absolute -bottom-2 left-1/2 z-0 h-3 w-[78%] -translate-x-1/2 rounded-full bg-black/20 blur-md"
                    aria-hidden
                  />
                </div>
              </div>
              <p
                className="mt-9 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/90 sm:mt-10 sm:text-xs font-ui"
                style={{ textShadow: "0 2px 14px rgba(0,0,0,0.35)" }}
              >
                Join waitlist
              </p>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Hero card modals — Diagnostic Assistant, Report Queue, Inbox Summary */}
      {heroOpen && heroRect && heroLayout && (() => {
        const W = heroLayout.w;
        const H = heroLayout.h;
        const idleScale = heroRect.width / W;
        const openScale = Math.max(1, idleScale);
        const cx = heroRect.left + heroRect.width / 2;
        const cy = heroRect.top + heroRect.height / 2;
        const expandedLeft = window.innerWidth * 0.25 - W / 2;
        const expandedTop = window.innerHeight / 2 - H / 2;
        const idleRotate =
          heroOpen === "diag" ? -2 : heroOpen === "report" ? 4 : -6;

        const heroRightPanel =
          heroOpen === "diag"
            ? {
                kicker: "Powered by Doe",
                title: (
                  <>
                    Caught before
                    <br />
                    it reached the patient.
                  </>
                ),
                body: "Doe monitors every prescription in real time, cross-referencing drug interactions, lab values, and patient history so you never have to.",
                bullets: [
                  "Real-time interaction checks",
                  "Lab-aware dosing suggestions",
                  "Evidence-backed recommendations",
                ],
              }
            : heroOpen === "report"
              ? {
                  kicker: "Powered by Doe",
                  title: (
                    <>
                      Nothing slips through
                      <br />
                      the queue.
                    </>
                  ),
                  body: "Doe prioritizes imaging and reports by acuity, keeps context attached to each study, and makes deferrals and handoffs one tap—so reviews stay fast.",
                  bullets: ["Acuity-aware worklists", "SLA & follow-up nudges", "Defer, assign, or review in place"],
                }
              : {
                  kicker: "Powered by Doe",
                  title: (
                    <>
                      Inbox that
                      <br />
                      runs itself.
                    </>
                  ),
                  body: "One clean queue for high-priority clinical messages, schedule updates, and admin requests. Team context stays attached so replies are instant.",
                  bullets: ["Priority-first sorting", "Shared thread context", "One-click routing"],
                };

        return (
        <>
          <div
            className="fixed inset-0 z-[99] bg-black/60 backdrop-blur-sm"
            style={{ opacity: heroExpanded ? 1 : 0, transition: "opacity 0.5s ease" }}
            onClick={closeHero}
          />

          <div
            className="fixed z-[100] rounded-xl bg-white font-ui shadow-[0_16px_30px_rgba(0,0,0,0.22),0_6px_14px_rgba(0,0,0,0.18)]"
            style={{
              width: W,
              height: H,
              left: heroExpanded ? expandedLeft : cx - W / 2,
              top: heroExpanded ? expandedTop : cy - H / 2,
              transformOrigin: "center center",
              transform: heroExpanded
                ? `scale(${openScale}) rotate(0deg)`
                : `scale(${idleScale}) rotate(${idleRotate}deg)`,
              transition: [
                "left 0.55s cubic-bezier(0.22,1,0.36,1)",
                "top 0.55s cubic-bezier(0.22,1,0.36,1)",
                "transform 0.55s cubic-bezier(0.22,1,0.36,1)",
              ].join(", "),
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-full w-full p-4">
              {heroOpen === "diag" && (
                <>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-base font-bold text-gray-900">Diagnostic Assistant</h3>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">Live</span>
                  </div>
                  <p className="mb-3 text-sm font-medium text-gray-700">Potential interaction flagged between current meds and newly prescribed antibiotic.</p>
                  <div className="space-y-2 rounded-lg bg-gray-50 p-3 text-xs font-medium text-gray-600">
                    <p>Risk: Moderate (renal function warning)</p>
                    <p>Suggestion: Consider dose adjustment and monitor eGFR.</p>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button className="rounded-md bg-gray-800 px-3 py-2 text-xs font-semibold text-white">Apply Suggestion</button>
                    <button className="rounded-md bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700">Dismiss</button>
                  </div>
                </>
              )}
              {heroOpen === "report" && (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-base font-bold text-gray-900">Report Queue</h3>
                    <span className="text-xs font-semibold text-gray-500">2 pending</span>
                  </div>
                  <div className="space-y-2 text-xs font-medium text-gray-600">
                    <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                      <span>Patient #2847 • CT Chest</span>
                      <span>2h ago</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                      <span>Patient #9132 • MRI Brain</span>
                      <span>4h ago</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button className="flex-1 rounded-md bg-gray-800 px-3 py-2 text-xs font-semibold text-white">Review</button>
                      <button className="flex-1 rounded-md bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700">Defer</button>
                    </div>
                  </div>
                </>
              )}
              {heroOpen === "inbox" && (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-base font-bold text-gray-900">Inbox Summary</h3>
                    <span className="text-xs font-semibold text-gray-500">3 new</span>
                  </div>
                  <div className="space-y-3">
                    <div className="rounded-lg border border-gray-100 p-3">
                      <p className="text-sm font-semibold text-gray-900">Dr. Sarah Chen</p>
                      <p className="mt-1 text-xs font-medium text-gray-600">Patient follow-up request for post-op consultation.</p>
                    </div>
                    <div className="rounded-lg border border-gray-100 p-3">
                      <p className="text-sm font-semibold text-gray-900">Hospital Admin</p>
                      <p className="mt-1 text-xs font-medium text-gray-600">Urgent: schedule change for tomorrow&apos;s surgery.</p>
                    </div>
                  </div>
                </>
              )}
              <div className="absolute -bottom-1 left-6 right-6 h-2 rounded-full bg-black/10 blur-sm" />
            </div>
          </div>

          <div
            className="fixed inset-y-0 right-0 z-[100] flex w-[48vw] flex-col justify-center px-16 py-14 font-ui max-[480px]:w-full max-[480px]:px-8 max-[480px]:py-10"
            style={{
              opacity: heroExpanded ? 1 : 0,
              transform: heroExpanded ? "translateX(0)" : "translateX(32px)",
              transition: heroExpanded
                ? "opacity 0.2s ease 0.14s, transform 0.2s cubic-bezier(0.22,1,0.36,1) 0.14s"
                : "opacity 0.12s ease, transform 0.12s cubic-bezier(0.22,1,0.36,1)",
              pointerEvents: heroExpanded ? "auto" : "none",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/50 max-[480px]:mb-2 max-[480px]:text-[10px]">{heroRightPanel.kicker}</p>
            <h3
              className={
                heroOpen === "inbox"
                  ? "mb-5 text-5xl font-thin leading-[1.02] tracking-tight text-white max-[480px]:mb-4 max-[480px]:text-4xl max-[480px]:leading-tight"
                  : "mb-5 text-4xl font-thin leading-snug text-white max-[480px]:mb-4 max-[480px]:text-3xl max-[480px]:leading-snug"
              }
              style={heroOpen === "inbox" ? undefined : { fontFamily: "var(--font-lora), serif" }}
            >
              {heroRightPanel.title}
            </h3>
            <p className="mb-8 max-w-sm text-base font-light leading-relaxed text-white/70 max-[480px]:mb-6 max-[480px]:text-sm max-[480px]:leading-relaxed">{heroRightPanel.body}</p>
            <div className="space-y-4 max-[480px]:space-y-3">
              {heroRightPanel.bullets.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div
                    className={
                      heroOpen === "diag"
                        ? "h-1.5 w-1.5 rounded-full bg-emerald-400"
                        : heroOpen === "report"
                          ? "h-1.5 w-1.5 rounded-full bg-sky-400"
                          : "h-1.5 w-1.5 rounded-full bg-violet-400"
                    }
                  />
                  <span className="text-sm font-medium text-white/80 max-[480px]:text-xs">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="fixed right-6 top-6 z-[101] flex h-9 w-9 items-center justify-center rounded-full bg-white/10 font-ui text-white transition hover:bg-white/20"
            style={{ opacity: heroExpanded ? 1 : 0, transition: "opacity 0.3s ease 0.4s" }}
            onClick={closeHero}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </>
        );
      })()}

      </div>
      <div aria-hidden="true" className="h-[280vh]" />
    </div>
  );
}
