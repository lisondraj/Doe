import { DOEPHONE_DISPLAY_WEIGHT_TW } from "@/lib/doephone/section-styles";
import { dmSans, suisseIntl } from "@/lib/home/fonts";
import { STORY_GENOME_TRAIN } from "@/lib/story/story-genome-visuals";

/** End-of-week prompt — train Genome to the next version. */
export function StoryGenomeWeeklyTrain() {
  return (
    <div className={`story-genome-stage story-genome-stage--train ${dmSans.className}`} aria-hidden="true">
      <div className="story-genome-card story-genome-train">
        <span className={`story-genome-train__when ${dmSans.className}`}>{STORY_GENOME_TRAIN.when}</span>

        <p className={`story-genome-train__clinic m-0 ${suisseIntl.className}`}>{STORY_GENOME_TRAIN.clinic}</p>
        <p className={`story-genome-train__to m-0 ${DOEPHONE_DISPLAY_WEIGHT_TW} ${dmSans.className}`}>
          {STORY_GENOME_TRAIN.toVersion}
        </p>
        <span className={`story-genome-train__from ${dmSans.className}`}>from {STORY_GENOME_TRAIN.fromVersion}</span>
        <span className="story-genome-train__bar" />

        <span className="story-genome-train__approved">Approved sources</span>
        <div className="story-genome-train__sources">
          {STORY_GENOME_TRAIN.sources.map((source) => (
            <span key={source}>{source}</span>
          ))}
        </div>

        <div className="story-genome-train__foot">
          <span className={`story-genome-train__signals ${dmSans.className}`}>{STORY_GENOME_TRAIN.signals}</span>
          <span className="story-genome-train__cta">{STORY_GENOME_TRAIN.cta}</span>
        </div>
      </div>
    </div>
  );
}
