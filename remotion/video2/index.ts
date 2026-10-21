import type { Video1Entry } from "../video1";
import { SECTION1_FRAMES, Section1Network } from "./Section1Network";
import { SECTION2_FRAMES, Section2Permissions } from "./Section2Permissions";
import { SECTION3_FRAMES, Section3Coordinate } from "./Section3Coordinate";

export const VIDEO2_LIST: Video1Entry[] = [
  { id: "Video2Network", title: "Intelligent network", component: Section1Network, durationInFrames: SECTION1_FRAMES },
  { id: "Video2Permissions", title: "Permissions", component: Section2Permissions, durationInFrames: SECTION2_FRAMES },
  { id: "Video2Coordinate", title: "Coordinate care", component: Section3Coordinate, durationInFrames: SECTION3_FRAMES },
];
