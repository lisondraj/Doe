import type { ComponentType } from "react";

import { VIDEO1_FPS, VIDEO1_HEIGHT, VIDEO1_WIDTH } from "../video1/theme";
import { SECTION1_FRAMES, Section1Reach } from "./Section1Reach";
import { SECTION2_FRAMES, Section2Packages } from "./Section2Packages";
import { SECTION3_FRAMES, Section3Capacity } from "./Section3Capacity";

export { VIDEO1_FPS as VIDEO5_FPS, VIDEO1_HEIGHT as VIDEO5_HEIGHT, VIDEO1_WIDTH as VIDEO5_WIDTH };

export type Video5Entry = {
  id: string;
  title: string;
  component: ComponentType;
  durationInFrames: number;
};

export const VIDEO5_LIST: Video5Entry[] = [
  { id: "Video5Reach", title: "Reach more patients", component: Section1Reach, durationInFrames: SECTION1_FRAMES },
  { id: "Video5Packages", title: "Packages & offers", component: Section2Packages, durationInFrames: SECTION2_FRAMES },
  { id: "Video5Capacity", title: "Fill unused capacity", component: Section3Capacity, durationInFrames: SECTION3_FRAMES },
];
