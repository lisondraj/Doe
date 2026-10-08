import { normalizeHost, PRIMARY_SITE_HOST } from "@/lib/site-domains";

/** Runs first in <head> — /premed only. doe.care `/` is the Fall 26 landing, not about-style. */
export function premedRouteBootstrapScript(): string {
  const primaryHost = JSON.stringify(normalizeHost(PRIMARY_SITE_HOST));

  return `(function(){try{var path=location.pathname;var host=(location.hostname||"").split(":")[0].toLowerCase().replace(/^www\\./,"");if(host===${primaryHost}&&path==="/")return;if(path!=="/premed")return;var html=document.documentElement;html.removeAttribute("data-home-page");html.setAttribute("data-about-page","true");html.setAttribute("data-doeforvc-always-phone","true");}catch(e){}})();`;
}
