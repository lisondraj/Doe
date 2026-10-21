import type { Video1Entry } from "../video1";
import { VIDEO6_COORDINATE_FRAMES, Video6Coordinate } from "./Video6Coordinate";
import { VIDEO6_GOVERN_FRAMES, Video6Govern } from "./Video6Govern";
import { VIDEO6_NETWORK_FRAMES, Video6Network } from "./Video6Network";

export const VIDEO6_LIST: Video1Entry[] = [
  { id: "Video6Network", title: "Network", component: Video6Network, durationInFrames: VIDEO6_NETWORK_FRAMES },
  { id: "Video6Govern", title: "Permissions", component: Video6Govern, durationInFrames: VIDEO6_GOVERN_FRAMES },
  { id: "Video6Coordinate", title: "Coordinate", component: Video6Coordinate, durationInFrames: VIDEO6_COORDINATE_FRAMES },
];
