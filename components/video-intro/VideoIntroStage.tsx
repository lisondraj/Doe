"use client";

import { Video1Stage } from "@/components/video1/Video1Stage";
import { VIDEO_INTRO_LIST } from "@/remotion/video-intro";

export function VideoIntroStage() {
  return <Video1Stage videos={VIDEO_INTRO_LIST} />;
}
