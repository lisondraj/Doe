/** Shared horizontal inset for /doephone section copy — matches hero. */
export const DOEPHONE_SECTION_COPY_INSET =
  "pl-14 pr-6 iphone-page:pl-[max(2.35rem,calc(env(safe-area-inset-left,0px)+5.25vmin))] iphone-page:pr-[max(1.65rem,env(safe-area-inset-right,0px))]";

/** Standard content gutter for all sections (same left edge as hero headline). */
export const DOEPHONE_SECTION_CONTENT_INSET = DOEPHONE_SECTION_COPY_INSET;

/** Top offset for section titles (~52% of prior padding — just under half removed). */
export const DOEPHONE_SECTION_TITLE_PT =
  "pt-[max(1.95rem,calc(env(safe-area-inset-top,0px)+7.25svh))]";

/** Upper-mid placement for section titles (sections 2+). */
export const DOEPHONE_SECTION_COPY_POSITION =
  `absolute inset-0 z-[3] flex flex-col items-start justify-start ${DOEPHONE_SECTION_TITLE_PT} pb-8`;

/** Suisse Intl light — between hero and prior section scale. */
export const DOEPHONE_SECTION_COPY_TW =
  "text-left font-light leading-[1.02] tracking-[-0.03em] text-[clamp(3.05rem,11.75vw,5.15rem)] iphone-page:text-[clamp(2.9rem,11vw,4.85rem)]";

/** Full iPhone viewport band below hero. */
export const DOEPHONE_VIEWPORT_SECTION =
  "relative z-10 w-full min-h-[100svh] h-[100svh] iphone-page:min-h-[100dvh] iphone-page:h-[100dvh]";

/** Top offset when the title shares a section with the carousel (section 2). */
export const DOEPHONE_SECTION_TITLE_PT_STACKED =
  "pt-[max(0.25rem,calc(env(safe-area-inset-top,0px)+2.6svh))]";
