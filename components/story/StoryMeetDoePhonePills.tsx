import type { CSSProperties } from "react";

import { dmSans, suisseIntl } from "@/lib/home/fonts";
import {
  STORY_MEET_DOE_PHONE_CENTRAL_WAVE_BAR_COUNT,
  STORY_MEET_DOE_PHONE_PILLS,
  STORY_MEET_DOE_PHONE_WAVE_BAR_COUNTS,
  storyMeetDoeSpeechWaveHeights,
} from "@/lib/story/story-meet-doe-phone-pills";

/** Overlapping call pills — gradient avatar, agent label, phone number, diamond waveform. */
export function StoryMeetDoePhonePills() {
  return (
    <div className={`story-meet-doe-phone-pills ${dmSans.className}`}>
      <div className="story-meet-doe-phone-pills__stage" aria-hidden="true">
        {STORY_MEET_DOE_PHONE_PILLS.map((pill) => {
          const waveHeights = storyMeetDoeSpeechWaveHeights(
            pill.id,
            pill.central
              ? STORY_MEET_DOE_PHONE_CENTRAL_WAVE_BAR_COUNT
              : STORY_MEET_DOE_PHONE_WAVE_BAR_COUNTS[pill.size],
          );

          return (
            <div
              key={pill.id}
              className={`story-meet-doe-phone-pill story-meet-doe-phone-pill--${pill.size}${pill.central ? " story-meet-doe-phone-pill--central" : ""}`}
              style={{
                top: pill.top,
                ...(pill.right != null
                  ? { right: pill.right, left: "auto" }
                  : { left: pill.left }),
                zIndex: pill.zIndex,
                ...(pill.opacity != null ? { opacity: pill.opacity } : {}),
              }}
            >
              <span
                className="story-meet-doe-phone-pill__avatar"
                style={{ background: pill.gradient }}
              />
              <span className="story-meet-doe-phone-pill__body">
                <span className={`story-meet-doe-phone-pill__agent ${suisseIntl.className}`}>{pill.agent}</span>
                <span className="story-meet-doe-phone-pill__call">
                  <span className={`story-meet-doe-phone-pill__number ${dmSans.className}`}>{pill.number}</span>
                  <div className="story-meet-doe-phone-pill__wave">
                    {waveHeights.map((height, index) => (
                      <span
                        key={`${pill.id}-wave-${index}`}
                        className="story-meet-doe-phone-pill__wave-bar"
                        style={
                          { "--story-meet-doe-wave-height": height } as CSSProperties & {
                            "--story-meet-doe-wave-height": number;
                          }
                        }
                      />
                    ))}
                  </div>
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
