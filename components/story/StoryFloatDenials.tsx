import { dmSans, suisseIntl } from "@/lib/home/fonts";
import { STORY_FLOAT_DENIALS } from "@/lib/story/story-float-visuals";

/** Square Float tile — open denials queued to deadline. */
export function StoryFloatDenials() {
  return (
    <div className={`story-float-stage story-float-stage--denials ${dmSans.className}`} aria-hidden="true">
      <div className="story-float-card story-float-denials">
        <div className="story-float-denials__head">
          <span className="story-float-denials__eyebrow">{STORY_FLOAT_DENIALS.eyebrow}</span>
          <span className={`story-float-denials__count ${dmSans.className}`}>{STORY_FLOAT_DENIALS.count}</span>
        </div>

        <ul className="story-float-denials__list m-0 list-none p-0">
          {STORY_FLOAT_DENIALS.items.map((item) => (
            <li
              key={item.id}
              className={`story-float-denials__item${item.due === "Live" ? " story-float-denials__item--live" : ""}`}
            >
              <span className={`story-float-denials__payer ${suisseIntl.className}`}>{item.payer}</span>
              <span className="story-float-denials__reason">{item.reason}</span>
              <span className={`story-float-denials__due ${dmSans.className}`}>{item.due === "Live" ? "Appeal" : item.due}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
