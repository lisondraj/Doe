import {
  STORY_MEET_DOE_MODAL_ALWAYS_SHOW,
  STORY_MEET_DOE_MODAL_STORAGE_KEY,
} from "@/lib/story/story-copy";
import { STORY_ALL_POSTER_URLS } from "@/lib/story/story-shader-posters";

/** Runs before paint on `/story` — hide shell until Meet Doe modal is ready; preload posters. */
export function storyRouteBootstrapScript(): string {
  const pendingStyle =
    "html[data-story-meet-doe-pending] .product-brown-story-mode,html[data-story-meet-doe-pending] .story-tab-pager{visibility:hidden!important}";
  const posterUrls = STORY_ALL_POSTER_URLS;

  return `(function(){try{if(location.pathname!=="/story"&&!location.pathname.startsWith("/story/"))return;var posters=${JSON.stringify(posterUrls)};posters.forEach(function(href){if(document.querySelector('link[rel="preload"][href="'+href+'"]'))return;var link=document.createElement("link");link.rel="preload";link.as="image";link.href=href;document.head.appendChild(link)});var show=${STORY_MEET_DOE_MODAL_ALWAYS_SHOW ? "true" : "false"};if(!show){try{show=sessionStorage.getItem(${JSON.stringify(STORY_MEET_DOE_MODAL_STORAGE_KEY)})!=="1"}catch(e){show=true}}if(!show)return;var html=document.documentElement;html.setAttribute("data-story-meet-doe-pending","true");if(!document.getElementById("story-meet-doe-pending-style")){var style=document.createElement("style");style.id="story-meet-doe-pending-style";style.textContent=${JSON.stringify(pendingStyle)};document.head.appendChild(style)}}catch(e){try{document.documentElement.setAttribute("data-story-meet-doe-pending","true")}catch(e2){}}})();`;
}
