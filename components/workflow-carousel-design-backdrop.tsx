import {
  WORKFLOW_CAROUSEL_GRAIN_STYLE,
  type WorkflowCarouselDesignBackdrop,
} from "@/lib/workflow-carousel-design-backdrops";

function HexGridOverlay({ patternId }: { patternId: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden" aria-hidden>
      <svg
        className="absolute inset-0 h-full w-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1000 1000"
      >
        <defs>
          <pattern
            id={patternId}
            x="0"
            y="0"
            width="80"
            height="69.28"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 80 17.32 L 80 51.96 L 40 69.28 L 0 51.96 L 0 17.32 Z"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="0.8"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}

function DotGridOverlay({ patternId }: { patternId: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden" aria-hidden>
      <svg
        className="absolute inset-0 h-full w-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 700 700"
      >
        <defs>
          <pattern id={patternId} x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
            <circle cx="25" cy="25" r="1.5" fill="rgba(255, 255, 255, 0.25)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}

function CrosshatchGridOverlay({ patternId }: { patternId: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden" aria-hidden>
      <svg
        className="absolute inset-0 h-full w-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 700 700"
      >
        <defs>
          <pattern id={patternId} x="0" y="0" width="56" height="56" patternUnits="userSpaceOnUse">
            <path
              d="M 0 0 L 56 0 M 0 0 L 0 56"
              fill="none"
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="0.8"
            />
            <circle cx="28" cy="28" r="1" fill="rgba(255, 255, 255, 0.18)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}

function DiagonalGridOverlay({ patternId }: { patternId: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden" aria-hidden>
      <svg
        className="absolute inset-0 h-full w-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 700 700"
      >
        <defs>
          <pattern
            id={patternId}
            x="0"
            y="0"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <path
              d="M 0 0 L 60 0 M 0 0 L 0 60"
              fill="none"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="0.8"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}

export function WorkflowCarouselDesignBackdrop({
  backdrop,
  patternIdPrefix = "design",
}: {
  backdrop: WorkflowCarouselDesignBackdrop;
  patternIdPrefix?: string;
}) {
  const patternId = `${patternIdPrefix}-grid-${backdrop.slideIndex}`;

  return (
    <main className="fixed inset-0 min-h-[100dvh] min-w-full overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: backdrop.gradient }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 z-[1]" style={WORKFLOW_CAROUSEL_GRAIN_STYLE} aria-hidden />
      {backdrop.grid === "hex" ? (
        <HexGridOverlay patternId={patternId} />
      ) : backdrop.grid === "diagonal" ? (
        <DiagonalGridOverlay patternId={patternId} />
      ) : backdrop.grid === "crosshatch" ? (
        <CrosshatchGridOverlay patternId={patternId} />
      ) : (
        <DotGridOverlay patternId={patternId} />
      )}
    </main>
  );
}
