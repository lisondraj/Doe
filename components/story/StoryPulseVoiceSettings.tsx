import type { CSSProperties } from "react";

import { dmSans, suisseIntl } from "@/lib/home/fonts";
import { STORY_PULSE_VOICES } from "@/lib/story/story-pulse-visuals";

/** Wide Pulse tile — three voice signatures, each with its own print. */
export function StoryPulseVoiceSettings() {
  return (
    <div className={`story-pulse-stage story-pulse-stage--voices ${dmSans.className}`} aria-hidden="true">
      <div className="story-pulse-voices">
        {STORY_PULSE_VOICES.map((agent) => (
          <div key={agent.id} className={`story-pulse-card story-pulse-voice story-pulse-voice--${agent.id}`}>
            <div className="story-pulse-voice__print">
              {agent.print.map((height, index) => (
                <i
                  key={`${agent.id}-${index}`}
                  style={{ "--story-pulse-print": `${height}%` } as CSSProperties & { "--story-pulse-print": string }}
                />
              ))}
            </div>
            <p className={`story-pulse-voice__name m-0 ${suisseIntl.className}`}>{agent.voice}</p>
            <span className="story-pulse-voice__role">{agent.name}</span>
            <span className={`story-pulse-voice__hours ${dmSans.className}`}>{agent.hours}</span>
            <span className="story-pulse-voice__lang">{agent.language}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
