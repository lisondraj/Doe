import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import type { WorkflowCarouselDesignBackdrop as WorkflowCarouselDesignBackdropType } from "@/lib/workflow-carousel-design-backdrops";
import { BLOG_FEATURE_BOX_TW, BLOG_TITLE_VISUAL_GAP } from "@/lib/blog/blog-layout-styles";

export function BlogHeroVisual({
  backdrop,
  variant = "hero",
}: {
  backdrop: WorkflowCarouselDesignBackdropType;
  variant?: "hero" | "list";
}) {
  return (
    <div
      className={`relative w-full overflow-hidden ${BLOG_FEATURE_BOX_TW} ${
        variant === "hero" ? BLOG_TITLE_VISUAL_GAP : ""
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
