import { DOEDTC_OVERFLOW_SURFACE } from "@/lib/doedtc/doedtc-chrome";
import {
  phoneLayoutViewportBootstrapScript,
  phoneOverflowChromeBootstrapScript,
} from "@/lib/doephone/phone-layout-viewport";
import { DOEDTC_PATH } from "@/lib/site-domains";

/** Runs before paint on `/doedtc*` - always iPhone chrome with cream overflow. */
export function doeDtcRouteBootstrapScript(): string {
  const viewportBootstrap = phoneLayoutViewportBootstrapScript();
  const overflowBootstrap = phoneOverflowChromeBootstrapScript(DOEDTC_OVERFLOW_SURFACE);
  const routePath = JSON.stringify(DOEDTC_PATH);

  return `(function(){try{if(!location.pathname.startsWith(${routePath}))return;var html=document.documentElement;var body=document.body;html.removeAttribute("data-home-page");html.removeAttribute("data-about-page");html.removeAttribute("data-doeinsure-page");html.removeAttribute("data-doehome-page");html.removeAttribute("data-layout");html.removeAttribute("data-doephone-pinching");html.setAttribute("data-doedtc-page","true");html.setAttribute("data-doeforvc-always-phone","true");if(body)body.classList.remove("desktop-route");${overflowBootstrap}${viewportBootstrap}}catch(e){}})();`;
}
