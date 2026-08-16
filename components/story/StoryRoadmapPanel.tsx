import { dmSans, suisseIntl } from "@/lib/home/fonts";
import {
  STORY_GTM_EYEBROW,
  STORY_GTM_HEADLINE,
  STORY_GTM_PHASES,
  STORY_ROADMAP_AGENTS,
  STORY_ROADMAP_BODY,
  STORY_ROADMAP_HEADLINE,
  STORY_ROADMAP_PRODUCT_EYEBROW,
  STORY_ROADMAP_VOICE_FEATURES,
  type StoryRoadmapAgent,
} from "@/lib/story/story-roadmap-gtm";

const STORY_ROADMAP_MONTHS = ["Now", "M3", "M6", "M9", "M12", "M15", "M18"] as const;

function StoryRoadmapProductMilestone({ agent, index }: { agent: StoryRoadmapAgent; index: number }) {
  return (
    <li className="story-roadmap-milestone story-roadmap-milestone--product">
      <article className="story-roadmap-milestone__card">
        <span className="story-roadmap-milestone__number" aria-hidden>
          {String(index + 1).padStart(2, "0")}
        </span>
        <p className="story-roadmap-milestone__time m-0">{agent.timing}</p>
        <h4 className={`story-roadmap-milestone__title m-0 ${dmSans.className}`}>{agent.label}</h4>
        <p className={`story-roadmap-milestone__detail m-0 ${suisseIntl.className}`}>{agent.description}</p>
      </article>
    </li>
  );
}

/** Roadmap — a shared 18-month product and market timeline. */
export function StoryRoadmapPanel() {
  return (
    <div className={`story-roadmap-callout ${dmSans.className}`} aria-label="Roadmap">
      <header className="story-roadmap-hero">
        <div>
          <p className="story-roadmap-eyebrow story-roadmap-hero__eyebrow m-0">18-month roadmap</p>
          <h2 className={`story-roadmap-hero-headline m-0 ${dmSans.className}`}>{STORY_ROADMAP_HEADLINE}</h2>
        </div>
        <p className={`story-roadmap-hero-body m-0 ${suisseIntl.className}`}>{STORY_ROADMAP_BODY}</p>
      </header>

      <section className={`story-roadmap-timeline ${suisseIntl.className}`} aria-label="Toronto to seed roadmap">
        <div className="story-roadmap-timeline__axis" aria-label="Roadmap timeline from now to month 18">
          {STORY_ROADMAP_MONTHS.map((month, index) => (
            <span
              key={month}
              className={`story-roadmap-timeline__tick${index === 0 ? " story-roadmap-timeline__tick--start" : ""}${
                index === STORY_ROADMAP_MONTHS.length - 1 ? " story-roadmap-timeline__tick--end" : ""
              }`}
            >
              {month}
            </span>
          ))}
        </div>

        <div className="story-roadmap-timeline__tracks">
          <section className="story-roadmap-track" aria-label="Product rollout">
            <header className="story-roadmap-track__head">
              <span className="story-roadmap-track__dot" aria-hidden />
              <div>
                <p className="story-roadmap-eyebrow m-0">{STORY_ROADMAP_PRODUCT_EYEBROW}</p>
                <p className="story-roadmap-track__caption m-0">Ship a connected operating system, one layer at a time.</p>
              </div>
            </header>
            <ol className="story-roadmap-track__milestones m-0 p-0">
              {STORY_ROADMAP_AGENTS.map((agent, index) => (
                <StoryRoadmapProductMilestone key={agent.id} agent={agent} index={index} />
              ))}
            </ol>
          </section>

          <section className="story-roadmap-track story-roadmap-track--market" aria-label="Go-to-market roadmap">
            <header className="story-roadmap-track__head">
              <span className="story-roadmap-track__dot" aria-hidden />
              <div>
                <p className="story-roadmap-eyebrow m-0">{STORY_GTM_EYEBROW}</p>
                <h3 className={`story-roadmap-track__headline m-0 ${dmSans.className}`}>{STORY_GTM_HEADLINE}</h3>
              </div>
            </header>
            <ol className="story-roadmap-track__milestones m-0 p-0">
              {STORY_GTM_PHASES.map((phase) => (
                <li key={phase.id} className="story-roadmap-milestone story-roadmap-milestone--market">
                  <article className="story-roadmap-milestone__card">
                    <span className="story-roadmap-milestone__number" aria-hidden>{phase.step}</span>
                    <p className="story-roadmap-milestone__time m-0">{phase.title}</p>
                    <h4 className={`story-roadmap-milestone__title m-0 ${dmSans.className}`}>{phase.headline}</h4>
                    <p className={`story-roadmap-milestone__detail m-0 ${suisseIntl.className}`}>{phase.detail}</p>
                    <ul className="story-roadmap-milestone__markers m-0 p-0">
                      {phase.markers.map((marker) => <li key={marker}>{marker}</li>)}
                    </ul>
                  </article>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <ul className="story-roadmap-proof-strip m-0 p-0" aria-label="Roadmap foundations">
          {STORY_ROADMAP_VOICE_FEATURES.map((feature) => (
            <li key={feature.label}>
              <span>{feature.label}</span>
              <small>{feature.note}</small>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
