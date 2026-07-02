"use client";

import { ProtoDesktopPanelSection } from "@/components/proto/ProtoDesktopPanelSection";
import { ProtoFeatureSectionCopy } from "@/components/proto/ProtoFeatureSectionCopy";
import type { DoePhoneCommunicationSlide } from "@/lib/doephone/communication-carousel";
import type { ProtoFeatureCopy } from "@/lib/proto/proto-feature-copy";
import {
  PROTO_DESKTOP_FEATURE_BAND_H,
  PROTO_DESKTOP_FEATURE_COPY_PT,
  PROTO_DESKTOP_FEATURE_SECTION_PAD,
  PROTO_DESKTOP_PAGE_INSET_X,
} from "@/lib/proto/proto-desktop-layout-styles";
import {
  protoCommunicationGradient,
  protoCommunicationGrid,
} from "@/lib/proto/proto-communication-gradients";

/** Desktop /proto — one feature slide: gradient panel + title/description copy. */
export function ProtoDesktopFeatureSection({
  slide,
  copy,
}: {
  slide: DoePhoneCommunicationSlide;
  copy: ProtoFeatureCopy;
}) {
  return (
    <section
      className={`proto-desktop-feature proto-section-band flex w-full flex-col bg-[#151c1f] ${PROTO_DESKTOP_FEATURE_BAND_H}`}
      aria-label={slide.menuLabel}
    >
      <div
        className={`flex h-full min-h-0 flex-1 flex-col ${PROTO_DESKTOP_PAGE_INSET_X} ${PROTO_DESKTOP_FEATURE_SECTION_PAD}`}
      >
        <div className="flex min-h-0 flex-1 flex-col">
          <ProtoDesktopPanelSection
            slide={slide}
            gradientOverride={protoCommunicationGradient(slide.id)}
            gridOverride={protoCommunicationGrid(slide.id)}
          />
        </div>

        <div className={`proto-desktop-feature__copy shrink-0 ${PROTO_DESKTOP_FEATURE_COPY_PT}`}>
          <ProtoFeatureSectionCopy copy={copy} layout="desktop" />
        </div>
      </div>
    </section>
  );
}
