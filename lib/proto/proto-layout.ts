import { phoneLayoutViewportBootstrapScript } from "@/lib/doephone/phone-layout-viewport";

/** Runs before paint on /proto — marks proto route; layout variant is chosen client-side. */
export function protoPageBootstrapScript(): string {
  const viewportBootstrap = phoneLayoutViewportBootstrapScript();
  const storagePrefix = "doephone-app-viewport-lock:";

  return `(function(){try{var html=document.documentElement;html.setAttribute("data-proto-page","true");try{sessionStorage.removeItem(${JSON.stringify(storagePrefix)}+location.hostname);}catch(e){}${viewportBootstrap}}catch(e){}})();`;
}
