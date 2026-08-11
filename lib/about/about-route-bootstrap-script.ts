import { ABOUT_STYLE_PAGE_PATHS } from "@/lib/about/about-style-page-paths";
import { phoneLayoutViewportBootstrapScript, phoneOverflowChromeBootstrapScript } from "@/lib/doephone/phone-layout-viewport";
import { DOEPHONE_DESKTOP_MEDIA_QUERY } from "@/lib/doephone/resolve-doe-phone-variant";
import { DOE_HOME_DUSK_OVERFLOW_SURFACE } from "@/lib/home/doe-page-colors";
import { PREMED_PATH, PRIMARY_SITE_HOST, normalizeHost } from "@/lib/site-domains";

/** Runs before paint on about-style pages — touch phone scaling, viewport pin, sessionStorage lock clear. */
export function aboutRouteBootstrapScript(): string {
  const viewportBootstrap = phoneLayoutViewportBootstrapScript();
  const overflowChromeBootstrap = phoneOverflowChromeBootstrapScript(DOE_HOME_DUSK_OVERFLOW_SURFACE.toLowerCase());
  const storagePrefix = "doephone-app-viewport-lock:";
  const paths = JSON.stringify(ABOUT_STYLE_PAGE_PATHS);
  const primaryHost = JSON.stringify(normalizeHost(PRIMARY_SITE_HOST));
  const premedPath = JSON.stringify(PREMED_PATH);

  return `(function(){try{var path=location.pathname;var host=(location.hostname||"").split(":")[0].toLowerCase().replace(/^www\\./,"");if(path==="/"&&host===${primaryHost})path=${premedPath};if(${paths}.indexOf(path)===-1)return;var html=document.documentElement;var body=document.body;html.removeAttribute("data-home-page");html.setAttribute("data-about-page","true");${overflowChromeBootstrap}try{sessionStorage.removeItem(${JSON.stringify(storagePrefix)}+location.hostname);}catch(e){}var touch=navigator.maxTouchPoints>0;if(touch){html.setAttribute("data-doeforvc-always-phone","true");html.removeAttribute("data-layout");if(body)body.classList.remove("desktop-route");${viewportBootstrap}return;}var desktop=window.matchMedia(${JSON.stringify(DOEPHONE_DESKTOP_MEDIA_QUERY)}).matches;if(desktop){html.removeAttribute("data-doeforvc-always-phone");html.removeAttribute("data-doephone-pinching");html.setAttribute("data-layout","desktop");if(body)body.classList.add("desktop-route");html.style.removeProperty("--app-vw");html.style.removeProperty("--app-vh");html.style.removeProperty("--app-vv-offset-top");return;}if(body)body.classList.remove("desktop-route");${viewportBootstrap}}catch(e){}})();`;
}
