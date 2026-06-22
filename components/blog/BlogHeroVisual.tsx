import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import type { WorkflowCarouselDesignBackdrop as WorkflowCarouselDesignBackdropType } from "@/lib/workflow-carousel-design-backdrops";

export function BlogHeroVisual({
  backdrop,
  compact = false,
}: {
  backdrop: WorkflowCarouselDesignBackdropType;
  compact?: boolean;
}) {
  return (
    <div
      className={`relative mx-auto w-full overflow-hidden rounded-[1.35rem] shadow-[0_18px_56px_rgba(0,0,0,0.12)] iphone-page:rounded-[clamp(1.25rem,1rem+1.4vmin,1.75rem)] ${
        compact
          ? "mt-0 aspect-[16/10] max-w-[min(100%,12rem)]"
          : "mt-10 max-w-[min(100%,38rem)] aspect-[4/3] iphone-page:mt-12"
      }`}
      aria-hidden
    >
      <WorkflowCarouselDesignBackdrop
        backdrop={backdrop}
        embedded
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
