"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef } from "react";

import type { PlayerRef } from "@remotion/player";

import { DOEHEALTH_INTRO_COPY } from "@/lib/doehealth/doehealth-intro-copy";
import { inter, lora, suisseIntl } from "@/lib/home/fonts";
import {
  DOE_INTRO_DURATION_FRAMES,
  DOE_INTRO_FPS,
  DOE_INTRO_HEIGHT,
  DOE_INTRO_WIDTH,
  DoeIntroComposition,
} from "@/remotion/doe-intro/DoeIntroComposition";
import { DOE_INTRO_SHARED_AUDIO_TAGS } from "@/remotion/doe-intro/constants";

import "@/lib/doehealth/doehealth-initiatives.css";
import "@/lib/doehealth/doehealth-landing.css";
import "@/lib/motion4/motion4-intro.css";
import "@/lib/motion3/motion3-remotion.css";
import "@/lib/product2/product2-agents.css";
import "@/lib/product2/product2-brown-mock.css";
import "@/lib/product2/product2-landing.css";

const Player = dynamic(
  () => import("@remotion/player").then((mod) => mod.Player),
  { ssr: false },
);

/** Idle preview — mid-composition (Sarah call). First play seeks back to frame 0. */
const DOE_INTRO_PREVIEW_FRAME = Math.round(DOE_INTRO_DURATION_FRAMES * 0.5);

/** Full viewport band — live /motion4 Remotion preview + gold section title. */
export function DoeHealthIntroVideoBand() {
  const { line1, line2 } = DOEHEALTH_INTRO_COPY.introVideoSectionTitle;
  const playerRef = useRef<PlayerRef>(null);
  const hasStartedRef = useRef(false);
  const playerInputProps = useMemo(() => ({ embedPreview: true as const }), []);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) {
      return undefined;
    }

    const onPlay = () => {
      if (hasStartedRef.current) {
        return;
      }

      hasStartedRef.current = true;
      player.pause();
      player.seekTo(0);
      player.play();
    };

    player.addEventListener("play", onPlay);
    return () => player.removeEventListener("play", onPlay);
  }, []);

  return (
    <section
      className={`doehealth-intro-band doehealth-intro-band--initiatives doehealth-intro-band--intro-video relative z-10 flex w-full shrink-0 flex-col ${suisseIntl.className} ${inter.className} ${lora.className}`}
      aria-label={`${line1} ${line2}, Doe intro video`}
    >
      <div className="doehealth-intro-band__shell relative z-[10] flex min-h-0 w-full flex-1 flex-col items-stretch justify-center">
        <div className="doehealth-intro-band__cluster">
          <div className="doehealth-intro-stage">
            <div className="doehealth-intro-video-sequence">
              <div className="doehealth-intro-video-sequence__stage">
                <div className="doehealth-intro-video__player-wrap">
                  <Player
                    ref={playerRef}
                    component={DoeIntroComposition}
                    inputProps={playerInputProps}
                    durationInFrames={DOE_INTRO_DURATION_FRAMES}
                    compositionWidth={DOE_INTRO_WIDTH}
                    compositionHeight={DOE_INTRO_HEIGHT}
                    fps={DOE_INTRO_FPS}
                    numberOfSharedAudioTags={DOE_INTRO_SHARED_AUDIO_TAGS}
                    initialFrame={DOE_INTRO_PREVIEW_FRAME}
                    className="doehealth-intro-video__player"
                    style={{ width: "100%", height: "100%" }}
                    controls
                    showVolumeControls
                    hideControlsWhenPointerDoesntMove={false}
                    allowFullscreen
                    doubleClickToFullscreen={false}
                    loop
                    volumePersistenceKey="doehealth-intro-video-volume"
                    acknowledgeRemotionLicense
                  />
                </div>
              </div>
            </div>
          </div>

          <h2
            className={`doehealth-intro-band__section-title ${suisseIntl.className}`}
            aria-label={`${line1} ${line2}`}
          >
            <span className="doehealth-intro-band__section-title-line">{line1}</span>
            <span className="doehealth-intro-band__section-title-line">{line2}</span>
          </h2>
        </div>
      </div>
    </section>
  );
}
