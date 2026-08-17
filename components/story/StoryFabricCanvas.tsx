import { dmSans, suisseIntl } from "@/lib/home/fonts";
import { STORY_FABRIC_CANVAS } from "@/lib/story/story-fabric-visuals";

/** Tall Fabric tile — typed builder with a branch, handoff, and clinic apps. */
export function StoryFabricCanvas() {
  return (
    <div className={`story-fabric-stage story-fabric-stage--canvas ${dmSans.className}`} aria-hidden="true">
      <div className="story-fabric-card story-fabric-canvas">
        <div className="story-fabric-canvas__apps">
          {STORY_FABRIC_CANVAS.apps.map((app) => (
            <span key={app}>{app}</span>
          ))}
        </div>

        <div className="story-fabric-canvas__field">
          {STORY_FABRIC_CANVAS.steps.map((step) => (
            <div key={step.id} className="story-fabric-canvas__wrap">
              <div className="story-fabric-canvas__block">
                <span className="story-fabric-canvas__kicker">{step.kicker}</span>
                <span className={`story-fabric-canvas__label ${suisseIntl.className}`}>{step.label}</span>
              </div>
              <span className="story-fabric-canvas__stem" />
            </div>
          ))}

          <div className="story-fabric-canvas__fork">
            {STORY_FABRIC_CANVAS.outcomes.map((outcome) => (
              <div
                key={outcome.id}
                className={`story-fabric-canvas__block story-fabric-canvas__block--${outcome.id}`}
              >
                <span className="story-fabric-canvas__kicker">{outcome.kicker}</span>
                <span className={`story-fabric-canvas__label ${suisseIntl.className}`}>{outcome.label}</span>
              </div>
            ))}
          </div>

          <span className="story-fabric-canvas__stem" />

          <div className="story-fabric-canvas__block story-fabric-canvas__block--human">
            <span className="story-fabric-canvas__kicker">{STORY_FABRIC_CANVAS.handoff.kicker}</span>
            <span className={`story-fabric-canvas__label ${suisseIntl.className}`}>
              {STORY_FABRIC_CANVAS.handoff.label}
            </span>
          </div>
        </div>

        <div className="story-fabric-canvas__dock">
          <span className="story-fabric-canvas__prompt">{STORY_FABRIC_CANVAS.prompt}</span>
          <div className="story-fabric-canvas__tools">
            {STORY_FABRIC_CANVAS.tools.map((tool) => (
              <span key={tool}>{tool}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
