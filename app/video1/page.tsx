"use client";

import dynamic from "next/dynamic";

const Video1Stage = dynamic(() => import("@/components/video1/Video1Stage").then((mod) => mod.Video1Stage), { ssr: false });

export default function Video1Page() {
  return <Video1Stage />;
}
