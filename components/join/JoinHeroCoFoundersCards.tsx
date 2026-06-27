"use client";

import { JoinHeroWorkflowCardCluster } from "@/components/join/JoinHeroWorkflowCardCluster";
import { suisseIntl } from "@/lib/home/fonts";
import { useJoinHeroScrollReveal } from "@/lib/join/use-join-hero-scroll-reveal";
import type { WorkflowCarouselSurface } from "@/lib/workflow-carousel-design-backdrops";

const CLUSTER_SCALE = 0.94;

/** Glass card cluster — non-overlapping bento grid (join hero band). */
export function JoinHeroCoFoundersCards({
  variant,
  surface = "orange",
}: {
  variant: "mobile" | "desktop";
  surface?: WorkflowCarouselSurface;
}) {
  const { ref, revealed } = useJoinHeroScrollReveal();

  if (variant === "mobile") return null;

  const isBeige = surface === "beige";

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute z-[2] ${suisseIntl.className}`}
      aria-hidden
      style={{
        top: "50%",
        left: isBeige ? "46%" : "40%",
        right: "clamp(4.5rem, 9vw, 7.5rem)",
        transform: `translateY(-50%) translateX(1.25rem) scale(${CLUSTER_SCALE})`,
        transformOrigin: "right center",
      }}
    >
      <JoinHeroWorkflowCardCluster surface={surface} revealed={revealed} />
    </div>
  );
}
