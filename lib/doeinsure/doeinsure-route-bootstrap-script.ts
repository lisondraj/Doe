import {
  DOEINSURE_DESKTOP_MEDIA_QUERY,
  DOEINSURE_DEVICE_VIEWPORT,
} from "@/lib/doeinsure/doeinsure-page-variant";
import {
  phoneLayoutViewportBootstrapScript,
  phoneOverflowChromeBootstrapScript,
} from "@/lib/doephone/phone-layout-viewport";
import { DOEINSURE_PATH } from "@/lib/site-domains";

const DOEINSURE_SURFACE = "#ffffff";
const DOEINSURE_IPHONE_OVERFLOW = "#3050e0";

/** Runs before paint on `/doeinsure` — phone overflow matches footer blue; desktop stays white. */
export function doeInsureRouteBootstrapScript(): string {
  const viewportBootstrap = phoneLayoutViewportBootstrapScript();
  const desktopOverflowBootstrap = phoneOverflowChromeBootstrapScript(DOEINSURE_SURFACE);
  const phoneOverflowBootstrap = phoneOverflowChromeBootstrapScript(DOEINSURE_IPHONE_OVERFLOW);
  const storagePrefix = "doephone-app-viewport-lock:";
  const path = JSON.stringify(DOEINSURE_PATH);
  const deviceViewport = JSON.stringify(DOEINSURE_DEVICE_VIEWPORT);

  return `(function(){try{if(location.pathname!==${path})return;var html=document.documentElement;var body=document.body;var meta=document.querySelector('meta[name="viewport"]');html.removeAttribute("data-home-page");html.removeAttribute("data-about-page");html.setAttribute("data-doeinsure-page","true");try{sessionStorage.removeItem(${JSON.stringify(storagePrefix)}+location.hostname);}catch(e){}var desktop=window.matchMedia(${JSON.stringify(DOEINSURE_DESKTOP_MEDIA_QUERY)}).matches||window.innerWidth>=1024;if(desktop){${desktopOverflowBootstrap}html.removeAttribute("data-doeforvc-always-phone");html.removeAttribute("data-doephone-pinching");html.setAttribute("data-layout","desktop");if(body)body.classList.add("desktop-route");html.style.removeProperty("--app-vw");html.style.removeProperty("--app-vh");html.style.removeProperty("--app-vv-offset-top");if(meta)meta.setAttribute("content",${deviceViewport});return;}${phoneOverflowBootstrap}html.setAttribute("data-doeforvc-always-phone","true");html.removeAttribute("data-layout");if(body)body.classList.remove("desktop-route");${viewportBootstrap}}catch(e){}})();`;
}
