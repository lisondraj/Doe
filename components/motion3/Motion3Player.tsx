"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";

import {
  DOE_LAUNCH_DURATION_FRAMES,
  DOE_LAUNCH_FPS,
  DOE_LAUNCH_HEIGHT,
  DOE_LAUNCH_WIDTH,
  DoeLaunchComposition,
} from "@/remotion/DoeLaunchComposition";

const Player = dynamic(
  () => import("@remotion/player").then((mod) => mod.Player),
  { ssr: false },
);

export function Motion3Player() {
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-motion3-page", "true");
    html.setAttribute("data-layout", "desktop");
    return () => {
      html.removeAttribute("data-motion3-page");
      html.removeAttribute("data-layout");
    };
  }, []);

  return (
    <div className="motion3-viewport">
      <div className="motion3-player-wrap">
        <Player
          component={DoeLaunchComposition}
          inputProps={{}}
          durationInFrames={DOE_LAUNCH_DURATION_FRAMES}
          compositionWidth={DOE_LAUNCH_WIDTH}
          compositionHeight={DOE_LAUNCH_HEIGHT}
          fps={DOE_LAUNCH_FPS}
          style={{
            width: "100%",
            height: "100%",
          }}
          controls
          autoPlay
          loop
          acknowledgeRemotionLicense
        />
      </div>
    </div>
  );
}
