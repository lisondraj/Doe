"use client";

import { JoinHeroWorkflowCardCluster } from "@/components/join/JoinHeroWorkflowCardCluster";
import { useJoinHeroScrollReveal } from "@/lib/join/use-join-hero-scroll-reveal";

/** Workflow stack — sits in hero bottom column below the headline. */
export function DoePhoneHeroWorkflowCards() {
  const { ref, revealed } = useJoinHeroScrollReveal();

  return (
    <div ref={ref} className="pointer-events-none w-full min-w-0" aria-hidden>
      <JoinHeroWorkflowCardCluster variant="hero-left-column" surface="beige" revealed={revealed} />
    </div>
  );
}
