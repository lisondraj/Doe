import {
  WORKFLOW_CAROUSEL_GRAIN_STYLE,
  getWorkflowGridOverlayStyle,
  type WorkflowCarouselDesignBackdrop,
} from "@/lib/workflow-carousel-design-backdrops";

export function WorkflowCarouselDesignBackdrop({
  backdrop,
}: {
  backdrop: WorkflowCarouselDesignBackdrop;
}) {
  return (
    <main className="fixed inset-0 min-h-[100dvh] min-w-full overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: backdrop.gradient }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 z-[1]" style={WORKFLOW_CAROUSEL_GRAIN_STYLE} aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={getWorkflowGridOverlayStyle(backdrop.grid)}
        aria-hidden
      />
    </main>
  );
}
