/** Hero / footer backdrop — matches `app/page.tsx` HERO_BACKDROP_GRADIENT + line mesh. */
export const HERO_BACKDROP_GRADIENT = `
  linear-gradient(152deg, #1a2e34 0%, #243a40 14%, #3d2f28 32%, #6b442f 48%, #a85a34 62%, #d4893f 76%, #e8b04d 88%, #f2cf7a 100%),
  radial-gradient(ellipse 100% 80% at 50% 110%, rgba(231, 169, 68, 0.55) 0%, transparent 58%),
  radial-gradient(ellipse 55% 45% at 12% 18%, rgba(255, 224, 180, 0.22) 0%, transparent 52%),
  radial-gradient(ellipse 50% 40% at 88% 22%, rgba(210, 119, 76, 0.3) 0%, transparent 55%)
`;

/** @deprecated Use `HeroCarouselTextureOverlay` (grain + crosshatch grid). */
export const HERO_LINE_MESH_OVERLAY = {
  opacity: 0.55,
  mixBlendMode: "soft-light" as const,
  backgroundImage: `
    repeating-linear-gradient(
      -32deg,
      transparent 0px,
      transparent 11px,
      rgba(255, 255, 255, 0.09) 11px,
      rgba(255, 255, 255, 0.09) 12px
    ),
    repeating-linear-gradient(
      32deg,
      transparent 0px,
      transparent 15px,
      rgba(30, 52, 58, 0.14) 15px,
      rgba(30, 52, 58, 0.14) 16px
    )`,
};
