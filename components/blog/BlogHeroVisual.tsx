import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import type { WorkflowCarouselDesignBackdrop as WorkflowCarouselDesignBackdropType } from "@/lib/workflow-carousel-design-backdrops";
import { BLOG_FEATURE_BOX_TW, BLOG_TITLE_VISUAL_GAP } from "@/lib/blog/blog-layout-styles";

export function BlogHeroVisual({
  backdrop,
  variant = "hero",
  boxClassName,
  gapClassName,
  patternScale,
}: {
  backdrop: WorkflowCarouselDesignBackdropType;
  variant?: "hero" | "list";
  boxClassName?: string;
  gapClassName?: string;
  patternScale?: number;
}) {
  const gap = gapClassName ?? (variant === "hero" ? BLOG_TITLE_VISUAL_GAP : "");

  return (
    <div
      className={`relative w-full overflow-hidden ${boxClassName ?? BLOG_FEATURE_BOX_TW} ${gap}`.trim()}
      aria-hidden
    >
      <WorkflowCarouselDesignBackdrop
        backdrop={backdrop}
        embedded
        className="absolute inset-0 h-full w-full"
        patternScale={patternScale}
      />
    </div>
  );
}
