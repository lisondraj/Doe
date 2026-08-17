import { dmSans, suisseIntl } from "@/lib/home/fonts";
import { STORY_FLOAT_HOLD } from "@/lib/story/story-float-visuals";

/** Float payer hold — live call queue that writes the reference back to the chart. */
export function StoryFloatHold() {
  return (
    <div className={`story-float-stage story-float-stage--hold ${dmSans.className}`} aria-hidden="true">
      <div className="story-float-card story-float-hold">
        <div className="story-float-hold__line">
          <span className="story-float-hold__live">
            <i />
            {STORY_FLOAT_HOLD.status}
          </span>
          <span className={`story-float-hold__timer ${dmSans.className}`}>{STORY_FLOAT_HOLD.timer}</span>
        </div>

        <p className={`story-float-hold__payer m-0 ${suisseIntl.className}`}>{STORY_FLOAT_HOLD.payer}</p>
        <span className="story-float-hold__task">{STORY_FLOAT_HOLD.task}</span>

        <ul className="story-float-hold__beats m-0 list-none p-0">
          {STORY_FLOAT_HOLD.beats.map((beat) => (
            <li
              key={beat.id}
              className={`story-float-hold__beat${beat.state === "Live" ? " story-float-hold__beat--live" : ""}`}
            >
              <span>
                {beat.label}
                <em className={dmSans.className}>{beat.at}</em>
              </span>
              <span
                className={`story-float-hold__state${beat.state === "Live" ? " story-float-hold__state--live" : ""}`}
              >
                {beat.state}
              </span>
            </li>
          ))}
        </ul>

        <div className="story-float-hold__foot">
          <span className={dmSans.className}>{STORY_FLOAT_HOLD.ref}</span>
          <span>{STORY_FLOAT_HOLD.note}</span>
        </div>
      </div>
    </div>
  );
}
