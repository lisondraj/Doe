"use client";

import { DoePhoneHeroHeadline } from "@/components/doephone/DoePhoneHeroHeadline";
import type { ProtoFeatureCopy } from "@/lib/proto/proto-feature-copy";
import { PROTO_FONT_CLASS } from "@/lib/proto/proto-font";
import {
  protoFeatureRevealClass,
  useProtoFeatureScrollReveal,
} from "@/lib/proto/use-proto-feature-scroll-reveal";

/** Two-line hero-style title + short description below a feature box. */
export function ProtoFeatureSectionCopy({ copy }: { copy: ProtoFeatureCopy }) {
  const { ref, revealed } = useProtoFeatureScrollReveal();

  return (
    <div ref={ref} className="proto-feature-section__copy w-full min-w-0">
      <div className={protoFeatureRevealClass(revealed, "title")}>
        <div className="doephone-hero-copy w-full min-w-0">
          <DoePhoneHeroHeadline
            line1={copy.titleLine1}
            line2={copy.titleLine2}
            fontClass={PROTO_FONT_CLASS}
          />
        </div>
      </div>
      <p className={`proto-feature-section__description ${protoFeatureRevealClass(revealed, "description")}`}>
        {copy.description}
      </p>
    </div>
  );
}
