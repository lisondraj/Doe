import { DOEDTC_PATH } from "@/lib/site-domains";

/** iPhone Safari chrome / overscroll gutters — light Soar-like surface. */
export const DOEDTC_OVERFLOW_SURFACE = "#F8F9FA";
export const DOEDTC_PAGE_SURFACE = "#F8F9FA";
/** Landing page top rubber-band — matches the white at the top of the landing gradient. */
export const DOEDTC_LANDING_OVERFLOW_SURFACE = "#ffffff";
/**
 * Footer / bottom rubber-band fill.
 * iOS paints `body` on BOTH bounces. Use body background-color for the bottom
 * bounce, and a no-repeat cream/white background-image only at the top so the
 * top bounce stays cream/white.
 */
export const DOEDTC_FOOTER_OVERFLOW_SURFACE = "#60a5fa";
const TOP_OVERFLOW_PATCH = "100% 120lvh";

export function isDoeDtcLandingPath(pathname: string): boolean {
  return pathname === DOEDTC_PATH || pathname === `${DOEDTC_PATH}/`;
}

export function doeDtcTopOverflowSurface(pathname: string): string {
  return isDoeDtcLandingPath(pathname) ? DOEDTC_LANDING_OVERFLOW_SURFACE : DOEDTC_OVERFLOW_SURFACE;
}

function paintSplitOverflow(target: HTMLElement, top: string, bottom: string): void {
  target.style.backgroundColor = bottom;
  target.style.backgroundImage = `linear-gradient(${top}, ${top})`;
  target.style.backgroundRepeat = "no-repeat";
  target.style.backgroundPosition = "top";
  target.style.backgroundSize = TOP_OVERFLOW_PATCH;
}

/** Body/html canvas = footer blue; a top-only cream/white patch keeps the pull-down bounce. */
export function applyDoeDtcOverflowChrome(pathname: string): void {
  if (typeof document === "undefined") return;

  const top = doeDtcTopOverflowSurface(pathname).toLowerCase();
  const bottom = DOEDTC_FOOTER_OVERFLOW_SURFACE.toLowerCase();
  const html = document.documentElement;

  html.style.setProperty("--doe-page-surface", top);
  html.style.setProperty("--proto-page-bg", top);
  html.style.setProperty("--doedtc-top-overflow", top);
  paintSplitOverflow(html, top, bottom);
  if (document.body) paintSplitOverflow(document.body, top, bottom);

  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.setAttribute("content", top);
}

export function doeDtcOverflowChromeBootstrapScript(topColor: string): string {
  const top = JSON.stringify(topColor.toLowerCase());
  const bottom = JSON.stringify(DOEDTC_FOOTER_OVERFLOW_SURFACE.toLowerCase());
  const patch = JSON.stringify(TOP_OVERFLOW_PATCH);
  return `(function(){try{var html=document.documentElement;var body=document.body;html.style.setProperty("--doe-page-surface",${top});html.style.setProperty("--proto-page-bg",${top});html.style.setProperty("--doedtc-top-overflow",${top});function paint(el){if(!el)return;el.style.backgroundColor=${bottom};el.style.backgroundImage="linear-gradient("+${top}+","+${top}+")";el.style.backgroundRepeat="no-repeat";el.style.backgroundPosition="top";el.style.backgroundSize=${patch};}paint(html);paint(body);var tc=document.querySelector('meta[name="theme-color"]');if(tc)tc.setAttribute("content",${top});}catch(e){}})();`;
}
