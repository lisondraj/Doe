import { phoneLayoutViewportBootstrapScript } from "@/lib/doephone/phone-layout-viewport";
import { normalizeHost } from "@/lib/site-domains";

/** Runs in <head> before paint — correct viewport + phone attrs on touch devices. */
export function designersTouchPhoneBootstrapScript(
  designersSiteHost: string,
): string {
  const host = normalizeHost(designersSiteHost);
  const viewportBootstrap = phoneLayoutViewportBootstrapScript();

  return `(function(){try{var d=${JSON.stringify(host)};var h=location.hostname.replace(/^www\\./,"").split(":")[0].toLowerCase();var touch=navigator.maxTouchPoints>0;if(h===d&&touch){var html=document.documentElement;html.setAttribute("data-doeforvc-always-phone","true");html.removeAttribute("data-layout");sessionStorage.removeItem("doephone-app-viewport-lock:"+location.hostname);}${viewportBootstrap}}catch(e){}})();`;
}
