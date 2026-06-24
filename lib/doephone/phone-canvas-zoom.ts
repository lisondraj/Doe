import { LAYOUT_W_REFERENCE } from "@/lib/doephone/resolve-layout-width";

const LAYOUT_W_MIN = 280;
const ZOOM_MIN = 0.38;

/**
 * Uniform canvas scale with Pro Max (430px) as the 1.0 reference.
 * Unlike `doeforvcRootZoom`, this does not shrink at 430 — it matches doe.care production.
 */
export function phoneCanvasZoom(layoutW: number): number {
  const w = Math.max(LAYOUT_W_MIN, layoutW);
  return Math.min(1, Math.max(ZOOM_MIN, w / LAYOUT_W_REFERENCE));
}
