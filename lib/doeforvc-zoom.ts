/**
 * Root `zoom` for the phone-layout canvas: readable shrink on narrow widths, then scales up
 * proportionally as the viewport widens so the experience stays “iPhone UI” at every size.
 */
export function doeforvcRootZoom(innerWidthPx: number): number {
  const w = Math.max(280, innerWidthPx);
  const pivot = 430;
  const zPivot = Math.min(1, Math.max(0.38, (pivot - 16) / 800));
  if (w <= pivot) {
    return Math.min(1, Math.max(0.38, (w - 16) / 800));
  }
  return Math.min(3, zPivot * (w / pivot));
}
