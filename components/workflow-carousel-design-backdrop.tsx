import {
  WORKFLOW_CAROUSEL_GRAIN_STYLE,
  getWorkflowGridOverlayStyle,
  type WorkflowCarouselDesignBackdrop,
  type WorkflowCarouselGridKind,
} from "@/lib/workflow-carousel-design-backdrops";
import {
  doephoneHeroIntroRingDelayMs,
  DOEPHONE_HERO_INTRO_RING_MS,
} from "@/lib/doephone/hero-intro-timing";
import type { CSSProperties } from "react";

function polarRadialPathD(angleDeg: number, radius = 500): string {
  const rad = (angleDeg * Math.PI) / 180;
  const x = Math.cos(rad) * radius;
  const y = Math.sin(rad) * radius;
  return `M ${500 - x} ${500 - y} L ${500 + x} ${500 + y}`;
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
  const size = `${118 * patternScale}vmax`;
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
        className="pointer-events-none absolute left-1/2 max-w-none"
        style={{
          top: centerY,
          width: size,
          height: size,
          transform: "translate(-50%, -50%)",
        }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid meet"
      >
        {Array.from({ length: 8 }, (_, j) => {
          const angle = j * 45;
          return (
            <path
              key={`polar-radial-${j}`}
              pathLength={1}
              className={`doephone-hero-polar-segment doephone-hero-polar-radial${
                introOnLoad ? " doephone-hero-polar-radial--intro" : ""
              }`}
              d={polarRadialPathD(angle)}
              fill="none"
              strokeWidth="0.8"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
        {Array.from({ length: 6 }, (_, j) => {
          const r = (j + 1) * 150;
          return (
            <circle
              key={`polar-ring-${j}`}
              className={`doephone-hero-polar-segment doephone-hero-polar-ring${
                introOnLoad ? " doephone-hero-polar-ring--intro" : ""
              }`}
              style={ringStyle(j)}
              cx="500"
              cy="500"
              r={r}
              fill="none"
              strokeWidth="0.8"
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
