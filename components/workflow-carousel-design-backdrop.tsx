import {
  WORKFLOW_CAROUSEL_GRAIN_STYLE,
  getWorkflowGridOverlayStyle,
  type WorkflowCarouselDesignBackdrop,
  type WorkflowCarouselGridKind,
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
  if (half === "a") return `M ${x1} ${y1} L ${cx} ${cy}`;
  if (half === "b") return `M ${x2} ${y2} L ${cx} ${cy}`;
  return `M ${x1} ${y1} L ${x2} ${y2}`;
}

/** Built for you orange panel — radial spokes + concentric rings. */
function PolarGridOverlay({
  patternScale = 1,
  centerY = "36%",
  introOnLoad = false,
}: {
  patternScale?: number;
  centerY?: string;
  introOnLoad?: boolean;
}) {
  const polarCy = polarCenterYUnits(centerY);
  const ringCount = introOnLoad ? DOEPHONE_HERO_INTRO_RING_COUNT : 6;
  const ringStyle = (index: number): CSSProperties | undefined =>
    introOnLoad
      ? {
          animationDelay: `${doephoneHeroIntroRingDelayMs(index)}ms`,
          animationDuration: `${DOEPHONE_HERO_INTRO_RING_MS}ms`,
        }
      : undefined;

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-[2] overflow-hidden${
        introOnLoad ? " doephone-hero-polar-overlay doephone-hero-polar-overlay--intro" : ""
      }`}
      aria-hidden
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox={`0 0 ${POLAR_VIEW} ${POLAR_VIEW}`}
        preserveAspectRatio="xMidYMid slice"
        style={patternScale !== 1 ? { transform: `scale(${patternScale})`, transformOrigin: "center" } : undefined}
        xmlns="http://www.w3.org/2000/svg"
      >
        {Array.from({ length: 8 }, (_, j) => {
          const angle = j * 45;

          if (introOnLoad) {
            return (["a", "b"] as const).map((half) => (
              <path
                key={`polar-radial-${j}-${half}`}
                pathLength={1}
                className="doephone-hero-polar-segment doephone-hero-polar-radial-half doephone-hero-polar-radial-half--intro"
                d={polarSpokePathD(POLAR_CX, polarCy, angle, half)}
                fill="none"
                strokeWidth="0.8"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            ));
          }

          return (
            <path
              key={`polar-radial-${j}`}
              className="doephone-hero-polar-segment doephone-hero-polar-radial"
              d={polarSpokePathD(POLAR_CX, polarCy, angle)}
              fill="none"
              strokeWidth="0.8"
              strokeLinecap="butt"
              vectorEffect="non-scaling-stroke"
            />
          );
        }).flat()}
        {Array.from({ length: ringCount }, (_, j) => {
          const r = (j + 1) * POLAR_RING_STEP;
          return (
            <circle
              key={`polar-ring-${j}`}
              className={`doephone-hero-polar-segment doephone-hero-polar-ring${
                introOnLoad ? " doephone-hero-polar-ring--intro" : ""
              }`}
              style={ringStyle(j)}
              cx={POLAR_CX}
              cy={polarCy}
              r={r}
              fill="none"
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
function WaveGridOverlay({ patternScale = 1 }: { patternScale?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden" aria-hidden>
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
            stroke="rgba(255, 255, 255, 0.12)"
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
}: {
  kind: WorkflowCarouselGridKind;
  patternScale?: number;
  polarCenterY?: string;
  introOnLoad?: boolean;
}) {
  if (kind === "polar") {
    return (
      <PolarGridOverlay
        patternScale={patternScale}
        centerY={polarCenterY}
        introOnLoad={introOnLoad}
      />
    );
  }
  if (kind === "wave") return <WaveGridOverlay patternScale={patternScale} />;

  const style = getWorkflowGridOverlayStyle(kind, patternScale);
  if (!style) return null;

  return <div className="pointer-events-none absolute inset-0 z-[2]" style={style} aria-hidden />;
}

export function WorkflowCarouselDesignBackdrop({
  backdrop,
  className = "",
  embedded = false,
  patternScale = 1,
  gradientOverride,
  gradientScale = 1,
  introOnLoad = false,
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
}) {
  const rootClass = embedded
    ? `absolute inset-0 overflow-hidden [transform:translateZ(0)] ${className}`.trim()
    : `fixed inset-0 min-h-[100dvh] min-w-full overflow-hidden ${className}`.trim();

  const Root = embedded ? "div" : "main";

  return (
    <Root className={rootClass}>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: gradientOverride ?? backdrop.gradient,
          backgroundPosition: embedded || gradientScale !== 1 ? "center center" : undefined,
          backgroundSize: embedded ? "cover" : gradientScale !== 1 ? `${gradientScale * 100}% ${gradientScale * 100}%` : undefined,
          backgroundRepeat: embedded || gradientScale !== 1 ? "no-repeat" : undefined,
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 z-[1]" style={WORKFLOW_CAROUSEL_GRAIN_STYLE} aria-hidden />
      <GridOverlay
        kind={backdrop.grid}
        patternScale={patternScale}
        polarCenterY={backdrop.polarCenterY}
        introOnLoad={introOnLoad}
      />
    </Root>
  );
}
