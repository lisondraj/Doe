"use client";

import dynamic from "next/dynamic";

const Video5Stage = dynamic(() => import("@/components/video5/Video5Stage").then((mod) => mod.Video5Stage), { ssr: false });

export default function Video5Page() {
  return <Video5Stage />;
}
