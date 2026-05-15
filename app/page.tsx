"use client";

import { Lora, Inter } from "next/font/google";
import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import type { ReactElement } from "react";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

import Link from "next/link";
import {
  dropdownContent,
  MOBILE_NAV_FOOTER_SLIDES,
  MobileNavFooterShapeIcon,
  NAV_ITEMS,
} from "@/components/doe-nav-data";
import { doeforvcRootZoom } from "@/lib/doeforvc-zoom";

/** Bottom title pill + description inside 700×700 slide mocks (scales with card transform). */
/** Position (left/right) is applied via inline style — computed from slide scale so captions
 *  are always inside the visible card area even on portrait-phone where the inner 700px div overflows. */
const slideCaptionWrap =
  "absolute bottom-9 z-[5] flex flex-col items-start gap-2.5 pointer-events-auto iphone-page:bottom-11";
const slideCaptionBadge =
  "inline-flex max-w-[calc(100%-2px)] shrink-0 items-center rounded-full border border-white/95 bg-white/5 px-[15px] py-[8px] text-[20px] font-semibold leading-snug tracking-[-0.02em] text-white shadow-[0_2px_14px_rgba(0,0,0,0.14)]";
const slideCaptionBody =
  "w-full min-w-0 max-w-[min(340px,calc(100%-4px))] text-left text-[18px] font-medium leading-[1.48] tracking-[-0.012em] text-white/[0.92] break-words [overflow-wrap:anywhere]";
const slideCaptionFont = { fontFamily: "system-ui, -apple-system, sans-serif" } as const;

/** Same horizontal inset as the fixed nav — hero, headline band, carousel (forced phone layout). */
const narrowHorizontalInset =
  "iphone-page:pl-[max(1.5rem,env(safe-area-inset-left,0px))] iphone-page:pr-[max(1.5rem,env(safe-area-inset-right,0px))]";

/**
 * Vertical bento horizontal inset — applied to scroll container so sticky element
 * inherits the narrowed width (matching carousel gutters).
 * Block (vertical) padding is applied directly on the sticky child, not here.
 */
const VBENTO_CANVAS_PADDING = "px-4 " + narrowHorizontalInset;

/** Scroll-driven vertical bento (between carousel and gradient hero). */
const VB_CLOSED_EXPAND = 0.06;
const VB_INACTIVE_OPACITY = 0.22;

function vbSmoothstep01(t: number): number {
  const x = Math.min(Math.max(t, 0), 1);
  return x * x * (3 - 2 * x);
}

type VerticalBentoMilestonesU = {
  uOpenEnd: number;
  uDw0End: number;
  uSwap01End: number;
  uDw1End: number;
  uSwap12End: number;
  uDw2End: number;
  uExitEnd: number;
};

type VerticalBentoScrollMetrics = {
  vh: number;
  scrollablePx: number;
  /** Section outer min-height in px (includes one viewport of “pin” slack). */
  sectionMinPx: number;
  anchor: number;
  stickyColumnH: number;
  milestones: VerticalBentoMilestonesU;
};

function vbBuildMilestonesU(scrollablePx: number, bandPx: number[]): VerticalBentoMilestonesU {
  let acc = 0;
  const sp = Math.max(scrollablePx, 1e-6);
  const parts = [...bandPx];
  const next = () => {
    const px = parts.shift() ?? 0;
    acc += px;
    return acc / sp;
  };
  return {
    uOpenEnd: next(),
    uDw0End: next(),
    uSwap01End: next(),
    uDw1End: next(),
    uSwap12End: next(),
    uDw2End: next(),
    uExitEnd: next(),
  };
}

function vbDocumentRootPx(): number {
  if (typeof document === "undefined") return 12.8;
  const n = parseFloat(getComputedStyle(document.documentElement).fontSize || "12.8");
  return Number.isFinite(n) && n > 0 ? n : 12.8;
}

/**
 * Visible viewport from `visualViewport` when sane (Safari toolbar / URL bar alignment across devices).
 * Falls back to `innerWidth` / `innerHeight`. Sets logical px used for hero height + CSS vars `--app-vw` / `--app-vh`.
 */
function vbAppViewportPx(): { width: number; height: number } {
  if (typeof window === "undefined") return { width: 1200, height: 800 };
  const vv = window.visualViewport;
  const iw = window.innerWidth;
  const ih = window.innerHeight;
  const w = vv && vv.width > 0 && vv.width <= iw + 16 ? Math.round(vv.width) : iw;
  const h = vv && vv.height >= 240 && vv.height <= ih + 16 ? Math.round(vv.height) : ih;
  return { width: Math.max(w, 280), height: Math.max(h, 320) };
}

function vbResizeViewportHeightPx(): number {
  return vbAppViewportPx().height;
}

/** Pinned stack height vs viewport (`top-[max(5.75rem,...)]`) and symmetric canvas vertical padding (#F7F6F3). Uses real root rem (`html font-size`). */
function vbStickyRailsViewportPx(innerHeightPx: number, innerWidthPx?: number): number {
  const vh = Math.max(innerHeightPx, 320);
  const rp = vbDocumentRootPx();
  const stickyInsetTopPx = Math.round(
    Math.max(5.75 * rp, 4.5 * rp + Math.min(Math.max(vh * 0.058, 30), 58)),
  );
  /** Vertical canvas padding (~px-4 / ~1.5rem phone) deducted top + bottom inside pin. */
  const canvasGutterY = Math.round(1.25 * rp);
  /** Sticky wrapper pt+pb around the rail stack (Tailwind `max-md:` vs md `pt-6`). */
  const w = typeof innerWidthPx === "number" ? innerWidthPx : 1200;
  const narrow = w < 768;
  const stickyWrapPaddingPx = narrow
    ? Math.round(Math.min(Math.max(vh * 0.096, 80), 112))
    : Math.round(Math.min(Math.max(vh * 0.052, 44), 64));
  /** Clears home indicator, Safari bottom chrome overlap, floating URL pill. */
  const bottomChromePx = narrow
    ? Math.round(Math.min(Math.max(vh * 0.048, 28), 56))
    : Math.round(Math.min(Math.max(vh * 0.028, 16), 36));
  return Math.max(
    260,
    Math.round(vh - stickyInsetTopPx - 2 * canvasGutterY - stickyWrapPaddingPx - bottomChromePx),
  );
}

/** Matches `gap-3.5` (0.875rem) applied via `iphone-page:` on rail stack. */
function vbRailsInterGapPx(): number {
  return Math.round(0.875 * vbDocumentRootPx());
}

function vbComputeScrollMetrics(
  innerHeightPx: number,
  railsLayoutHeightPx?: number,
  innerWidthPx?: number,
): VerticalBentoScrollMetrics {
  const vh = Math.max(innerHeightPx, 320);
  const openPx = Math.round(Math.max(vh * 0.82, 400));
  const dwellPx = Math.round(Math.max(vh * 5.05, 2800));
  /** Third rail dwell — long scrub while expanded; rail stays open through exit/tail */
  const dwellLastPx = Math.max(Math.round(dwellPx * 0.92), Math.round(vh * 4.25));
  const swapPx = Math.round(Math.max(vh * 0.62, 420));
  /** Scroll slack after rail 3 dwell while stack stays pinned (rail 3 no longer collapses) */
  const exitPx = Math.round(Math.max(vh * 0.52, 320));
  const tailPx = Math.round(Math.max(vh * 0.42, 260));
  const scrollablePx =
    openPx + dwellPx + swapPx + dwellPx + swapPx + dwellLastPx + exitPx + tailPx;
  const sectionMinPx = scrollablePx + vh;
  const anchor = Math.max(72, Math.min(140, Math.round(vh * 0.095)));
  const railsVhIn = railsLayoutHeightPx ?? vh;
  const stickyColumnH = vbStickyRailsViewportPx(Math.min(vh, railsVhIn), innerWidthPx);
  const milestones = vbBuildMilestonesU(scrollablePx, [
    openPx,
    dwellPx,
    swapPx,
    dwellPx,
    swapPx,
    dwellLastPx,
    exitPx,
    tailPx,
  ]);
  return { vh, scrollablePx, sectionMinPx, anchor, stickyColumnH, milestones };
}

function vbDeriveRails(
  uIn: number,
  ms: VerticalBentoMilestonesU
): { expand: [number, number, number]; opacity: [number, number, number] } {
  const u = Math.min(Math.max(uIn, 0), 1);
  const CLO = VB_CLOSED_EXPAND;

  const segUp = (a: number, b: number): number => {
    if (b <= a) return 1;
    if (u <= a) return 0;
    if (u >= b) return 1;
    return vbSmoothstep01((u - a) / (b - a));
  };
  const segDn = (a: number, b: number): number => {
    if (b <= a) return 0;
    if (u <= a) return 1;
    if (u >= b) return 0;
    return 1 - vbSmoothstep01((u - a) / (b - a));
  };

  let e0 = CLO;
  if (u <= ms.uOpenEnd) e0 = CLO + (1 - CLO) * segUp(0, ms.uOpenEnd);
  else if (u <= ms.uDw0End) e0 = 1;
  else if (u <= ms.uSwap01End) e0 = CLO + (1 - CLO) * segDn(ms.uDw0End, ms.uSwap01End);
  else e0 = CLO;

  let e1 = CLO;
  if (u <= ms.uDw0End) e1 = CLO;
  else if (u <= ms.uSwap01End) e1 = CLO + (1 - CLO) * segUp(ms.uDw0End, ms.uSwap01End);
  else if (u <= ms.uDw1End) e1 = 1;
  else if (u <= ms.uSwap12End) e1 = CLO + (1 - CLO) * segDn(ms.uDw1End, ms.uSwap12End);
  else e1 = CLO;

  let e2 = CLO;
  if (u <= ms.uDw1End) e2 = CLO;
  else if (u <= ms.uSwap12End) e2 = CLO + (1 - CLO) * segUp(ms.uDw1End, ms.uSwap12End);
  else e2 = 1;

  const op = (e: number): number => {
    const denom = Math.max(1 - CLO, 1e-6);
    const t = vbSmoothstep01((e - CLO) / denom);
    return VB_INACTIVE_OPACITY + t * (1 - VB_INACTIVE_OPACITY);
  };

  return { expand: [e0, e1, e2], opacity: [op(e0), op(e1), op(e2)] };
}

/** Normalized scroll progress inside the active milestone slice (fills the skinny bar “within” one phase). */
function vbPhaseLocalProgress(uIn: number, m: VerticalBentoMilestonesU): number {
  const u = Math.min(Math.max(uIn, 0), 1);
  const segs: readonly [number, number][] = [
    [0, m.uOpenEnd],
    [m.uOpenEnd, m.uDw0End],
    [m.uDw0End, m.uSwap01End],
    [m.uSwap01End, m.uDw1End],
    [m.uDw1End, m.uSwap12End],
    [m.uSwap12End, m.uDw2End],
    [m.uDw2End, m.uExitEnd],
  ];
  for (const [a, b] of segs) {
    if (b <= a) continue;
    if (u >= a && u < b) return (u - a) / (b - a);
  }
  if (u >= m.uExitEnd) return 1;
  return 0;
}

/**
 * Blend rail-0 open vs dwell scrub while the stack settles into view (smooth instead of a hard gate jump).
 */
function vbGateVerticalBentoUTimeline(
  uRaw: number,
  ms: VerticalBentoMilestonesU,
  sectionTopPx: number,
  viewportHeightPx: number,
): number {
  const u = Math.min(Math.max(uRaw, 0), 1);
  const openEnd = ms.uOpenEnd;
  if (openEnd <= 1e-12) return u;

  const settleStart = viewportHeightPx * 0.78;
  const settleEnd = viewportHeightPx * 0.52;
  let settle01 = 1;
  if (sectionTopPx >= settleStart) settle01 = 0;
  else if (sectionTopPx <= settleEnd) settle01 = 1;
  else settle01 = vbSmoothstep01((settleStart - sectionTopPx) / Math.max(settleStart - settleEnd, 1e-6));

  const uUnsettled = Math.min(u, openEnd);
  const uSettled = Math.max(u, openEnd);
  return uUnsettled * (1 - settle01) + uSettled * settle01;
}

function vbRailHeightPx(exp: number, collapsedPx: number, expandedMaxPx: number): number {
  const denom = Math.max(1 - VB_CLOSED_EXPAND, 1e-6);
  const t = Math.min(Math.max((exp - VB_CLOSED_EXPAND) / denom, 0), 1);
  return collapsedPx + t * (expandedMaxPx - collapsedPx);
}

/** Which rail is visually dominant — progress track clips to its height. */
function vbDominantRailIndex(exp: readonly [number, number, number]): 0 | 1 | 2 {
  const [e0, e1, e2] = exp;
  if (e0 >= e1 && e0 >= e2) return 0;
  if (e1 >= e2) return 1;
  return 2;
}

