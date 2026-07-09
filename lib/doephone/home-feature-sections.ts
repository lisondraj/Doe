import type { DoePhoneCommunicationSlide } from "@/lib/doephone/communication-carousel";

export type HomeFeatureSectionTitle = {
  line1: string;
  line2: string;
};

/** iPhone home — two-line titles under each feature shader card. */
export const HOME_FEATURE_SECTION_TITLES: Record<
  DoePhoneCommunicationSlide["id"],
  HomeFeatureSectionTitle
> = {
  agents: {
    line1: "Agents for every",
    line2: "workflow in clinic.",
  },
  "front-desk": {
    line1: "Agents for",
    line2: "every specialty.",
  },
  inbox: {
    line1: "Review detailed",
    line2: "call histories.",
  },
  ambient: {
    line1: "Overdue patients",
    line2: "surface automatically.",
  },
  billing: {
    line1: "Billing without the",
    line2: "chase.",
  },
  integrate: {
    line1: "Integrate your",
    line2: "whole stack.",
  },
  prototype: {
    line1: "Prototype what",
    line2: "you ship next.",
  },
};
