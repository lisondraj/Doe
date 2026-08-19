import type { CSSProperties } from "react";

import { dmSans, suisseIntl } from "@/lib/home/fonts";
import { STORY_PULSE_DESK } from "@/lib/story/story-pulse-visuals";

/** Tall Pulse tile — a live call as a two-sided voice strip. */
export function StoryPulseFrontDesk() {
  return (
    <div className={`story-pulse-stage story-pulse-stage--desk ${dmSans.className}`} aria-hidden="true">
      <div className="story-pulse-card story-pulse-desk">
        <span className="story-pulse-desk__live">{STORY_PULSE_DESK.status}</span>
        <p className={`story-pulse-desk__agent m-0 ${suisseIntl.className}`}>{STORY_PULSE_DESK.agent}</p>
        <span className={`story-pulse-desk__time ${dmSans.className}`}>{STORY_PULSE_DESK.duration}</span>
        <span className={`story-pulse-desk__number ${dmSans.className}`}>{STORY_PULSE_DESK.number}</span>

        <div className="story-pulse-desk__print">
          {STORY_PULSE_DESK.print.map((width, index) => (
            <i
              key={`desk-print-${index}`}
              className={index % 2 === 0 ? "is-caller" : "is-agent"}
              style={{ "--story-pulse-strip": `${width}%` } as CSSProperties & { "--story-pulse-strip": string }}
            />
          ))}
        </div>

        <span className="story-pulse-desk__foot">{STORY_PULSE_DESK.note}</span>
      </div>
    </div>
  );
}
