"use client";

import { DoePhoneAmbientVisual } from "@/components/doephone/DoePhoneAmbientVisual";
import { DoePhoneBillingVisual } from "@/components/doephone/DoePhoneBillingVisual";
import { DoePhoneCallHistoryVisual } from "@/components/doephone/DoePhoneCallHistoryVisual";
import { DoePhoneFrontDeskInboxVisual } from "@/components/doephone/DoePhoneFrontDeskInboxVisual";
import { DoePhoneIntegrateVisual } from "@/components/doephone/DoePhoneIntegrateVisual";
import { DoePhoneProtoValidateVisual } from "@/components/doephone/DoePhoneProtoValidateVisual";
import { DoePhoneReviewPackageVisual } from "@/components/doephone/DoePhoneReviewPackageVisual";
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
      return <DoePhoneReviewPackageVisual layout={layout} />;
    case "inbox":
      return <DoePhoneCallHistoryVisual layout={layout} />;
    case "front-desk":
      return <DoePhoneFrontDeskInboxVisual />;
    case "ambient":
      return <DoePhoneAmbientVisual layout={layout} />;
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
