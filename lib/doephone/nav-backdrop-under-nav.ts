export type NavBackdropKind = "sand" | "shader";

/** Sections where the punched-out nav should use a warm sand capsule. */
const SHADER_BACKDROP_SELECTOR =
  ".home-feature-shader-band, .doephone-hero-section";

/**
 * Sample the page directly under the nav bar — sand bands vs teal shader bands
 * need opposite frost tones for legibility.
 */
export function navBackdropUnderNav(navEl: HTMLElement | null): NavBackdropKind {
  if (!navEl || typeof document === "undefined") return "sand";

  const rect = navEl.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return "sand";

  const x = Math.round(rect.left + rect.width * 0.5);
  const y = Math.round(Math.min(window.innerHeight - 1, rect.bottom + 8));

  const stack = document.elementsFromPoint(x, y);
  for (const el of stack) {
    if (!(el instanceof Element) || navEl.contains(el)) continue;
    if (el.closest(SHADER_BACKDROP_SELECTOR)) return "shader";
    if (el.closest(".home-feature-card-section")) return "sand";
  }

  return "sand";
}
