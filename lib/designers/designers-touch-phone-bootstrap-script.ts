import { phoneLayoutViewportBootstrapScript } from "@/lib/doephone/phone-layout-viewport";
import { normalizeHost } from "@/lib/site-domains";

import {
  DESIGNERS_LAYOUT_WIDE_MIN_PX,
  DESIGNERS_PHONE_VMIN_REF_PX,
  DESIGNERS_PHONE_VMIN_VAR,
} from "@/lib/designers/designers-phone-vmin";

/** Runs in <head> before paint — designers path + doehealth.care touch phone attrs. */
export function designersTouchPhoneBootstrapScript(
  designersSiteHost: string,
): string {
  const host = normalizeHost(designersSiteHost);
  const viewportBootstrap = phoneLayoutViewportBootstrapScript();
  const ref = DESIGNERS_PHONE_VMIN_REF_PX;
  const wideMin = DESIGNERS_LAYOUT_WIDE_MIN_PX;
  const vminVar = DESIGNERS_PHONE_VMIN_VAR;

  return `(function(){try{var d=${JSON.stringify(host)};var h=location.hostname.replace(/^www\\./,"").split(":")[0].toLowerCase();var touch=navigator.maxTouchPoints>0;var path=location.pathname;var designersPath=path==="/designers"||path.indexOf("/designers/")===0;if(designersPath){var html=document.documentElement;html.setAttribute("data-designers-page","true");var w=Math.max(280,document.documentElement.clientWidth||window.innerWidth);var vh=window.innerHeight;var vmin=w>${wideMin}?Math.min(${ref},vh):Math.min(w,vh);html.style.setProperty(${JSON.stringify(vminVar)},vmin+"px");if(w>${wideMin})html.setAttribute("data-designers-layout-wide","true");}if((h===d||designersPath)&&touch){var html=document.documentElement;html.setAttribute("data-doeforvc-always-phone","true");html.removeAttribute("data-layout");sessionStorage.removeItem("doephone-app-viewport-lock:"+location.hostname);}${viewportBootstrap}}catch(e){}})();`;
}

/** /designers layout only — early vmin + designers-page marker (no global viewport side effects). */
export function designersPageBootstrapScript(): string {
  const ref = DESIGNERS_PHONE_VMIN_REF_PX;
  const wideMin = DESIGNERS_LAYOUT_WIDE_MIN_PX;
  const vminVar = DESIGNERS_PHONE_VMIN_VAR;
  const viewportBootstrap = phoneLayoutViewportBootstrapScript();

  return `(function(){try{var html=document.documentElement;html.setAttribute("data-designers-page","true");var w=Math.max(280,document.documentElement.clientWidth||window.innerWidth);var vh=window.innerHeight;var vmin=w>${wideMin}?Math.min(${ref},vh):Math.min(w,vh);html.style.setProperty(${JSON.stringify(vminVar)},vmin+"px");if(w>${wideMin})html.setAttribute("data-designers-layout-wide","true");var touch=navigator.maxTouchPoints>0;if(touch){html.setAttribute("data-doeforvc-always-phone","true");html.removeAttribute("data-layout");sessionStorage.removeItem("doephone-app-viewport-lock:"+location.hostname);}${viewportBootstrap}}catch(e){}})();`;
}
