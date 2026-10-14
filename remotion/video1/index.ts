import type { ComponentType } from "react";

import { VIDEO1_FPS, VIDEO1_HEIGHT, VIDEO1_WIDTH } from "./theme";
import { VIDEO1_STRUCTURED_FRAMES, Video1Structured } from "./Video1Structured";
import { VIDEO2_COMMUNICATION_FRAMES, Video2Communication } from "./Video2Communication";
import { VIDEO3_PAYMENTS_FRAMES, Video3Payments } from "./Video3Payments";
import { VIDEO4_END_TO_END_FRAMES, Video4EndToEnd } from "./Video4EndToEnd";

export { VIDEO1_FPS, VIDEO1_HEIGHT, VIDEO1_WIDTH };

export type Video1Entry = {
  id: string;
  title: string;
  component: ComponentType;
  durationInFrames: number;
};

export const VIDEO1_LIST: Video1Entry[] = [
  { id: "Video1Structured", title: "Structured data", component: Video1Structured, durationInFrames: VIDEO1_STRUCTURED_FRAMES },
  { id: "Video1Communication", title: "Communication", component: Video2Communication, durationInFrames: VIDEO2_COMMUNICATION_FRAMES },
  { id: "Video1Payments", title: "Payments", component: Video3Payments, durationInFrames: VIDEO3_PAYMENTS_FRAMES },
  { id: "Video1EndToEnd", title: "End to end", component: Video4EndToEnd, durationInFrames: VIDEO4_END_TO_END_FRAMES },
];
