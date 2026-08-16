import { StoryShaderPosterFill } from "@/components/story/StoryShaderPosterFill";
import { dmSans } from "@/lib/home/fonts";
import {
  STORY_FUNDRAISE_AMOUNT,
  STORY_FUNDRAISE_ROUND,
  STORY_FUNDRAISE_RUNWAY_DURATION,
  STORY_FUNDRAISE_RUNWAY_LABEL,
} from "@/lib/story/story-copy";
import { STORY_GENOME_TOP_LEFT_POSTER } from "@/lib/story/story-shader-posters";

/** Centered Our Ask — Pre-Seed, raise amount, and runway. */
export function StoryFundraiseAskPanel() {
  return (
    <div
      className={`story-fundraise-callout story-fundraise-callout--shader-box ${dmSans.className}`}
      aria-label="Our ask"
    >
      <StoryShaderPosterFill
        src={STORY_GENOME_TOP_LEFT_POSTER}
        className="story-fundraise-callout__poster"
      />
      <div className="story-fundraise-amount-block">
        <div className="story-fundraise-raise-lockup">
          <p className="story-fundraise-round m-0">{STORY_FUNDRAISE_ROUND}</p>
          <p className="story-fundraise-amount m-0" aria-label="One point five million dollars">
            {STORY_FUNDRAISE_AMOUNT}
          </p>
          <div className="story-fundraise-runway">
            <p className="story-fundraise-runway-duration m-0">{STORY_FUNDRAISE_RUNWAY_DURATION}</p>
            <p className="story-fundraise-runway-label m-0">{STORY_FUNDRAISE_RUNWAY_LABEL}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
