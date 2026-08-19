import type { CSSProperties } from "react";

import { dmSans } from "@/lib/home/fonts";
import { STORY_PULSE_NIGHTS } from "@/lib/story/story-pulse-visuals";

/** After-hours Pulse — overnight calls filling toward open. */
export function StoryPulseNights() {
  return (
    <div className={`story-pulse-stage story-pulse-stage--nights ${dmSans.className}`} aria-hidden="true">
      <div className="story-pulse-card story-pulse-nights">
        <span className="story-pulse-nights__eyebrow">{STORY_PULSE_NIGHTS.eyebrow}</span>
        <span className={`story-pulse-nights__count ${dmSans.className}`}>{STORY_PULSE_NIGHTS.returned}</span>
        <span className="story-pulse-nights__note">{STORY_PULSE_NIGHTS.note}</span>

        <ul className="story-pulse-nights__hours m-0 list-none p-0">
          {STORY_PULSE_NIGHTS.items.map((item) => (
            <li key={item.id} className="story-pulse-nights__col">
              <div className="story-pulse-nights__meter">
                <span
                  style={{ "--story-pulse-fill": `${item.fill}%` } as CSSProperties & { "--story-pulse-fill": string }}
                />
              </div>
              <span className="story-pulse-nights__task">{item.task}</span>
              <span className={`story-pulse-nights__done ${dmSans.className}`}>{item.done}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
