import {
  DOEPHONE_COMMUNICATION_SLIDES,
  type DoePhoneCommunicationSlide,
} from "@/lib/doephone/communication-carousel";
import { HOME_FEATURE_SECTION_TITLES } from "@/lib/doephone/home-feature-sections";

export type DoeDesktopFeatureCopy = {
  titleLine1: string;
  titleLine2: string;
  description: string;
};

/** Desktop home feature copy — iPhone home titles paired with the slide detail description. */
export function doeDesktopFeatureCopy(slideId: string): DoeDesktopFeatureCopy | undefined {
  const title = HOME_FEATURE_SECTION_TITLES[slideId as DoePhoneCommunicationSlide["id"]];
  const slide = DOEPHONE_COMMUNICATION_SLIDES.find((entry) => entry.id === slideId);
  if (!title || !slide?.description) return undefined;

  return {
    titleLine1: title.line1,
    titleLine2: title.line2,
    description: slide.description,
  };
}
