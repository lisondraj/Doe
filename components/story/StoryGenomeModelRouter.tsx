import { dmSans } from "@/lib/home/fonts";
import { STORY_GENOME_ROUTER } from "@/lib/story/story-genome-visuals";

/** Task router — routine work stays on the clinic model; hard cases go to frontier. */
export function StoryGenomeModelRouter() {
  const lanes = [STORY_GENOME_ROUTER.personal, STORY_GENOME_ROUTER.frontier] as const;

  return (
    <div className={`story-genome-stage story-genome-stage--router ${dmSans.className}`} aria-hidden="true">
      <div className="story-genome-card story-genome-router">
        <span className="story-genome-router__kicker">Incoming</span>
        {lanes.map((lane, index) => (
          <div
            key={lane.label}
            className={`story-genome-router__lane${index === 0 ? " story-genome-router__lane--personal" : " story-genome-router__lane--frontier"}`}
          >
            <div className="story-genome-router__lane-head">
              <div className="story-genome-router__lane-copy">
                <span className={`story-genome-router__lane-label ${dmSans.className}`}>{lane.label}</span>
                <span className="story-genome-router__lane-note">{lane.note}</span>
              </div>
              <span className={`story-genome-router__lane-count ${dmSans.className}`}>{lane.count}</span>
            </div>
            <div className="story-genome-router__lane-tasks">
              {lane.tasks.map((task) => (
                <span key={task}>{task}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
