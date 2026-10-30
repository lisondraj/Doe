"use client";

import dynamic from "next/dynamic";

const VideoIntroStage = dynamic(() => import("@/components/video-intro/VideoIntroStage").then((mod) => mod.VideoIntroStage), { ssr: false });

export default function VideoIntroPage() {
  return <VideoIntroStage />;
}
