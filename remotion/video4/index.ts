import type { Video1Entry } from "../video1";
import { VIDEO4_DENTAL_FRAMES, Video4Dental } from "./Video4Dental";
import { VIDEO4_HOMECARE_FRAMES, Video4HomeCare } from "./Video4HomeCare";
import { VIDEO4_SCOPE_FRAMES, Video4Scope } from "./Video4Scope";

export const VIDEO4_LIST: Video1Entry[] = [
  { id: "Video4Dental", title: "Dental", component: Video4Dental, durationInFrames: VIDEO4_DENTAL_FRAMES },
  { id: "Video4Scope", title: "NP / PA", component: Video4Scope, durationInFrames: VIDEO4_SCOPE_FRAMES },
  { id: "Video4HomeCare", title: "Home care", component: Video4HomeCare, durationInFrames: VIDEO4_HOMECARE_FRAMES },
];
