import { dmSans } from "@/lib/home/fonts";
import {
  STORY_FUNDRAISE_AMOUNT,
  STORY_FUNDRAISE_ROUND,
  STORY_FUNDRAISE_RUNWAY_DURATION,
  STORY_FUNDRAISE_RUNWAY_LABEL,
} from "@/lib/story/story-copy";

/** Centered Our Ask — Pre-Seed, raise amount, and runway. */
export function StoryFundraiseAskPanel() {
  return (
    <div className={`story-fundraise-callout ${dmSans.className}`} aria-label="Our ask">
      <div className="story-fundraise-amount-block">
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
  );
}
