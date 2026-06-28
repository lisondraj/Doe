"use client";

import { DoePhoneAmbientVisual } from "@/components/doephone/DoePhoneAmbientVisual";
import { DoePhoneBillingVisual } from "@/components/doephone/DoePhoneBillingVisual";
import { DoePhoneBuildWorkflowPrompt } from "@/components/doephone/DoePhoneBuildWorkflowPrompt";
import { DoePhoneClinicAgentsVisual } from "@/components/doephone/DoePhoneClinicAgentsVisual";
import { DoePhoneFrontDeskInboxVisual } from "@/components/doephone/DoePhoneFrontDeskInboxVisual";
import { DoePhoneIntegrateVisual } from "@/components/doephone/DoePhoneIntegrateVisual";
import { DoePhoneWorkflowVisual } from "@/components/doephone/DoePhoneWorkflowVisual";
import type { DoePhoneCommunicationSlide } from "@/lib/doephone/communication-carousel";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";
import { suisseIntl } from "@/lib/home/fonts";

type SlideVisualLayout = "phone" | "desktop";

export function DoePhoneCommunicationSlideVisual({
  slideId,
  layout = "phone",
}: {
  slideId: DoePhoneCommunicationSlide["id"];
  layout?: SlideVisualLayout;
}) {
  switch (slideId) {
    case "agents":
      return <DoePhoneClinicAgentsVisual />;
    case "inbox":
      if (layout === "desktop") {
        return (
          <div
            className={`mx-auto flex h-full w-full items-center justify-center ${suisseIntl.className}`}
            style={{ maxWidth: CAROUSEL_MENU_UI.maxWidthPhone }}
            aria-hidden
          >
            <DoePhoneBuildWorkflowPrompt layout="carousel" size="default" />
          </div>
        );
      }
      return <DoePhoneWorkflowVisual layout={layout} />;
    case "front-desk":
      return <DoePhoneFrontDeskInboxVisual />;
    case "ambient":
      return <DoePhoneAmbientVisual />;
    case "integrate":
      return <DoePhoneIntegrateVisual />;
    case "billing":
      return <DoePhoneBillingVisual />;
    default:
      return null;
  }
}
