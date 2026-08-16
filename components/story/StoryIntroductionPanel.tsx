import { StoryIntroductionCarousel } from "@/components/story/StoryIntroductionCarousel";
import { suisseIntl } from "@/lib/home/fonts";
import {
  STORY_CONTACT_EMAIL,
  STORY_INTRODUCTION_BODY_LEAD,
  STORY_INTRODUCTION_BODY_TAIL,
  STORY_INTRODUCTION_HEADLINE,
} from "@/lib/story/story-copy";

/** Introduction tab — opening headline, deck purpose, and preview carousel. */
export function StoryIntroductionPanel() {
  return (
    <div className={`story-introduction-panel ${suisseIntl.className}`} aria-label="Introduction">
      <div className="story-introduction-panel__intro">
        <h2 className="story-introduction-panel__headline m-0">{STORY_INTRODUCTION_HEADLINE}</h2>
        <p className="story-introduction-panel__body m-0">
          {STORY_INTRODUCTION_BODY_LEAD}
          <a href={`mailto:${STORY_CONTACT_EMAIL}`} className="story-introduction-panel__contact">
            James
          </a>
          {STORY_INTRODUCTION_BODY_TAIL}
        </p>
      </div>
      <StoryIntroductionCarousel />
    </div>
  );
}
