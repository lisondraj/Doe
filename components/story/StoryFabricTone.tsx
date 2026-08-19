import type { CSSProperties } from "react";

import { dmSans, suisseIntl } from "@/lib/home/fonts";
import { STORY_FABRIC_TONE } from "@/lib/story/story-fabric-visuals";

/** Square Fabric tile — two voice cards, gold fill is tone and pace. */
export function StoryFabricTone() {
  return (
    <div className={`story-fabric-stage story-fabric-stage--tone ${dmSans.className}`} aria-hidden="true">
      <div className="story-fabric-voices">
        {STORY_FABRIC_TONE.map((voice) => (
          <div key={voice.id} className="story-fabric-card story-fabric-panel">
            <span className={`story-fabric-panel__kicker ${suisseIntl.className}`}>{voice.name}</span>
            <div className="story-fabric-levels">
              {voice.levels.map((level) => (
                <div key={level.id} className="story-fabric-levels__row">
                  <div className="story-fabric-levels__head">
                    <span className="story-fabric-levels__label">{level.label}</span>
                    <span className={`story-fabric-levels__value ${dmSans.className}`}>{level.fill}</span>
                  </div>
                  <span className="story-fabric-levels__track">
                    <i
                      style={
                        { "--story-fabric-fill": `${level.fill}%` } as CSSProperties & { "--story-fabric-fill": string }
                      }
                    />
                  </span>
                </div>
              ))}
            </div>
            <span className={`story-fabric-panel__meta ${dmSans.className}`}>{voice.language}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
