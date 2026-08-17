import type { CSSProperties } from "react";

import { dmSans, suisseIntl } from "@/lib/home/fonts";
import { STORY_PULSE_DESK } from "@/lib/story/story-pulse-visuals";

/** Tall Pulse tile — a voice agent answering the clinic front desk. */
export function StoryPulseFrontDesk() {
  return (
    <div className={`story-pulse-stage story-pulse-stage--desk ${dmSans.className}`} aria-hidden="true">
      <div className="story-pulse-card story-pulse-desk">
        <div className="story-pulse-desk__line">
          <span className="story-pulse-desk__live">
            <i />
            {STORY_PULSE_DESK.status}
          </span>
          <span className={`story-pulse-desk__number ${dmSans.className}`}>
            {STORY_PULSE_DESK.number}
            <em>{STORY_PULSE_DESK.duration}</em>
          </span>
        </div>

        <p className={`story-pulse-desk__agent m-0 ${suisseIntl.className}`}>
          {STORY_PULSE_DESK.agent}
          <span>{STORY_PULSE_DESK.role}</span>
        </p>

        <ol className="story-pulse-desk__turns m-0 list-none p-0">
          {STORY_PULSE_DESK.turns.map((turn) => (
            <li
              key={`${turn.who}-${turn.text}`}
              className={`story-pulse-desk__turn${turn.who === STORY_PULSE_DESK.agent ? " story-pulse-desk__turn--agent" : ""}`}
            >
              <span className="story-pulse-desk__who">{turn.who}</span>
              <span className={`story-pulse-desk__text ${dmSans.className}`}>{turn.text}</span>
            </li>
          ))}
        </ol>

        <div className="story-pulse-desk__wave">
          {Array.from({ length: 22 }, (_, index) => (
            <span
              key={index}
              style={
                {
                  "--story-pulse-wave": 0.28 + ((index * 37) % 72) / 100,
                } as CSSProperties & { "--story-pulse-wave": number }
              }
            />
          ))}
        </div>
        <div className="story-pulse-desk__foot">{STORY_PULSE_DESK.note}</div>
      </div>
    </div>
  );
}
