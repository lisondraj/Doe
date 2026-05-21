/** Scroll-driven vertical bento (between carousel and gradient hero). */

import { doeforvcRootZoom } from "@/lib/doeforvc-zoom";

export const VB_CLOSED_EXPAND = 0.06;
export const VB_INACTIVE_OPACITY = 0.22;

export function vbSmoothstep01(t: number): number {
  const x = Math.min(Math.max(t, 0), 1);
  return x * x * (3 - 2 * x);
}

export type VerticalBentoMilestonesU = {
  uOpenEnd: number;
  uDw0End: number;
  uSwap01End: number;
  uDw1End: number;
  uSwap12End: number;
  uDw2End: number;
  uExitEnd: number;
};

export type VerticalBentoScrollMetrics = {
  vh: number;
  scrollablePx: number;
  /** Section outer min-height in px (includes one viewport of “pin” slack). */
  sectionMinPx: number;
  anchor: number;
  stickyColumnH: number;
  milestones: VerticalBentoMilestonesU;
};

export function vbBuildMilestonesU(scrollablePx: number, bandPx: number[]): VerticalBentoMilestonesU {
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

export function vbDocumentRootPx(): number {
  if (typeof document === "undefined") return 12.8;
  const n = parseFloat(getComputedStyle(document.documentElement).fontSize || "12.8");
  return Number.isFinite(n) && n > 0 ? n : 12.8;
}

/**
 * Visible viewport from `visualViewport` when sane (Safari toolbar / URL bar alignment across devices).
 * Falls back to `innerWidth` / `innerHeight`. Sets logical px used for hero height + CSS vars `--app-vw` / `--app-vh`.
 * During pinch-zoom (`visualViewport.scale > 1`), keep the layout viewport so Safari scales visually without reflow.
 */
export const VB_VISUAL_VIEWPORT_PINCH_SCALE = 1.005;

export function vbIsVisualViewportPinching(): boolean {
  if (typeof window === "undefined") return false;
  const vv = window.visualViewport;
  return vv ? vv.scale > VB_VISUAL_VIEWPORT_PINCH_SCALE : false;
}

export function vbAppViewportPx(): { width: number; height: number } {
  if (typeof window === "undefined") return { width: 1200, height: 800 };
  const vv = window.visualViewport;
  const iw = window.innerWidth;
  const ih = window.innerHeight;
  if (vbIsVisualViewportPinching()) {
    return { width: Math.max(iw, 280), height: Math.max(ih, 320) };
  }
  const w = vv && vv.width > 0 && vv.width <= iw + 16 ? Math.round(vv.width) : iw;
  const h = vv && vv.height >= 240 && vv.height <= ih + 16 ? Math.round(vv.height) : ih;
  return { width: Math.max(w, 280), height: Math.max(h, 320) };
}

export function vbResizeViewportHeightPx(): number {
  return vbAppViewportPx().height;
}

/** Pinned stack height vs viewport (`top-[max(5.75rem,...)]`) and symmetric canvas vertical padding (#F7F6F3). Uses real root rem (`html font-size`). */
export function vbStickyRailsViewportPx(innerHeightPx: number, innerWidthPx?: number): number {
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
export function vbRailsInterGapPx(): number {
  return Math.round(0.875 * vbDocumentRootPx());
}

/** Vertical-bento scroll bypass hysteresis — avoids chatter when flick-scrolling past pinned rails on iOS. */
export const VB_BENTO_SCROLL_BYPASS_ENTER_BOTTOM_PX = -168;
export const VB_BENTO_SCROLL_BYPASS_EXIT_TOP_FRAC = 0.38;

export function vbComputeScrollMetrics(
  innerHeightPx: number,
  railsLayoutHeightPx?: number,
  innerWidthPx?: number,
): VerticalBentoScrollMetrics {
  const vh = Math.max(innerHeightPx, 320);
  const openPx = Math.round(Math.max(vh * 0.82, 400));
  /** Dwell on first two rails — shorter than before so momentum scroll isn’t “trapped” in a huge sticky band. */
  const dwellLongPx = Math.round(Math.max(vh * 2.2, 1040));
  /** Third rail: ~1 viewport so the progress bar still completes one full pass. */
  const dwellThirdPx = Math.round(Math.max(vh * 1.02, 600));
  const swapPx = Math.round(Math.max(vh * 0.5, 360));
  const exitPx = Math.round(Math.max(vh * 0.52, 340));
  const tailPx = Math.round(Math.max(vh * 0.22, 180));
  const scrollablePx =
    openPx + dwellLongPx + swapPx + dwellLongPx + swapPx + dwellThirdPx + exitPx + tailPx;
  const sectionMinPx = scrollablePx + vh;
  const anchor = Math.max(72, Math.min(140, Math.round(vh * 0.095)));
  const railsVhIn = railsLayoutHeightPx ?? vh;
  const stickyColumnH = vbStickyRailsViewportPx(Math.min(vh, railsVhIn), innerWidthPx);
  const milestones = vbBuildMilestonesU(scrollablePx, [
    openPx,
    dwellLongPx,
    swapPx,
    dwellLongPx,
    swapPx,
    dwellThirdPx,
    exitPx,
    tailPx,
  ]);
  return { vh, scrollablePx, sectionMinPx, anchor, stickyColumnH, milestones };
}

export function vbDeriveRails(
  uIn: number,
  ms: VerticalBentoMilestonesU,
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
export function vbPhaseLocalProgress(uIn: number, m: VerticalBentoMilestonesU): number {
  const u = Math.min(Math.max(uIn, 0), 1);
  /** Third-rail dwell only: 0→1 across full scroll of that band (inclusive end at uDw2End). */
  if (m.uDw2End > m.uSwap12End && u >= m.uSwap12End && u <= m.uDw2End) {
    const span = m.uDw2End - m.uSwap12End;
    return span > 1e-9 ? (u - m.uSwap12End) / span : 0;
  }
  /** After third dwell completes, keep the bar full through exit + tail so it does not “unfill”. */
  if (u > m.uDw2End) return 1;

  const segs: readonly [number, number][] = [
    [0, m.uOpenEnd],
    [m.uOpenEnd, m.uDw0End],
    [m.uDw0End, m.uSwap01End],
    [m.uSwap01End, m.uDw1End],
    [m.uDw1End, m.uSwap12End],
  ];
  for (const [a, b] of segs) {
    if (b <= a) continue;
    if (u >= a && u < b) return (u - a) / (b - a);
  }
  return 0;
}

/**
 * Blend rail-0 open vs dwell scrub while the stack settles into view (smooth instead of a hard gate jump).
 */
export function vbGateVerticalBentoUTimeline(
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

export function vbRailHeightPx(exp: number, collapsedPx: number, expandedMaxPx: number): number {
  const denom = Math.max(1 - VB_CLOSED_EXPAND, 1e-6);
  const t = Math.min(Math.max((exp - VB_CLOSED_EXPAND) / denom, 0), 1);
  return collapsedPx + t * (expandedMaxPx - collapsedPx);
}

/** Which rail is visually dominant — progress track clips to its height. */
export function vbDominantRailIndex(exp: readonly [number, number, number]): 0 | 1 | 2 {
  const [e0, e1, e2] = exp;
  if (e0 >= e1 && e0 >= e2) return 0;
  if (e1 >= e2) return 1;
  return 2;
}

/** Vertical bento rails — gradients + overlay motifs aligned with sliding workflow tiles (section 2). */
export const VBENTO_WORKFLOW_GRADIENTS: [string, string, string] = [
  "linear-gradient(135deg, #E7A944 0%, #D49D4F 30%, #D2774C 60%, #1E343A 100%)",
  "linear-gradient(180deg, #E7A944 0%, #D49D4F 25%, #D2774C 55%, #1E343A 100%)",
  "linear-gradient(90deg, #1E343A 0%, #D2774C 38%, #D49D4F 68%, #E7A944 100%)",
];
export const VBENTO_GRAIN_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`;

/** Bento → Built-for-you bridge — three short testimonials (natural wrap, ~5 lines max on phone). */
export type BentoBridgeTestimonial = {
  quote: string;
  name: string;
  meta: string;
  initials: string;
};

export const VBENTO_BRIDGE_TESTIMONIALS: readonly BentoBridgeTestimonial[] = [
  {
    quote:
      "\u201cDoe keeps the busywork from stealing my clinic hours, so patient time stays patient time.\u201d",
    name: "Avery Mills, MD",
    meta: "Physician · Boston, MA",
    initials: "AM",
  },
  {
    quote:
      "\u201cOur front desk keeps up with messages without sounding rushed\u2014Doe holds the noisy parts.\u201d",
    name: "Jamie Chen",
    meta: "Patient Navigator · Toronto, ON",
    initials: "JC",
  },
  {
    quote:
      "\u201cI read fewer frantic threads on the unit and still know what changed before rounds move on.\u201d",
    name: "Jordan Okonkwo, RN",
    meta: "Registered Nurse · Seattle, WA",
    initials: "JO",
  },
] as const;

export function vbBridgeGraphemeLen(s: string): number {
  return Array.from(s).length;
}

export function vbBridgeSliceGraphemes(s: string, n: number): string {
  return Array.from(s).slice(0, Math.max(0, n)).join("");
}

/** Effective layout viewport height inside `zoom < 1` canvas (matches `100dvh / zoom` compensation). */
export function vbRailsEffectiveInnerHeight(innerWidthPx: number, innerHeightPx: number): number {
  const rz = doeforvcRootZoom(innerWidthPx);
  if (rz < 0.999) return innerHeightPx / rz;
  return innerHeightPx;
}
