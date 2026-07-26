"use client";

import { DOEHEALTH_INTRO_COPY } from "@/lib/doehealth/doehealth-intro-copy";
import { suisseIntl } from "@/lib/home/fonts";

const DOE_INTRO_VIDEO_SRC = "/motion/doe-intro.mp4";

/** Full viewport band — Doe intro video + gold section title (below patient chart). */
export function DoeHealthIntroVideoBand() {
  const { line1, line2 } = DOEHEALTH_INTRO_COPY.introVideoSectionTitle;

  return (
    <section
      className="doehealth-intro-band doehealth-intro-band--initiatives doehealth-intro-band--intro-video relative z-10 flex w-full shrink-0 flex-col"
      aria-label={`${line1} ${line2}, Doe intro video`}
    >
      <div className="doehealth-intro-band__shell relative z-[10] flex min-h-0 w-full flex-1 flex-col items-stretch justify-center">
        <div className="doehealth-intro-band__cluster">
          <div className="doehealth-intro-stage">
            <div className="doehealth-intro-video-sequence doehealth-content-rail">
              <div className="doehealth-intro-video-sequence__stage">
                <video
                  className="doehealth-intro-video__player"
                  src={DOE_INTRO_VIDEO_SRC}
                  controls
                  playsInline
                  preload="metadata"
                  aria-label="Doe product intro video"
                />
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
