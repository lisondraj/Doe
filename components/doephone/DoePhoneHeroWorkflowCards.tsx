"use client";

import { JoinHeroWorkflowCardCluster } from "@/components/join/JoinHeroWorkflowCardCluster";
import { DOEPHONE_HERO_COPY_INSET } from "@/lib/doephone/section-styles";
import { useJoinHeroScrollReveal } from "@/lib/join/use-join-hero-scroll-reveal";

/** Left menu + scheduling agent — full hero width between copy gutters. */
export function DoePhoneHeroWorkflowCards() {
  const { ref, revealed } = useJoinHeroScrollReveal();

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute inset-0 z-[2] flex items-center ${DOEPHONE_HERO_COPY_INSET}`}
      aria-hidden
    >
      <JoinHeroWorkflowCardCluster
        variant="hero-scheduling"
        surface="beige"
        revealed={revealed}
        style={{
          width: "100%",
          maxWidth: "100%",
        }}
      />
    </div>
  );
}
