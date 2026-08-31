import { DOEDTC_PATH } from "@/lib/site-domains";

/** iPhone Safari chrome / overscroll gutters — light Soar-like surface. */
export const DOEDTC_OVERFLOW_SURFACE = "#F8F9FA";
export const DOEDTC_PAGE_SURFACE = "#F8F9FA";
/** Landing page top rubber-band — matches the white at the top of the landing gradient. */
export const DOEDTC_LANDING_OVERFLOW_SURFACE = "#ffffff";
/**
 * Footer / bottom rubber-band fill.
 * iOS Safari: `html` is the document canvas (BOTTOM bounce), `body` is the TOP bounce.
 * Never paint this on `body` — that turns the top rubber-band blue.
 */
export const DOEDTC_FOOTER_OVERFLOW_SURFACE = "#60a5fa";

export function isDoeDtcLandingPath(pathname: string): boolean {
  return pathname === DOEDTC_PATH || pathname === `${DOEDTC_PATH}/`;
}

export function doeDtcTopOverflowSurface(pathname: string): string {
  return isDoeDtcLandingPath(pathname) ? DOEDTC_LANDING_OVERFLOW_SURFACE : DOEDTC_OVERFLOW_SURFACE;
}

/** html = footer blue (bottom bounce), body + theme-color = cream/white (top bounce). */
export function applyDoeDtcOverflowChrome(pathname: string): void {
  if (typeof document === "undefined") return;

  const top = doeDtcTopOverflowSurface(pathname).toLowerCase();
  const bottom = DOEDTC_FOOTER_OVERFLOW_SURFACE.toLowerCase();
  const html = document.documentElement;

  html.style.setProperty("--doe-page-surface", top);
  html.style.setProperty("--proto-page-bg", top);
  html.style.removeProperty("--doedtc-top-overflow");
  html.style.backgroundColor = bottom;
  html.style.removeProperty("background-image");
  html.style.removeProperty("background-size");
  html.style.removeProperty("background-repeat");
  html.style.removeProperty("background-position");

  if (document.body) {
    document.body.style.backgroundColor = top;
    document.body.style.removeProperty("background-image");
    document.body.style.removeProperty("background-size");
    document.body.style.removeProperty("background-repeat");
    document.body.style.removeProperty("background-position");
  }

  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.setAttribute("content", top);
}

export function doeDtcOverflowChromeBootstrapScript(topColor: string): string {
  const top = JSON.stringify(topColor.toLowerCase());
  const bottom = JSON.stringify(DOEDTC_FOOTER_OVERFLOW_SURFACE.toLowerCase());
  return `(function(){try{var html=document.documentElement;var body=document.body;html.style.setProperty("--doe-page-surface",${top});html.style.setProperty("--proto-page-bg",${top});html.style.removeProperty("--doedtc-top-overflow");html.style.backgroundColor=${bottom};html.style.removeProperty("background-image");html.style.removeProperty("background-size");html.style.removeProperty("background-repeat");html.style.removeProperty("background-position");if(body){body.style.backgroundColor=${top};body.style.removeProperty("background-image");body.style.removeProperty("background-size");body.style.removeProperty("background-repeat");body.style.removeProperty("background-position");}var tc=document.querySelector('meta[name="theme-color"]');if(tc)tc.setAttribute("content",${top});}catch(e){}})();`;
}
