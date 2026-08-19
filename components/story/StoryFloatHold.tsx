import { dmSans, suisseIntl } from "@/lib/home/fonts";
import { STORY_FLOAT_HOLD } from "@/lib/story/story-float-visuals";

/** Square Float tile — payer hold as a segmented runway. */
export function StoryFloatHold() {
  return (
    <div className={`story-float-stage story-float-stage--hold ${dmSans.className}`} aria-hidden="true">
      <div className="story-float-card story-float-hold">
        <span className="story-float-hold__live">{STORY_FLOAT_HOLD.status}</span>
        <p className={`story-float-hold__payer m-0 ${suisseIntl.className}`}>{STORY_FLOAT_HOLD.payer}</p>
        <span className={`story-float-hold__timer ${dmSans.className}`}>{STORY_FLOAT_HOLD.timer}</span>
        <span className="story-float-hold__task">{STORY_FLOAT_HOLD.task}</span>

        <ul className="story-float-hold__runway m-0 list-none p-0">
          {STORY_FLOAT_HOLD.beats.map((beat) => (
            <li
              key={beat.id}
              className={`story-float-hold__seg story-float-hold__seg--${beat.state.toLowerCase()}`}
            >
              <span className="story-float-hold__seg-label">{beat.label}</span>
              <span className={`story-float-hold__seg-at ${dmSans.className}`}>{beat.at}</span>
            </li>
          ))}
        </ul>

        <span className={`story-float-hold__ref ${dmSans.className}`}>{STORY_FLOAT_HOLD.ref}</span>
      </div>
    </div>
  );
}
