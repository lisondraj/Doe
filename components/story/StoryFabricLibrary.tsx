import { dmSans, suisseIntl } from "@/lib/home/fonts";
import { STORY_FABRIC_LIBRARY } from "@/lib/story/story-fabric-visuals";

/** Square Fabric tile — gold squares are clinics on the peer flow. */
export function StoryFabricLibrary() {
  return (
    <div className={`story-fabric-stage story-fabric-stage--library ${dmSans.className}`} aria-hidden="true">
      <div className="story-fabric-card story-fabric-panel story-fabric-share">
        <span className="story-fabric-panel__kicker">{STORY_FABRIC_LIBRARY.kicker}</span>
        <span className={`story-fabric-panel__title ${suisseIntl.className}`}>{STORY_FABRIC_LIBRARY.title}</span>
        <div className="story-fabric-clinics">
          {STORY_FABRIC_LIBRARY.clinics.map((on, index) => (
            <i key={`clinic-${index}`} className={on ? "is-on" : "is-you"}>
              {on ? "" : "1"}
            </i>
          ))}
        </div>
        <p className={`story-fabric-panel__count m-0 ${dmSans.className}`}>{STORY_FABRIC_LIBRARY.count}</p>
        <span className="story-fabric-panel__label">{STORY_FABRIC_LIBRARY.label}</span>
        <div className="story-fabric-panel__sent">
          <b className={dmSans.className}>{STORY_FABRIC_LIBRARY.sent}</b>
          <span className={suisseIntl.className}>{STORY_FABRIC_LIBRARY.sentLabel}</span>
        </div>
      </div>
    </div>
  );
}
