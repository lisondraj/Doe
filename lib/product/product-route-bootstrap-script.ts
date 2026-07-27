import {
  phoneLayoutViewportBootstrapScript,
  phoneOverflowChromeBootstrapScript,
} from "@/lib/doephone/phone-layout-viewport";
import { DOEPHONE_DESKTOP_MEDIA_QUERY } from "@/lib/doephone/resolve-doe-phone-variant";

/** Runs before paint on `/product` — touch phone scaling vs desktop fine-pointer MQ. */
export function productRouteBootstrapScript(): string {
  const viewportBootstrap = phoneLayoutViewportBootstrapScript();
  const overflowChromeBootstrap = phoneOverflowChromeBootstrapScript("#1a1208");
  const storagePrefix = "doephone-app-viewport-lock:";

  return `(function(){try{if(location.pathname!=="/product")return;var html=document.documentElement;html.removeAttribute("data-home-page");html.removeAttribute("data-about-page");html.setAttribute("data-product-page","true");${overflowChromeBootstrap}try{sessionStorage.removeItem(${JSON.stringify(storagePrefix)}+location.hostname);}catch(e){}var touch=navigator.maxTouchPoints>0;if(touch){html.setAttribute("data-doeforvc-always-phone","true");html.removeAttribute("data-layout");${viewportBootstrap}return;}var desktop=window.matchMedia(${JSON.stringify(DOEPHONE_DESKTOP_MEDIA_QUERY)}).matches;if(desktop){html.removeAttribute("data-doeforvc-always-phone");html.removeAttribute("data-doephone-pinching");html.setAttribute("data-layout","desktop");html.style.removeProperty("--app-vw");html.style.removeProperty("--app-vh");html.style.removeProperty("--app-vv-offset-top");return;}${viewportBootstrap}}catch(e){}})();`;
}
