import {
  WORKFLOW_BEIGE_SURFACE_FILL,
  WORKFLOW_CAROUSEL_GRAIN_STYLE,
  getWorkflowGridOverlayStyle,
  workflowPolarStroke,
  workflowWaveStroke,
  type WorkflowCarouselDesignBackdrop,
  type WorkflowCarouselGridKind,
  type WorkflowCarouselSurface,
} from "@/lib/workflow-carousel-design-backdrops";
import {
  doephoneHeroIntroRingDelayMs,
  DOEPHONE_HERO_INTRO_RING_COUNT,
  DOEPHONE_HERO_INTRO_RING_MS,
} from "@/lib/doephone/hero-intro-timing";
import type { CSSProperties } from "react";

const POLAR_VIEW = 1000;
const POLAR_CX = POLAR_VIEW / 2;
const POLAR_RING_STEP = 150;

function polarCenterYUnits(centerY = "36%"): number {
  const pct = centerY.endsWith("%") ? parseFloat(centerY) : 36;
  return (pct / 100) * POLAR_VIEW;
}

/** Ray from center through viewBox — endpoints always sit on the 1000×1000 bounds. */
function polarSpokeEndpoints(cx: number, cy: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  const dx = Math.cos(rad);
  const dy = Math.sin(rad);
  const ts: number[] = [];

  if (Math.abs(dx) > 1e-9) {
    ts.push(-cx / dx, (POLAR_VIEW - cx) / dx);
  }
  if (Math.abs(dy) > 1e-9) {
    ts.push(-cy / dy, (POLAR_VIEW - cy) / dy);
  }

  const negative = ts.filter((t) => t < 0);
  const positive = ts.filter((t) => t > 0);
  const tNeg = Math.min(...negative);
  const tPos = Math.max(...positive);

  return {
    x1: cx + tNeg * dx,
    y1: cy + tNeg * dy,
    x2: cx + tPos * dx,
    y2: cy + tPos * dy,
  };
}

function polarSpokePathD(
  cx: number,
  cy: number,
  angleDeg: number,
  half?: "a" | "b",
): string {
  const { x1, y1, x2, y2 } = polarSpokeEndpoints(cx, cy, angleDeg);
  /*
   * For the intro animation (stroke-dashoffset 1 → 0 with pathLength=1):
   *   visible region = [dashoffset, 1]  — always includes the PATH END (position 1).
   *
   * To draw edge → center (the "converge from screen edges" effect) the path
   * must START at center and END at the edge.  That way position-1 (the edge)
   * is always anchored on-screen and the growing front sweeps from there toward
   * position-0 (center).
   *
   * Reversed from the previous M edge L center which drew center → edge.
   */
  if (half === "a") return `M ${cx} ${cy} L ${x1} ${y1}`;
  if (half === "b") return `M ${cx} ${cy} L ${x2} ${y2}`;
  return `M ${x1} ${y1} L ${x2} ${y2}`;
}

