"use client";

import dynamic from "next/dynamic";

const Video2Stage = dynamic(() => import("@/components/video2/Video2Stage").then((mod) => mod.Video2Stage), { ssr: false });

export default function Video2Page() {
  return <Video2Stage />;
}
