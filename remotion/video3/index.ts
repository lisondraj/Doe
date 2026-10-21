import type { Video1Entry } from "../video1";
import { V3_CONNECT_FRAMES, Video3Connect } from "./Video3Connect";
import { V3_BRIDGE_FRAMES, Video3Bridge } from "./Video3Bridge";
import { V3_MEMBERSHIPS_FRAMES, Video3Memberships } from "./Video3Memberships";

export const VIDEO3_LIST: Video1Entry[] = [
  { id: "Video3Connect", title: "Connect with patients", component: Video3Connect, durationInFrames: V3_CONNECT_FRAMES },
  { id: "Video3Memberships", title: "Memberships", component: Video3Memberships, durationInFrames: V3_MEMBERSHIPS_FRAMES },
  { id: "Video3Bridge", title: "Agent to practice", component: Video3Bridge, durationInFrames: V3_BRIDGE_FRAMES },
];
