import {
  DOEDTC_LANDING_OVERFLOW_SURFACE,
  DOEDTC_OVERFLOW_SURFACE,
  doeDtcOverflowChromeBootstrapScript,
} from "@/lib/doedtc/doedtc-chrome";
import { phoneLayoutViewportBootstrapScript } from "@/lib/doephone/phone-layout-viewport";
import { DOEDTC2_PATH, DOEDTC_PATH } from "@/lib/site-domains";

/** Runs before paint on `/doedtc*` - sets page marker and overflow; variant resolved client-side. */
export function doeDtcRouteBootstrapScript(): string {
  const viewportBootstrap = phoneLayoutViewportBootstrapScript();
  const landingOverflowBootstrap = doeDtcOverflowChromeBootstrapScript(DOEDTC_LANDING_OVERFLOW_SURFACE);
  const pageOverflowBootstrap = doeDtcOverflowChromeBootstrapScript(DOEDTC_OVERFLOW_SURFACE);
  const routePath = JSON.stringify(DOEDTC_PATH);
  const doedtc2Path = JSON.stringify(DOEDTC2_PATH);

  return `(function(){try{var path=location.pathname;var extra=path==="/profile"||path==="/onboarding"||path==="/onboarding-2"||path==="/onboarding-3"||path==="/onboarding-4";if(!path.startsWith(${routePath})&&!extra)return;var html=document.documentElement;var body=document.body;html.removeAttribute("data-home-page");html.removeAttribute("data-about-page");html.removeAttribute("data-doeinsure-page");html.removeAttribute("data-doehome-page");html.removeAttribute("data-layout");html.removeAttribute("data-doephone-pinching");html.setAttribute("data-doedtc-page","true");var isDoedtc2=path===${doedtc2Path}||path===${doedtc2Path}+"/";var desktop=!isDoedtc2&&(window.matchMedia("(min-width: 1024px)").matches||window.innerWidth>=1024);html.setAttribute("data-doedtc-variant",desktop?"desktop":"phone");var landing=path===${routePath}||path===${routePath}+"/"||isDoedtc2;if(landing){${landingOverflowBootstrap}}else{${pageOverflowBootstrap}}if(desktop){html.removeAttribute("data-doeforvc-always-phone");if(body)body.classList.add("desktop-route");}else{html.setAttribute("data-doeforvc-always-phone","true");if(body)body.classList.remove("desktop-route");${viewportBootstrap}}}catch(e){}})();`;
}
