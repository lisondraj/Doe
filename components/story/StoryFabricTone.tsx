import { dmSans, suisseIntl } from "@/lib/home/fonts";
import { STORY_FABRIC_TONE } from "@/lib/story/story-fabric-visuals";

/** Square Fabric tile — two stacked personality cards, not a settings grid. */
export function StoryFabricTone() {
  return (
    <div className={`story-fabric-stage story-fabric-stage--tone ${dmSans.className}`} aria-hidden="true">
      <div className="story-fabric-tones">
        {STORY_FABRIC_TONE.map((voice) => (
          <div key={voice.id} className={`story-fabric-card story-fabric-tone story-fabric-tone--${voice.id}`}>
            <div className="story-fabric-tone__head">
              <span className="story-fabric-tone__orb" />
              <div>
                <p className={`story-fabric-tone__name m-0 ${suisseIntl.className}`}>{voice.name}</p>
                <span className="story-fabric-tone__role">{voice.role}</span>
              </div>
              <span className="story-fabric-tone__specialty">{voice.specialty}</span>
            </div>
            <p className={`story-fabric-tone__sample m-0 ${dmSans.className}`}>{voice.sample}</p>
            <div className="story-fabric-tone__chips">
              <span>{voice.tone}</span>
              <span>{voice.pace}</span>
              <span>{voice.language}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
