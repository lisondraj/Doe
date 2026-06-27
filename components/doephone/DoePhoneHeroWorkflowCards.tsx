"use client";

import { JoinHeroWorkflowCardCluster } from "@/components/join/JoinHeroWorkflowCardCluster";
import { DOEPHONE_SECTION_CAROUSEL_INSET_X } from "@/lib/doephone/section-styles";
import { useJoinHeroScrollReveal } from "@/lib/join/use-join-hero-scroll-reveal";

/** Full workflow stack — page gutters, full width, large in-card type. */
export function DoePhoneHeroWorkflowCards() {
  const { ref, revealed } = useJoinHeroScrollReveal();

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute inset-0 z-[2] flex items-end justify-start pb-[clamp(1.5rem,5vmin,2.5rem)] ${DOEPHONE_SECTION_CAROUSEL_INSET_X}`}
      aria-hidden
    >
      <JoinHeroWorkflowCardCluster variant="hero-left-column" surface="beige" revealed={revealed} />
    </div>
  );
}