/** Vertical bento rails — gradients + overlay motifs aligned with sliding workflow tiles (section 2). */
const VBENTO_WORKFLOW_GRADIENTS: [string, string, string] = [
  "linear-gradient(135deg, #E7A944 0%, #D49D4F 30%, #D2774C 60%, #1E343A 100%)",
  "linear-gradient(180deg, #E7A944 0%, #D49D4F 25%, #D2774C 55%, #1E343A 100%)",
  "linear-gradient(90deg, #1E343A 0%, #D2774C 38%, #D49D4F 68%, #E7A944 100%)",
];
const VBENTO_GRAIN_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`;

/** Six rounded tiles around the quality headline (percent positions; viewBox 400×400). */
const QUALITY_ORBIT_ANCHORS_PCT: ReadonlyArray<{ leftPct: number; topPct: number }> = [
  { leftPct: 50, topPct: 9 },
  { leftPct: 81, topPct: 28.75 },
  { leftPct: 81, topPct: 71.25 },
  { leftPct: 50, topPct: 91 },
  { leftPct: 19, topPct: 71.25 },
  { leftPct: 19, topPct: 28.75 },
];
/** Ovular connector (ellipse in 400×400 viewBox) — hugs the wider tile ring. */
const QUALITY_ORBIT_CONNECTOR_RX = 134;
const QUALITY_ORBIT_CONNECTOR_RY = 162;
/** Gradient fill applied to each orbit tile (lighter original palette). */
const QUALITY_ORBIT_TILE_FILL =
  "linear-gradient(135deg, #E7A944 0%, #D49D4F 28%, #D2774C 62%, #b84e2e 100%)";

/** Ovular connector split into arcs (SVG 400² viewBox) — drawn from apex down both sides simultaneously. */
const QUALITY_ORBIT_ARC_TOP_Y = 200 - QUALITY_ORBIT_CONNECTOR_RY;
const QUALITY_ORBIT_ARC_BOTTOM_Y = 200 + QUALITY_ORBIT_CONNECTOR_RY;
const QUALITY_ORBIT_ARC_RIGHT_D = `M 200 ${QUALITY_ORBIT_ARC_TOP_Y} A ${QUALITY_ORBIT_CONNECTOR_RX} ${QUALITY_ORBIT_CONNECTOR_RY} 0 0 1 200 ${QUALITY_ORBIT_ARC_BOTTOM_Y}`;
const QUALITY_ORBIT_ARC_LEFT_D = `M 200 ${QUALITY_ORBIT_ARC_TOP_Y} A ${QUALITY_ORBIT_CONNECTOR_RX} ${QUALITY_ORBIT_CONNECTOR_RY} 0 0 0 200 ${QUALITY_ORBIT_ARC_BOTTOM_Y}`;

/** Short captions inside each orbit tile (clockwise from top). */
const QUALITY_ORBIT_TILE_LABELS = [
  ["AI Inbox"],
  ["Receptionist"],
  ["Appointment", "Assist"],
  ["Auto-Billing"],
  ["Multi-Specialty"],
  ["Patient Facing"],
] as const;

const QUALITY_ORBIT_CHOREO_HEADLINE_DELAY_MS = 120;
const QUALITY_ORBIT_CHOREO_DIAGRAM_DELAY_MS = 920;
/** Grey connector stroke-dash animation duration — keep in sync with SVG transition below */
const QUALITY_ORBIT_GREY_ARC_DRAW_MS = 3200;
const QUALITY_ORBIT_CHOREO_ACCENT_AFTER_GREY_MS = 180;
/** Brief hold after the section enters view before headline / diagram animations begin. */
const QUALITY_ORBIT_CHOREO_ENTER_PAUSE_MS = 650;
/** Tiles appear clockwise from top (index 0); gap between each tile reveal. */
const QUALITY_ORBIT_TILE_FIRST_MS = 360;
const QUALITY_ORBIT_TILE_STEP_MS = 600;

/** Orbit choreography IO: require this much of the section vertically visible (px), capped for tall viewports */
function qualityOrbitIntersectionMinVisiblePx(viewportHeight: number): number {
  return Math.min(200, Math.max(120, viewportHeight * 0.17));
}

function qualityOrbitMiniIcon(tileIndex: number): ReactElement {
  const svgProps = {
    className: "h-[1.375rem] w-[1.375rem] shrink-0 text-white/95",
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.45,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };
  switch (tileIndex) {
    case 0:
      return (
        <svg {...svgProps}>
          <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
          <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
        </svg>
      );
    case 1:
      return (
        <svg {...svgProps}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      );
    case 2:
      return (
        <svg {...svgProps}>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
    case 3:
      return (
        <svg {...svgProps}>
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      );
    case 4:
      return (
        <svg {...svgProps}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    default:
      return (
        <svg {...svgProps}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
  }
}

/** Effective layout viewport height inside `zoom < 1` canvas (matches `100dvh / zoom` compensation). */
function vbRailsEffectiveInnerHeight(innerWidthPx: number, innerHeightPx: number): number {
  const rz = doeforvcRootZoom(innerWidthPx);
  if (rz < 0.999) return innerHeightPx / rz;
  return innerHeightPx;
}

export default function DoePage() {
  const [gradientAngle, setGradientAngle] = useState(135);
  const [colorShift, setColorShift] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  /** Which top-level nav row is expanded in the phone menu sheet (accordion). */
  const [mobileNavExpandedKey, setMobileNavExpandedKey] = useState<string | null>(null);
  /** Featured strip carousel at bottom of the phone nav sheet */
  const [mobileNavFooterSlide, setMobileNavFooterSlide] = useState(0);
  const mobileNavFooterCarouselRef = useRef<HTMLDivElement>(null);
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
  /** Second-section workflow carousel: one panel at a time (index 0..5). */
  const [workflowCarouselIndex, setWorkflowCarouselIndex] = useState(0);
  /** When true, skip CSS transition (used on index wrap 5↔0). */
  const [workflowCarouselSkipMotion, setWorkflowCarouselSkipMotion] = useState(false);
  /** Full fixed `<nav>` — sheet top aligns to `<nav>` bottom (includes bar underline when menu open). */
  const navBarRowRef = useRef<HTMLElement>(null);
  const [iphoneMenuTopPx, setIphoneMenuTopPx] = useState(88);
  /** Scroll-driven vertical bento (after workflow carousel) */
  const verticalBentoSectionRef = useRef<HTMLDivElement>(null);
  const [verticalBentoU, setVerticalBentoU] = useState(0);
  const [vbMetrics, setVbMetrics] = useState<VerticalBentoScrollMetrics>(() =>
    vbComputeScrollMetrics(800, undefined, 1200),
  );
  const [verticalBentoTitleOpacity, setVerticalBentoTitleOpacity] = useState(0);
  const [verticalBentoTitleTranslateY, setVerticalBentoTitleTranslateY] = useState(40);
  const [verticalBentoRailsOpacity, setVerticalBentoRailsOpacity] = useState(0);
  const [verticalBentoRailsTranslateY, setVerticalBentoRailsTranslateY] = useState(40);
  const verticalBentoHeadlineRef = useRef<HTMLDivElement>(null);
  /** “Only high-quality patient care” orbit — staged scroll-in choreography */
  const qualityOrbitSectionRef = useRef<HTMLElement | null>(null);
  const [qualityOrbitChoreography, setQualityOrbitChoreography] = useState({
    headline: false,
    accent: false,
    /** Orbit pills revealed clockwise from top; 0..6 */
    tilesShown: 0,
  });
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

  /** Phone-only UI path (nav sheet, carousel sizing); layout matches at every viewport via Tailwind `iphone-page:` + root zoom. */
  const isPhoneLayout = true;
  const [viewportWidth, setViewportWidth] = useState(1200);
  /** Visible viewport (matches `visualViewport`); drives hero sizing + `--app-vh` / `--app-vw`. */
  const [appViewport, setAppViewport] = useState({ width: 1200, height: 800 });
  /** Sliding cards on phone: logical px inside zoomed root (= visible px ÷ root zoom). */
  const [phoneSlideSize, setPhoneSlideSize] = useState({ w: 850, h: 1090 });

  useEffect(() => {
    const updateWidth = () => setViewportWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useLayoutEffect(() => {
    const measure = () => {
      const { width: vw, height: vhVis } = vbAppViewportPx();
      setAppViewport({ width: vw, height: vhVis });
      if (typeof document !== "undefined") {
        document.documentElement.style.setProperty("--app-vw", `${vw}px`);
        document.documentElement.style.setProperty("--app-vh", `${vhVis}px`);
      const vv = window.visualViewport;
        if (vv) {
          document.documentElement.style.setProperty("--app-vv-offset-top", `${Math.round(vv.offsetTop)}px`);
        }
      }

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
    measure();
    window.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("scroll", measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("scroll", measure);
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
    window.visualViewport?.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      ro.disconnect();
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
    };
  }, [mobileNavOpen, viewportWidth]);

  useLayoutEffect(() => {
    const ih = typeof window !== "undefined" ? window.innerHeight : 800;
    const vvH = typeof window !== "undefined" ? vbResizeViewportHeightPx() : 800;
    setVbMetrics(
      vbComputeScrollMetrics(
        vvH,
        typeof window !== "undefined" ? vbRailsEffectiveInnerHeight(window.innerWidth, ih) : undefined,
        typeof window !== "undefined" ? window.innerWidth : 1200,
      ),
    );
  }, []);

  useEffect(() => {
    const onResize = () => {
      const ih = window.innerHeight;
      setVbMetrics(
        vbComputeScrollMetrics(
          vbResizeViewportHeightPx(),
          vbRailsEffectiveInnerHeight(window.innerWidth, ih),
          window.innerWidth,
        ),
      );
    };
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("scroll", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("scroll", onResize);
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
    if (!mobileNavOpen) setMobileNavExpandedKey(null);
  }, [mobileNavOpen]);

  useEffect(() => {
    if (!mobileNavOpen) setMobileNavFooterSlide(0);
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
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      // Slowly rotate gradient angle
      setGradientAngle((prev) => (prev + (deltaTime * 0.01)) % 360);
      
      // Shift colors subtly
      setColorShift((prev) => (prev + (deltaTime * 0.02)) % 100);

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      const viewportHeight = vbAppViewportPx().height;
      
      // Calculate second section title fade-in and slide-up animation
      if (secondSectionRef.current) {
        const rect = secondSectionRef.current.getBoundingClientRect();
        const sectionTop = rect.top;
        
        // Start animation when section enters viewport (when top is at 85% of viewport)
        // Complete animation when section is at 60% from top of viewport
        const startPoint = viewportHeight * 0.85;
        const endPoint = viewportHeight * 0.6;
        const distance = startPoint - endPoint;
        
        if (sectionTop <= startPoint && sectionTop >= endPoint) {
          // Section is in animation range
          const progress = (startPoint - sectionTop) / distance;
          const clampedProgress = Math.min(Math.max(progress, 0), 1);
          
          // Fade in: 0 to 1
          setSecondSectionTitleOpacity(clampedProgress);
          // Slide up: 40px to 0px
          setSecondSectionTitleTranslateY(40 * (1 - clampedProgress));
          
          // Sliding boxes animation starts after title animation (at 60% progress)
          // Sliding boxes animation range: 60% to 100% of title animation progress
          if (clampedProgress >= 0.6) {
            const slidingBoxesProgress = (clampedProgress - 0.6) / 0.4; // 0 to 1 when title is 60% to 100%
            const clampedSlidingProgress = Math.min(Math.max(slidingBoxesProgress, 0), 1);
            
            setSlidingBoxesOpacity(clampedSlidingProgress);
            setSlidingBoxesTranslateY(40 * (1 - clampedSlidingProgress));
            
            // Start sliding animation after title animation completes (at 80% progress)
            if (clampedProgress >= 0.8) {
              setShouldStartSlidingAnimation(true);
            }
          } else {
            setSlidingBoxesOpacity(0);
            setSlidingBoxesTranslateY(40);
            setShouldStartSlidingAnimation(false);
          }
        } else if (sectionTop < endPoint) {
          // Section is past animation point - fully visible
          setSecondSectionTitleOpacity(1);
          setSecondSectionTitleTranslateY(0);
          setSlidingBoxesOpacity(1);
          setSlidingBoxesTranslateY(0);
          setShouldStartSlidingAnimation(true);
        } else {
          // Section hasn't reached animation point yet
          setSecondSectionTitleOpacity(0);
          setSecondSectionTitleTranslateY(40);
          setSlidingBoxesOpacity(0);
          setSlidingBoxesTranslateY(40);
          setShouldStartSlidingAnimation(false);
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
        
        if (sectionTop <= startPoint && sectionTop >= endPoint) {
          // Section is in animation range
          const progress = (startPoint - sectionTop) / distance;
          const clampedProgress = Math.min(Math.max(progress, 0), 1);
          
          // Fade in: 0 to 1
          setCarouselSectionOpacity(clampedProgress);
          // Slide up: 40px to 0px
          setCarouselSectionTranslateY(40 * (1 - clampedProgress));
        } else if (sectionTop < endPoint) {
          // Section is past animation point - fully visible
          setCarouselSectionOpacity(1);
          setCarouselSectionTranslateY(0);
        } else {
          // Section hasn't reached animation point yet
          setCarouselSectionOpacity(0);
          setCarouselSectionTranslateY(40);
        }
      }
      
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
        const u = vbGateVerticalBentoUTimeline(uRaw, milestones, sectionTop, viewportHeight);
        setVerticalBentoU((prev) => (Math.abs(prev - u) < 0.0012 ? prev : u));
      }
    };

    // Set initial scroll position on mount
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
      setWorkflowCarouselIndex((i) => {
        if (delta === 1) {
          if (i === carouselSlideCount - 1) {
            setWorkflowCarouselSkipMotion(true);
            return 0;
          }
          return i + 1;
        }
        if (i === 0) {
          setWorkflowCarouselSkipMotion(true);
          return carouselSlideCount - 1;
        }
        return i - 1;
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
  }, [workflowCarouselIndex, workflowCarouselSkipMotion]);

  useEffect(() => {
    if (!shouldStartSlidingAnimation || isSlidingPaused) return;
    const id = window.setInterval(() => {
      advanceWorkflowCarousel(1);
    }, 5000);
    return () => window.clearInterval(id);
  }, [shouldStartSlidingAnimation, isSlidingPaused, advanceWorkflowCarousel, workflowCarouselIndex]);

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
  const applyRootZoom = Math.abs(rootZoom - 1) > 0.001;
  /** Hero fills visible viewport after CSS `zoom`. */
  const heroLogicalHeightPx = Math.round(
    applyRootZoom ? appViewport.height / rootZoom : appViewport.height,
  );
  return (
    <div
      className="relative overflow-x-hidden overflow-y-visible overscroll-none doeforvc-iphone-root"
      data-doeforvc-view="iphone"
      style={{
        backgroundColor: "#F7F6F3",
        ...(applyRootZoom ? { zoom: rootZoom } : {}),
      }}
      suppressHydrationWarning
    >
      {/* Hero Section with Dynamic Gradient */}
      <div
        className="relative overflow-hidden"
        style={{
          minHeight: `${heroLogicalHeightPx}px`,
          height: `${heroLogicalHeightPx}px`,
        }}
      >
        {/* Footer base gradient + line mesh overlay (same as <footer>) */}
        <div className="absolute inset-0">
          <div
            className="pointer-events-none absolute inset-0"
          style={{
            background: `
              linear-gradient(152deg, #1a2e34 0%, #243a40 14%, #3d2f28 32%, #6b442f 48%, #a85a34 62%, #d4893f 76%, #e8b04d 88%, #f2cf7a 100%),
              radial-gradient(ellipse 100% 80% at 50% 110%, rgba(231, 169, 68, 0.55) 0%, transparent 58%),
              radial-gradient(ellipse 55% 45% at 12% 18%, rgba(255, 224, 180, 0.22) 0%, transparent 52%),
              radial-gradient(ellipse 50% 40% at 88% 22%, rgba(210, 119, 76, 0.3) 0%, transparent 55%)
            `,
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 z-[1]"
            style={{
              opacity: 0.55,
              mixBlendMode: "soft-light",
              backgroundImage: `
              repeating-linear-gradient(
                -32deg,
                transparent 0px,
                transparent 11px,
                rgba(255, 255, 255, 0.09) 11px,
                rgba(255, 255, 255, 0.09) 12px
              ),
              repeating-linear-gradient(
                32deg,
                transparent 0px,
                transparent 15px,
                rgba(30, 52, 58, 0.14) 15px,
                rgba(30, 52, 58, 0.14) 16px
              )
            `,
            }}
          />
        </div>
        {/* Navigation Bar */}
        <nav
          ref={navBarRowRef}
          className="fixed top-0 left-0 right-0 z-50 iphone-page:pt-[env(safe-area-inset-top,0px)]"
          style={{ 
            /** Phone + open sheet: solid bar so safe-area + controls aren’t over transparent hero. */
            backgroundColor:
              isPhoneLayout && mobileNavOpen ? "#F7F6F3" : "transparent",
            /** Stable phone chrome height: reserve 1px border slot so opening menu doesn’t shift layout */
            borderBottom:
              isPhoneLayout
                ? mobileNavOpen || showBackgroundBox || isDropdownOpen
                  ? "1px solid #E6E6E6"
                  : "1px solid transparent"
                : showBackgroundBox || isDropdownOpen
                ? "1px solid #E6E6E6"
                : "none",
            transition: "border-bottom 100ms ease-out, border-color 100ms ease-out, background-color 180ms ease-out",
          }}
          onMouseLeave={() => {
            setActiveDropdown(null);
          }}
        >
          {/* Unified background box for hover dropdown */}
          {isDropdownOpen && (
            <div 
              className="absolute inset-0 transition-opacity duration-150 ease-out z-0"
              style={{ 
                backgroundColor: '#F7F6F3',
                opacity: activeDropdown ? 1 : 0,
                borderBottom: '1px solid #E6E6E6'
              }}
            />
          )}
          {/* Background box when close to second section */}
          {showBackgroundBox && !isDropdownOpen && (
            <div 
              className="absolute inset-0 transition-opacity duration-300"
              style={{ 
                backgroundColor: '#F7F6F3',
                opacity: scrollY >= viewportHeight * 0.9 
                  ? 1 
                  : (scrollY - viewportHeight * 0.85) / (viewportHeight * 0.05)
              }}
            />
          )}
          {/* Top bar */}
          <div
            className="px-8 py-6 iphone-page:py-[clamp(0.8125rem,0.52rem+1.55vmin,1.9rem)] iphone-page:px-[max(1.25rem,calc(env(safe-area-inset-left,0px)+2.85vmin))] iphone-page:pr-[max(1.25rem,env(safe-area-inset-right,0px))] flex items-center relative z-10 iphone-page:gap-[clamp(0.45rem,0.35rem+0.85vmin,0.75rem)] justify-end"
          >
            {/* Logo — opacity only (no width collapse) so it fades, not slides */}
            <h1
              className={`absolute top-1/2 -translate-y-1/2 left-8 iphone-page:left-[max(1.25rem,calc(env(safe-area-inset-left,0px)+2.85vmin))] font-normal z-[1] min-w-0 whitespace-nowrap transition-opacity duration-500 ease-out ${lora.className} text-4xl iphone-page:text-[clamp(1.85rem,1.05rem+3.55vmin,3.9rem)] iphone-page:leading-none ${
                showNavLogo ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              aria-hidden={!showNavLogo}
            >
              <Link
                href="/"
                className="text-inherit no-underline"
              style={
                  showNavLogo
                    ? { color: navTextColor, textShadow: navTextShadow }
                    : undefined
              }
            >
              Doe
              </Link>
            </h1>

            {/* Desktop: center Navigation Links */}
            <div className="hidden items-center gap-8 absolute left-1/2 -translate-x-1/2">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="text-sm font-medium transition-all duration-300 flex items-center gap-1 bg-transparent border-none cursor-pointer hover:opacity-70 shrink-0"
                  style={{ color: navTextColor, textShadow: navTextShadow }}
                  onMouseEnter={() => setActiveDropdown(item)}
                >
                  {item}
                  <svg
                    className="w-4 h-4 transition-transform duration-200"
                    style={{ transform: activeDropdown === item ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              ))}
            </div>

            {/* Desktop: Login */}
            <a
              href="#"
              className="hidden text-sm font-semibold px-6 py-2.5 rounded-md hover:opacity-90 transition-all duration-300 shrink-0 items-center"
              style={{
                backgroundColor: loginButtonBg,
                color: loginButtonText,
                boxShadow: loginButtonShadow,
              }}
            >
              Login
            </a>

            {/* iPhone: menu (replaces center links + login) */}
            <button
              type="button"
              className="flex items-center justify-center p-3 iphone-page:p-[clamp(0.625rem,0.38rem+1.35vmin,0.975rem)] rounded-xl transition-colors active:bg-white/15"
              style={{ color: navTextColor }}
              aria-expanded={mobileNavOpen}
              aria-label={mobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
              onClick={() => {
                setMobileNavOpen((wasOpen) => {
                  if (!wasOpen) setActiveDropdown(null);
                  return !wasOpen;
                });
              }}
            >
              {mobileNavOpen ? (
                <svg className="w-9 h-9 iphone-page:w-[clamp(1.8rem,1.2rem+2.65vmin,2.55rem)] iphone-page:h-[clamp(1.8rem,1.2rem+2.65vmin,2.55rem)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-9 h-9 iphone-page:w-[clamp(1.8rem,1.2rem+2.65vmin,2.55rem)] iphone-page:h-[clamp(1.8rem,1.2rem+2.65vmin,2.55rem)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Dropdown Panel — desktop only (phone uses full-screen sheet; no mega panels) */}
          <div
            className={`overflow-hidden transition-all duration-150 ease-out relative z-20 ${isPhoneLayout ? "hidden" : ""}`}
            style={{
              maxHeight: activeDropdown ? "400px" : "0px",
              opacity: activeDropdown ? 1 : 0,
            }}
          >
            {/* Top border line */}
            <div className="mx-8 iphone-page:mx-4 border-t border-gray-200 relative z-30" style={{ borderColor: '#E6E6E6' }} />

            <div className="py-8 iphone-page:py-4">
              <div 
                className={`max-w-[1400px] mx-auto px-8 iphone-page:px-4 flex ${isPhoneLayout ? "flex-col gap-3" : ""}`}
                style={{ gap: isPhoneLayout ? undefined : '24px', height: isPhoneLayout ? 'auto' : '144px' }}
                onMouseLeave={() => setHoveredBox(null)}
              >
                {(() => {
                  let labels;
                  if (activeDropdown === 'Security') {
                    labels = ['HIPAA', 'SOC 2 Type II', 'PHIPA', 'PIPA'];
                  } else if (activeDropdown === 'Students') {
                    labels = ['LADDR', '', '', ''];
                  } else if (activeDropdown === 'Company') {
                    labels = ['VISION', 'CAREERS', 'BLOG', 'INTEGRATION'];
                  } else {
                    labels = ['INBOX', 'FINANCE', 'BRAIN', 'ACADEMICS'];
                  }
                  
                  return [0, 1, 2, 3].map((i) => {
                    const isHovered = hoveredBox === i;
                    const rowFlex = isPhoneLayout
                      ? "none"
                      : hoveredBox === i
                        ? "10 1 0"
                        : hoveredBox !== null
                          ? "2 1 0"
                          : "1 1 0";
                    return (
                      <div
                        key={i}
                        className="rounded-2xl cursor-pointer relative w-full"
                        style={{
                          background: '#E5E5E5',
                          flex: rowFlex,
                          transition: 'flex 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 400ms ease, background 200ms ease',
                          opacity: isPhoneLayout ? 1 : hoveredBox !== null && hoveredBox !== i ? 0.5 : 1,
                          height: isPhoneLayout ? '92px' : '144px',
                          minHeight: isPhoneLayout ? '92px' : undefined,
                        }}
                        onMouseEnter={() => !isPhoneLayout && setHoveredBox(i)}
                        onClick={() => isPhoneLayout && setHoveredBox(isHovered ? null : i)}
                      >
                        {labels[i] && (
                          <div className="absolute bottom-3 left-6 right-6 overflow-hidden">
                            <div className="relative flex items-center" style={{ width: '100%', height: '100%' }}>
                              {/* Original text */}
                              <span 
                                className="font-medium text-black inline-block relative z-10 flex-shrink-0"
                                style={{ 
                                  fontFamily: 'system-ui, -apple-system, sans-serif',
                                  fontSize: isHovered ? '16px' : '14px',
                                  transition: 'font-size 400ms ease',
                                  color: '#000000'
                                }}
                              >
                                {labels[i]}
                              </span>
                              
                              {/* Repeating text when hovered - starts after original */}
                              {isHovered && (
                                <div 
                                  className="absolute whitespace-nowrap"
                                  style={{
                                    left: `${labels[i] ? labels[i].length * 9 + 20 : 0}px`,
                                    top: '0px',
                                    opacity: 0.1
                                  }}
                                >
                                  {Array(100).fill(0).map((_, idx) => (
                                    <span 
                                      key={idx}
                                      className="font-medium text-black inline-block"
                                      style={{ 
                                        fontFamily: 'system-ui, -apple-system, sans-serif',
                                        fontSize: '16px',
                                        marginRight: '20px',
                                        color: '#000000'
                                      }}
                                    >
                                      {labels[i]}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Bottom border line */}
            <div className="mx-8 iphone-page:mx-4 border-b border-gray-200 relative z-30" style={{ borderColor: '#E6E6E6' }} />
          </div>
        </nav>

        {/* iPhone: menu panel below fixed nav (nav stays put; page dims behind) */}
        {isPhoneLayout && mobileNavOpen && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-[40] cursor-pointer bg-black/25 transition-opacity duration-300 ease-out"
              aria-label="Close navigation menu"
              onClick={() => setMobileNavOpen(false)}
            />
            {/*
              Sheet is full-screen (top:0) so CSS-zoom measurement errors can't
              create a hero-peek gap. The nav (z-50) sits on top; the list is
              padded down by iphoneMenuTopPx so content appears right below it.
            */}
            <div
              className="fixed inset-0 z-[45] pointer-events-none"
              role="presentation"
            >
              {/* Beige fill behind the nav chrome area — no gap possible */}
              <div
                className="absolute inset-x-0 top-0 bg-[#F7F6F3] pointer-events-none"
                style={{ height: iphoneMenuTopPx }}
                aria-hidden
              />
              <div
                className="absolute inset-x-0 bottom-0 bg-[#F7F6F3] flex flex-col pointer-events-auto overflow-hidden min-h-0"
                style={{ top: iphoneMenuTopPx }}
                role="dialog"
                aria-modal="true"
                aria-label="Site navigation"
              >
                <nav className="flex flex-col flex-1 min-h-0 overflow-y-auto overscroll-contain">
                  {NAV_ITEMS.map((item) => {
                    const expanded = mobileNavExpandedKey === item;
                    const subs = dropdownContent[item]?.items ?? [];
                    const four = subs.slice(0, 4);
                    return (
                      <div key={item} className="border-b border-[#E6E6E6]">
                    <button
                      type="button"
                          aria-expanded={expanded}
                          className={`flex w-full items-center gap-2.5 iphone-page:gap-[clamp(0.5rem,0.35rem+0.95vmin,0.9rem)] text-left font-medium tracking-[-0.02em] text-gray-900 pl-5 pr-5 iphone-page:pl-[max(1.35rem,calc(env(safe-area-inset-left,0px)+12px+2.4vmin))] iphone-page:pr-[max(1.25rem,env(safe-area-inset-right,0px))] py-4 iphone-page:py-[clamp(0.65rem,0.42rem+1.35vmin,1.2rem)] active:bg-black/[0.04] transition-colors ${inter.className} text-4xl iphone-page:text-[clamp(1.52rem,0.82rem+2.92vmin,3.92rem)] iphone-page:leading-none`}
                          onClick={() =>
                            setMobileNavExpandedKey((k) => (k === item ? null : item))
                          }
                        >
                          <span className="min-w-0">{item}</span>
                          <span className="shrink-0 inline-flex items-center justify-center text-gray-400 self-center" aria-hidden>
                            {expanded ? (
                              <svg
                                className="w-[clamp(0.9375rem,0.5rem+2.85vmin+0.95vw,1.95rem)] h-[clamp(0.9375rem,0.5rem+2.85vmin+0.95vw,1.95rem)] transition-transform duration-200 ease-out"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.4}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M6 9l6 6 6-6" />
                              </svg>
                            ) : (
                              <svg
                                className="w-[clamp(0.9375rem,0.5rem+2.85vmin+0.95vw,1.95rem)] h-[clamp(0.9375rem,0.5rem+2.85vmin+0.95vw,1.95rem)] transition-transform duration-200 ease-out"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.4}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M18 15l-6-6-6 6" />
                              </svg>
                            )}
                          </span>
                        </button>
                        <div
                          className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                        >
                          <div className="overflow-hidden min-h-0">
                            {four.length > 0 && (
                              <div className="flex flex-col pl-5 pr-5 iphone-page:pl-[max(1.35rem,calc(env(safe-area-inset-left,0px)+12px+2.4vmin))] iphone-page:pr-[max(1.25rem,env(safe-area-inset-right,0px))] pb-3 pt-0">
                                {four.map((sub) =>
                                  sub.href ? (
                                    <Link
                                      key={sub.title}
                                      href={sub.href}
                                      className={`block w-full text-left py-3.5 iphone-page:py-[clamp(0.72rem,0.48rem+1.1vmin,1.05rem)] pl-7 iphone-page:pl-[clamp(2.15rem,calc(env(safe-area-inset-left,0px)+32px)+1.95vmin,4.9rem)] text-[1.625rem] iphone-page:text-[clamp(1.2rem,0.72rem+1.95vmin,2.52rem)] leading-snug font-medium text-gray-600 active:bg-black/[0.03] transition-colors ${inter.className}`}
                      onClick={() => setMobileNavOpen(false)}
                    >
                                      {sub.title}
                                    </Link>
                                  ) : (
                                    <button
                                      key={sub.title}
                                      type="button"
                                      className={`w-full text-left py-3.5 iphone-page:py-[clamp(0.72rem,0.48rem+1.1vmin,1.05rem)] pl-7 iphone-page:pl-[clamp(2.15rem,calc(env(safe-area-inset-left,0px)+32px)+1.95vmin,4.9rem)] text-[1.625rem] iphone-page:text-[clamp(1.2rem,0.72rem+1.95vmin,2.52rem)] leading-snug font-medium text-gray-600 active:bg-black/[0.03] transition-colors ${inter.className}`}
                                      onClick={() => setMobileNavOpen(false)}
                                    >
                                      {sub.title}
                    </button>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </nav>
                {/* Footer — swipeable carousel: gradient capsule + outside CTA row per slide */}
                <div
                  className="shrink-0 pb-[max(1rem,calc(env(safe-area-inset-bottom,0px)+10px))] iphone-page:pb-[max(0.9375rem,calc(env(safe-area-inset-bottom,0px)+clamp(10px,1.85vmin,20px)))] pt-4 iphone-page:pt-[clamp(0.75rem,0.52rem+1.05vmin,1.25rem)] border-t border-[#ECEAE6]"
                >
                  <div
                    ref={mobileNavFooterCarouselRef}
                    className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                    style={{ WebkitOverflowScrolling: "touch" }}
                    onScroll={(e) => {
                      const el = e.currentTarget;
                      const w = el.clientWidth;
                      if (w <= 0) return;
                      setMobileNavFooterSlide(
                        Math.min(
                          MOBILE_NAV_FOOTER_SLIDES.length - 1,
                          Math.max(0, Math.round(el.scrollLeft / w))
                        )
                      );
                    }}
                    aria-label="Featured"
                  >
                    {MOBILE_NAV_FOOTER_SLIDES.map((slide) => (
                      <div
                        key={slide.boxTitle}
                        className="w-full min-w-full shrink-0 snap-center px-6 iphone-page:pl-[max(1.35rem,calc(env(safe-area-inset-left,0px)+10px+2vmin))] iphone-page:pr-[max(1.35rem,calc(env(safe-area-inset-right,0px)+8px+1.25vmin))] space-y-3 box-border iphone-page:space-y-[clamp(0.65rem,0.42rem+0.85vmin,1rem)]"
                      >
                        <div className="relative rounded-[1.375rem] iphone-page:rounded-[clamp(1.2rem,1rem+1.4vmin,2.1rem)] overflow-hidden min-h-[30rem] iphone-page:min-h-[clamp(22rem,58vmin,48rem)] shadow-[0_10px_32px_rgba(0,0,0,0.12)]">
                          <div
                            className="absolute inset-0"
                            style={{ background: slide.gradient }}
                            aria-hidden
                          />
                          <div
                            className="pointer-events-none absolute inset-0"
                            style={{
                              opacity: slide.lineOverlay.opacity,
                              mixBlendMode: slide.lineOverlay.mixBlendMode,
                              backgroundImage: slide.lineOverlay.backgroundImage,
                            }}
                            aria-hidden
                          />
                          <div className="absolute left-0 right-0 top-0 z-[4] flex justify-center gap-2.5 iphone-page:gap-[clamp(0.65rem,0.45rem+1vmin,0.95rem)] px-5 pt-10 iphone-page:pt-[clamp(2rem,1.55rem+1.95vmin,3.5rem)] pb-1">
                            {MOBILE_NAV_FOOTER_SLIDES.map((s, dotI) => (
                              <button
                                key={s.boxTitle}
                                type="button"
                                aria-label={`Show ${s.boxTitle}`}
                                aria-current={mobileNavFooterSlide === dotI ? "true" : undefined}
                                className={`h-2.5 iphone-page:h-[clamp(9px,calc(6px+0.45vmin),12px)] shrink-0 rounded-full transition-[width,background-color,opacity] duration-200 shadow-sm ${
                                  mobileNavFooterSlide === dotI
                                    ? "w-8 iphone-page:w-[clamp(1.95rem,calc(1.65rem+1.9vmin),2.85rem)] bg-white opacity-95"
                                    : "w-2.5 iphone-page:w-[clamp(0.625rem,calc(0.5rem+0.42vmin),0.75rem)] bg-white/45 hover:bg-white/70"
                                }`}
                                onClick={() => {
                                  const el = mobileNavFooterCarouselRef.current;
                                  if (!el) return;
                                  const step = el.clientWidth;
                                  el.scrollTo({ left: dotI * step, behavior: "smooth" });
                                  setMobileNavFooterSlide(dotI);
                                }}
                              />
                            ))}
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 z-[3] flex items-center justify-start p-8 iphone-page:p-[clamp(1.35rem,0.9rem+3.1vmin,3.5rem)]">
                            <div
                              className={`flex items-center gap-7 iphone-page:gap-[clamp(1.65rem,1.2rem+3.1vmin,3.2rem)] text-white ${inter.className}`}
                            >
                              <MobileNavFooterShapeIcon shape={slide.shape} />
                              <span className="text-[3.25rem] iphone-page:text-[clamp(2.05rem,1rem+5.5vmin,4.65rem)] font-medium tracking-tight leading-none">
                                {slide.boxTitle}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <button
                            type="button"
                            className={`flex w-full flex-row flex-wrap items-center justify-start gap-2.5 iphone-page:gap-[clamp(0.85rem,0.55rem+1.2vmin,1rem)] text-left active:opacity-80 transition-opacity ${inter.className}`}
                            onClick={() => {
                              setMobileNavOpen(false);
                              requestAnimationFrame(() => {
                                carouselSectionRef.current?.scrollIntoView({
                                  behavior: "smooth",
                                  block: "start",
                                });
                              });
                            }}
                            aria-label={slide.outside}
                          >
                            <span className="text-[1.5rem] iphone-page:text-[clamp(1.38rem,0.88rem+2.3vmin,2.45rem)] font-medium text-gray-800 tracking-tight leading-snug">
                              {slide.outside}
                            </span>
                            <span
                              className="shrink-0 inline-flex h-14 w-14 iphone-page:h-[clamp(2.85rem,11.5vmin,4.85rem)] iphone-page:w-[clamp(2.85rem,11.5vmin,4.85rem)] items-center justify-center rounded-full border-2 border-gray-300/90 bg-white text-gray-900 shadow-[0_4px_14px_rgba(0,0,0,0.08)]"
                              aria-hidden
                            >
                              <svg
                                className="w-7 h-7 iphone-page:w-[clamp(1.4rem,5.35vmin,2.35rem)] iphone-page:h-[clamp(1.4rem,5.35vmin,2.35rem)]"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M5 12h14M13 6l6 6-6 6" />
                              </svg>
                            </span>
                          </button>
                          <p
                            className={`mt-1.5 text-[1.0625rem] iphone-page:text-[clamp(0.98rem,0.78rem+1.15vmin,1.45rem)] font-medium tracking-tight text-gray-500 ${inter.className}`}
                          >
                            {slide.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Hero Header - Centered, Contained in Gradient Circle */}
        <div
          className={`absolute inset-0 z-20 flex items-center justify-center iphone-page:pt-[env(safe-area-inset-top,0px)] iphone-page:pb-[env(safe-area-inset-bottom,0px)] ${narrowHorizontalInset}`}
        >
          <div className="max-w-[800px] mx-auto px-8 iphone-page:px-0 text-center w-full">
            <p
              className={`font-normal leading-none tracking-tight mb-7 iphone-page:mb-6 ${lora.className}`}
              style={{
                fontSize: "clamp(7.25rem, 36vw, 17rem)",
                backgroundImage:
                  "linear-gradient(180deg, #ffffff 0%, #ffffff 15%, #fafafa 34%, #f5f6f8 52%, #e2e8ee 76%, #c5cdd6 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 2px 28px rgba(0, 0, 0, 0.2))",
              }}
            >
              Doe
            </p>
            <div className="flex flex-col items-center gap-[1.625rem] iphone-page:gap-7 px-2">
              <p
                className="text-[clamp(1.75rem,4.15vw,2.75rem)] iphone-page:text-[clamp(1.2rem,4.85vw,1.9375rem)] font-medium text-white/90 text-center iphone-page:px-2 tracking-tight flex flex-col items-center gap-1.5 iphone-page:gap-2 iphone-page:leading-snug leading-snug"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                <span className="block iphone-page:whitespace-nowrap iphone-page:text-center w-full">
                  We&apos;re building the future of AI in
                </span>
                <span className="block iphone-page:whitespace-nowrap iphone-page:text-center w-full">
                  clinical practice and education.
                </span>
              </p>
              <a
                href="mailto:contact@joindoe.com"
                className={`inline-flex items-center gap-[0.95rem] rounded-full border border-white/25 bg-white/95 px-[2.35rem] py-[1.1rem] pl-[2.1rem] text-[1.1875rem] iphone-page:text-[clamp(1.05rem,4.65vw,1.25rem)] font-semibold tracking-tight text-gray-900 shadow-[0_6px_28px_rgba(0,0,0,0.16)] transition-[background-color,box-shadow,transform,border-color] duration-200 hover:bg-white hover:shadow-[0_10px_36px_rgba(0,0,0,0.2)] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${inter.className}`}
              >
                <svg
                  className="h-[1.5em] w-[1.5em] shrink-0 text-gray-700"
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
                Contact us
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Horizontal line at bottom of hero section */}
      <div className="w-full border-t border-[#E6E6E6]" />

      {/* Second Section — title upper third, carousel lower two-thirds */}
      <div ref={secondSectionRef} className="min-h-[calc(var(--app-vh,100dvh)+7rem)] relative z-10 flex flex-col pt-16 pb-28 iphone-page:min-h-[calc(var(--app-vh,100dvh)+6rem)] iphone-page:pt-12 iphone-page:pb-[9.5rem] overscroll-none overflow-hidden">
        <div className="flex-1 grid grid-rows-[3fr_9fr_auto] min-h-[85vh] iphone-page:min-h-[88dvh] w-full overflow-x-hidden overscroll-none">
          {/* Title band — slightly taller than 1:2 so headline has room */}
          <div
            className={`flex flex-col justify-center min-h-0 px-4 py-14 iphone-page:pt-16 iphone-page:pb-9 ${narrowHorizontalInset}`}
          >
            <div className="mx-auto w-full max-w-full text-center iphone-page:mt-5">
              <h1 
                className={`flex flex-col items-center gap-2 font-normal text-gray-900 tracking-tight ${lora.className}`}
                style={{
                  opacity: secondSectionTitleOpacity,
                  transform: `translateY(${secondSectionTitleTranslateY}px)`,
                  transition: 'opacity 1.2s ease-out, transform 1.2s ease-out'
                }}
              >
                <span className="block leading-[1.06] text-[clamp(2.65rem,11.5vw,4rem)] iphone-page:text-[clamp(1.48rem,6.25vw,4rem)] iphone-page:whitespace-nowrap">
                  Agents for every
                </span>
                <span className="block leading-[1.06] text-[clamp(2.65rem,11.5vw,4rem)] iphone-page:text-[clamp(1.48rem,6.25vw,4rem)] iphone-page:whitespace-nowrap">
                  workflow.
                </span>
              </h1>
            </div>
          </div>

          {/* Carousel band (~bottom two-thirds) */}
          <div
            className={`flex flex-col justify-center min-h-0 overflow-x-hidden overflow-y-visible pb-16 iphone-page:pb-14 overscroll-none ${narrowHorizontalInset}`}
          >
          {/* Sliding squares container — width matches Built-for-you orange panel (`w-full` inside narrowHorizontalInset) */}
          <div
            className="relative mx-auto flex w-full max-w-full flex-col justify-center overscroll-none"
            style={{
              opacity: slidingBoxesOpacity,
              transform: `translateY(${slidingBoxesTranslateY}px)`,
              transition: 'opacity 1.2s ease-out, transform 1.2s ease-out',
            }}
          >
            <div
              className="relative flex min-h-0 w-full flex-1 items-center justify-center overscroll-none"
              style={{ minHeight: slideBoxH }}
            >
            {/* Pause button - top right corner */}
            <button
              onClick={() => setIsSlidingPaused(!isSlidingPaused)}
              className="absolute top-2 right-4 iphone-page:top-2 iphone-page:right-4 z-30 p-2 rounded-full hover:bg-gray-100 transition-colors"
              style={{
                opacity: slidingBoxesOpacity,
              }}
            >
              {isSlidingPaused ? (
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>
            
            {/* Navigation Arrows */}
            {showLeftArrow && (
              <button 
                className="absolute left-8 iphone-page:left-4 z-20 transition-opacity duration-200 hover:opacity-70"
                onClick={goWorkflowCarouselPrev}
                style={{
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
                }}
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
            )}
            {showRightArrow && (
              <button 
                className="absolute right-8 iphone-page:right-4 z-20 transition-opacity duration-200 hover:opacity-70"
                onClick={goWorkflowCarouselNext}
                style={{
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
                }}
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            )}
            
            {/* One card viewport; track translates so the next slide enters from the right */}
            <div 
              className="relative iphone-page:rounded-2xl mx-auto overscroll-none"
              style={{ 
                width: slideBoxW,
                height: slideBoxH,
                overflow: 'hidden'
              }}
            >
            {/* Slide picker — inside card, same pill pattern as expanded nav footer carousel */}
            <div
              className="pointer-events-auto absolute left-0 right-0 top-0 z-[28] flex justify-center gap-2.5 px-5 pb-2 pt-[clamp(1.35rem,4vmin,2.65rem)] iphone-page:gap-[clamp(0.65rem,0.45rem+1vmin,0.95rem)]"
              aria-hidden={false}
            >
              {Array.from({ length: carouselSlideCount }, (_, dotI) => (
                <button
                  key={`wf-dot-${dotI}`}
                  type="button"
                  aria-label={`Workflow slide ${dotI + 1}`}
                  aria-current={workflowCarouselIndex === dotI ? 'true' : undefined}
                  className={`h-2.5 shrink-0 rounded-full transition-[width,background-color,opacity] duration-200 shadow-sm iphone-page:h-[clamp(9px,calc(6px+0.45vmin),12px)] ${
                    workflowCarouselIndex === dotI
                      ? 'w-8 bg-white opacity-95 iphone-page:w-[clamp(1.95rem,calc(1.65rem+1.9vmin),2.85rem)]'
                      : 'w-2.5 bg-white/45 hover:bg-white/70 iphone-page:w-[clamp(0.625rem,calc(0.5rem+0.42vmin),0.75rem)]'
                  }`}
                  onClick={() => {
                    setWorkflowCarouselIndex(dotI as 0 | 1 | 2 | 3 | 4 | 5);
                  }}
                />
              ))}
            </div>
            <div
              className="flex h-full flex-row shrink-0"
              style={{
                gap: slideGap,
                transform: `translate3d(-${workflowCarouselIndex * boxTotalWidth}px, 0, 0)`,
                transition: workflowCarouselSkipMotion
                  ? "none"
                  : `transform ${workflowCarouselTransitionMs}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                willChange: "transform",
              }}
            >
            {([0, 1, 2, 3, 4, 5] as const).map((i) => {
              // Box 1 (index 0) - AI Receptionist
              if (i === 0) {
                return (
                  <div
                    key={`box-${i}`}
                    className="rounded-2xl relative shrink-0 overflow-hidden shadow-xl iphone-page:shadow-md"
                    style={{
                      width: slideBoxW,
                      height: slideBoxH,
                    }}
                  >
                    <div
                      className="rounded-2xl"
                      style={{
                        width: 700,
                        height: 700,
                        position: "absolute",
                        left: (slideBoxW - scaledSide) / 2,
                        top: (slideBoxH - scaledSide) / 2,
                        transform: `scale(${slideUniformScale})`,
                        transformOrigin: "top left",
                        background:
                          "linear-gradient(135deg, #E7A944 0%, #D49D4F 30%, #D2774C 60%, #1E343A 100%)",
                      }}
                    >
                    {/* Grain texture overlay */}
                    <div
                      className="absolute inset-0 pointer-events-none rounded-2xl"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
                        backgroundSize: '200px 200px',
                        opacity: 1,
                        mixBlendMode: 'overlay',
                      }}
                    />
                    {/* Grid pattern overlay - Box 1: Diagonal grid */}
                    <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
                      <svg className="absolute inset-0 pointer-events-none w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700">
                        <defs>
                          <pattern id="grid1" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                            <path d="M 0 0 L 60 0 M 0 0 L 0 60" fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.8" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid1)" />
                      </svg>
                    </div>
                    {/* Number indicator */}
                    <div className="absolute top-6 left-6">
                      <span className="text-white text-sm font-medium" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        {i + 1}
                      </span>
                    </div>
                    
                    {/* AI Receptionist — caller line left + heard stream + thinking */}
                    <div
                      className="absolute left-1/2 rounded-xl bg-white shadow-lg"
                      style={{
                        width: `${carouselReceptionThinkingWidth700}px`,
                        top: '47%',
                        transform: `translate(calc(-50% - 18px), -50%) scale(${priorAuthComposeScale})`,
                        transformOrigin: 'center center',
                        padding: carouselReceptionThinkingWidth700 < 288 ? '16px' : '20px',
                        paddingBottom: '16px',
                        userSelect: 'none',
                        pointerEvents: 'auto',
                      }}
                    >
                      <div className="mb-3 flex items-center justify-start">
                        <p
                          className="text-sm font-semibold tracking-tight text-gray-900"
                          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                        >
                          (555) 310-4412
                        </p>
                      </div>
                      <div className="mb-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5">
                        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-gray-500">Heard now</p>
                        <p className="text-xs leading-snug text-gray-900" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          “I&apos;m dizzy after my new meds—need to bump my cardio follow-up.”
                        </p>
                      </div>
                      <div className="rounded-lg border border-dashed border-gray-200 bg-white px-3 py-2.5">
                        <div className="mb-2 flex items-center gap-2">
                          <span className="flex gap-1" aria-hidden>
                            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-gray-500 [animation-duration:1.05s]" />
                            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-gray-500 [animation-duration:1.05s] [animation-delay:180ms]" />
                            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-gray-500 [animation-duration:1.05s] [animation-delay:360ms]" />
                          </span>
                          <span
                            className="text-[11px] font-semibold uppercase tracking-wide text-gray-700"
                            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                          >
                            Thinking
                          </span>
                        </div>
                        <ul className="space-y-2 text-[11px] leading-snug text-gray-600" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          {[
                            'Intent · side-effect plus reschedule request',
                            'Cross-check meds + dizziness cues in chart',
                            'Selecting next cardio NP openings Tue · Thu AM',
                            'Preparing scripted hold / warm transfer script',
                          ].map((line) => (
                            <li key={line} className="flex gap-2">
                              <span className="mt-1 h-2 w-2 shrink-0 rounded-sm bg-gray-400" aria-hidden />
                              <span>{line}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <p className="mt-2 text-[10px] text-gray-400" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        Hold music until confidence threshold met—then announces slot or escalates triage.
                      </p>
                    </div>

                    <div className={slideCaptionWrap} style={{ left: captionLeftWorkflow, right: captionRightWorkflow }}>
                      <span className={slideCaptionBadge} style={slideCaptionFont}>
                        AI Receptionist
                      </span>
                      <p className={slideCaptionBody} style={slideCaptionFont}>
                        Answers every line, confirms intent, fills the schedule, then ships questionnaires so the visit starts ready—not on hold.
                      </p>
                    </div>
                    </div>
                  </div>
                );
              }
              
              // Box 2 (index 1) - Smart Appointments
              if (i === 1) {
                return (
                  <div
                    key={`box-${i}`}
                    className="rounded-2xl relative shrink-0 overflow-hidden shadow-xl iphone-page:shadow-md"
                    style={{
                      width: slideBoxW,
                      height: slideBoxH,
                    }}
                  >
                    <div
                      className="rounded-2xl"
                      style={{
                        width: 700,
                        height: 700,
                        position: "absolute",
                        left: (slideBoxW - scaledSide) / 2,
                        top: (slideBoxH - scaledSide) / 2,
                        transform: `scale(${slideUniformScale})`,
                        transformOrigin: "top left",
                        background:
                          "linear-gradient(135deg, #E7A944 0%, #D49D4F 30%, #D2774C 60%, #1E343A 100%)",
                      }}
                    >
                    {/* Grain texture overlay */}
                    <div
                      className="absolute inset-0 pointer-events-none rounded-2xl"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
                        backgroundSize: '200px 200px',
                        opacity: 1,
                        mixBlendMode: 'overlay',
                      }}
                    />
                    {/* Grid pattern overlay — match slide 1 (diagonal grid) */}
                    <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
                      <svg className="absolute inset-0 pointer-events-none w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700">
                        <defs>
                          <pattern id="gridSmartAppt" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                            <path d="M 0 0 L 60 0 M 0 0 L 0 60" fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.8" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#gridSmartAppt)" />
                      </svg>
                    </div>
                    {/* Number indicator */}
                    <div className="absolute top-6 left-6">
                      <span className="text-white text-sm font-medium" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        {i + 1}
                      </span>
                    </div>
                    
                    {/* Save and Undo when editing Smart Appointments caption */}
                    {(isEditingBox2Title || isEditingBox2Description) && (
                      <div
                        className="absolute top-6 right-6 flex items-center z-20"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.25)',
                          borderRadius: '9999px',
                          padding: '5px',
                          gap: '3px',
                        }}
                      >
                        <button
                          onClick={handleSave}
                          className="px-5 py-2 text-sm font-medium transition-colors duration-200"
                          style={{
                            borderRadius: '9999px',
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                            color: '#ffffff',
                            backgroundColor: 'transparent',
                            transition: 'background-color 250ms ease, color 250ms ease',
                            cursor: 'pointer',
                            border: 'none',
                            outline: 'none',
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={handleUndo}
                          className="px-5 py-2 text-sm font-medium transition-colors duration-200"
                          style={{
                            borderRadius: '9999px',
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                            color: '#ffffff',
                            backgroundColor: 'transparent',
                            transition: 'background-color 250ms ease, color 250ms ease',
                            cursor: 'pointer',
                            border: 'none',
                            outline: 'none',
                          }}
                        >
                          Undo
                        </button>
                      </div>
                    )}

                    {/* Smart appointments — wider panel, compact chat density */}
                    <div
                      className="absolute left-1/2 rounded-xl bg-white shadow-lg"
                      style={{
                        width: `${carouselSmartApptPanelWidth700}px`,
                        top: '47%',
                        transform: `translate(calc(-50% - 10px), -50%) scale(${priorAuthComposeScale})`,
                        transformOrigin: 'center center',
                        padding: carouselSmartApptPanelWidth700 < 300 ? '11px 13px' : '13px 15px',
                        paddingBottom: '12px',
                        userSelect: 'none',
                        pointerEvents: 'auto',
                      }}
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <p
                          className="text-[13px] font-semibold leading-tight tracking-tight text-gray-900"
                          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                        >
                          Visit assistant
                        </p>
                        <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" aria-hidden />
                      </div>
                      <div className="mb-1.5 rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-2">
                        <p className="mb-1 text-[9px] font-bold uppercase tracking-wide text-gray-500">Patient</p>
                        <p className="text-[11px] leading-snug text-gray-900" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          &ldquo;Metformin gives me cramps—I skipped two doses.&rdquo;
                        </p>
                      </div>
                      <div className="mb-1.5 rounded-lg border border-gray-100 bg-white px-2.5 py-2">
                        <p className="mb-1 text-[9px] font-bold uppercase tracking-wide text-gray-500">Assistant</p>
                        <p className="text-[11px] leading-snug text-gray-700" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          Noted under Medications · BMP before change · knee tagged for exam.
                        </p>
                      </div>
                      <div className="mb-2 rounded-lg border border-dashed border-gray-200 bg-gray-50 px-2.5 py-2">
                        <p className="mb-1 text-[9px] font-bold uppercase tracking-wide text-gray-500">Patient</p>
                        <p className="text-[11px] leading-snug text-gray-900" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          &ldquo;Left knee popped again after PT.&rdquo;
                        </p>
                      </div>
                      <div className="mb-2 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5">
                        <div className="h-1.5 flex-1 max-w-[72%] rounded-sm bg-gray-200" aria-hidden />
                        <span className="text-[9px] font-semibold uppercase tracking-wide text-gray-400">Send</span>
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          className="flex-1 rounded bg-gray-600 px-2 py-1.5 text-[11px] font-semibold text-white"
                          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                        >
                          Insert note
                        </button>
                        <button
                          type="button"
                          className="flex-1 rounded bg-gray-600 px-2 py-1.5 text-[11px] font-semibold text-white"
                          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                        >
                          Tasks
                        </button>
                      </div>
                    </div>

                    <div className={slideCaptionWrap} style={{ left: captionLeftWorkflow, right: captionRightWorkflow }}>
                        <>
                          {isEditingBox2Title ? (
                        <input
                          type="text"
                          value={box2Title}
                          onChange={(e) => {
                            setBox2Title(e.target.value);
                          }}
                          onBlur={() => {
                            setIsEditingBox2Title(false);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              setIsEditingBox2Title(false);
                            }
                            if (e.key === 'Escape') {
                              setIsEditingBox2Title(false);
                            }
                          }}
                          className={`${slideCaptionBadge} border-2 border-white bg-white/15 outline-none min-w-[12rem]`}
                          style={slideCaptionFont}
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <span 
                          className={`${slideCaptionBadge} cursor-text hover:bg-white/12 transition-colors`}
                          style={slideCaptionFont}
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsEditingBox2Title(true);
                          }}
                        >
                          {box2Title}
                        </span>
                      )}
                      {isEditingBox2Description ? (
                        <textarea
                          ref={descriptionEditRef}
                          value={box2Description}
                          onChange={(e) => {
                            setBox2Description(e.target.value);
                          }}
                          onBlur={() => {
                            setIsEditingBox2Description(false);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                              setIsEditingBox2Description(false);
                            }
                          }}
                          className={`${slideCaptionBody} outline-none resize-none overflow-hidden rounded-md border border-white/40 bg-transparent`}
                          style={{ 
                            ...slideCaptionFont,
                            margin: 0,
                            padding: '8px 10px',
                            lineHeight: 1.48,
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            display: 'block',
                            outline: 'none',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            borderRadius: '4px',
                            backgroundColor: 'transparent',
                            background: 'transparent',
                            backgroundImage: 'none',
                            minHeight: 'fit-content',
                            maxHeight: 'none',
                            overflow: 'hidden',
                            direction: 'ltr',
                            textAlign: 'left',
                            color: 'rgba(255, 255, 255, 0.9)',
                            boxShadow: 'none',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none',
                            appearance: 'none'
                          }}
                          rows={2}
                          wrap="soft"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            const scrollHeight = target.scrollHeight;
                            const lineHeight = parseFloat(getComputedStyle(target).lineHeight);
                            const maxHeight = lineHeight * 2;
                            target.style.height = Math.min(scrollHeight, maxHeight) + 'px';
                          }}
                        />
                      ) : (
                        <p 
                          className={`${slideCaptionBody} cursor-text hover:bg-white/6 rounded-md transition-colors`}
                          style={{ 
                            ...slideCaptionFont,
                            margin: 0,
                            padding: '6px 8px',
                            lineHeight: 1.48,
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            display: 'block'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsEditingBox2Description(true);
                          }}
                        >
                          {box2Description}
                        </p>
                      )}
                        </>
                    </div>
                    </div>
                  </div>
                );
              }
              
              // Box 3 (index 2) - Billing & Finances
              if (i === 2) {
                return (
                  <div
                    key={`box-${i}`}
                    className="rounded-2xl relative shrink-0 overflow-hidden shadow-xl iphone-page:shadow-md"
                    style={{
                      width: slideBoxW,
                      height: slideBoxH,
                    }}
                  >
                    <div
                      className="rounded-2xl"
                      style={{
                        width: 700,
                        height: 700,
                        position: "absolute",
                        left: (slideBoxW - scaledSide) / 2,
                        top: (slideBoxH - scaledSide) / 2,
                        transform: `scale(${slideUniformScale})`,
                        transformOrigin: "top left",
                        background:
                          "linear-gradient(180deg, #E7A944 0%, #D49D4F 25%, #D2774C 55%, #1E343A 100%)",
                      }}
                    >
                    {/* Grain texture overlay */}
                    <div
                      className="absolute inset-0 pointer-events-none rounded-2xl"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
                        backgroundSize: '200px 200px',
                        opacity: 1,
                        mixBlendMode: 'overlay',
                      }}
                    />
                    {/* Grid pattern overlay - Box 3: Hexagonal grid */}
                    <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
                      <svg className="absolute inset-0 pointer-events-none w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700">
                        <defs>
                          <pattern id="hexGrid" x="0" y="0" width="80" height="69.28" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 80 17.32 L 80 51.96 L 40 69.28 L 0 51.96 L 0 17.32 Z" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.8" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#hexGrid)" />
                      </svg>
                    </div>
                    {/* Number indicator */}
                    <div className="absolute top-6 left-6">
                      <span className="text-white text-sm font-medium" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        {i + 1}
                      </span>
                    </div>
                    
                    {/* Billing — overlapping ERA + outbound packet */}
                    <div
                      className="absolute"
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: `translate(calc(-50% - 28px), -50%) scale(${priorAuthComposeScale})`,
                        transformOrigin: 'center center',
                        width: '472px',
                        height: '380px',
                        opacity: 1,
                        pointerEvents: 'auto',
                        userSelect: 'none',
                        cursor: 'default',
                        touchAction: 'none',
                      }}
                    >
                      <div className="relative h-full w-full">
                        <div
                          className="absolute rounded-xl bg-white shadow-lg"
                          style={{
                            width: '258px',
                            left: '14px',
                            top: '80px',
                            zIndex: 1,
                            padding: '17px',
                            paddingBottom: '15px',
                          }}
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <h3 className="font-bold text-gray-900" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '14px' }}>
                              Ledger snapshot
                            </h3>
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200">
                              <span className="text-[10px] font-bold text-gray-600" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                AR
                              </span>
                            </div>
                          </div>
                          <p className={`text-gray-500 text-xs mb-3`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            Remittance posted · BCBS ERA batch
                          </p>
                          <div className="mb-2 flex items-center justify-between">
                            <span className={`text-gray-700 text-xs font-semibold`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              Matched
                            </span>
                            <span className={`text-gray-600 text-xs font-bold`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              $182k
                            </span>
                          </div>
                          <div className="mb-3 h-2 w-full rounded-full bg-gray-200">
                            <div className="h-2 rounded-full bg-gray-600" style={{ width: '74%' }} />
                          </div>
                          <div className="flex items-start gap-3 rounded-lg border border-gray-100 p-2">
                            <div className="h-8 w-8 shrink-0 rounded-full bg-gray-600" />
                            <div className="min-w-0 pt-0.5">
                              <p className="text-xs font-bold text-gray-900" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                Carve-outs queued
                              </p>
                              <p className="text-[11px] text-gray-600" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                Four payer exceptions awaiting staff review.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div
                          className="absolute rounded-xl bg-white shadow-lg"
                          style={{
                            width: '282px',
                            left: '198px',
                            top: '14px',
                            zIndex: 2,
                            padding: '15px',
                            paddingBottom: '13px',
                          }}
                        >
                          <div className="mb-2 flex items-start justify-between gap-2">
                            <div>
                              <p className={`mb-0.5 text-gray-900 text-sm font-bold`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                Authorization packet
                              </p>
                              <p className={`text-gray-500 text-xs`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                MRI lumbar · Subscriber ·8821
                              </p>
                            </div>
                            <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gray-400" />
                          </div>
                          <p className={`mb-3 text-gray-600 text-xs`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            Clinical summary and CPT bundle staged for routing. Ledger updated when the payer responds.
                          </p>
                          <div className="flex gap-2">
                            <button type="button" className="flex-1 rounded bg-gray-600 px-3 py-2 text-xs font-semibold text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              Preview
                            </button>
                            <button type="button" className="flex-1 rounded bg-gray-600 px-3 py-2 text-xs font-semibold text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              Queue
                            </button>
                            <button type="button" className="flex-1 rounded bg-gray-600 px-3 py-2 text-xs font-semibold text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              Send
                            </button>
                          </div>
                          <p className={`mt-2.5 text-gray-500 text-[11px]`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            Collections thirty-day · AR over ninety trending down week over week.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className={slideCaptionWrap} style={{ left: captionLeftWorkflow, right: captionRightWorkflow }}>
                      <span className={slideCaptionBadge} style={slideCaptionFont}>
                        Billing &amp; finances
                      </span>
                      <p className={slideCaptionBody} style={slideCaptionFont}>
                        ERAs reconcile quietly, routine prior auths ship with evidence, and a live ledger keeps cash, AR, and risk in one glance.
                      </p>
                    </div>
                    </div>
                  </div>
                );
              }
              
              // Box 4 (index 3) - Multi-disciplinary care
              if (i === 3) {
                return (
                <div
                  key={`box-${i}`}
                  className="rounded-2xl relative shrink-0 overflow-hidden shadow-xl iphone-page:shadow-md"
                  style={{
                    width: slideBoxW,
                    height: slideBoxH,
                  }}
                >
                  <div
                    className="rounded-2xl"
                    style={{
                      width: 700,
                      height: 700,
                      position: "absolute",
                      left: (slideBoxW - scaledSide) / 2,
                      top: (slideBoxH - scaledSide) / 2,
                      transform: `scale(${slideUniformScale})`,
                      transformOrigin: "top left",
                      background:
                        "radial-gradient(circle at center, #1E343A 0%, #D2774C 60%, #E7A944 100%)",
                    }}
                  >
                  {/* Grain texture overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none rounded-2xl"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
                      backgroundSize: '200px 200px',
                      opacity: 1,
                      mixBlendMode: 'overlay',
                    }}
                  />
                  {/* Grid pattern overlay - Box 4: Dotted grid */}
                  <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
                    <svg className="absolute inset-0 pointer-events-none w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700">
                      <defs>
                        <pattern id="dotGrid" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                          <circle cx="25" cy="25" r="1.5" fill="rgba(255, 255, 255, 0.25)" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#dotGrid)" />
                    </svg>
                  </div>
                  {/* Number indicator */}
                  <div className="absolute top-6 left-6">
                    <span className="text-white text-sm font-medium" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      {i + 1}
                    </span>
                  </div>
                  
                  {/* Multi-disciplinary — single horizontal ribbon, centered */}
                  <div
                    className="absolute left-1/2 flex flex-col justify-center rounded-xl bg-white shadow-lg"
                    style={{
                      width: `${carouselMultidiscRibbonWidth700}px`,
                      top: '47%',
                      transform: `translate(-50%, -50%) scale(${priorAuthComposeScale})`,
                      transformOrigin: 'center center',
                      minHeight: Math.min(124, Math.max(104, Math.round(slideVisibleWidth700 * 0.28))),
                      padding: carouselMultidiscRibbonWidth700 < 340 ? '12px 14px' : '14px 18px',
                      userSelect: 'none',
                      pointerEvents: 'auto',
                    }}
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-gray-900" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          Care routing
                        </p>
                        <p className="text-[11px] text-gray-500" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          One synopsis · duplicate referrals suppressed
                        </p>
                      </div>
                      <span
                        className="shrink-0 rounded-full bg-gray-200 px-2 py-1 text-[10px] font-bold text-gray-600"
                        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                      >
                        Draft
                      </span>
                    </div>
                    <div className="flex min-h-[4.75rem] w-full divide-x divide-gray-100 rounded-lg border border-gray-100 bg-gray-50/70">
                      {[
                        { label: 'Cardiology', lane: 'Echo request', eta: '48h slot hold' },
                        { label: 'Nephrology', lane: 'BMP curve', eta: 'Shared today' },
                        { label: 'Rehab', lane: 'Edema protocol', eta: 'Outpatient coach' },
                      ].map((col) => (
                        <div key={col.label} className="flex min-w-0 flex-1 flex-col px-3 py-2.5 first:rounded-l-[7px] last:rounded-r-[7px]">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">{col.label}</p>
                          <p className="mt-1 text-[11px] font-semibold text-gray-900" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            {col.lane}
                          </p>
                          <p className="mt-0.5 text-[10px] text-gray-500" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            {col.eta}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={slideCaptionWrap} style={{ left: captionLeftWorkflow, right: captionRightWorkflow }}>
                    <span className={slideCaptionBadge} style={slideCaptionFont}>
                      Multi-disciplinary
                    </span>
                    <p className={slideCaptionBody} style={slideCaptionFont}>
                      Doe reads the narrative once, drafts parallel specialty paths, passes clean context, and keeps everyone off duplicate phone tag.
                    </p>
                  </div>
                  </div>
                </div>
                );
              }

              // Box 5 (index 4) - Referral Intake
              if (i === 4) {
                return (
                  <div
                    key={`box-${i}`}
                    className="rounded-2xl relative shrink-0 overflow-hidden shadow-xl iphone-page:shadow-md"
                    style={{
                      width: slideBoxW,
                      height: slideBoxH,
                    }}
                  >
                    <div
                      className="rounded-2xl"
                      style={{
                        width: 700,
                        height: 700,
                        position: "absolute",
                        left: (slideBoxW - scaledSide) / 2,
                        top: (slideBoxH - scaledSide) / 2,
                        transform: `scale(${slideUniformScale})`,
                        transformOrigin: "top left",
                        background:
                          "linear-gradient(135deg, #1E343A 0%, #4A3D32 18%, #5C4A3A 30%, #D2774C 60%, #D49D4F 82%, #E7A944 100%)",
                      }}
                    >
                    {/* Grain texture overlay */}
                    <div
                      className="absolute inset-0 pointer-events-none rounded-2xl"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
                        backgroundSize: '200px 200px',
                        opacity: 1,
                        mixBlendMode: 'overlay',
                      }}
                    />
                    {/* Grid pattern overlay - Box 5: Fine crosshatch grid */}
                    <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
                      <svg className="absolute inset-0 pointer-events-none w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700">
                        <defs>
                          <pattern id="crosshatchGrid" x="0" y="0" width="56" height="56" patternUnits="userSpaceOnUse">
                            <path d="M 0 0 L 56 0 M 0 0 L 0 56" fill="none" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="0.8" />
                            <circle cx="28" cy="28" r="1" fill="rgba(255, 255, 255, 0.18)" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#crosshatchGrid)" />
                      </svg>
                    </div>
                    {/* Number indicator */}
                    <div className="absolute top-6 left-6">
                      <span className="text-white text-sm font-medium" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        {i + 1}
                      </span>
                    </div>

                    {/* Different UI - Referral Intake */}
                    <div
                      className="absolute left-1/2 bg-white rounded-xl"
                      style={{
                        opacity: 1,
                        pointerEvents: 'auto',
                        width: `${carouselInboxUiWidth700}px`,
                        height: 'fit-content',
                        userSelect: 'none',
                        cursor: 'default',
                        touchAction: 'none',
                        top: '45%',
                        transform: 'translateX(-50%) translateY(-50%)',
                        padding: carouselInboxUiWidth700 < 296 ? '14px' : '20px',
                        paddingBottom: carouselInboxUiWidth700 < 296 ? '12px' : '16px',
                      }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`font-bold text-gray-900`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '14px' }}>
                          Referral Intake
                        </h3>
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 text-xs font-bold">5</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-100">
                          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-gray-900 text-sm font-bold" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                Cardiology
                              </span>
                              <span className="text-xs font-semibold text-gray-500">Urgent</span>
                            </div>
                            <p className="text-gray-600 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              New patient referral queued for triage and specialist routing.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-100">
                          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-gray-900 text-sm font-bold" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                Imaging
                              </span>
                              <span className="text-xs font-semibold text-gray-500">Today</span>
                            </div>
                            <p className="text-gray-600 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              Documents and notes attached, ready to send to intake review.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={slideCaptionWrap} style={{ left: captionLeftWorkflow, right: captionRightWorkflow }}>
                      <span className={slideCaptionBadge} style={slideCaptionFont}>
                        Referral Intake
                      </span>
                      <p className={slideCaptionBody} style={slideCaptionFont}>
                        Doe captures new referrals, sorts urgency, and routes each case to the right team automatically.
                      </p>
                    </div>
                    </div>
                  </div>
                );
              }

              // Box 6 (index 5) — Prior authorization copilot
              if (i === 5) {
                return (
                  <div
                    key={`box-${i}`}
                    className="rounded-2xl relative shrink-0 overflow-hidden shadow-xl iphone-page:shadow-md"
                    style={{
                      width: slideBoxW,
                      height: slideBoxH,
                    }}
                  >
                    <div
                      className="rounded-2xl"
                      style={{
                        width: 700,
                        height: 700,
                        position: "absolute",
                        left: (slideBoxW - scaledSide) / 2,
                        top: (slideBoxH - scaledSide) / 2,
                        transform: `scale(${slideUniformScale})`,
                        transformOrigin: "top left",
                        background:
                          "linear-gradient(90deg, #1E343A 0%, #D2774C 38%, #D49D4F 68%, #E7A944 100%)",
                      }}
                    >
                    <div
                      className="absolute inset-0 pointer-events-none rounded-2xl"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
                        backgroundSize: '200px 200px',
                        opacity: 1,
                        mixBlendMode: 'overlay',
                      }}
                    />
                    <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
                      <svg className="absolute inset-0 pointer-events-none w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700" preserveAspectRatio="none">
                        {Array.from({ length: 12 }, (_, w) => (
                          <path
                            key={`wave-${w}`}
                            d={`M -40 ${60 + w * 58} Q 175 ${20 + w * 58} 350 ${60 + w * 58} T 740 ${60 + w * 58}`}
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.12)"
                            strokeWidth="1"
                          />
                        ))}
                      </svg>
                    </div>
                    <div className="absolute top-6 left-6">
                      <span className="text-white text-sm font-medium" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        {i + 1}
                      </span>
                    </div>

                    <div
                      className="absolute"
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: `translate(-50%, -50%) scale(${priorAuthComposeScale})`,
                        transformOrigin: 'center center',
                        width: '472px',
                        height: '380px',
                        opacity: 1,
                        pointerEvents: 'auto',
                        userSelect: 'none',
                        cursor: 'default',
                        touchAction: 'none',
                      }}
                    >
                      <div className="relative w-full h-full">
                        {/* Rear card — benefits / coverage context */}
                        <div
                          className="bg-white rounded-xl shadow-lg absolute"
                          style={{
                            width: '258px',
                            left: '12px',
                            top: '84px',
                            zIndex: 1,
                            padding: '18px',
                            paddingBottom: '16px',
                          }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h3 className={`font-bold text-gray-900`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '14px' }}>
                              Benefits snapshot
                            </h3>
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-gray-600 text-[10px] font-bold">Rx</span>
                            </div>
                          </div>
                          <p className={`text-gray-500 text-xs mb-3`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            Aetna PPO · Subscriber ID ending ·8821
                          </p>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-gray-700 text-xs font-semibold`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              PA required
                            </span>
                            <span className={`text-gray-600 text-xs font-bold`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                              Yes
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-gray-600 h-2 rounded-full" style={{ width: '55%' }} />
                          </div>
                          <p className={`text-gray-500 text-[11px] mt-2`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            Packet steps 2 of 4 complete
                          </p>
                        </div>

                        {/* Front card — draft PA packet */}
                        <div
                          className="bg-white rounded-xl shadow-lg absolute"
                          style={{
                            width: '282px',
                            left: '198px',
                            top: '12px',
                            zIndex: 2,
                            padding: '16px',
                            paddingBottom: '14px',
                          }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className={`text-gray-900 text-sm font-bold mb-0.5`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                Prior auth packet
                              </p>
                              <p className={`text-gray-500 text-xs`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                Humira · Patient #2847
                              </p>
                            </div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0" />
                          </div>
                          <p className={`text-gray-600 text-xs mb-3`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            Clinical summary and CPT bundle attached. Ready to queue for payer submission.
                          </p>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              className="flex-1 px-3 py-2 bg-gray-600 text-white rounded text-xs font-semibold"
                              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                            >
                              Preview
                            </button>
                            <button
                              type="button"
                              className="flex-1 px-3 py-2 bg-gray-600 text-white rounded text-xs font-semibold"
                              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                            >
                              Queue
                            </button>
                            <button
                              type="button"
                              className="flex-1 px-3 py-2 bg-gray-600 text-white rounded text-xs font-semibold"
                              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                            >
                              Send
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={slideCaptionWrap} style={{ left: captionLeftWorkflow, right: captionRightWorkflow }}>
                      <span className={slideCaptionBadge} style={slideCaptionFont}>
                        Prior authorization
                      </span>
                      <p className={slideCaptionBody} style={slideCaptionFont}>
                        Doe drafts payer packets, tracks status, and surfaces denials so nothing blocks the schedule.
                      </p>
                    </div>
                    </div>
                  </div>
                );
              }

              return null;
            })}
            </div>
            </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Quality orbit — between carousel (section 2) and vertical bento (section 3) */}
      <section
        ref={qualityOrbitSectionRef}
        className={`relative z-10 w-full overflow-visible overscroll-none pointer-events-none bg-[#F7F6F3] pt-[clamp(5.75rem,13.5vw,9.25rem)] pb-[clamp(8.5rem,19vw,14rem)] iphone-page:pt-[clamp(5.5rem,12vw,8.5rem)] iphone-page:pb-[clamp(8rem,17vw,11.5rem)] mt-[clamp(1.75rem,4.5vw,3.5rem)] mb-[clamp(4.75rem,11vw,8rem)] ${narrowHorizontalInset}`}
        aria-labelledby="quality-orbit-heading"
      >
        <h2 id="quality-orbit-heading" className="sr-only">
          Only high-quality patient care.
        </h2>
        {/* Grid backdrop — taller draw than section so lines read above/below the diagram */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-x-clip overflow-y-visible" aria-hidden>
          <svg
            className="pointer-events-none absolute left-0 w-full"
            style={{
              top: "-40%",
              height: "165%",
            }}
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern
                id="qualityOrbitSectionGridPattern"
                x="0"
                y="0"
                width="80"
                height="80"
                patternUnits="userSpaceOnUse"
              >
                <path d="M 0 0 L 80 0 M 0 0 L 0 80" fill="none" stroke="#999999" strokeWidth="0.5" opacity="0.28" />
                <circle cx="0" cy="0" r="1" fill="#999999" opacity="0.35" />
                <circle cx="80" cy="0" r="1" fill="#999999" opacity="0.35" />
                <circle cx="0" cy="80" r="1" fill="#999999" opacity="0.35" />
                <circle cx="80" cy="80" r="1" fill="#999999" opacity="0.35" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#qualityOrbitSectionGridPattern)" />
          </svg>
          <div
            className="absolute left-0 right-0 top-0 z-[1] h-[min(6.5rem,13vw)] bg-gradient-to-b from-[#F7F6F3] to-transparent"
            aria-hidden
          />
          <div
            className="absolute bottom-0 left-0 right-0 z-[1] h-[min(6.5rem,13vw)] bg-gradient-to-t from-[#F7F6F3] to-transparent"
            aria-hidden
          />
        </div>
        <div
          className="relative z-[2] mx-auto w-full max-w-full overflow-visible overscroll-none pointer-events-none pb-[clamp(3.75rem,11vw,6.75rem)]"
          style={{
            aspectRatio: "10 / 11",
            minHeight: "clamp(32rem, 88vw, 58rem)",
          }}
        >
            <svg
              className="absolute inset-0 z-0 h-full w-full pointer-events-none"
              viewBox="0 0 400 400"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden
            >
              <defs>
                <linearGradient
                  id="qualityOrbitOrangeTraceGradient"
                  gradientUnits="userSpaceOnUse"
                  x1="200"
                  y1={QUALITY_ORBIT_ARC_TOP_Y}
                  x2="200"
                  y2={QUALITY_ORBIT_ARC_BOTTOM_Y}
                >
                  <stop offset="0%" stopColor="#fff2c9" />
                  <stop offset="42%" stopColor="#f6c056" />
                  <stop offset="100%" stopColor="#d2663f" />
                </linearGradient>
              </defs>
              {[QUALITY_ORBIT_ARC_RIGHT_D, QUALITY_ORBIT_ARC_LEFT_D].map((d, arcI) => (
                <path
                  key={`orbit-grey-${arcI}`}
                  d={d}
                  fill="none"
                  stroke="#d4d4d4"
                  strokeWidth={1.35}
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={
                    qualityOrbitChoreography.tilesShown >= QUALITY_ORBIT_TILE_LABELS.length ? 0 : 1
                  }
                  vectorEffect="nonScalingStroke"
                  style={{
                    transition:
                      "stroke-dashoffset 3.2s cubic-bezier(0.45, 0, 0.2, 1)",
                  }}
                  className="motion-reduce:transition-none"
                />
              ))}
              {[QUALITY_ORBIT_ARC_RIGHT_D, QUALITY_ORBIT_ARC_LEFT_D].map((d, arcI) => (
                <path
                  key={`orbit-orange-${arcI}`}
                  d={d}
                  fill="none"
                  stroke="url(#qualityOrbitOrangeTraceGradient)"
                  strokeWidth={3}
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={qualityOrbitChoreography.accent ? 0 : 1}
                  strokeOpacity={qualityOrbitChoreography.accent ? 1 : 0}
                  vectorEffect="nonScalingStroke"
                  style={{
                    transition:
                      "stroke-dashoffset 3.05s cubic-bezier(0.43, 0, 0.18, 1), stroke-opacity 0.72s ease-out",
                  }}
                  className="motion-reduce:transition-none"
                />
              ))}
            </svg>

            {QUALITY_ORBIT_ANCHORS_PCT.map((p, i) => {
              const tileVisible = qualityOrbitChoreography.tilesShown > i;
              return (
              <div
                key={i}
                className="absolute z-[2] rounded-2xl iphone-page:rounded-[0.9rem] pointer-events-none overflow-visible"
                style={{
                  left: `${p.leftPct}%`,
                  top: `${p.topPct}%`,
                  width: "clamp(7.5rem, 30.5vw, 12.85rem)",
                  height: "clamp(4.35rem, 16vw, 7.25rem)",
                  boxShadow:
                    "0 18px 44px rgba(214, 119, 76, 0.34), 0 8px 20px rgba(30, 52, 58, 0.11), 0 3px 8px rgba(255, 255, 255, 0.48)",
                  opacity: tileVisible ? 1 : 0,
                  transform: tileVisible
                    ? "translate(-50%, -50%) scale(1)"
                    : "translate(-50%, -50%) scale(0.92)",
                  transition: tileVisible
                    ? "opacity 0.72s cubic-bezier(0.4, 0, 0.2, 1), transform 0.82s cubic-bezier(0.28, 0.86, 0.35, 1)"
                    : "opacity 0.52s ease, transform 0.52s ease",
                }}
              >
                <div className="absolute inset-0 overflow-hidden rounded-2xl iphone-page:rounded-[0.9rem]">
                <div
                  className="absolute inset-0"
                  style={{
                    background: QUALITY_ORBIT_TILE_FILL,
                  }}
                />
                <div
                  className="absolute inset-0 pointer-events-none rounded-2xl iphone-page:rounded-[0.9rem]"
                  style={{
                    backgroundImage: VBENTO_GRAIN_BG,
                    backgroundSize: "200px 200px",
                    opacity: 0.9,
                    mixBlendMode: "overlay",
                  }}
                />
                <svg
                  className="absolute inset-0 h-full w-full pointer-events-none rounded-2xl iphone-page:rounded-[0.9rem]"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <defs>
                    <pattern
                      id={`quality-orbit-lines-${i}`}
                      patternUnits="userSpaceOnUse"
                      width={28}
                      height={28}
                      patternTransform="rotate(42)"
                    >
                      <path
                        d="M 0 0 L 28 0 M 0 0 L 0 28"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.22)"
                        strokeWidth={0.75}
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill={`url(#quality-orbit-lines-${i})`} />
                </svg>
                <div
                  className={`relative z-[4] pointer-events-none flex h-full min-h-0 flex-col items-center justify-center gap-1 px-2 py-1 text-center ${inter.className}`}
                >
                  {qualityOrbitMiniIcon(i)}
                  <span
                    className={`max-w-[min(100%,11rem)] font-semibold leading-snug tracking-tight text-white/95 drop-shadow-[0_1px_12px_rgba(0,0,0,0.28)] ${
                      QUALITY_ORBIT_TILE_LABELS[i].length > 1
                        ? "text-[clamp(0.78rem,2.95vw,1.0625rem)]"
                        : "text-[clamp(0.9rem,3.25vw,1.1875rem)]"
                    }`}
                  >
                    {QUALITY_ORBIT_TILE_LABELS[i].map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </span>
                </div>
                </div>
              </div>
            );
            })}

            <div className="pointer-events-none absolute inset-0 z-[3] flex items-center justify-center px-4 iphone-page:px-5">
              <p
                className={`motion-reduce:transition-none flex flex-col items-center gap-2 text-center font-normal tracking-tight text-gray-900 ${lora.className}`}
                style={{
                  textWrap: "balance",
                  opacity: qualityOrbitChoreography.headline ? 1 : 0,
                  transform: qualityOrbitChoreography.headline ? "translateY(0)" : "translateY(13px)",
                  transition:
                    "opacity 0.88s cubic-bezier(0.4, 0, 0.2, 1), transform 0.88s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <span className="block leading-[1.06] text-[clamp(2.3rem,9.85vw,3.58rem)] iphone-page:text-[clamp(1.32rem,5.65vw,3.58rem)] iphone-page:whitespace-nowrap">
                  Only high-quality
                </span>
                <span className="block leading-[1.06] text-[clamp(2.3rem,9.85vw,3.58rem)] iphone-page:text-[clamp(1.32rem,5.65vw,3.58rem)] iphone-page:whitespace-nowrap">
                  patient care.
                </span>
              </p>
            </div>
        </div>
      </section>

      {/* Vertical bento rails — pinned stack + scrub */}
      <div
        ref={verticalBentoSectionRef}
        className={`relative z-10 w-full bg-[#F7F6F3] mt-[clamp(3.75rem,10.5vw,7.75rem)] pt-11 pb-8 md:pt-9 md:pb-6 max-md:pt-11 max-md:pb-12 iphone-page:mt-[clamp(3.25rem,9vw,6.75rem)] iphone-page:pt-12 iphone-page:pb-12 ${VBENTO_CANVAS_PADDING}`}
        style={{ minHeight: vbMetrics.sectionMinPx }}
      >
        <div
          ref={verticalBentoHeadlineRef}
          className={`flex flex-col items-center w-full shrink-0 px-4 ${narrowHorizontalInset} pb-4 max-md:pb-5 iphone-page:pb-6 md:pb-5`}
        >
          <h2
            className={`flex flex-col items-center gap-1 text-center text-gray-900 w-full max-w-[min(100%,42rem)] font-normal tracking-tight leading-[1.06] ${lora.className}`}
            style={{
              paddingTop: "clamp(0.2rem, 1vw, 0.75rem)",
              paddingBottom: "clamp(0.45rem, 1.8vw, 1rem)",
              overflow: "visible",
              textWrap: "balance",
              opacity: verticalBentoTitleOpacity,
              transform: `translateY(${verticalBentoTitleTranslateY}px)`,
              transition: "opacity 1.2s ease-out, transform 1.2s ease-out",
            }}
          >
            <span className="block text-[clamp(2.65rem,11.5vw,4rem)] iphone-page:text-[clamp(1.48rem,6.25vw,4rem)] iphone-page:whitespace-nowrap">
              So you can do
            </span>
            <span className="block text-[clamp(2.65rem,11.5vw,4rem)] iphone-page:text-[clamp(1.48rem,6.25vw,4rem)] iphone-page:whitespace-nowrap">
              Doctor better.
            </span>
          </h2>
        </div>
        <div className="sticky top-[max(5.75rem,calc(env(safe-area-inset-top,0px)+4.5rem))] z-[5] pt-6 pb-6 md:pt-6 md:pb-6 max-md:pt-10 max-md:pb-10 iphone-page:pt-[max(2.75rem,env(safe-area-inset-top,0px))] iphone-page:pb-[max(2.75rem,env(safe-area-inset-bottom,0px))]">
          <div
            className="relative mx-auto w-full max-w-full shrink-0"
            style={{
              opacity: verticalBentoRailsOpacity,
              transform: `translateY(${verticalBentoRailsTranslateY}px)`,
              transition: "opacity 1.2s ease-out, transform 1.2s ease-out",
            }}
          >
              {(() => {
                const ms = vbMetrics.milestones;
                const { expand, opacity } = vbDeriveRails(verticalBentoU, ms);
                const gapPx = vbRailsInterGapPx();
                const railGapsPx = gapPx * 2;
                let usable = Math.max(vbMetrics.stickyColumnH - railGapsPx, 220);
                let collapsedPx = Math.max(48, Math.min(90, Math.round(usable * 0.108)));
                let expandedMax = usable - 2 * collapsedPx;
                while (expandedMax < collapsedPx + 40 && collapsedPx > 40) {
                  collapsedPx -= 2;
                  expandedMax = usable - 2 * collapsedPx;
                }
                collapsedPx = Math.max(40, collapsedPx);
                expandedMax = Math.max(collapsedPx + 4, usable - 2 * collapsedPx);
                const localBar = vbPhaseLocalProgress(verticalBentoU, ms);
                const barRail = vbDominantRailIndex(expand);
                const dominantOpenT = vbSmoothstep01((expand[barRail] - 0.982) / (1 - 0.982));
                const barGate = dominantOpenT;
                const showProgressBar =
                  dominantOpenT > 0.04 && verticalBentoU >= ms.uOpenEnd && verticalBentoRailsOpacity * barGate > 0.06;

                return (
                  <div className="relative w-full overflow-visible" style={{ height: vbMetrics.stickyColumnH }}>
                    <div
                      className="relative z-[3] flex w-full flex-col gap-4 iphone-page:gap-3.5"
                      style={{ height: vbMetrics.stickyColumnH }}
                    >
                      {([0, 1, 2] as const).map((i) => {
                        const h = vbRailHeightPx(expand[i], collapsedPx, expandedMax);
                        const trackOpacity =
                          dominantOpenT > 0.12 ? verticalBentoRailsOpacity * barGate * opacity[i] : 0;

                        return (
                          <div
                            key={i}
                            aria-hidden
                            className={
                              i === 1
                                ? "relative w-full shrink-0 overflow-hidden rounded-2xl ring-1 ring-black/[0.06]"
                                : "relative w-full shrink-0 overflow-hidden rounded-2xl py-3 iphone-page:py-3.5 ring-1 ring-black/[0.06]"
                            }
                            style={{
                              height: h,
                              opacity: opacity[i],
                            }}
                          >
                            <div className="absolute inset-0 z-[1] rounded-2xl" style={{ background: VBENTO_WORKFLOW_GRADIENTS[i] }} />
                            <div
                              className="absolute inset-0 z-[1] pointer-events-none rounded-2xl"
                              style={{
                                backgroundImage: VBENTO_GRAIN_BG,
                                backgroundSize: "200px 200px",
                                opacity: 1,
                                mixBlendMode: "overlay",
                              }}
                            />
                            <div className="absolute inset-0 z-[1] pointer-events-none rounded-2xl overflow-hidden">
                            {i === 0 ? (
                              <svg
                                className="absolute inset-0 h-full w-full"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 700 700"
                                preserveAspectRatio="none"
                                aria-hidden
                              >
                                <defs>
                                  <pattern
                                    id="vbBentoDiagRail"
                                    x="0"
                                    y="0"
                                    width="60"
                                    height="60"
                                    patternUnits="userSpaceOnUse"
                                    patternTransform="rotate(45)"
                                  >
                                    <path d="M 0 0 L 60 0 M 0 0 L 0 60" fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.8" />
                                  </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#vbBentoDiagRail)" />
                              </svg>
                            ) : null}
                            {i === 1 ? (
                              <svg
                                className="absolute inset-0 h-full w-full"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 700 700"
                                preserveAspectRatio="none"
                                aria-hidden
                              >
                                <defs>
                                  <pattern id="vbBentoHexRail" x="0" y="0" width="80" height="69.28" patternUnits="userSpaceOnUse">
                                    <path
                                      d="M 40 0 L 80 17.32 L 80 51.96 L 40 69.28 L 0 51.96 L 0 17.32 Z"
                                      fill="none"
                                      stroke="rgba(255, 255, 255, 0.1)"
                                      strokeWidth="0.8"
                                    />
                                  </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#vbBentoHexRail)" />
                              </svg>
                            ) : null}
                            {i === 2 ? (
                              <svg
                                className="absolute inset-0 h-full w-full"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 700 700"
                                preserveAspectRatio="none"
                                aria-hidden
                              >
                                {Array.from({ length: 12 }, (_, w) => (
                                  <path
                                    key={`vb-bento-wave-${w}`}
                                    d={`M -40 ${60 + w * 58} Q 175 ${20 + w * 58} 350 ${60 + w * 58} T 740 ${60 + w * 58}`}
                                    fill="none"
                                    stroke="rgba(255, 255, 255, 0.12)"
                                    strokeWidth="1"
                                  />
                                ))}
                              </svg>
                            ) : null}
                          </div>
                            {i === barRail ? (
                              <div
                                className={`pointer-events-none absolute left-5 top-7 bottom-7 z-[8] w-[3px] rounded-full bg-white/30 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)]`}
                                style={{
                                  opacity: trackOpacity,
                                  transition:
                                    "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                                  transform: dominantOpenT < 0.02 ? "scaleY(0.02)" : "scaleY(1)",
                                  transformOrigin: "top center",
                                }}
                                {...(showProgressBar && dominantOpenT > 0.12
                                  ? ({
                                      role: "progressbar",
                                      "aria-valuemin": 0,
                                      "aria-valuemax": 100,
                                      "aria-valuenow": Math.round(localBar * 100),
                                      "aria-label": "Progress within the current bento step",
                                    } as const)
                                  : { "aria-hidden": true })}
                              >
                                {dominantOpenT > 0.1 ? (
                                  <div className="absolute inset-0 overflow-hidden rounded-full">
                                    <div
                                      className="absolute left-0 right-0 top-0 rounded-full bg-white/75"
                                      style={{ height: `${Math.max(0, Math.min(1, localBar)) * 100}%` }}
                                    />
                                  </div>
                                ) : null}
                              </div>
                            ) : null}
                        </div>
                      );
                    })}
                    </div>
                  </div>
                );
              })()}
          </div>
        </div>
      </div>

      {/* Visual pause between scrubbed bento and Built for you carousel */}
      <div
        className="relative z-10 w-full shrink-0 bg-[#F7F6F3]"
        aria-hidden
        style={{ minHeight: "clamp(4rem, 11vw, 8rem)" }}
      />

      {/* Blank Section with Grid Lines */}
      <div
        id="students"
        ref={carouselSectionRef}
        className="w-full relative z-10 overflow-x-hidden mt-[clamp(1rem,3vw,2rem)] iphone-page:mt-10 pb-24 iphone-page:pb-32"
        style={{
          opacity: carouselSectionOpacity,
          transform: `translateY(${carouselSectionTranslateY}px)`,
          transition: 'opacity 1.2s ease-out, transform 1.2s ease-out',
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <svg
            className="absolute inset-0 pointer-events-none w-full h-full"
            style={{ transform: "translateY(-18%)" }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="blankSectionGridPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 0 0 L 80 0 M 0 0 L 0 80" fill="none" stroke="#999999" strokeWidth="0.5" opacity="0.28" />
                <circle cx="0" cy="0" r="1" fill="#999999" opacity="0.35" />
                <circle cx="80" cy="0" r="1" fill="#999999" opacity="0.35" />
                <circle cx="0" cy="80" r="1" fill="#999999" opacity="0.35" />
                <circle cx="80" cy="80" r="1" fill="#999999" opacity="0.35" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#blankSectionGridPattern)" />
          </svg>
        </div>
        {/* Top fade overlay */}
        <div 
          className="absolute top-0 left-0 right-0 pointer-events-none z-10"
          style={{
            height: '200px',
            background: 'linear-gradient(to bottom, rgba(247, 246, 243, 1) 0%, rgba(247, 246, 243, 0.8) 30%, rgba(247, 246, 243, 0) 100%)'
          }}
        />
        {/* Bottom fade overlay */}
        <div 
          className="absolute bottom-0 left-0 right-0 pointer-events-none z-10"
          style={{
            height: '200px',
            background: 'linear-gradient(to top, rgba(247, 246, 243, 1) 0%, rgba(247, 246, 243, 0.8) 30%, rgba(247, 246, 243, 0) 100%)'
          }}
        />
        {/* Headline + horizontal carousel + description */}
        <div className={`relative z-20 flex flex-col items-center w-full overflow-visible ${narrowHorizontalInset} pt-4 iphone-page:pt-6 pb-4`}>
          <p
            className={`text-center text-gray-900 w-full max-w-[min(100%,42rem)] font-normal tracking-tight leading-[1.06] text-[clamp(2.65rem,11.5vw,4rem)] iphone-page:text-[clamp(1.65rem,7.25vw,4rem)] iphone-page:whitespace-nowrap ${lora.className}`}
              style={{
              paddingTop: "clamp(0.35rem, 1.5vw, 1rem)",
              paddingBottom: "clamp(0.45rem, 1.8vw, 1rem)",
              overflow: "visible",
              textWrap: "balance",
            }}
          >
            Built for you.
          </p>

          {/* Horizontal Agents / Franchises / Design … carousel */}
          <div className="flex flex-row items-center justify-center gap-3 iphone-page:gap-5 w-full max-w-[min(100%,42rem)] pb-4 iphone-page:pb-5">
            <button
              type="button"
              aria-label="Previous category"
              onClick={() => {
                if (isCarouselTransitioning) return;
                setIsCarouselTransitioning(true);
                requestAnimationFrame(() => {
                  setUiMockupOpacity(0);
                  setUiMockupTranslateY(10);
                  setUiMockupScale(0.96);
                });
                setCarouselOffset(-1);
                setTimeout(() => {
                  const newIndex = (selectedWordIndex - 1 + 8) % 8;
                  setSelectedWordIndex(newIndex);
                  setCarouselOffset(0);
                  requestAnimationFrame(() => {
                    setUiMockupOpacity(1);
                    setUiMockupTranslateY(0);
                    setUiMockupScale(1);
                  });
                  setTimeout(() => {
                    setIsCarouselTransitioning(false);
                  }, 50);
                }, 400);
              }}
              className="shrink-0 p-2 rounded-full hover:bg-black/[0.04] transition-colors"
            >
              <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div
              className="relative flex-1 min-w-0 overflow-hidden py-2"
              style={{
                maxWidth: "min(94vw, 40rem)",
                minHeight: "5.65rem",
              }}
            >
              <div
                className="pointer-events-none absolute inset-y-0 left-0 z-[2] w-14 bg-gradient-to-r from-[#F7F6F3] to-transparent"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-y-0 right-0 z-[2] w-14 bg-gradient-to-l from-[#F7F6F3] to-transparent"
                aria-hidden
              />
              {(() => {
                const words = ["Agents", "Franchises", "Design", "Billing", "Marketing", "Patient", "Teams", "Inbox"];
                const n = words.length;
                const offsets = [-3, -2, -1, 0, 1, 2, 3];
                /** Center-to-center spacing in `em` (carousel font-size) — avoids overlap vs fixed px */
                const narrowBuiltCarousel = appViewport.width < 420;
                const slotEm = narrowBuiltCarousel ? 10 : 12;

                const getOpacity = (offset: number) => {
                  const abs = Math.abs(offset);
                  if (abs === 0) return 1;
                  if (abs === 1) return 0.32;
                  if (abs === 2) return 0.2;
                  return 0;
                };

                return (
                  <div
                    className={inter.className}
                      style={{
                      position: "absolute",
                      left: `calc(50% - ${(3 + carouselOffset) * slotEm}em)`,
                      top: "50%",
                      transform: "translateY(-50%)",
                      transition:
                        isCarouselTransitioning && carouselOffset !== 0
                          ? "left 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                          : "none",
                      fontWeight: 300,
                      fontSize: narrowBuiltCarousel
                        ? "clamp(1.45rem, 5.25vw, 2.65rem)"
                        : "clamp(1.95rem, 6.75vw, 3rem)",
                      whiteSpace: "nowrap",
                      lineHeight: 1.15,
                      height: "auto",
                    }}
                  >
                    {offsets.map((offset) => {
                        const wordIdx = ((selectedWordIndex + offset) % n + n) % n;
                        return (
                          <span
                            key={offset}
                            style={{
                            position: "absolute",
                            left: `${(offset + 3) * slotEm}em`,
                            top: "50%",
                            transform: "translate(-50%, -50%)",
                            whiteSpace: "nowrap",
                              opacity: getOpacity(offset),
                            color: offset === 0 ? "#111827" : "#6B7280",
                            }}
                          >
                            {words[wordIdx]}
                          </span>
                        );
                      })}
                  </div>
                );
              })()}
            </div>

                <button
              type="button"
              aria-label="Next category"
              onClick={() => builtForYouCarouselAdvanceRightRef.current?.()}
              className="shrink-0 p-2 rounded-full hover:bg-black/[0.04] transition-colors"
            >
              <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
        {(() => {
          const descriptions = [
            ["Automates tasks around you", "Learns your workflows daily", "Acts without being asked to"],
            ["One system, every location", "Consistent brand and process", "Scale without losing control"],
            ["Built for clinical precision", "Minimal, focused interfaces", "Every decision intentional"],
            ["Claims submitted instantly", "Revenue tracked end to end", "No more chasing payments"],
            ["Reach patients who need you", "Campaigns run on your data", "Growth that runs itself now"],
            ["Full history before you ask", "Context always at your side", "Know each patient completely"],
            ["Stay aligned across all roles", "Tasks and notes in one place", "Built for how clinics work"],
            ["Every message, one channel", "Sorted before you open it", "Nothing falls through again"],
          ];
          const lines = descriptions[selectedWordIndex] ?? descriptions[0];
          return (
              <div className="w-full flex justify-center pb-4 iphone-page:pb-5">
              <div
                key={selectedWordIndex}
                  className={`text-2xl iphone-page:text-[clamp(1.5rem,5vw,2.125rem)] text-gray-700 text-center max-w-2xl iphone-page:max-w-3xl leading-snug iphone-page:leading-relaxed ${inter.className}`}
                  style={{ fontWeight: 500, animation: "fade-in 0.35s ease-out" }}
              >
                  {lines.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
              </div>
            </div>
          );
        })()}
        </div>
        {/* Orange panel — word-linked UI mockups; horizontal inset matches second-section carousel */}
        <div className={`relative z-30 w-full pb-14 iphone-page:pb-16 ${narrowHorizontalInset} mt-10 iphone-page:mt-14`}>
        <div 
            className="relative mx-auto w-full max-w-full shrink-0 rounded-2xl overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.14)]"
          style={{
              /** Outer orange canvas: square (width = height), not a wide strip */
              width: "100%",
              aspectRatio: "1",
              height: "auto",
              boxSizing: "border-box",
              background: `radial-gradient(circle at 50% 36%, #E7A944 0%, #D49D4F 40%, #D2774C 70%, #1E343A 100%)`,
              borderRadius: "16px",
          }}
        >
          {/* Grain texture overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: '16px',
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
              backgroundSize: '200px 200px',
              opacity: 1,
              mixBlendMode: 'overlay',
            }}
          />
          {/* Circular grid pattern overlay — shifted up behind headline/mockup */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ borderRadius: '16px' }}>
            <svg
              className="absolute pointer-events-none left-1/2 -translate-x-1/2 w-[118%] max-w-none h-[118%]"
              style={{ top: "-13%", }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1000 1000"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden
            >
              {/* Radial lines */}
              {Array.from({ length: 8 }, (_, j) => {
                const angle = (j * 45);
                const radius = 500;
                return (
                  <path
                    key={`radial-${j}`}
                    d={`M 500 500 L ${500 + Math.cos(angle * Math.PI / 180) * radius} ${500 + Math.sin(angle * Math.PI / 180) * radius}`}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.15)"
                    strokeWidth="0.8"
                  />
                );
              })}
              {/* Concentric circles */}
              {Array.from({ length: 6 }, (_, j) => {
                const r = (j + 1) * 150;
                return (
                  <circle
                    key={`circle-${j}`}
                    cx="500"
                    cy="500"
                    r={r}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.15)"
                    strokeWidth="0.8"
                  />
                );
              })}
            </svg>
          </div>

          {/* App UI Mockup - Dynamic based on selected word */}
          {(() => {
            const renderUIMockup = () => {
              const words = ['Agents', 'Franchises', 'Design', 'Billing', 'Marketing', 'Patient', 'Teams', 'Inbox'];
              const currentWord = words[selectedWordIndex];

              // Common sidebar
              const Sidebar = () => (
                <div style={{
                  width: '48px',
                  background: '#1E343A',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '14px 0',
                  gap: '4px',
                  flexShrink: 0,
                }}>
                  <div style={{ width: 24, height: 24, borderRadius: 7, background: '#D49D4F', marginBottom: 14 }} />
                  {[true, false, false, false, false, false].map((active, i) => (
                    <div key={i} style={{
                      width: 30, height: 30, borderRadius: 7,
                      background: active ? 'rgba(255,255,255,0.12)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <div style={{
                        width: 13, height: 13, borderRadius: 3,
                        background: active ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.22)',
                      }} />
                    </div>
                  ))}
                  <div style={{ marginTop: 'auto', width: 26, height: 26, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
                </div>
              );

              // Agents UI - Automation workflows
              if (currentWord === 'Agents') {
                return (
                  <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                    <Sidebar />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F7F6F3' }}>
                      <div style={{ height: 40, borderBottom: '1px solid #E6E6E6', background: '#ffffff', display: 'flex', alignItems: 'center', padding: '0 14px' }}>
                        <div style={{ width: 90, height: 6, borderRadius: 3, background: '#D4D4D4' }} />
                      </div>
                      <div style={{ flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <div style={{ flex: 1, height: 56, borderRadius: 10, background: '#1E343A', padding: '10px 12px' }}>
                            <div style={{ width: '50%', height: 4, borderRadius: 3, background: 'rgba(255,255,255,0.25)', marginBottom: 6 }} />
                            <div style={{ width: '30%', height: 12, borderRadius: 3, background: 'rgba(255,255,255,0.45)' }} />
                          </div>
                          <div style={{ flex: 1, height: 56, borderRadius: 10, background: 'linear-gradient(135deg, #D2774C, #E7A944)', padding: '10px 12px' }}>
                            <div style={{ width: '50%', height: 4, borderRadius: 3, background: 'rgba(255,255,255,0.30)', marginBottom: 6 }} />
                            <div style={{ width: '30%', height: 12, borderRadius: 3, background: 'rgba(255,255,255,0.50)' }} />
                          </div>
                        </div>
                        {['Auto-scheduled', 'Running now', 'Queued'].map((label, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px', borderRadius: 9, background: i === 0 ? '#ffffff' : 'transparent', border: i === 0 ? '1px solid #E6E6E6' : 'none', opacity: i === 0 ? 1 : i === 1 ? 0.6 : 0.35 }}>
                            <div style={{ width: 24, height: 24, borderRadius: 6, background: i === 0 ? '#E6EFF0' : '#EBEBEB' }} />
                            <div style={{ flex: 1, height: 5, borderRadius: 3, background: '#BEBEBE', width: `${65 - i * 8}%` }} />
                            <div style={{ width: 28, height: 14, borderRadius: 20, background: i === 0 ? '#E6EFF0' : '#EBEBEB' }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              // Franchises UI - Multi-location
              if (currentWord === 'Franchises') {
                return (
                  <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                    <Sidebar />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F7F6F3' }}>
                      <div style={{ height: 40, borderBottom: '1px solid #E6E6E6', background: '#ffffff', display: 'flex', alignItems: 'center', padding: '0 14px' }}>
                        <div style={{ width: 100, height: 6, borderRadius: 3, background: '#D4D4D4' }} />
                      </div>
                      <div style={{ flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} style={{ height: 48, borderRadius: 9, background: '#ffffff', border: '1px solid #E6E6E6', padding: '8px 10px', opacity: i === 1 ? 1 : i === 2 ? 0.7 : i === 3 ? 0.45 : 0.25 }}>
                              <div style={{ width: '60%', height: 4, borderRadius: 3, background: '#C8C8C8', marginBottom: 6 }} />
                              <div style={{ width: '40%', height: 3, borderRadius: 3, background: '#DCDCDC' }} />
                            </div>
                          ))}
                        </div>
                        <div style={{ flex: 1, borderRadius: 9, background: '#ffffff', border: '1px solid #E6E6E6', padding: '10px 12px' }}>
                          <div style={{ width: '70%', height: 4, borderRadius: 3, background: '#C8C8C8', marginBottom: 8 }} />
                          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                            {[1, 2, 3].map(i => <div key={i} style={{ flex: 1, height: 32, borderRadius: 6, background: '#F0F0F0' }} />)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              // Design UI - Clean interface elements
              if (currentWord === 'Design') {
                return (
                  <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                    <Sidebar />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F7F6F3' }}>
                      <div style={{ height: 40, borderBottom: '1px solid #E6E6E6', background: '#ffffff', display: 'flex', alignItems: 'center', padding: '0 14px' }}>
                        <div style={{ width: 75, height: 6, borderRadius: 3, background: '#D4D4D4' }} />
                      </div>
                      <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ height: 80, borderRadius: 12, background: '#ffffff', border: '1px solid #E6E6E6', padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
                          <div style={{ width: '65%', height: 5, borderRadius: 3, background: '#1E343A', margin: '0 auto' }} />
                          <div style={{ width: '45%', height: 4, borderRadius: 3, background: '#C8C8C8', margin: '0 auto' }} />
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {[1, 2, 3].map(i => (
                            <div key={i} style={{ flex: 1, height: 60, borderRadius: 10, background: '#ffffff', border: '1px solid #E6E6E6', padding: '8px', opacity: i === 1 ? 1 : i === 2 ? 0.6 : 0.35 }}>
                              <div style={{ width: '70%', height: 4, borderRadius: 3, background: '#DCDCDC', marginBottom: 6 }} />
                              <div style={{ width: '50%', height: 3, borderRadius: 3, background: '#EBEBEB' }} />
                            </div>
                          ))}
                        </div>
                        <div style={{ flex: 1, borderRadius: 10, background: '#ffffff', border: '1px solid #E6E6E6', padding: '10px' }}>
                          <div style={{ width: '55%', height: 4, borderRadius: 3, background: '#C8C8C8', marginBottom: 8 }} />
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} style={{ height: 24, borderRadius: 5, background: '#F0F0F0' }} />)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              // Billing UI - Claims and revenue
              if (currentWord === 'Billing') {
                return (
                  <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                    <Sidebar />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F7F6F3' }}>
                      <div style={{ height: 40, borderBottom: '1px solid #E6E6E6', background: '#ffffff', display: 'flex', alignItems: 'center', padding: '0 14px' }}>
                        <div style={{ width: 85, height: 6, borderRadius: 3, background: '#D4D4D4' }} />
                      </div>
                      <div style={{ flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <div style={{ flex: 1, height: 70, borderRadius: 10, background: '#1E343A', padding: '12px' }}>
                            <div style={{ width: '50%', height: 4, borderRadius: 3, background: 'rgba(255,255,255,0.25)', marginBottom: 8 }} />
                            <div style={{ width: '35%', height: 18, borderRadius: 4, background: 'rgba(255,255,255,0.45)' }} />
                          </div>
                          <div style={{ flex: 1, height: 70, borderRadius: 10, background: 'linear-gradient(135deg, #D2774C, #E7A944)', padding: '12px' }}>
                            <div style={{ width: '50%', height: 4, borderRadius: 3, background: 'rgba(255,255,255,0.30)', marginBottom: 8 }} />
                            <div style={{ width: '35%', height: 18, borderRadius: 4, background: 'rgba(255,255,255,0.50)' }} />
                          </div>
                        </div>
                        {['Claim #2847', 'Claim #1923', 'Claim #4521'].map((label, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 11px', borderRadius: 9, background: i === 0 ? '#ffffff' : 'transparent', border: i === 0 ? '1px solid #E6E6E6' : 'none', opacity: i === 0 ? 1 : i === 1 ? 0.6 : 0.35 }}>
                            <div style={{ width: 50, height: 4, borderRadius: 3, background: '#BEBEBE' }} />
                            <div style={{ flex: 1, height: 4, borderRadius: 3, background: '#D8D8D8', width: `${55 - i * 8}%` }} />
                            <div style={{ width: 35, height: 16, borderRadius: 20, background: i === 0 ? '#E6EFF0' : '#EBEBEB' }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              // Marketing UI - Campaigns
              if (currentWord === 'Marketing') {
                return (
                  <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                    <Sidebar />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F7F6F3' }}>
                      <div style={{ height: 40, borderBottom: '1px solid #E6E6E6', background: '#ffffff', display: 'flex', alignItems: 'center', padding: '0 14px' }}>
                        <div style={{ width: 95, height: 6, borderRadius: 3, background: '#D4D4D4' }} />
                      </div>
                      <div style={{ flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ height: 100, borderRadius: 10, background: 'linear-gradient(135deg, #D2774C, #E7A944)', padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <div style={{ width: '60%', height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.30)', marginBottom: 8, margin: '0 auto 8px' }} />
                          <div style={{ width: '45%', height: 16, borderRadius: 4, background: 'rgba(255,255,255,0.50)', margin: '0 auto' }} />
                        </div>
                        {['Active campaign', 'Scheduled', 'Draft'].map((label, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px', borderRadius: 9, background: i === 0 ? '#ffffff' : 'transparent', border: i === 0 ? '1px solid #E6E6E6' : 'none', opacity: i === 0 ? 1 : i === 1 ? 0.6 : 0.35 }}>
                            <div style={{ width: 24, height: 24, borderRadius: 6, background: i === 0 ? '#E6EFF0' : '#EBEBEB' }} />
                            <div style={{ flex: 1, height: 5, borderRadius: 3, background: '#BEBEBE', width: `${60 - i * 7}%` }} />
                            <div style={{ width: 45, height: 16, borderRadius: 20, background: i === 0 ? '#E6EFF0' : '#EBEBEB' }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              // Patient UI - Profile and history
              if (currentWord === 'Patient') {
                return (
                  <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                    <Sidebar />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F7F6F3' }}>
                      <div style={{ height: 40, borderBottom: '1px solid #E6E6E6', background: '#ffffff', display: 'flex', alignItems: 'center', padding: '0 14px' }}>
                        <div style={{ width: 80, height: 6, borderRadius: 3, background: '#D4D4D4' }} />
                      </div>
                      <div style={{ flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px', borderRadius: 10, background: '#ffffff', border: '1px solid #E6E6E6' }}>
                          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#E8E8E8' }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ width: '45%', height: 5, borderRadius: 3, background: '#BEBEBE', marginBottom: 6 }} />
                            <div style={{ width: '65%', height: 4, borderRadius: 3, background: '#D8D8D8' }} />
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                          {[1, 2].map(i => (
                            <div key={i} style={{ height: 48, borderRadius: 9, background: '#ffffff', border: '1px solid #E6E6E6', padding: '8px 10px', opacity: i === 1 ? 1 : 0.6 }}>
                              <div style={{ width: '55%', height: 4, borderRadius: 3, background: '#C8C8C8', marginBottom: 6 }} />
                              <div style={{ width: '40%', height: 3, borderRadius: 3, background: '#DCDCDC' }} />
                            </div>
                          ))}
                        </div>
                        {['Last visit', 'Medications', 'Allergies'].map((label, i) => (
                          <div key={i} style={{ padding: '8px 10px', borderRadius: 9, background: i === 0 ? '#ffffff' : 'transparent', border: i === 0 ? '1px solid #E6E6E6' : 'none', opacity: i === 0 ? 1 : i === 1 ? 0.6 : 0.35 }}>
                            <div style={{ width: `${50 - i * 5}%`, height: 4, borderRadius: 3, background: '#BEBEBE', marginBottom: 4 }} />
                            <div style={{ width: `${70 - i * 5}%`, height: 3, borderRadius: 3, background: '#D8D8D8' }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              // Teams UI - Collaboration
              if (currentWord === 'Teams') {
                return (
                  <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                    <Sidebar />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F7F6F3' }}>
                      <div style={{ height: 40, borderBottom: '1px solid #E6E6E6', background: '#ffffff', display: 'flex', alignItems: 'center', padding: '0 14px' }}>
                        <div style={{ width: 70, height: 6, borderRadius: 3, background: '#D4D4D4' }} />
                      </div>
                      <div style={{ flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                          {[1, 2, 3, 4].map(i => <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', background: '#E8E8E8', opacity: i === 1 ? 1 : i === 2 ? 0.7 : i === 3 ? 0.45 : 0.25 }} />)}
                        </div>
                        {['Task assigned', 'Note added', 'Status updated'].map((label, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 11px', borderRadius: 9, background: i === 0 ? '#ffffff' : 'transparent', border: i === 0 ? '1px solid #E6E6E6' : 'none', opacity: i === 0 ? 1 : i === 1 ? 0.6 : 0.35 }}>
                            <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#E8E8E8' }} />
                            <div style={{ flex: 1 }}>
                              <div style={{ width: `${58 - i * 7}%`, height: 5, borderRadius: 3, background: '#BEBEBE', marginBottom: 4 }} />
                              <div style={{ width: `${75 - i * 5}%`, height: 4, borderRadius: 3, background: '#D8D8D8' }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              // Inbox UI - Messages
              if (currentWord === 'Inbox') {
                return (
                  <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                    <Sidebar />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F7F6F3' }}>
                      <div style={{ height: 40, borderBottom: '1px solid #E6E6E6', background: '#ffffff', display: 'flex', alignItems: 'center', padding: '0 14px' }}>
                        <div style={{ width: 65, height: 6, borderRadius: 3, background: '#D4D4D4' }} />
                        <div style={{ flex: 1 }} />
                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#E6EFF0' }} />
                      </div>
                      <div style={{ flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {['New message', 'Follow-up', 'Appointment', 'Lab results'].map((label, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 11px', borderRadius: 9, background: i === 0 ? '#ffffff' : 'transparent', border: i === 0 ? '1px solid #E6E6E6' : 'none', opacity: i === 0 ? 1 : i === 1 ? 0.65 : i === 2 ? 0.4 : 0.2 }}>
                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: i === 0 ? '#E6EFF0' : '#EBEBEB' }} />
                            <div style={{ flex: 1 }}>
                              <div style={{ width: `${55 - i * 6}%`, height: 5, borderRadius: 3, background: '#BEBEBE', marginBottom: 4 }} />
                              <div style={{ width: `${72 - i * 4}%`, height: 4, borderRadius: 3, background: '#D8D8D8' }} />
                            </div>
                            <div style={{ width: 24, height: 14, borderRadius: 20, background: i === 0 ? '#E6EFF0' : '#EBEBEB' }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              // Default fallback
              return null;
            };

            return (
              <div
                key={selectedWordIndex}
                className="absolute bottom-[4%] iphone-page:bottom-[5%]"
                style={{
                  top: "auto",
                  left: "50%",
                  right: "auto",
                  /** Square mockup: width drives height via aspect-ratio */
                  width: "min(100%, min(92vmin, min(72dvh, 560px)))",
                  height: "auto",
                  aspectRatio: "1",
                  borderRadius: "14px",
                  boxShadow: "0 40px 100px rgba(0,0,0,0.35)",
                  overflow: "hidden",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  opacity: uiMockupOpacity,
                  transition:
                    "opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  willChange: isCarouselTransitioning ? "opacity, transform" : "auto",
                  transform: `translateX(-50%) translateY(${uiMockupTranslateY}px) scale(${uiMockupScale})`,
                }}
              >
                {renderUIMockup()}
              </div>
            );
          })()}
        </div>
      </div>

      </div>

      {/* Inquisara — width matches Built-for-you inner column (narrowHorizontalInset only) */}
      <div className={`relative z-10 w-full pb-[clamp(1rem,3vw,1.75rem)] ${narrowHorizontalInset}`}>
        <section
          aria-labelledby="inquisara-teaser-heading"
          className="relative mx-auto w-full max-w-[min(100%,42rem)] overflow-hidden rounded-[clamp(1.15rem,2.75vw,1.875rem)] shadow-[0_16px_44px_rgba(180,72,24,0.22)] ring-1 ring-orange-950/15"
        >
        <div className="pointer-events-none absolute inset-0 rounded-[inherit]">
          <div
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{
              background: `
              radial-gradient(ellipse 115% 95% at 50% -8%,
                #fff7ee 0%,
                #ffd7b8 18%,
                #ffb06a 38%,
                #f07828 58%,
                #d94e14 78%,
                #a8320c 100%
              ),
              radial-gradient(circle at 78% 92%,
                rgba(255, 186, 102, 0.55) 0%,
                transparent 52%
              ),
              radial-gradient(circle at 12% 68%,
                rgba(255, 138, 72, 0.35) 0%,
                transparent 48%
              )
            `,
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit]"
            style={{
              opacity: 0.5,
              mixBlendMode: "overlay",
              backgroundImage: `
              repeating-linear-gradient(
                128deg,
                transparent 0px,
                transparent 13px,
                rgba(255, 255, 255, 0.085) 13px,
                rgba(255, 255, 255, 0.085) 14px
              ),
              repeating-linear-gradient(
                -128deg,
                transparent 0px,
                transparent 17px,
                rgba(120, 38, 12, 0.1) 17px,
                rgba(120, 38, 12, 0.1) 18px
              )
            `,
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 z-[2] rounded-[inherit]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
              backgroundSize: "200px 200px",
              opacity: 0.65,
              mixBlendMode: "soft-light",
            }}
          />
        </div>
        <div className="relative z-10 mx-auto flex min-h-[min(52vw,22rem)] w-full max-w-full flex-col items-center justify-center px-6 py-[clamp(3.25rem,9vw,6.75rem)] text-center md:min-h-[min(44vw,20rem)] md:px-10 iphone-page:px-5 iphone-page:py-[clamp(3rem,11vw,6rem)]">
          <h2
            id="inquisara-teaser-heading"
            className={`font-medium tracking-tight text-white drop-shadow-[0_2px_20px_rgba(88,28,8,0.45)] ${inter.className}`}
            style={{
              fontSize: "clamp(2.85rem, min(11vw, 12vmin), 5.75rem)",
              lineHeight: 1.02,
            }}
          >
            Inquisara
          </h2>
          <a
            href="https://inquisara.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Inquisara — see what we're building (opens in new tab)"
            className={`group mt-[clamp(1rem,3vw,1.75rem)] flex flex-col items-center gap-[clamp(0.65rem,2vw,1rem)] text-white no-underline transition-opacity hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/90 ${inter.className}`}
          >
            <span className="text-[clamp(0.9375rem,2.85vw,1.1875rem)] font-medium tracking-tight text-white/[0.88]">
              See what we&apos;re building
            </span>
            <span className="flex h-[clamp(3rem,9vmin,3.75rem)] w-[clamp(3rem,9vmin,3.75rem)] shrink-0 items-center justify-center rounded-full border border-white/[0.42] bg-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.2)] backdrop-blur-[2px] transition-[transform,background-color,border-color] duration-200 group-hover:border-white/55 group-hover:bg-white/[0.14] group-active:scale-[0.98]">
              <svg
                width={26}
                height={26}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.65}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/95 translate-x-[0.5px] translate-y-[0.5px]"
                aria-hidden
              >
                <circle cx="12" cy="12" r="10" fill="none" />
                <path d="M8 16L16 8M16 8H11M16 8v5" fill="none" />
              </svg>
            </span>
          </a>
        </div>
      </section>
      </div>

      <footer
        className="relative z-10 mt-0 flex min-h-[min(69vh,42rem)] w-screen flex-col justify-end overflow-x-clip overflow-y-visible pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] iphone-page:min-h-[66vh]"
          style={{
          width: "100vw",
          marginLeft: "calc(50% - 50vw)",
          marginRight: "calc(50% - 50vw)",
        }}
      >
        {/* Base — warm amber / teak blend consistent with hero & bento oranges */}
        <div
          className="pointer-events-none absolute inset-0"
                  style={{
                  background: `
              linear-gradient(152deg, #1a2e34 0%, #243a40 14%, #3d2f28 32%, #6b442f 48%, #a85a34 62%, #d4893f 76%, #e8b04d 88%, #f2cf7a 100%),
              radial-gradient(ellipse 100% 80% at 50% 110%, rgba(231, 169, 68, 0.55) 0%, transparent 58%),
              radial-gradient(ellipse 55% 45% at 12% 18%, rgba(255, 224, 180, 0.22) 0%, transparent 52%),
              radial-gradient(ellipse 50% 40% at 88% 22%, rgba(210, 119, 76, 0.3) 0%, transparent 55%)
            `,
          }}
        />
        {/* Line mesh overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
                  style={{
            opacity: 0.55,
            mixBlendMode: "soft-light",
            backgroundImage: `
              repeating-linear-gradient(
                -32deg,
                transparent 0px,
                transparent 11px,
                rgba(255, 255, 255, 0.09) 11px,
                rgba(255, 255, 255, 0.09) 12px
              ),
              repeating-linear-gradient(
                32deg,
                transparent 0px,
                transparent 15px,
                rgba(30, 52, 58, 0.14) 15px,
                rgba(30, 52, 58, 0.14) 16px
              )
            `,
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 z-[2]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
                    opacity: 1,
            mixBlendMode: "overlay",
          }}
        />
        <div className="relative z-10 flex w-full flex-1 flex-col justify-end px-3 pt-10 md:px-6 md:pt-16 iphone-page:px-0">
          <nav
            className="mx-auto mb-14 grid w-[min(100%,17rem)] shrink-0 grid-cols-2 justify-items-center gap-x-5 gap-y-4 text-center text-[clamp(1.15rem,4.25vw,1.5rem)] font-medium tracking-tight md:mb-16 md:w-[min(100%,22rem)] md:gap-x-8 md:gap-y-5 md:text-[clamp(1.25rem,2.8vw,1.75rem)] iphone-page:mb-12 iphone-page:max-w-[16rem] iphone-page:gap-x-4 iphone-page:gap-y-3.5 iphone-page:text-[clamp(1.2rem,4.8vmin,1.65rem)]"
            aria-label="Footer"
          >
            <Link href="/" className="text-white no-underline transition-colors hover:text-white/85">
              Features
            </Link>
            <Link href="/" className="text-white no-underline transition-colors hover:text-white/85">
              Security
            </Link>
            <Link href="/#students" className="text-white no-underline transition-colors hover:text-white/85">
              Students
            </Link>
            <Link href="/blog" className="text-white no-underline transition-colors hover:text-white/85">
              Company
            </Link>
          </nav>
          <div
            className="relative z-[11] flex justify-center overflow-x-clip overflow-y-visible pt-3 pb-0"
                    style={{ 
              width: "100vw",
              marginLeft: "calc(50% - 50vw)",
              marginRight: "calc(50% - 50vw)",
            }}
          >
            <Link
              href="/"
              className={`pointer-events-auto inline-block shrink-0 text-center font-normal leading-[0.65] tracking-tight no-underline transition-opacity hover:opacity-90 ${lora.className}`}
                style={{
                color: "#F7F6F3",
                /** Giant: wide enough that “d” / “e” bleed past L/R edges; milder bottom bleed. */
                fontSize: "clamp(11rem, min(76vw, 68vmin), 30rem)",
                marginBottom: "calc(-0.06em - env(safe-area-inset-bottom, 0px))",
                transform: "translateY(min(1vh, 0.5rem))",
              }}
            >
              Doe
            </Link>
            </div>
          </div>
      </footer>
    </div>
  );
}
