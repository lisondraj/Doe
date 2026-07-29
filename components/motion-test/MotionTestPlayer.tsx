"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { prefetch, staticFile } from "remotion";

import { dmSans, lora } from "@/lib/home/fonts";
import { MOTION_TEST_BG_MUSIC_SRC } from "@/remotion/motion-test/constants";
import {
  MOTION_TEST_DURATION_FRAMES,
  MOTION_TEST_FPS,
  MOTION_TEST_HEIGHT,
  MOTION_TEST_WIDTH,
  MotionTestComposition,
} from "@/remotion/motion-test/MotionTestComposition";

const Player = dynamic(
  () => import("@remotion/player").then((mod) => mod.Player),
  { ssr: false },
);

export function MotionTestPlayer() {
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-motion-test-page", "true");
    html.setAttribute("data-layout", "desktop");
    return () => {
      html.removeAttribute("data-motion-test-page");
      html.removeAttribute("data-layout");
    };
  }, []);

  useEffect(() => {
    const { free, waitUntilDone } = prefetch(staticFile(MOTION_TEST_BG_MUSIC_SRC), {
      method: "blob-url",
    });

    void waitUntilDone().catch(() => undefined);

    return () => {
      free();
    };
  }, []);

  return (
    <div className={`motion-test-viewport ${dmSans.className} ${lora.className}`}>
      <div className="motion-test-player-wrap">
        <Player
          component={MotionTestComposition}
          inputProps={{}}
          durationInFrames={MOTION_TEST_DURATION_FRAMES}
          compositionWidth={MOTION_TEST_WIDTH}
          compositionHeight={MOTION_TEST_HEIGHT}
          fps={MOTION_TEST_FPS}
          numberOfSharedAudioTags={1}
          bufferStateDelayInMilliseconds={300}
          audioLatencyHint="playback"
          style={{ width: "100%", height: "100%" }}
          controls
          autoPlay
          loop
          acknowledgeRemotionLicense
        />
      </div>
    </div>
  );
}
