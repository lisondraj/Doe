import {
  DOEPHONE_COMMUNICATION_SLIDES,
  type DoePhoneCommunicationSlide,
} from "@/lib/doephone/communication-carousel";

import { PROTO_PROTOTYPE_BACKDROP } from "@/lib/proto/proto-communication-gradients";

/** /proto-only slide — not shown in the 3×2 Doe home carousel menu. */
export const PROTO_PROTOTYPE_SLIDE: DoePhoneCommunicationSlide = {
  id: "prototype",
  menuLabel: "Prototype",
  description:
    "Applicants submit prototypes that Proto routes through user feedback and in-product simulation before you commit to a build.",
  backdrop: PROTO_PROTOTYPE_BACKDROP,
};

const DOEPHONE_SLIDE_BY_ID = Object.fromEntries(
  DOEPHONE_COMMUNICATION_SLIDES.map((slide) => [slide.id, slide]),
) as Record<(typeof DOEPHONE_COMMUNICATION_SLIDES)[number]["id"], DoePhoneCommunicationSlide>;

/** /proto feature stack order — includes prototype between billing and integrate. */
export const PROTO_COMMUNICATION_SLIDES: readonly DoePhoneCommunicationSlide[] = [
  DOEPHONE_SLIDE_BY_ID.agents,
  DOEPHONE_SLIDE_BY_ID["front-desk"],
  DOEPHONE_SLIDE_BY_ID.inbox,
  DOEPHONE_SLIDE_BY_ID.ambient,
  DOEPHONE_SLIDE_BY_ID.billing,
  PROTO_PROTOTYPE_SLIDE,
  DOEPHONE_SLIDE_BY_ID.integrate,
];
