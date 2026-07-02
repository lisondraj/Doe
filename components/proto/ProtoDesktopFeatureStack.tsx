"use client";

import { ProtoDesktopFeatureSection } from "@/components/proto/ProtoDesktopFeatureSection";
import { PROTO_COMMUNICATION_SLIDES } from "@/lib/proto/proto-communication-slides";
import { protoFeatureCopy } from "@/lib/proto/proto-feature-copy";

/** Desktop /proto — stacked feature sections matching the iPhone slide order and copy. */
export function ProtoDesktopFeatureStack() {
  return (
    <>
      {PROTO_COMMUNICATION_SLIDES.map((slide) => {
        const copy = protoFeatureCopy(slide.id);
        if (!copy) return null;

        return <ProtoDesktopFeatureSection key={slide.id} slide={slide} copy={copy} />;
      })}
    </>
  );
}
