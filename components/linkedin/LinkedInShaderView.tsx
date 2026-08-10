"use client";

import { ProtoGrainGradient } from "@/components/proto/ProtoGrainGradient";
import { pulseCallHistoryCarouselShaderSurface } from "@/lib/linkedin/pulse-call-history-carousel-shader";

/** Full-viewport Pulse Call History carousel shader — for LinkedIn banner capture. */
export function LinkedInShaderView() {
  const shader = pulseCallHistoryCarouselShaderSurface();

  return (
    <main
      className="fixed inset-0 h-[100dvh] w-screen overflow-hidden"
      style={{ backgroundColor: shader.colorBack }}
      aria-hidden
    >
      <ProtoGrainGradient
        static
        variant={shader.variant}
        colors={shader.colors}
        colorBack={shader.colorBack}
        className="absolute inset-0 h-full w-full"
      />
    </main>
  );
}
