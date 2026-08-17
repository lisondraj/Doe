import { dmSans, suisseIntl } from "@/lib/home/fonts";
import { STORY_PULSE_VOICES } from "@/lib/story/story-pulse-visuals";

/** Wide Pulse tile — three voice agents, each with its own settings. */
export function StoryPulseVoiceSettings() {
  return (
    <div className={`story-pulse-stage story-pulse-stage--voices ${dmSans.className}`} aria-hidden="true">
      <div className="story-pulse-voices">
        {STORY_PULSE_VOICES.map((agent) => (
          <div key={agent.id} className={`story-pulse-card story-pulse-voice story-pulse-voice--${agent.id}`}>
            <div className="story-pulse-voice__mark">
              <div className="story-pulse-voice__orb" />
              <span>On</span>
            </div>
            <p className={`story-pulse-voice__name m-0 ${suisseIntl.className}`}>{agent.name}</p>
            <dl className="story-pulse-voice__settings m-0">
              <div>
                <dt>Voice</dt>
                <dd>{agent.voice}</dd>
              </div>
              <div>
                <dt>Language</dt>
                <dd>{agent.language}</dd>
              </div>
              <div>
                <dt>Tone</dt>
                <dd>{agent.tone}</dd>
              </div>
              <div>
                <dt>Pace</dt>
                <dd>{agent.pace}</dd>
              </div>
              <div>
                <dt className={dmSans.className}>Hours</dt>
                <dd className={dmSans.className}>{agent.hours}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}