/** Built for you orange panel — radial spokes + concentric rings. */
function PolarGridOverlay({
  patternScale = 1,
  centerY = "36%",
  introOnLoad = false,
  surface = "orange",
  lineOverlayOpacity,
  clipClassName = "",
}: {
  patternScale?: number;
  centerY?: string;
  introOnLoad?: boolean;
  surface?: WorkflowCarouselSurface;
  lineOverlayOpacity?: number;
  clipClassName?: string;
}) {
  const polarCy = polarCenterYUnits(centerY);
  const ringCount = introOnLoad ? DOEPHONE_HERO_INTRO_RING_COUNT : 6;
  const stroke = workflowPolarStroke(surface, lineOverlayOpacity);
  /** globals.css `.doephone-hero-polar-segment` sets stroke — inline style wins when opacity is custom. */
  const customStrokeStyle =
    lineOverlayOpacity !== undefined && !introOnLoad ? ({ stroke } as CSSProperties) : undefined;
  const ringStyle = (index: number): CSSProperties | undefined =>
    introOnLoad
      ? {
          animationDelay: `${doephoneHeroIntroRingDelayMs(index)}ms`,
          animationDuration: `${DOEPHONE_HERO_INTRO_RING_MS}ms`,
        }
      : undefined;

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-[2] overflow-hidden ${clipClassName}${
        introOnLoad ? " doephone-hero-polar-overlay doephone-hero-polar-overlay--intro" : ""
      }`.trim()}
      aria-hidden
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox={`0 0 ${POLAR_VIEW} ${POLAR_VIEW}`}
        preserveAspectRatio="xMidYMid slice"
        style={patternScale !== 1 ? { transform: `scale(${patternScale})`, transformOrigin: "center" } : undefined}
        xmlns="http://www.w3.org/2000/svg"
      >
        {!introOnLoad &&
          Array.from({ length: 8 }, (_, j) => {
            const angle = j * 45;
            return (
              <path
                key={`polar-radial-${j}`}
                className="doephone-hero-polar-segment doephone-hero-polar-radial"
                d={polarSpokePathD(POLAR_CX, polarCy, angle)}
                fill="none"
                style={customStrokeStyle}
                stroke={customStrokeStyle ? undefined : stroke}
                strokeWidth="0.8"
                strokeLinecap="butt"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        {Array.from({ length: ringCount }, (_, j) => {
          const r = (j + 1) * POLAR_RING_STEP;
          return (
            <circle
              key={`polar-ring-${j}`}
              className={`doephone-hero-polar-segment doephone-hero-polar-ring${
                introOnLoad ? " doephone-hero-polar-ring--intro" : ""
              }`}
              style={{
                ...ringStyle(j),
                ...customStrokeStyle,
                transformOrigin: introOnLoad ? `${POLAR_CX}px ${polarCy}px` : undefined,
              }}
              cx={POLAR_CX}
              cy={polarCy}
              r={r}
              fill="none"
              stroke={customStrokeStyle ? undefined : stroke}
              strokeWidth="0.8"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>
    </div>
  );
}

/** Prior auth slide — curved waves; viewBox includes path bleed so strokes are not clipped. */
function WaveGridOverlay({
  patternScale = 1,
  surface = "orange",
  lineOverlayOpacity,
  clipClassName = "",
}: {
  patternScale?: number;
  surface?: WorkflowCarouselSurface;
  lineOverlayOpacity?: number;
  clipClassName?: string;
}) {
  const stroke = workflowWaveStroke(surface, lineOverlayOpacity);

  return (
    <div className={`pointer-events-none absolute inset-0 z-[2] overflow-hidden ${clipClassName}`.trim()} aria-hidden>
      <svg
        className="pointer-events-none absolute left-1/2 top-1/2 max-w-none"
        style={{
          width: `${100 * patternScale}%`,
          height: `${100 * patternScale}%`,
          transform: "translate(-50%, -50%)",
        }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-40 0 780 716"
        preserveAspectRatio="xMidYMid slice"
      >
        {Array.from({ length: 12 }, (_, w) => (
          <path
            key={`wave-${w}`}
            d={`M -40 ${60 + w * 58} Q 175 ${20 + w * 58} 350 ${60 + w * 58} T 740 ${60 + w * 58}`}
            fill="none"
            stroke={stroke}
            strokeWidth="1"
          />
        ))}
      </svg>
    </div>
  );
}

function GridOverlay({
  kind,
  patternScale = 1,
  polarCenterY = "36%",
  introOnLoad = false,
  surface = "orange",
  lineOverlayOpacity,
  clipClassName = "",
}: {
  kind: WorkflowCarouselGridKind;
  patternScale?: number;
  polarCenterY?: string;
  introOnLoad?: boolean;
  surface?: WorkflowCarouselSurface;
  lineOverlayOpacity?: number;
  clipClassName?: string;
}) {
  if (kind === "polar") {
    return (
      <PolarGridOverlay
        patternScale={patternScale}
        centerY={polarCenterY}
        introOnLoad={introOnLoad}
        surface={surface}
        lineOverlayOpacity={lineOverlayOpacity}
        clipClassName={clipClassName}
      />
    );
  }
  if (kind === "wave") {
    return (
      <WaveGridOverlay
        patternScale={patternScale}
        surface={surface}
        lineOverlayOpacity={lineOverlayOpacity}
        clipClassName={clipClassName}
      />
    );
  }

  const style = getWorkflowGridOverlayStyle(kind, patternScale, surface);
  if (!style) return null;

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-[2] overflow-hidden ${clipClassName}`.trim()}
      style={style}
      aria-hidden
    />
  );
}

