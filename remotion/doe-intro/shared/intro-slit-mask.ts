export const SLIT_EDGE_FEATHER_X = 22;

const HIDDEN_SLIT_MASK = "linear-gradient(to right, transparent 0%, transparent 100%)";

/** Horizontal center slit — 0 closed, 1 fully open (matches Doe logo reveal). */
export function buildHorizontalSlitMask(reveal: number): string | undefined {
  if (reveal >= 1) {
    return undefined;
  }

  if (reveal <= 0) {
    return HIDDEN_SLIT_MASK;
  }

  const halfWidth = reveal * 50;
  const leftInner = 50 - halfWidth;
  const rightInner = 50 + halfWidth;

  if (halfWidth <= SLIT_EDGE_FEATHER_X * 0.35) {
    return `linear-gradient(to right, transparent 0%, transparent ${leftInner}%, black ${leftInner}%, black ${rightInner}%, transparent ${rightInner}%, transparent 100%)`;
  }

  const leftOuter = Math.max(0, leftInner - SLIT_EDGE_FEATHER_X);
  const leftSoft = Math.max(0, leftInner - SLIT_EDGE_FEATHER_X * 0.48);
  const rightOuter = Math.min(100, rightInner + SLIT_EDGE_FEATHER_X);
  const rightSoft = Math.min(100, rightInner + SLIT_EDGE_FEATHER_X * 0.48);
  return `linear-gradient(to right, transparent ${leftOuter}%, rgba(0,0,0,0.38) ${leftSoft}%, black ${leftInner}%, black ${rightInner}%, rgba(0,0,0,0.38) ${rightSoft}%, transparent ${rightOuter}%)`;
}

export function slitMaskStyle(reveal: number) {
  const mask = buildHorizontalSlitMask(reveal);

  if (!mask) {
    return {};
  }

  return {
    WebkitMaskImage: mask,
    maskImage: mask,
    WebkitMaskSize: "100% 100%",
    maskSize: "100% 100%",
    WebkitMaskRepeat: "no-repeat" as const,
    maskRepeat: "no-repeat" as const,
  };
}
