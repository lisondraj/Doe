import { PHONE_LAYOUT_REFERENCE_WIDTH } from "@/lib/doephone/phone-layout-viewport";

/** iPhone layout reference for designers — matches phone-layout viewport pin. */
export const DESIGNERS_PHONE_VMIN_REF_PX = PHONE_LAYOUT_REFERENCE_WIDTH;

export const DESIGNERS_PHONE_VMIN_VAR = "--designers-vmin";

/** Width above which layout viewport is pinned — keep in sync with phone-layout-viewport. */
export const DESIGNERS_LAYOUT_WIDE_MIN_PX = PHONE_LAYOUT_REFERENCE_WIDTH + 32;

export function readDesignersAppVhPx(): number {
  if (typeof window === "undefined") return 844;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--app-vh")
    .trim();
  const parsed = parseFloat(raw);
  if (Number.isFinite(parsed) && parsed > 0) return parsed;
  return window.innerHeight;
}

/** Stable vmin for designers iPhone canvas — ignores inflated desktop layout width. */
export function computeDesignersVminPx(
  layoutWidthPx = typeof document !== "undefined"
    ? document.documentElement.clientWidth
    : DESIGNERS_PHONE_VMIN_REF_PX,
): number {
  const layoutW = Math.max(280, layoutWidthPx);
  const vh = readDesignersAppVhPx();
  const ref = Math.min(DESIGNERS_PHONE_VMIN_REF_PX, vh);
  if (layoutW <= DESIGNERS_LAYOUT_WIDE_MIN_PX) {
    return Math.min(layoutW, vh);
  }
  return ref;
}

export function isDesignersLayoutWide(
  layoutWidthPx = typeof document !== "undefined"
    ? document.documentElement.clientWidth
    : DESIGNERS_PHONE_VMIN_REF_PX,
): boolean {
  return layoutWidthPx > DESIGNERS_LAYOUT_WIDE_MIN_PX;
}
