import { HeroCarouselTextureOverlay } from "@/components/hero-carousel-texture";
import { HERO_BACKDROP_GRADIENT } from "@/lib/hero-backdrop";
import {
  WORKFLOW_CAROUSEL_GRAIN_STYLE,
  WORKFLOW_DOT_GRID_STYLE,
} from "@/lib/workflow-carousel-design-backdrops";

/** Hero gradient + texture overlay (`/design` crosshatch, `/design2` dots). */
export function DesignHeroBackdropSection({
  className = "",
  overlay = "crosshatch",
  /** Repeat size for dots overlay (`/design2`); smaller px = denser dots. */
  dotPatternCellPx = 50,
  /** Multiplies dot layer visibility; grain is unchanged (`overlay="dots"` only). */
  dotOverlayOpacity = 1,
}: {
  className?: string;
  /** `dots` matches `/design2` (Care routing slide). */
  overlay?: "crosshatch" | "dots";
  dotPatternCellPx?: number;
  dotOverlayOpacity?: number;
}) {
  return (
    <section
      className={`relative min-h-[100dvh] min-h-screen w-full overflow-hidden ${className}`.trim()}
      aria-hidden
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: HERO_BACKDROP_GRADIENT }}
      />
      {overlay === "dots" ? (
        <>
          <div className="pointer-events-none absolute inset-0 z-[1]" style={WORKFLOW_CAROUSEL_GRAIN_STYLE} aria-hidden />
          <div
            className="pointer-events-none absolute inset-0 z-[2]"
            style={{
              ...WORKFLOW_DOT_GRID_STYLE,
              backgroundSize: `${dotPatternCellPx}px ${dotPatternCellPx}px`,
              opacity: dotOverlayOpacity,
            }}
            aria-hidden
          />
        </>
      ) : (
        <HeroCarouselTextureOverlay />
      )}
    </section>
  );
}
