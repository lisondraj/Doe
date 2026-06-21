import {
  WORKFLOW_CAROUSEL_GRAIN_STYLE,
  getWorkflowGridOverlayStyle,
  type WorkflowCarouselDesignBackdrop,
  type WorkflowCarouselGridKind,
} from "@/lib/workflow-carousel-design-backdrops";

/** Built for you orange panel — radial spokes + concentric rings. */
function PolarGridOverlay({ patternScale = 1 }: { patternScale?: number }) {
  const size = `${118 * patternScale}vmax`;

  return (
    <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden" aria-hidden>
      <svg
        className="pointer-events-none absolute left-1/2 max-w-none"
        style={{
          top: "36%",
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
          const radius = 500;
          return (
            <path
              key={`polar-radial-${j}`}
              d={`M 500 500 L ${500 + Math.cos((angle * Math.PI) / 180) * radius} ${500 + Math.sin((angle * Math.PI) / 180) * radius}`}
              fill="none"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="0.8"
            />
          );
        })}
        {Array.from({ length: 6 }, (_, j) => {
          const r = (j + 1) * 150;
          return (
            <circle
              key={`polar-ring-${j}`}
              cx="500"
              cy="500"
              r={r}
              fill="none"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="0.8"
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
}: {
  kind: WorkflowCarouselGridKind;
  patternScale?: number;
}) {
  if (kind === "polar") return <PolarGridOverlay patternScale={patternScale} />;
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
}: {
  backdrop: WorkflowCarouselDesignBackdrop;
  className?: string;
  /** When true, fills a parent (e.g. tab panel) instead of the viewport. */
  embedded?: boolean;
  /** > 1 spreads grid overlays (e.g. tab panel). */
  patternScale?: number;
  /** Replaces only the gradient layer — grid + grain unchanged. */
  gradientOverride?: string;
}) {
  const rootClass = embedded
    ? `absolute inset-0 overflow-hidden ${className}`.trim()
    : `fixed inset-0 min-h-[100dvh] min-w-full overflow-hidden ${className}`.trim();

  const Root = embedded ? "div" : "main";

  return (
    <Root className={rootClass}>
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: gradientOverride ?? backdrop.gradient }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 z-[1]" style={WORKFLOW_CAROUSEL_GRAIN_STYLE} aria-hidden />
      <GridOverlay kind={backdrop.grid} patternScale={patternScale} />
    </Root>
  );
}
