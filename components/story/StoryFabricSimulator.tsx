import type { CSSProperties } from "react";

import { dmSans, suisseIntl } from "@/lib/home/fonts";
import { STORY_FABRIC_SIM } from "@/lib/story/story-fabric-visuals";

/** Wide Fabric tile — private test slots, then two scored runs. */
export function StoryFabricSimulator() {
  return (
    <div className={`story-fabric-stage story-fabric-stage--sim ${dmSans.className}`} aria-hidden="true">
      <div className="story-fabric-tests">
        <div className="story-fabric-card story-fabric-panel story-fabric-panel--booth">
          <span className="story-fabric-panel__kicker">{STORY_FABRIC_SIM.booth.kicker}</span>
          <div className="story-fabric-slots">
            {STORY_FABRIC_SIM.booth.slots.map((done, index) => (
              <i key={`slot-${index}`} className={done ? "is-done" : undefined}>
                {index + 1}
              </i>
            ))}
          </div>
          <p className={`story-fabric-panel__count m-0 ${dmSans.className}`}>{STORY_FABRIC_SIM.booth.count}</p>
          <span className="story-fabric-panel__label">{STORY_FABRIC_SIM.booth.label}</span>
          <div className="story-fabric-panel__sent">
            <b className={dmSans.className}>{STORY_FABRIC_SIM.booth.sent}</b>
            <span className={suisseIntl.className}>{STORY_FABRIC_SIM.booth.sentLabel}</span>
          </div>
        </div>

        {STORY_FABRIC_SIM.runs.map((run) => (
          <div key={run.id} className="story-fabric-card story-fabric-panel">
            <span className={`story-fabric-panel__kicker ${suisseIntl.className}`}>{run.scenario}</span>
            <div className="story-fabric-turns">
              {run.turns.map((width, index) => (
                <i
                  key={`${run.id}-${index}`}
                  style={{ "--story-fabric-fill": `${width}%` } as CSSProperties & { "--story-fabric-fill": string }}
                />
              ))}
            </div>
            <span className={`story-fabric-panel__result ${suisseIntl.className}`}>{run.result}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
