import { dmSans, suisseIntl } from "@/lib/home/fonts";
import { STORY_FABRIC_SIM } from "@/lib/story/story-fabric-visuals";

/** Wide Fabric tile — three private test scenarios, each its own conversation card. */
export function StoryFabricSimulator() {
  return (
    <div className={`story-fabric-stage story-fabric-stage--sim ${dmSans.className}`} aria-hidden="true">
      <div className="story-fabric-sims">
        {STORY_FABRIC_SIM.map((run) => (
          <div key={run.id} className={`story-fabric-card story-fabric-sim story-fabric-sim--${run.id}`}>
            <div className="story-fabric-sim__line">
              <span className="story-fabric-sim__mode">{run.mode}</span>
              <span className="story-fabric-sim__result">{run.result}</span>
            </div>
            <span className={`story-fabric-sim__scenario ${suisseIntl.className}`}>{run.scenario}</span>
            <p className="story-fabric-sim__caller m-0">
              <b>{run.who}</b>
              {run.text}
            </p>
            <p className={`story-fabric-sim__agent m-0 ${dmSans.className}`}>{run.agent}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
