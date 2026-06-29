import { normalizeHost } from "@/lib/site-domains";

const PINCH_VIEWPORT =
  "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover";

/** Runs in <head> before paint — locks phone canvas on doehealth.care touch devices. */
export function designersTouchPhoneBootstrapScript(
  designersSiteHost: string,
): string {
  const host = normalizeHost(designersSiteHost);
  const viewport = PINCH_VIEWPORT;

  return `(function(){try{var d=${JSON.stringify(host)};var h=location.hostname.replace(/^www\\./,"").split(":")[0].toLowerCase();if(h!==d||navigator.maxTouchPoints<1)return;var html=document.documentElement;html.setAttribute("data-doeforvc-always-phone","true");html.removeAttribute("data-layout");var m=document.querySelector('meta[name="viewport"]');if(m)m.setAttribute("content",${JSON.stringify(viewport)});sessionStorage.removeItem("doephone-app-viewport-lock:"+location.hostname);}catch(e){}})();`;
}
