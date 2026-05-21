/** Workflow carousel slide caption classes (below white UI mocks on gradient cards). */

/** Position (left/right) is applied via inline style — computed from slide scale so captions
 *  are always inside the visible card area even on portrait-phone where the inner 700px div overflows. */
export const slideCaptionWrap =
  "absolute bottom-9 z-[5] flex flex-col items-start gap-2.5 pointer-events-auto iphone-page:bottom-11";
export const slideCaptionBadge =
  "inline-flex max-w-[calc(100%-2px)] shrink-0 items-center rounded-full border border-white/95 bg-white/5 px-[15px] py-[8px] text-[20px] font-semibold leading-snug tracking-[-0.02em] text-white shadow-[0_2px_14px_rgba(0,0,0,0.14)]";
export const slideCaptionBody =
  "w-full min-w-0 max-w-[min(340px,calc(100%-4px))] text-left text-[18px] font-medium leading-[1.48] tracking-[-0.012em] text-white/[0.92] break-words [overflow-wrap:anywhere]";
export const slideCaptionFont = { fontFamily: "system-ui, -apple-system, sans-serif" } as const;
