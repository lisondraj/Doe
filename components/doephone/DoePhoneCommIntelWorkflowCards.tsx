"use client";

import { JoinHeroWorkflowCardCluster } from "@/components/join/JoinHeroWorkflowCardCluster";
import { DOEPHONE_SECTION_CONTENT_INSET } from "@/lib/doephone/section-styles";
import { useJoinHeroScrollReveal } from "@/lib/join/use-join-hero-scroll-reveal";

/** Workflow card bento from join “Where we're at right now” — sized for iPhone comm + intelligence. */
export function DoePhoneCommIntelWorkflowCards() {
  const { ref, revealed } = useJoinHeroScrollReveal();

  return (
    <div
      ref={ref}
      className={`pointer-events-none w-full ${DOEPHONE_SECTION_CONTENT_INSET} pb-[max(1.75rem,calc(env(safe-area-inset-bottom,0px)+1.25rem))] pt-4`}
      aria-hidden
    >
      <JoinHeroWorkflowCardCluster
        surface="orange"
        revealed={revealed}
        style={{
          width: "100%",
          maxWidth: "100%",
          transform: "scale(0.96)",
          transformOrigin: "top center",
        }}
      />
    </div>
  );
}
