import { StoryShaderPosterFill } from "@/components/story/StoryShaderPosterFill";
import { dmSans } from "@/lib/home/fonts";
import {
  STORY_GOALS_AT_SEED_ARR_AMOUNT,
  STORY_GOALS_AT_SEED_ARR_LABEL,
  STORY_GOALS_AT_SEED_ARR_META,
} from "@/lib/story/story-copy";
import {
  STORY_GOALS_AT_SEED_ITEMS,
  type StoryGoldOffset,
} from "@/lib/story/story-goals-at-seed";
import { STORY_GOALS_ARR_HERO_POSTER } from "@/lib/story/story-shader-posters";

function storyGoalsGoldOffsetClass(offset?: StoryGoldOffset) {
  return offset ? `story-goals-gold-offset story-goals-gold-offset--${offset}` : "";
}

function StoryGoalsFocusLine({
  text,
  offset,
}: {
  text: string;
  offset?: StoryGoldOffset;
}) {
  return (
    <p
      className={`story-goals-stat-focus m-0${offset ? " story-goals-stat-focus--offset-host" : ""}`}
    >
      {offset ? <span className={storyGoalsGoldOffsetClass(offset)}>{text}</span> : text}
    </p>
  );
}

/** Goals at Seed — ARR hero plus stacked milestone lockups (big focus, runway-style meta). */
export function StoryGoalsAtSeedPanel() {
  return (
    <div className={`story-goals-callout ${dmSans.className}`} aria-label="Goals at seed">
      <div className="story-goals-hero">
        <div className="story-goals-hero-box">
          <StoryShaderPosterFill
            src={STORY_GOALS_ARR_HERO_POSTER}
            className="story-goals-hero-box__poster"
          />
          <div className="story-goals-hero-lockup">
            <p className="story-goals-hero-meta m-0">{STORY_GOALS_AT_SEED_ARR_META}</p>
            <p
              className="story-goals-hero-amount m-0"
              aria-label="Two hundred thousand dollars annualized run rate by spring twenty twenty eight"
            >
              {STORY_GOALS_AT_SEED_ARR_AMOUNT}
            </p>
            <p className="story-goals-hero-label m-0">{STORY_GOALS_AT_SEED_ARR_LABEL}</p>
          </div>
        </div>
      </div>

      <ul className="story-goals-list m-0 p-0">
        {STORY_GOALS_AT_SEED_ITEMS.map((item) => (
          <li key={item.id} className="story-goals-stat-lockup story-goals-list__item">
            {item.metaAbove?.map((line) => (
              <p key={line} className="story-goals-stat-meta m-0">
                {line}
              </p>
            ))}
            {item.productLines ? (
              <div className="story-goals-product-lines" aria-label={item.meta}>
                {item.productLines.map((line) => (
                  <p key={`${line.accent}-${line.leading ?? ""}${line.trailing ?? ""}`} className="story-goals-product-lines__name m-0">
                    {line.leading ? <span className="story-goals-product-lines__plain">{line.leading}</span> : null}
                    <span className={storyGoalsGoldOffsetClass(line.offset ?? "ne")}>{line.accent}</span>
                    {line.trailing ? <span className="story-goals-product-lines__plain">{line.trailing}</span> : null}
                  </p>
                ))}
              </div>
            ) : item.focusLines ? (
              <div className="story-goals-stat-focus-stack">
                {item.focusLines.map((line) => (
                  <StoryGoalsFocusLine key={line.text} text={line.text} offset={line.offset} />
                ))}
              </div>
            ) : (
              <StoryGoalsFocusLine text={item.focus ?? ""} offset={item.focusOffset} />
            )}
            {item.meta ? <p className="story-goals-stat-meta m-0">{item.meta}</p> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
