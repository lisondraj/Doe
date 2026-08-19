import { dmSans, suisseIntl } from "@/lib/home/fonts";
import { STORY_GENOME_KEPT } from "@/lib/story/story-genome-visuals";

/** Square Genome tile — patient information stays on Harbor Genome. */
export function StoryGenomeModelRouter() {
  return (
    <div className={`story-genome-stage story-genome-stage--kept ${dmSans.className}`} aria-hidden="true">
      <div className="story-genome-card story-genome-kept">
        <span className="story-genome-kept__clinic">{STORY_GENOME_KEPT.clinic}</span>

        <div className="story-genome-kept__stack">
          <i />
          <i />
          <i />
        </div>

        <p className={`story-genome-kept__kept m-0 ${dmSans.className}`}>{STORY_GENOME_KEPT.kept}</p>
        <span className="story-genome-kept__kept-label">{STORY_GENOME_KEPT.keptLabel}</span>

        <div className="story-genome-kept__sent">
          <b className={dmSans.className}>{STORY_GENOME_KEPT.sent}</b>
          <span className={suisseIntl.className}>{STORY_GENOME_KEPT.sentLabel}</span>
        </div>
      </div>
    </div>
  );
}
