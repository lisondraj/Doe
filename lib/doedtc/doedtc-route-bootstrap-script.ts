import {
  DOEDTC_FOOTER_OVERFLOW_SURFACE,
  DOEDTC_LANDING_OVERFLOW_SURFACE,
  DOEDTC_OVERFLOW_SURFACE,
} from "@/lib/doedtc/doedtc-chrome";
import {
  phoneLayoutViewportBootstrapScript,
  phoneSplitOverflowChromeBootstrapScript,
} from "@/lib/doephone/phone-layout-viewport";
import { DOEDTC_PATH } from "@/lib/site-domains";

/** Runs before paint on `/doedtc*` - sets page marker and overflow; variant resolved client-side. */
export function doeDtcRouteBootstrapScript(): string {
  const viewportBootstrap = phoneLayoutViewportBootstrapScript();
  const landingOverflowBootstrap = phoneSplitOverflowChromeBootstrapScript(
    DOEDTC_LANDING_OVERFLOW_SURFACE,
    DOEDTC_FOOTER_OVERFLOW_SURFACE,
  );
  const pageOverflowBootstrap = phoneSplitOverflowChromeBootstrapScript(
    DOEDTC_OVERFLOW_SURFACE,
    DOEDTC_FOOTER_OVERFLOW_SURFACE,
  );
  const routePath = JSON.stringify(DOEDTC_PATH);

  return `(function(){try{var path=location.pathname;var extra=path==="/profile"||path==="/onboarding";if(!path.startsWith(${routePath})&&!extra)return;var html=document.documentElement;var body=document.body;html.removeAttribute("data-home-page");html.removeAttribute("data-about-page");html.removeAttribute("data-doeinsure-page");html.removeAttribute("data-doehome-page");html.removeAttribute("data-layout");html.removeAttribute("data-doephone-pinching");html.setAttribute("data-doedtc-page","true");var desktop=window.matchMedia("(min-width: 1024px)").matches||window.innerWidth>=1024;html.setAttribute("data-doedtc-variant",desktop?"desktop":"phone");var landing=path===${routePath}||path===${routePath}+"/";if(landing){${landingOverflowBootstrap}}else{${pageOverflowBootstrap}}if(desktop){html.removeAttribute("data-doeforvc-always-phone");if(body)body.classList.add("desktop-route");}else{html.setAttribute("data-doeforvc-always-phone","true");if(body)body.classList.remove("desktop-route");${viewportBootstrap}}}catch(e){}})();`;
}