export function WorkflowCarouselDesignBackdrop({
  backdrop,
  className = "",
  embedded = false,
  patternScale = 1,
  gradientOverride,
  gradientScale = 1,
  introOnLoad = false,
  surface = "orange",
}: {
  backdrop: WorkflowCarouselDesignBackdrop;
  className?: string;
  /** When true, fills a parent (e.g. tab panel) instead of the viewport. */
  embedded?: boolean;
  /** > 1 spreads grid overlays (e.g. tab panel). */
  patternScale?: number;
  /** Replaces only the gradient layer — grid + grain unchanged. */
  gradientOverride?: string;
  /** Scales only the gradient layer (>1 pushes outer stops past edges). */
  gradientScale?: number;
  /** Staggered fade-in for polar line overlay on load. */
  introOnLoad?: boolean;
  /** Beige uses solid fill and taupe line overlays instead of orange gradient + white lines. */
  surface?: WorkflowCarouselSurface;
}) {
  const isBeige = surface === "beige";
  const fill = isBeige ? WORKFLOW_BEIGE_SURFACE_FILL : (gradientOverride ?? backdrop.gradient);
  const rootClass = embedded
    ? `absolute inset-0 overflow-hidden ${className}`.trim()
    : `fixed inset-0 min-h-[100dvh] min-w-full overflow-hidden ${className}`.trim();
  const layerClass = embedded && className ? className : "";
  const layerInsetClass = embedded ? "absolute -inset-px" : "absolute inset-0";

  const Root = embedded ? "div" : "main";

  return (
    <Root className={rootClass}>
      <div
        className={`pointer-events-none ${layerInsetClass} ${layerClass}`.trim()}
        style={{
          background: fill,
          backgroundPosition: "center center",
          /*
           * Always use a percentage-based background-size for the embedded hero gradient.
           * This prevents a jump when switching between percentage and "cover" — "cover"
           * on a non-square container would produce a differently-sized circle than 100%.
           * At gradientScale=1 we use 100%, which fills the div exactly (no distortion
           * artifact because the gradient outer stops are #1E343A, same as section bg).
           * gradientScale > 1 (scroll zoom) enlarges the tile so only the center orange
           * is visible. gradientScale < 1 (intro) starts as a tiny centered glow.
           */
          backgroundSize: embedded
            ? `${gradientScale * 100}% ${gradientScale * 100}%`
            : gradientScale !== 1 ? `${gradientScale * 100}% ${gradientScale * 100}%` : undefined,
          backgroundRepeat: embedded || gradientScale !== 1 ? "no-repeat" : undefined,
        }}
        aria-hidden
      />
      {!isBeige ? (
        <div
          className={`pointer-events-none ${layerInsetClass} z-[1] ${layerClass}`.trim()}
          style={WORKFLOW_CAROUSEL_GRAIN_STYLE}
          aria-hidden
        />
      ) : null}
      <GridOverlay
        kind={backdrop.grid}
        patternScale={patternScale}
        polarCenterY={backdrop.polarCenterY}
        introOnLoad={introOnLoad}
        surface={surface}
        lineOverlayOpacity={backdrop.lineOverlayOpacity}
        clipClassName={layerClass}
      />
    </Root>
  );
}
