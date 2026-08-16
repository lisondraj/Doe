import { dmSans, suisseIntl } from "@/lib/home/fonts";
import {
  STORY_GTM_EYEBROW,
  STORY_GTM_HEADLINE,
  STORY_GTM_POINTS,
  STORY_ROADMAP_AGENT_ROWS,
  STORY_ROADMAP_BODY,
  STORY_ROADMAP_FOCUS,
  STORY_ROADMAP_FOCUS_LABEL,
  STORY_ROADMAP_HEADLINE,
  STORY_ROADMAP_PRODUCT_EYEBROW,
} from "@/lib/story/story-roadmap-gtm";

/** Roadmap — product rollout from Voice plus go-to-market plan. */
export function StoryRoadmapPanel() {
  return (
    <div className={`story-roadmap-callout ${dmSans.className}`} aria-label="Roadmap">
      <header className="story-roadmap-hero">
        <h2 className={`story-roadmap-hero-headline m-0 ${dmSans.className}`}>{STORY_ROADMAP_HEADLINE}</h2>
        <p className={`story-roadmap-hero-body m-0 ${suisseIntl.className}`}>{STORY_ROADMAP_BODY}</p>
      </header>

      <div className="story-roadmap-columns">
        <section className={`story-roadmap-product ${suisseIntl.className}`} aria-label="Product roadmap">
          <p className="story-roadmap-eyebrow m-0">{STORY_ROADMAP_PRODUCT_EYEBROW}</p>

          <div className="story-roadmap-focus-card">
            <p className="story-roadmap-focus-label m-0">{STORY_ROADMAP_FOCUS_LABEL}</p>
            <p className={`story-roadmap-focus-value m-0 ${dmSans.className}`}>{STORY_ROADMAP_FOCUS}</p>
          </div>

          <ul className="story-roadmap-agent-grid m-0 p-0">
            {STORY_ROADMAP_AGENT_ROWS.flat().map((label) => (
              <li key={label} className="story-roadmap-agent-grid__item">
                <span className="story-roadmap-agent-grid__label">{label}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={`story-roadmap-gtm ${suisseIntl.className}`} aria-label="Go-to-market">
          <p className="story-roadmap-eyebrow m-0">{STORY_GTM_EYEBROW}</p>
          <h3 className={`story-roadmap-gtm-headline m-0 ${dmSans.className}`}>{STORY_GTM_HEADLINE}</h3>
          <ul className="story-roadmap-gtm-list m-0 p-0">
            {STORY_GTM_POINTS.map((point) => (
              <li key={point} className="story-roadmap-gtm-list__item">
                <span className="story-roadmap-gtm-list__bullet" aria-hidden />
                <p className={`story-roadmap-gtm-list__text m-0 ${suisseIntl.className}`}>{point}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
