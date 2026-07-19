import { phoneLayoutViewportBootstrapScript, phoneOverflowChromeBootstrapScript } from "@/lib/doephone/phone-layout-viewport";
import { DOEPHONE_DESKTOP_MEDIA_QUERY } from "@/lib/doephone/resolve-doe-phone-variant";
import { DOE_HOME_DUSK_OVERFLOW_SURFACE } from "@/lib/home/doe-page-colors";
import { normalizeHost, DESIGNERS_SITE_HOST } from "@/lib/site-domains";

/** Runs before paint on doe.care `/` only — not doehealth.care or /doehealth. */
export function homeRouteBootstrapScript(): string {
  const viewportBootstrap = phoneLayoutViewportBootstrapScript();
  const overflowChromeBootstrap = phoneOverflowChromeBootstrapScript(DOE_HOME_DUSK_OVERFLOW_SURFACE.toLowerCase());
  const storagePrefix = "doephone-app-viewport-lock:";
  const designersHost = normalizeHost(DESIGNERS_SITE_HOST);
  const landingPaths = ["/doehealth", "/designers"];

  return `(function(){try{var path=location.pathname;var h=location.hostname.replace(/^www\\./,"").split(":")[0].toLowerCase();var landingPath=${JSON.stringify(landingPaths)}.some(function(p){return path===p||path.indexOf(p+"/")===0;});if(landingPath||h===${JSON.stringify(designersHost)})return;if(path!=="/")return;var html=document.documentElement;html.removeAttribute("data-about-page");html.setAttribute("data-home-page","true");${overflowChromeBootstrap}try{sessionStorage.removeItem(${JSON.stringify(storagePrefix)}+location.hostname);}catch(e){}var touch=navigator.maxTouchPoints>0;if(touch){html.setAttribute("data-doeforvc-always-phone","true");html.removeAttribute("data-layout");${viewportBootstrap}return;}var desktop=window.matchMedia(${JSON.stringify(DOEPHONE_DESKTOP_MEDIA_QUERY)}).matches;if(desktop){html.removeAttribute("data-doeforvc-always-phone");html.removeAttribute("data-doephone-pinching");html.setAttribute("data-layout","desktop");html.style.removeProperty("--app-vw");html.style.removeProperty("--app-vh");html.style.removeProperty("--app-vv-offset-top");html.style.overflow="";var body=document.body;if(body){body.classList.add("desktop-route");body.classList.remove("doephone-route");body.style.overflow="";}return;}${viewportBootstrap}}catch(e){}})();`;
}
