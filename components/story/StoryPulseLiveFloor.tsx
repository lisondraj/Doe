import { dmSans, suisseIntl } from "@/lib/home/fonts";
import { STORY_PULSE_LIVE } from "@/lib/story/story-pulse-visuals";

/** Pulse floor — live agents plus a human take-over. */
export function StoryPulseLiveFloor() {
  return (
    <div className={`story-pulse-stage story-pulse-stage--live ${dmSans.className}`} aria-hidden="true">
      <div className="story-pulse-card story-pulse-live">
        <div className="story-pulse-live__head">
          <span className={`story-pulse-live__stat ${dmSans.className}`}>
            <b>{STORY_PULSE_LIVE.live}</b>
            live
          </span>
          <span className={`story-pulse-live__stat story-pulse-live__stat--human ${dmSans.className}`}>
            <b>{STORY_PULSE_LIVE.human}</b>
            human
          </span>
        </div>

        <ul className="story-pulse-live__agents m-0 list-none p-0">
          {STORY_PULSE_LIVE.agents.map((agent) => (
            <li key={agent.id} className="story-pulse-live__agent">
              <span className="story-pulse-live__who">
                <i className={agent.state === "Live" ? "is-live" : undefined} />
                {agent.name}
                <em className={dmSans.className}>{agent.time}</em>
              </span>
              <span
                className={`story-pulse-live__state${agent.state === "Hold" ? " story-pulse-live__state--hold" : ""}`}
              >
                {agent.state}
              </span>
            </li>
          ))}
        </ul>

        <div className="story-pulse-live__takeover">
          <span className="story-pulse-live__takeover-label">{STORY_PULSE_LIVE.intervention.title}</span>
          <span className={`story-pulse-live__takeover-name ${suisseIntl.className}`}>
            {STORY_PULSE_LIVE.intervention.person}
          </span>
          <span className="story-pulse-live__takeover-reason">{STORY_PULSE_LIVE.intervention.reason}</span>
        </div>
      </div>
    </div>
  );
}
