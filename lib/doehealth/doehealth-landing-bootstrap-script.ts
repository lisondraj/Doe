import { phoneLayoutViewportBootstrapScript } from "@/lib/doephone/phone-layout-viewport";
import { normalizeHost, DESIGNERS_SITE_HOST, PRIMARY_SITE_HOST } from "@/lib/site-domains";

import {
  DESIGNERS_LAYOUT_WIDE_MIN_PX,
  DESIGNERS_PHONE_VMIN_REF_PX,
  DESIGNERS_PHONE_VMIN_VAR,
} from "@/lib/designers/designers-phone-vmin";

import { isDoeHealthLandingRoute } from "@/lib/doehealth/doehealth-landing-paths";
import { ABOUT_BROWN_OVERFLOW_SURFACE, DOE_HOME_DUSK_OVERFLOW_SURFACE } from "@/lib/home/doe-page-colors";

/** iPhone overscroll under footer — brown like /about; sand page-surface tokens kept. */
function doeHealthPhoneOverflowBootstrapScript(): string {
  const brown = JSON.stringify(ABOUT_BROWN_OVERFLOW_SURFACE.toLowerCase());
  const sand = JSON.stringify(DOE_HOME_DUSK_OVERFLOW_SURFACE.toLowerCase());
  return `(function(){try{var html=document.documentElement;html.style.setProperty("--doe-page-surface",${sand});html.style.setProperty("--proto-page-bg",${sand});html.style.backgroundColor=${brown};if(document.body)document.body.style.backgroundColor=${brown};var tc=document.querySelector('meta[name="theme-color"]');if(tc)tc.setAttribute("content",${brown});}catch(e){}})();`;
}

/** Runs in <head> before paint — /doehealth, /designers, and marketing `/` on both domains. */
export function doeHealthLandingTouchBootstrapScript(
  designersSiteHost: string = DESIGNERS_SITE_HOST,
): string {
  const designersHost = normalizeHost(designersSiteHost);
  const primaryHost = normalizeHost(PRIMARY_SITE_HOST);
  const viewportBootstrap = phoneLayoutViewportBootstrapScript();
  const overflowChromeBootstrap = doeHealthPhoneOverflowBootstrapScript();
  const ref = DESIGNERS_PHONE_VMIN_REF_PX;
  const wideMin = DESIGNERS_LAYOUT_WIDE_MIN_PX;
  const vminVar = DESIGNERS_PHONE_VMIN_VAR;
  const landingPaths = ["/doehealth", "/designers"];

  return `(function(){try{var d=${JSON.stringify(designersHost)};var p=${JSON.stringify(primaryHost)};var h=location.hostname.replace(/^www\\./,"").split(":")[0].toLowerCase();var touch=navigator.maxTouchPoints>0;var path=location.pathname;var landingPath=${JSON.stringify(landingPaths)}.some(function(p){return path===p||path.indexOf(p+"/")===0;});var marketingRoot=path==="/"&&(h===d||h===p);if(landingPath){var html=document.documentElement;html.setAttribute("data-designers-page","true");var w=Math.max(280,document.documentElement.clientWidth||window.innerWidth);var vh=window.innerHeight;var vmin=w>${wideMin}?Math.min(${ref},vh):Math.min(w,vh);html.style.setProperty(${JSON.stringify(vminVar)},vmin+"px");if(w>${wideMin})html.setAttribute("data-designers-layout-wide","true");}if((marketingRoot||landingPath)&&touch){var html=document.documentElement;html.setAttribute("data-doeforvc-always-phone","true");html.removeAttribute("data-layout");sessionStorage.removeItem("doephone-app-viewport-lock:"+location.hostname);${overflowChromeBootstrap}}${viewportBootstrap}}catch(e){}})();`;
}

/** /doehealth and /designers layout — early vmin + landing marker. */
export function doeHealthLandingPageBootstrapScript(): string {
  const ref = DESIGNERS_PHONE_VMIN_REF_PX;
  const wideMin = DESIGNERS_LAYOUT_WIDE_MIN_PX;
  const vminVar = DESIGNERS_PHONE_VMIN_VAR;
  const viewportBootstrap = phoneLayoutViewportBootstrapScript();
  const overflowChromeBootstrap = doeHealthPhoneOverflowBootstrapScript();

  return `(function(){try{var html=document.documentElement;html.setAttribute("data-designers-page","true");var w=Math.max(280,document.documentElement.clientWidth||window.innerWidth);var vh=window.innerHeight;var vmin=w>${wideMin}?Math.min(${ref},vh):Math.min(w,vh);html.style.setProperty(${JSON.stringify(vminVar)},vmin+"px");if(w>${wideMin})html.setAttribute("data-designers-layout-wide","true");var touch=navigator.maxTouchPoints>0;if(touch){html.setAttribute("data-doeforvc-always-phone","true");html.removeAttribute("data-layout");sessionStorage.removeItem("doephone-app-viewport-lock:"+location.hostname);${overflowChromeBootstrap}}${viewportBootstrap}}catch(e){}})();`;
}

export function pathnameIsDoeHealthLandingRoute(pathname: string): boolean {
  return isDoeHealthLandingRoute(pathname);
}
