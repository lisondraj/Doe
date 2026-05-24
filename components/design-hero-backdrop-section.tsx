import { HeroCarouselTextureOverlay } from "@/components/hero-carousel-texture";
import { DotWaveCanvas } from "@/components/dot-wave-canvas";
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
  children,
}: {
  className?: string;
  /** `dots` = static CSS grid. `dot-wave` = animated canvas wave. */
  overlay?: "crosshatch" | "dots" | "dot-wave";
  dotPatternCellPx?: number;
  dotOverlayOpacity?: number;
  children?: React.ReactNode;
}) {
  return (
    <section
      className={`relative min-h-[100dvh] min-h-screen w-full overflow-hidden ${className}`.trim()}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: HERO_BACKDROP_GRADIENT }}
      />

      {overlay === "dots" && (
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
      )}

      {overlay === "dot-wave" && (
        <>
          <div className="pointer-events-none absolute inset-0 z-[1]" style={WORKFLOW_CAROUSEL_GRAIN_STYLE} aria-hidden />
          <div className="pointer-events-none absolute inset-0 z-[2]">
            <DotWaveCanvas className="absolute inset-0 h-full w-full" />
          </div>
        </>
      )}

      {overlay === "crosshatch" && <HeroCarouselTextureOverlay />}

      {children ? <div className="relative z-10 min-h-[inherit] w-full">{children}</div> : null}
    </section>
  );
}
