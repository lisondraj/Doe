"use client";

import { useEffect, useRef } from "react";

import { DOEHEALTH_INTRO_COPY } from "@/lib/doehealth/doehealth-intro-copy";
import { inter, lora, suisseIntl } from "@/lib/home/fonts";

import "@/lib/doehealth/doehealth-initiatives.css";
import "@/lib/doehealth/doehealth-landing.css";

const DOE_INTRO_VIDEO_SRC = "/motion/doe-intro.mp4";

/** Exported Doe intro — idle preview at ~50%, first play starts at 0s. */
export function DoeHealthIntroVideoBand() {
  const { line1, line2 } = DOEHEALTH_INTRO_COPY.introVideoSectionTitle;
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return undefined;
    }

    const showPreviewFrame = () => {
      if (hasStartedRef.current || !Number.isFinite(video.duration) || video.duration <= 0) {
        return;
      }

      video.currentTime = video.duration * 0.5;
    };

    const onPlay = () => {
      if (hasStartedRef.current) {
        return;
      }

      hasStartedRef.current = true;
      video.pause();
      video.currentTime = 0;
      void video.play();
    };

    video.addEventListener("loadedmetadata", showPreviewFrame);
    video.addEventListener("play", onPlay);

    if (video.readyState >= 1) {
      showPreviewFrame();
    }

    return () => {
      video.removeEventListener("loadedmetadata", showPreviewFrame);
      video.removeEventListener("play", onPlay);
    };
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
                  <video
                    ref={videoRef}
                    className="doehealth-intro-video__video"
                    src={DOE_INTRO_VIDEO_SRC}
                    controls
                    playsInline
                    loop
                    preload="metadata"
                    aria-label={`${line1} ${line2}, Doe intro video`}
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
