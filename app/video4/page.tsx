"use client";

import dynamic from "next/dynamic";

const Video4Stage = dynamic(() => import("@/components/video4/Video4Stage").then((mod) => mod.Video4Stage), { ssr: false });

export default function Video4Page() {
  return <Video4Stage />;
}
