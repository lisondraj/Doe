/** Second-section scroll-driven sticky workflow carousel scroll math. */

export const WF_CAROUSEL_SCROLL_HOLD_FRAC = 0.38;
/** Extra scroll driver height so dwell + transition spans feel unhurried. */
export const WF_CAROUSEL_SCROLL_STRETCH = 1.5;

/** Map normalized scroll through driver (0..1) to carousel progress; dwell on middle slides only. */
export function wfScrollProgressFromUnitT(t: number, slideCount: number, holdFrac: number): number {
  const last = Math.max(0, slideCount - 1);
  if (slideCount <= 1) return 0;
  if (t <= 0) return 0;
  if (t >= 1) return last;

  const scaled = t * slideCount;
  const seg = Math.min(last, Math.floor(scaled));
  const local = scaled - seg;

  // First slide: no dwell — scroll immediately advances toward slide 1
  if (seg === 0) {
    return Math.min(last, local);
  }
  // Last slide: no dwell — lock progress at final slide without extra hold span
  if (seg >= last) {
    return last;
  }
  if (local < holdFrac) {
    return seg;
  }
  const trans = (local - holdFrac) / Math.max(1e-6, 1 - holdFrac);
  return Math.min(last, seg + trans);
}
