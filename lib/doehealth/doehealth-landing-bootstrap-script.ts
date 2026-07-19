import { phoneLayoutViewportBootstrapScript } from "@/lib/doephone/phone-layout-viewport";
import { normalizeHost, DESIGNERS_SITE_HOST } from "@/lib/site-domains";

import {
  DESIGNERS_LAYOUT_WIDE_MIN_PX,
  DESIGNERS_PHONE_VMIN_REF_PX,
  DESIGNERS_PHONE_VMIN_VAR,
} from "@/lib/designers/designers-phone-vmin";

import { isDoeHealthLandingRoute } from "@/lib/doehealth/doehealth-landing-paths";

/** Runs in <head> before paint — /doehealth, /designers, and doehealth.care root. */
export function doeHealthLandingTouchBootstrapScript(
  designersSiteHost: string = DESIGNERS_SITE_HOST,
): string {
  const host = normalizeHost(designersSiteHost);
  const viewportBootstrap = phoneLayoutViewportBootstrapScript();
  const ref = DESIGNERS_PHONE_VMIN_REF_PX;
  const wideMin = DESIGNERS_LAYOUT_WIDE_MIN_PX;
  const vminVar = DESIGNERS_PHONE_VMIN_VAR;
  const landingPaths = ["/doehealth", "/designers"];

  return `(function(){try{var d=${JSON.stringify(host)};var h=location.hostname.replace(/^www\\./,"").split(":")[0].toLowerCase();var touch=navigator.maxTouchPoints>0;var path=location.pathname;var landingPath=${JSON.stringify(landingPaths)}.some(function(p){return path===p||path.indexOf(p+"/")===0;});if(landingPath){var html=document.documentElement;html.setAttribute("data-designers-page","true");var w=Math.max(280,document.documentElement.clientWidth||window.innerWidth);var vh=window.innerHeight;var vmin=w>${wideMin}?Math.min(${ref},vh):Math.min(w,vh);html.style.setProperty(${JSON.stringify(vminVar)},vmin+"px");if(w>${wideMin})html.setAttribute("data-designers-layout-wide","true");}if((h===d||landingPath)&&touch){var html=document.documentElement;html.setAttribute("data-doeforvc-always-phone","true");html.removeAttribute("data-layout");sessionStorage.removeItem("doephone-app-viewport-lock:"+location.hostname);}${viewportBootstrap}}catch(e){}})();`;
}

/** /doehealth and /designers layout — early vmin + landing marker. */
export function doeHealthLandingPageBootstrapScript(): string {
  const ref = DESIGNERS_PHONE_VMIN_REF_PX;
  const wideMin = DESIGNERS_LAYOUT_WIDE_MIN_PX;
  const vminVar = DESIGNERS_PHONE_VMIN_VAR;
  const viewportBootstrap = phoneLayoutViewportBootstrapScript();

  return `(function(){try{var html=document.documentElement;html.setAttribute("data-designers-page","true");var w=Math.max(280,document.documentElement.clientWidth||window.innerWidth);var vh=window.innerHeight;var vmin=w>${wideMin}?Math.min(${ref},vh):Math.min(w,vh);html.style.setProperty(${JSON.stringify(vminVar)},vmin+"px");if(w>${wideMin})html.setAttribute("data-designers-layout-wide","true");var touch=navigator.maxTouchPoints>0;if(touch){html.setAttribute("data-doeforvc-always-phone","true");html.removeAttribute("data-layout");sessionStorage.removeItem("doephone-app-viewport-lock:"+location.hostname);}${viewportBootstrap}}catch(e){}})();`;
}

export function pathnameIsDoeHealthLandingRoute(pathname: string): boolean {
  return isDoeHealthLandingRoute(pathname);
}
