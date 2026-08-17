import {
  phoneLayoutViewportBootstrapScript,
  phoneOverflowChromeBootstrapScript,
} from "@/lib/doephone/phone-layout-viewport";
import { DOEPHONE_DESKTOP_MEDIA_QUERY } from "@/lib/doephone/resolve-doe-phone-variant";
import { DOEINSURE_PATH } from "@/lib/site-domains";

const DOEINSURE_SURFACE = "#ffffff";

/** Runs before paint on `/doeinsure` — white overflow, phone scaling vs desktop fine-pointer MQ. */
export function doeInsureRouteBootstrapScript(): string {
  const viewportBootstrap = phoneLayoutViewportBootstrapScript();
  const overflowChromeBootstrap = phoneOverflowChromeBootstrapScript(DOEINSURE_SURFACE);
  const storagePrefix = "doephone-app-viewport-lock:";
  const path = JSON.stringify(DOEINSURE_PATH);

  return `(function(){try{if(location.pathname!==${path})return;var html=document.documentElement;var body=document.body;html.removeAttribute("data-home-page");html.removeAttribute("data-about-page");html.setAttribute("data-doeinsure-page","true");${overflowChromeBootstrap}try{sessionStorage.removeItem(${JSON.stringify(storagePrefix)}+location.hostname);}catch(e){}var desktop=window.matchMedia(${JSON.stringify(DOEPHONE_DESKTOP_MEDIA_QUERY)}).matches;if(desktop){html.removeAttribute("data-doeforvc-always-phone");html.removeAttribute("data-doephone-pinching");html.setAttribute("data-layout","desktop");if(body)body.classList.add("desktop-route");html.style.removeProperty("--app-vw");html.style.removeProperty("--app-vh");html.style.removeProperty("--app-vv-offset-top");return;}var touch=navigator.maxTouchPoints>0;if(touch){html.setAttribute("data-doeforvc-always-phone","true");html.removeAttribute("data-layout");if(body)body.classList.remove("desktop-route");${viewportBootstrap}return;}if(body)body.classList.remove("desktop-route");${viewportBootstrap}}catch(e){}})();`;
}
