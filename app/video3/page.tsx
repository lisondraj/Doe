"use client";

import dynamic from "next/dynamic";

const Video3Stage = dynamic(() => import("@/components/video3/Video3Stage").then((mod) => mod.Video3Stage), { ssr: false });

export default function Video3Page() {
  return <Video3Stage />;
}
