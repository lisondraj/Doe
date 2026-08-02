import { ABOUT_STYLE_PAGE_PATHS } from "@/lib/about/about-style-page-paths";
import { phoneLayoutViewportBootstrapScript, phoneOverflowChromeBootstrapScript } from "@/lib/doephone/phone-layout-viewport";
import { DOEPHONE_DESKTOP_MEDIA_QUERY } from "@/lib/doephone/resolve-doe-phone-variant";
import { DOE_HOME_DUSK_OVERFLOW_SURFACE } from "@/lib/home/doe-page-colors";

/** Runs before paint on about-style pages — touch phone scaling, viewport pin, sessionStorage lock clear. */
export function aboutRouteBootstrapScript(): string {
  const viewportBootstrap = phoneLayoutViewportBootstrapScript();
  const overflowChromeBootstrap = phoneOverflowChromeBootstrapScript(DOE_HOME_DUSK_OVERFLOW_SURFACE.toLowerCase());
  const storagePrefix = "doephone-app-viewport-lock:";
  const paths = JSON.stringify(ABOUT_STYLE_PAGE_PATHS);

  return `(function(){try{var path=location.pathname;if(${paths}.indexOf(path)===-1)return;var html=document.documentElement;html.removeAttribute("data-home-page");html.setAttribute("data-about-page","true");${overflowChromeBootstrap}try{sessionStorage.removeItem(${JSON.stringify(storagePrefix)}+location.hostname);}catch(e){}var touch=navigator.maxTouchPoints>0;if(touch){html.setAttribute("data-doeforvc-always-phone","true");html.removeAttribute("data-layout");${viewportBootstrap}return;}var desktop=window.matchMedia(${JSON.stringify(DOEPHONE_DESKTOP_MEDIA_QUERY)}).matches;if(desktop){html.removeAttribute("data-doeforvc-always-phone");html.removeAttribute("data-doephone-pinching");html.setAttribute("data-layout","desktop");html.style.removeProperty("--app-vw");html.style.removeProperty("--app-vh");html.style.removeProperty("--app-vv-offset-top");return;}${viewportBootstrap}}catch(e){}})();`;
}
