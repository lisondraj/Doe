import { phoneLayoutViewportBootstrapScript, phoneOverflowChromeBootstrapScript } from "@/lib/doephone/phone-layout-viewport";
import { DOEPHONE_DESKTOP_MEDIA_QUERY } from "@/lib/doephone/resolve-doe-phone-variant";
import { DOE_PAGE_SURFACE } from "@/lib/home/doe-page-colors";

/** Runs before paint on `/about` — touch phone scaling, viewport pin, sessionStorage lock clear. */
export function aboutRouteBootstrapScript(): string {
  const viewportBootstrap = phoneLayoutViewportBootstrapScript();
  const overflowChromeBootstrap = phoneOverflowChromeBootstrapScript(DOE_PAGE_SURFACE.toLowerCase());
  const storagePrefix = "doephone-app-viewport-lock:";

  return `(function(){try{if(location.pathname!=="/about")return;var html=document.documentElement;html.setAttribute("data-about-page","true");${overflowChromeBootstrap}try{sessionStorage.removeItem(${JSON.stringify(storagePrefix)}+location.hostname);}catch(e){}var touch=navigator.maxTouchPoints>0;if(touch){html.setAttribute("data-doeforvc-always-phone","true");html.removeAttribute("data-layout");${viewportBootstrap}return;}var desktop=window.matchMedia(${JSON.stringify(DOEPHONE_DESKTOP_MEDIA_QUERY)}).matches;if(desktop){html.removeAttribute("data-doeforvc-always-phone");html.removeAttribute("data-doephone-pinching");html.setAttribute("data-layout","desktop");html.style.removeProperty("--app-vw");html.style.removeProperty("--app-vh");html.style.removeProperty("--app-vv-offset-top");return;}${viewportBootstrap}}catch(e){}})();`;
}
