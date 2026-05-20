/** Matches Tailwind `wide-desktop` — real desktop/laptop, not phone landscape. */
export const WIDE_DESKTOP_MEDIA_QUERY =
  "(min-width: 1280px) and (hover: hover) and (pointer: fine)";

export function isWideDesktopViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(WIDE_DESKTOP_MEDIA_QUERY).matches;
}
