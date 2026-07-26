"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";

import { inter, lora, suisseIntl } from "@/lib/home/fonts";

import {
  DOE_INTRO_DURATION_FRAMES,
  DOE_INTRO_FPS,
  DOE_INTRO_HEIGHT,
  DOE_INTRO_WIDTH,
  DoeIntroComposition,
} from "@/remotion/doe-intro/DoeIntroComposition";
import { DOE_INTRO_SHARED_AUDIO_TAGS } from "@/remotion/doe-intro/constants";

const Player = dynamic(
  () => import("@remotion/player").then((mod) => mod.Player),
  { ssr: false },
);

export function Motion4Player() {
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-motion4-page", "true");
    html.setAttribute("data-layout", "desktop");
    return () => {
      html.removeAttribute("data-motion4-page");
      html.removeAttribute("data-layout");
    };
  }, []);

  return (
    <div className={`motion4-viewport ${suisseIntl.className} ${inter.className} ${lora.className}`}>
      <div className="motion4-player-wrap">
        <Player
          component={DoeIntroComposition}
          inputProps={{}}
          durationInFrames={DOE_INTRO_DURATION_FRAMES}
          compositionWidth={DOE_INTRO_WIDTH}
          compositionHeight={DOE_INTRO_HEIGHT}
          fps={DOE_INTRO_FPS}
          numberOfSharedAudioTags={DOE_INTRO_SHARED_AUDIO_TAGS}
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
