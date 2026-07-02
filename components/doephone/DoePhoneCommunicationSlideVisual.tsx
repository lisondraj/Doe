"use client";

import { DoePhoneAmbientVisual } from "@/components/doephone/DoePhoneAmbientVisual";
import { DoePhoneBillingVisual } from "@/components/doephone/DoePhoneBillingVisual";
import { DoePhoneClinicAgentsVisual } from "@/components/doephone/DoePhoneClinicAgentsVisual";
import { DoePhoneFrontDeskInboxVisual } from "@/components/doephone/DoePhoneFrontDeskInboxVisual";
import { DoePhoneIntegrateVisual } from "@/components/doephone/DoePhoneIntegrateVisual";
import { DoePhoneProtoValidateVisual } from "@/components/doephone/DoePhoneProtoValidateVisual";
import { DoePhoneWorkflowVisual } from "@/components/doephone/DoePhoneWorkflowVisual";
import type { DoePhoneCommunicationSlide } from "@/lib/doephone/communication-carousel";

export function DoePhoneCommunicationSlideVisual({
  slideId,
  layout = "phone",
}: {
  slideId: DoePhoneCommunicationSlide["id"];
  layout?: "phone" | "desktop";
}) {
  switch (slideId) {
    case "agents":
      return <DoePhoneClinicAgentsVisual />;
    case "inbox":
      return <DoePhoneWorkflowVisual layout={layout} />;
    case "front-desk":
      return <DoePhoneFrontDeskInboxVisual />;
    case "ambient":
      return <DoePhoneAmbientVisual />;
    case "integrate":
      return <DoePhoneIntegrateVisual />;
    case "billing":
      return <DoePhoneBillingVisual />;
    case "prototype":
      return <DoePhoneProtoValidateVisual layout={layout} />;
    default:
      return null;
  }
}
