/** Pro Max reference — matches `3.7209vw` root font at 430px. */
export const LAYOUT_W_REFERENCE = 430;

const LAYOUT_W_MIN = 280;
const LAYOUT_W_MAX = 520;

export type ResolvedLayoutWidth = {
  layoutW: number;
  browserVw: number;
  /** True when viewport meta should be pinned to layoutW (fake-wide webviews). */
  needsViewportPin: boolean;
};

function screenLogicalWidth(innerW: number): number {
  if (typeof screen === "undefined" || !screen.width) return 0;

  const dpr = window.devicePixelRatio || 1;
  let w = Math.round(screen.width);

  if (w > innerW * 1.25 && dpr > 1) {
    w = Math.round(screen.width / dpr);
  }

  return w;
}

/**
 * Resolve phone layout width.
 * - Normal phones: pass through `innerWidth`.
 * - Fake-wide mobile webviews: pin to smallest plausible phone width.
 * - Real desktop (wide screen + wide viewport): never pin.
 */
export function resolveLayoutWidth(): ResolvedLayoutWidth {
  const browserVw = window.innerWidth;
  const screenW = screenLogicalWidth(browserVw);

  if (browserVw <= LAYOUT_W_MAX) {
    return { layoutW: browserVw, browserVw, needsViewportPin: false };
  }

  if (screenW > LAYOUT_W_MAX) {
    return { layoutW: browserVw, browserVw, needsViewportPin: false };
  }

  const vvW = window.visualViewport?.width ?? 0;

  const candidates: number[] = [];
  if (vvW > 0) candidates.push(Math.round(vvW));
  if (screenW > 0) candidates.push(screenW);

  const phoneCandidates = candidates.filter(
    (c) => c >= LAYOUT_W_MIN && c <= LAYOUT_W_MAX,
  );

  const layoutW =
    phoneCandidates.length > 0
      ? Math.min(...phoneCandidates)
      : LAYOUT_W_REFERENCE;

  return {
    layoutW: Math.max(LAYOUT_W_MIN, Math.min(layoutW, LAYOUT_W_MAX)),
    browserVw,
    needsViewportPin: true,
  };
}
