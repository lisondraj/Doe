"use client";

import { JoinHeroWorkflowCardCluster } from "@/components/join/JoinHeroWorkflowCardCluster";
import { DOEPHONE_HERO_COPY_INSET } from "@/lib/doephone/section-styles";
import { useJoinHeroScrollReveal } from "@/lib/join/use-join-hero-scroll-reveal";

/** Full workflow stack — spans hero gutters, right edge aligned to copy inset. */
export function DoePhoneHeroWorkflowCards() {
  const { ref, revealed } = useJoinHeroScrollReveal();

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute inset-0 z-[2] flex items-end justify-end pb-[clamp(1.5rem,5vmin,2.5rem)] ${DOEPHONE_HERO_COPY_INSET}`}
      aria-hidden
    >
      <JoinHeroWorkflowCardCluster
        variant="hero-left-column"
        surface="beige"
        revealed={revealed}
        style={{
          transform: "scale(1.1)",
          transformOrigin: "right bottom",
        }}
      />
    </div>
  );
}
