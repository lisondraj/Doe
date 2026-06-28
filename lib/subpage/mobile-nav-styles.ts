import {
  DESKTOP_NAV_ACTION_HEIGHT_TW,
  DESKTOP_NAV_ACTION_SIZE,
} from "@/lib/subpage/desktop-nav-styles";

/** iPhone nav — mail + investors controls (same proportions as desktop). */
export const MOBILE_NAV_ACTION_CTA_LAYOUT = `flex ${DESKTOP_NAV_ACTION_HEIGHT_TW} shrink-0 items-center justify-center font-medium leading-none transition-opacity hover:opacity-90 active:opacity-80`;

export const MOBILE_NAV_ACTION_CTA_BASE = `${MOBILE_NAV_ACTION_CTA_LAYOUT} bg-black text-white`;

export const MOBILE_NAV_MAIL_BUTTON_TW = `${MOBILE_NAV_ACTION_CTA_LAYOUT} rounded-md !px-0`;

export const MOBILE_NAV_MAIL_ICON_TW = "h-[1.25rem] w-[1.25rem]";

export const MOBILE_NAV_SPLIT_LINK_TW = `${MOBILE_NAV_ACTION_CTA_LAYOUT} rounded-none px-7 text-[0.9375rem]`;

export const MOBILE_NAV_SPLIT_TOGGLE_TW = `${MOBILE_NAV_ACTION_CTA_LAYOUT} rounded-none border-l !px-0`;

export const MOBILE_NAV_SPLIT_SHELL_TW =
  "relative flex items-stretch overflow-visible rounded-md";

export const MOBILE_NAV_SPLIT_INNER_TW =
  "flex items-stretch overflow-hidden rounded-md";

export const MOBILE_NAV_DROPDOWN_ATTACH_TW =
  "absolute left-0 right-0 top-[calc(100%+0.5rem)] z-[60] overflow-hidden rounded-md";

export { DESKTOP_NAV_ACTION_SIZE };
