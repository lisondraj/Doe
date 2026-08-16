import { StoryFundraiseAskPanel } from "@/components/story/StoryFundraiseAskPanel";
import { StoryFundraiseBudgetTable } from "@/components/story/StoryFundraiseBudgetTable";

/** Our Ask — ask left, full-height budget right. */
export function StoryOurAskPanel() {
  return (
    <div className="story-our-ask-stage">
      <div className="story-our-ask-grid">
        <div className="story-our-ask-grid__cell story-our-ask-grid__cell--ask">
          <StoryFundraiseAskPanel />
        </div>
        <div className="story-our-ask-grid__cell story-our-ask-grid__cell--budget">
          <StoryFundraiseBudgetTable embedded />
        </div>
      </div>
    </div>
  );
}
