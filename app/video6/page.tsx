"use client";

import dynamic from "next/dynamic";

const Video6Stage = dynamic(() => import("@/components/video6/Video6Stage").then((mod) => mod.Video6Stage), { ssr: false });

export default function Video6Page() {
  return <Video6Stage />;
}
