"use client";

import { DoePhoneHeroHeadline } from "@/components/doephone/DoePhoneHeroHeadline";
import type { ProtoFeatureCopy } from "@/lib/proto/proto-feature-copy";
import { PROTO_FONT_CLASS } from "@/lib/proto/proto-font";

/** Two-line hero-style title + short description below a feature box. */
export function ProtoFeatureSectionCopy({ copy }: { copy: ProtoFeatureCopy }) {
  return (
    <div className="proto-feature-section__copy w-full min-w-0">
      <div className="doephone-hero-copy w-full min-w-0">
        <DoePhoneHeroHeadline
          line1={copy.titleLine1}
          line2={copy.titleLine2}
          fontClass={PROTO_FONT_CLASS}
        />
      </div>
      <p className="proto-feature-section__description">{copy.description}</p>
    </div>
  );
}
