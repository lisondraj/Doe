"use client";

import { Video1Stage } from "@/components/video1/Video1Stage";
import { VIDEO2_LIST } from "@/remotion/video2";

export function Video2Stage() {
  return <Video1Stage videos={VIDEO2_LIST} />;
}
