/** Reset every common document scroll surface (html, body, window). */
export function resetDocumentScroll() {
  if (typeof window === "undefined") return;

  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}
