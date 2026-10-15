/** Pause before desk motion begins (desktop only). */
export const DOEHEALTH_DESK_DESKTOP_MOTION_ENTRY_DELAY_MS = 360;

export function isDoehealthDeskDesktopViewport() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(min-width: 1024px)").matches;
}
