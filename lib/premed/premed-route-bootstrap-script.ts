import { normalizeHost, PRIMARY_SITE_HOST } from "@/lib/site-domains";

/** Runs first in <head> — doe.care `/` must never inherit home-page attrs before about bootstraps. */
export function premedRouteBootstrapScript(): string {
  const primaryHost = JSON.stringify(normalizeHost(PRIMARY_SITE_HOST));

  return `(function(){try{var path=location.pathname;var host=(location.hostname||"").split(":")[0].toLowerCase().replace(/^www\\./,"");if(path!=="/"||host!==${primaryHost})return;var html=document.documentElement;html.removeAttribute("data-home-page");html.setAttribute("data-about-page","true");html.setAttribute("data-doeforvc-always-phone","true");}catch(e){}})();`;
}
