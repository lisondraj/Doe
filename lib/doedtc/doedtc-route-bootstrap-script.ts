import {
  DOEDTC_DESKTOP_MEDIA_QUERY,
  DOEDTC_DEVICE_VIEWPORT,
} from "@/lib/doedtc/doedtc-page-variant";
import {
  phoneLayoutViewportBootstrapScript,
  phoneOverflowChromeBootstrapScript,
} from "@/lib/doephone/phone-layout-viewport";
import { DOEDTC_PATH } from "@/lib/site-domains";
import { DOE_PAGE_SURFACE } from "@/lib/home/doe-page-colors";

/** Runs before paint on `/doedtc` — cream health brand on phone and desktop. */
export function doeDtcRouteBootstrapScript(): string {
  const viewportBootstrap = phoneLayoutViewportBootstrapScript();
  const overflowBootstrap = phoneOverflowChromeBootstrapScript(DOE_PAGE_SURFACE);
  const routePath = JSON.stringify(DOEDTC_PATH);
  const deviceViewport = JSON.stringify(DOEDTC_DEVICE_VIEWPORT);
  const desktopMq = JSON.stringify(DOEDTC_DESKTOP_MEDIA_QUERY);

  return `(function(){try{if(!location.pathname.startsWith(${routePath}))return;var html=document.documentElement;var body=document.body;var meta=document.querySelector('meta[name="viewport"]');html.removeAttribute("data-home-page");html.removeAttribute("data-about-page");html.removeAttribute("data-doeinsure-page");html.setAttribute("data-doedtc-page","true");var desktop=window.matchMedia(${desktopMq}).matches||window.innerWidth>=1024;if(desktop){${overflowBootstrap}html.removeAttribute("data-doeforvc-always-phone");html.removeAttribute("data-doephone-pinching");html.setAttribute("data-layout","desktop");if(body)body.classList.add("desktop-route");html.style.removeProperty("--app-vw");html.style.removeProperty("--app-vh");html.style.removeProperty("--app-vv-offset-top");if(meta)meta.setAttribute("content",${deviceViewport});return;}${overflowBootstrap}html.setAttribute("data-doeforvc-always-phone","true");html.removeAttribute("data-layout");if(body)body.classList.remove("desktop-route");${viewportBootstrap}}catch(e){}})();`;
}
