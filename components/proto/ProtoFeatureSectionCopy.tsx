"use client";

import { DoePhoneHeroHeadline } from "@/components/doephone/DoePhoneHeroHeadline";
import type { ProtoFeatureCopy } from "@/lib/proto/proto-feature-copy";
import {
  PROTO_DESKTOP_FEATURE_DESC_TW,
  PROTO_DESKTOP_FEATURE_TITLE_TW,
} from "@/lib/proto/proto-desktop-layout-styles";
import { PROTO_FONT_CLASS } from "@/lib/proto/proto-font";
import {
  protoFeatureRevealClass,
  useProtoFeatureScrollReveal,
} from "@/lib/proto/use-proto-feature-scroll-reveal";

/** Two-line hero-style title + short description below a feature box. */
export function ProtoFeatureSectionCopy({
  copy,
  layout = "phone",
}: {
  copy: ProtoFeatureCopy;
  layout?: "phone" | "desktop";
}) {
  const { ref, revealed } = useProtoFeatureScrollReveal();
  const isDesktop = layout === "desktop";

  return (
    <div ref={ref} className="proto-feature-section__copy w-full min-w-0">
      <div className={protoFeatureRevealClass(revealed, "title")}>
        <div className="doephone-hero-copy w-full min-w-0">
          {isDesktop ? (
            <h2 className={PROTO_DESKTOP_FEATURE_TITLE_TW}>
              <span className="block">{copy.titleLine1}</span>
              <span className="block">{copy.titleLine2}</span>
            </h2>
          ) : (
            <DoePhoneHeroHeadline
              line1={copy.titleLine1}
              line2={copy.titleLine2}
              fontClass={PROTO_FONT_CLASS}
            />
          )}
        </div>
      </div>
      <p
        className={`proto-feature-section__description ${
          isDesktop ? PROTO_DESKTOP_FEATURE_DESC_TW : ""
        } ${protoFeatureRevealClass(revealed, "description")}`}
      >
        {copy.description}
      </p>
    </div>
  );
}
