import { phoneLayoutViewportBootstrapScript } from "@/lib/doephone/phone-layout-viewport";

/** Runs before paint on /proto — same viewport pin as the home page. */
export function protoPageBootstrapScript(): string {
  const viewportBootstrap = phoneLayoutViewportBootstrapScript();
  const storagePrefix = "doephone-app-viewport-lock:";

  return `(function(){try{var html=document.documentElement;html.setAttribute("data-proto-page","true");html.setAttribute("data-doeforvc-always-phone","true");html.removeAttribute("data-layout");try{sessionStorage.removeItem(${JSON.stringify(storagePrefix)}+location.hostname);}catch(e){}${viewportBootstrap}}catch(e){}})();`;
}
