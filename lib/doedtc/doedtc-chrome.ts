import { DOEDTC_PATH } from "@/lib/site-domains";

/** iPhone Safari chrome / overscroll gutters — light Soar-like surface. */
export const DOEDTC_OVERFLOW_SURFACE = "#F8F9FA";
export const DOEDTC_PAGE_SURFACE = "#F8F9FA";
/** Landing page top rubber-band — matches the white at the top of the landing gradient. */
export const DOEDTC_LANDING_OVERFLOW_SURFACE = "#ffffff";
/** Footer / bottom rubber-band fill. Never paint this on html/body — iOS reveals body at the top bounce. */
export const DOEDTC_FOOTER_OVERFLOW_SURFACE = "#60a5fa";

export function isDoeDtcLandingPath(pathname: string): boolean {
  return pathname === DOEDTC_PATH || pathname === `${DOEDTC_PATH}/`;
}

export function doeDtcTopOverflowSurface(pathname: string): string {
  return isDoeDtcLandingPath(pathname) ? DOEDTC_LANDING_OVERFLOW_SURFACE : DOEDTC_OVERFLOW_SURFACE;
}
