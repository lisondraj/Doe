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
    line1: "Phone and schedule,",
    line2: "handled together.",
  },
  inbox: {
    line1: "Documents routed",
    line2: "to the right workflow.",
  },
  ambient: {
    line1: "Ambient at the",
    line2: "point of care.",
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
