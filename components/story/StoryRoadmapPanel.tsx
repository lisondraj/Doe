import { dmSans, suisseIntl } from "@/lib/home/fonts";
import {
  STORY_GTM_EYEBROW,
  STORY_GTM_HEADLINE,
  STORY_GTM_PHASES,
  STORY_ROADMAP_AGENT_ROWS,
  STORY_ROADMAP_BODY,
  STORY_ROADMAP_DIAGRAM_LABEL,
  STORY_ROADMAP_FOCUS,
  STORY_ROADMAP_FOCUS_LABEL,
  STORY_ROADMAP_HEADLINE,
  STORY_ROADMAP_PRODUCT_EYEBROW,
  STORY_ROADMAP_VOICE_FEATURES,
  type StoryRoadmapAgent,
} from "@/lib/story/story-roadmap-gtm";

function StoryRoadmapAgentCard({
  agent,
  index,
}: {
  agent: StoryRoadmapAgent;
  index: number;
}) {
  return (
    <li className="story-roadmap-diagram__node">
      <span className="story-roadmap-diagram__drop" aria-hidden />
      <article className="story-roadmap-agent-card">
        <span className="story-roadmap-agent-card__index" aria-hidden>
          {String(index + 1).padStart(2, "0")}
        </span>
        <h4 className={`story-roadmap-agent-card__title m-0 ${dmSans.className}`}>{agent.label}</h4>
        <p className="story-roadmap-agent-card__timing m-0">{agent.timing}</p>
        <p className={`story-roadmap-agent-card__desc m-0 ${suisseIntl.className}`}>{agent.description}</p>
      </article>
    </li>
  );
}

/** Roadmap — full-panel product diagram plus GTM phase timeline. */
export function StoryRoadmapPanel() {
  let agentIndex = 0;

  return (
    <div className={`story-roadmap-callout ${dmSans.className}`} aria-label="Roadmap">
      <header className="story-roadmap-hero">
        <h2 className={`story-roadmap-hero-headline m-0 ${dmSans.className}`}>{STORY_ROADMAP_HEADLINE}</h2>
        <p className={`story-roadmap-hero-body m-0 ${suisseIntl.className}`}>{STORY_ROADMAP_BODY}</p>
      </header>

      <div className="story-roadmap-stage">
        <section className={`story-roadmap-product-panel ${suisseIntl.className}`} aria-label="Product roadmap">
          <div className="story-roadmap-panel-head">
            <p className="story-roadmap-eyebrow m-0">{STORY_ROADMAP_PRODUCT_EYEBROW}</p>
            <p className="story-roadmap-panel-caption m-0">{STORY_ROADMAP_DIAGRAM_LABEL}</p>
          </div>

          <div className="story-roadmap-diagram" aria-label="Voice-first agent rollout diagram">
            <div className="story-roadmap-diagram__focus-wrap">
              <div className="story-roadmap-diagram__focus">
                <span className="story-roadmap-diagram__focus-tag">{STORY_ROADMAP_FOCUS_LABEL}</span>
                <span className={`story-roadmap-diagram__focus-value ${dmSans.className}`}>{STORY_ROADMAP_FOCUS}</span>
              </div>
              <div className="story-roadmap-diagram__focus-stem" aria-hidden />
            </div>

            <div className="story-roadmap-diagram__rows">
              {STORY_ROADMAP_AGENT_ROWS.map((row, rowIndex) => (
                <div key={row.map((agent) => agent.id).join("-")} className="story-roadmap-diagram__row">
                  {rowIndex > 0 ? <div className="story-roadmap-diagram__row-link" aria-hidden /> : null}
                  <div className="story-roadmap-diagram__row-bar" aria-hidden />
                  <ul className={`story-roadmap-diagram__next story-roadmap-diagram__next--count-${row.length} m-0 p-0`}>
                    {row.map((agent) => {
                      const card = <StoryRoadmapAgentCard key={agent.id} agent={agent} index={agentIndex} />;
                      agentIndex += 1;
                      return card;
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <ul className="story-roadmap-voice-strip m-0 p-0" aria-label="Voice capabilities live today">
            {STORY_ROADMAP_VOICE_FEATURES.map((feature) => (
              <li key={feature.label} className="story-roadmap-voice-strip__item">
                <span className="story-roadmap-voice-strip__label">{feature.label}</span>
                <span className="story-roadmap-voice-strip__note">{feature.note}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={`story-roadmap-gtm-panel ${suisseIntl.className}`} aria-label="Go-to-market">
          <div className="story-roadmap-panel-head">
            <p className="story-roadmap-eyebrow m-0">{STORY_GTM_EYEBROW}</p>
            <h3 className={`story-roadmap-gtm-headline m-0 ${dmSans.className}`}>{STORY_GTM_HEADLINE}</h3>
          </div>

          <ol className="story-roadmap-gtm-phases m-0 p-0">
            {STORY_GTM_PHASES.map((phase) => (
              <li key={phase.id} className="story-roadmap-gtm-phase">
                <div className="story-roadmap-gtm-phase__rail" aria-hidden>
                  <span className="story-roadmap-gtm-phase__step">{phase.step}</span>
                  <span className="story-roadmap-gtm-phase__line" />
                </div>
                <article className="story-roadmap-gtm-phase__card">
                  <p className="story-roadmap-gtm-phase__title m-0">{phase.title}</p>
                  <h4 className={`story-roadmap-gtm-phase__headline m-0 ${dmSans.className}`}>{phase.headline}</h4>
                  <p className={`story-roadmap-gtm-phase__detail m-0 ${suisseIntl.className}`}>{phase.detail}</p>
                  <ul className="story-roadmap-gtm-phase__markers m-0 p-0">
                    {phase.markers.map((marker) => (
                      <li key={marker} className="story-roadmap-gtm-phase__marker">
                        {marker}
                      </li>
                    ))}
                  </ul>
                </article>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
