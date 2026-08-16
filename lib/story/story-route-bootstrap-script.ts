import {
  STORY_MEET_DOE_MODAL_ALWAYS_SHOW,
  STORY_MEET_DOE_MODAL_STORAGE_KEY,
} from "@/lib/story/story-copy";

/** Runs before paint on `/story` — hide shell until Meet Doe modal is ready. */
export function storyRouteBootstrapScript(): string {
  const pendingStyle =
    "html[data-story-meet-doe-pending] .product-brown-story-mode,html[data-story-meet-doe-pending] .story-tab-pager{visibility:hidden!important}";

  return `(function(){try{if(location.pathname!=="/story")return;var show=${STORY_MEET_DOE_MODAL_ALWAYS_SHOW ? "true" : "false"};if(!show){try{show=sessionStorage.getItem(${JSON.stringify(STORY_MEET_DOE_MODAL_STORAGE_KEY)})!=="1"}catch(e){show=true}}if(!show)return;var html=document.documentElement;html.setAttribute("data-story-meet-doe-pending","true");if(!document.getElementById("story-meet-doe-pending-style")){var style=document.createElement("style");style.id="story-meet-doe-pending-style";style.textContent=${JSON.stringify(pendingStyle)};document.head.appendChild(style)}}catch(e){try{document.documentElement.setAttribute("data-story-meet-doe-pending","true")}catch(e2){}}})();`;
}
