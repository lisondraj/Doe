"use client";

import { JoinHeroWorkflowCardCluster } from "@/components/join/JoinHeroWorkflowCardCluster";
import { DOEPHONE_HERO_COPY_INSET } from "@/lib/doephone/section-styles";
import { useJoinHeroScrollReveal } from "@/lib/join/use-join-hero-scroll-reveal";

/** Workflow bento — join “Where we're at right now” palette, centered in the hero. */
export function DoePhoneHeroWorkflowCards() {
  const { ref, revealed } = useJoinHeroScrollReveal();

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute inset-0 z-[2] flex items-center justify-center ${DOEPHONE_HERO_COPY_INSET}`}
      aria-hidden
    >
      <JoinHeroWorkflowCardCluster
        variant="hero-scheduling"
        surface="beige"
        revealed={revealed}
        style={{
          width: "100%",
          maxWidth: "100%",
          transform: "scale(1.14)",
          transformOrigin: "center center",
        }}
      />
    </div>
  );
}
