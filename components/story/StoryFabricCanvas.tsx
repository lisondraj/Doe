import type { CSSProperties } from "react";

import { dmSans, suisseIntl } from "@/lib/home/fonts";
import { STORY_FABRIC_CANVAS } from "@/lib/story/story-fabric-visuals";

/** Tall Fabric tile — branch weights, canvas nodes, and a human handoff. */
export function StoryFabricCanvas() {
  return (
    <div className={`story-fabric-stage story-fabric-stage--canvas ${dmSans.className}`} aria-hidden="true">
      <div className="story-fabric-build">
        <div className="story-fabric-card story-fabric-panel">
          <span className="story-fabric-panel__kicker">{STORY_FABRIC_CANVAS.branch.kicker}</span>
          <div className="story-fabric-paths">
            {STORY_FABRIC_CANVAS.branch.paths.map((path) => (
              <div key={path.id} className="story-fabric-paths__row">
                <div className="story-fabric-paths__head">
                  <span className={`story-fabric-paths__label ${suisseIntl.className}`}>{path.label}</span>
                  <span className={`story-fabric-paths__value ${dmSans.className}`}>{path.fill}</span>
                </div>
                <span className="story-fabric-paths__track">
                  <i
                    style={{ "--story-fabric-fill": `${path.fill}%` } as CSSProperties & { "--story-fabric-fill": string }}
                  />
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="story-fabric-card story-fabric-panel">
          <span className="story-fabric-panel__kicker">{STORY_FABRIC_CANVAS.start.kicker}</span>
          <div className="story-fabric-nodes">
            {STORY_FABRIC_CANVAS.start.nodes.map((node) => (
              <span
                key={node.id}
                className={`story-fabric-nodes__block${node.on ? " is-on" : ""} ${suisseIntl.className}`}
              >
                {node.label}
              </span>
            ))}
          </div>
        </div>

        <div className="story-fabric-card story-fabric-panel">
          <span className="story-fabric-panel__kicker">{STORY_FABRIC_CANVAS.handoff.kicker}</span>
          <div className="story-fabric-handoff">
            <span className={`story-fabric-handoff__mark ${dmSans.className}`}>
              {STORY_FABRIC_CANVAS.handoff.mark}
            </span>
            <span className={`story-fabric-handoff__name ${suisseIntl.className}`}>
              {STORY_FABRIC_CANVAS.handoff.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
