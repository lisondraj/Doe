/** Translucent warm glass — outer panel fill. */
export const DOEPHONE_SHORTCUT_PILL_GRADIENT =
  "linear-gradient(135deg, rgba(255,255,255,0.13) 0%, rgba(255,228,196,0.1) 38%, rgba(210,119,76,0.085) 100%)";

/** Translucent warm glass — inner panel fill. */
export const DOEPHONE_SHORTCUT_KEY_GRADIENT =
  "linear-gradient(145deg, rgba(255,255,255,0.24) 0%, rgba(255,236,205,0.14) 52%, rgba(232,169,68,0.07) 100%)";

/** Shared corner radius for Communication glass panels. */
export const DOEPHONE_COMMUNICATION_GLASS_RADIUS_TW =
  "rounded-[clamp(0.55rem,0.44rem+0.48vmin,0.78rem)] iphone-page:rounded-[clamp(0.68rem,0.52rem+0.62vmin,0.92rem)]";

/** Outer keyboard chip glass — corners, blur, shadow. */
export const DOEPHONE_COMMUNICATION_OUTER_GLASS_TW =
  `${DOEPHONE_COMMUNICATION_GLASS_RADIUS_TW} shadow-[inset_0_1px_0_rgba(255,255,255,0.13)] backdrop-blur-[4px] [transform:translateZ(0)] iphone-page:backdrop-blur-[3px]`;

/** Inner key-badge glass — corners, blur, shadow. */
export const DOEPHONE_COMMUNICATION_INNER_GLASS_TW =
  `${DOEPHONE_COMMUNICATION_GLASS_RADIUS_TW} shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-[2px] [transform:translateZ(0)] iphone-page:backdrop-blur-[2px]`;
