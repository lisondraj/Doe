import { dmSans, suisseIntl } from "@/lib/home/fonts";
import { STORY_GENOME_AGENTS } from "@/lib/story/story-genome-visuals";

/** Fabric canvas — agents you build run on the clinic’s Genome. */
export function StoryGenomeAgentCanvas() {
  return (
    <div className={`story-genome-stage story-genome-stage--agents ${dmSans.className}`} aria-hidden="true">
      <div className="story-genome-card story-genome-canvas">
        <div className="story-genome-canvas__field">
          <div className="story-genome-canvas__flow">
            <div className="story-genome-canvas__node">
              <span className="story-genome-canvas__node-note">{STORY_GENOME_AGENTS.left.kicker}</span>
              <span className={`story-genome-canvas__node-label ${suisseIntl.className}`}>
                {STORY_GENOME_AGENTS.left.label}
              </span>
            </div>
            <span className="story-genome-canvas__rail" />
            <div className="story-genome-canvas__node story-genome-canvas__node--model">
              <span className={`story-genome-canvas__node-label ${suisseIntl.className}`}>
                {STORY_GENOME_AGENTS.model}
              </span>
              <span className="story-genome-canvas__node-note">{STORY_GENOME_AGENTS.modelNote}</span>
            </div>
            <span className="story-genome-canvas__rail" />
            <div className="story-genome-canvas__stack">
              {STORY_GENOME_AGENTS.right.map((node) => (
                <div key={node.id} className="story-genome-canvas__node">
                  <span className="story-genome-canvas__node-note">{node.kicker}</span>
                  <span className={`story-genome-canvas__node-label ${suisseIntl.className}`}>{node.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="story-genome-canvas__dock">
          <span className="story-genome-canvas__dock-label">Add</span>
          {STORY_GENOME_AGENTS.presets.map((preset) => (
            <span key={preset.id} className="story-genome-canvas__chip">
              {preset.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
