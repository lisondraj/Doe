import { dmSans, suisseIntl } from "@/lib/home/fonts";
import { STORY_FABRIC_LIBRARY } from "@/lib/story/story-fabric-visuals";

/** Square Fabric tile — stacked community flows with a Use chip on the selected one. */
export function StoryFabricLibrary() {
  return (
    <div className={`story-fabric-stage story-fabric-stage--library ${dmSans.className}`} aria-hidden="true">
      <div className="story-fabric-card story-fabric-library">
        <span className={`story-fabric-library__eyebrow ${dmSans.className}`}>{STORY_FABRIC_LIBRARY.eyebrow}</span>

        <ul className="story-fabric-library__list m-0 list-none p-0">
          {STORY_FABRIC_LIBRARY.items.map((item) => (
            <li
              key={item.id}
              className={`story-fabric-library__item${item.selected ? " story-fabric-library__item--selected" : ""}`}
            >
              <div className="story-fabric-library__copy">
                <span className={`story-fabric-library__title ${suisseIntl.className}`}>{item.title}</span>
                <span className="story-fabric-library__source">{item.source}</span>
              </div>
              {item.selected ? (
                <span className="story-fabric-library__cta">Use</span>
              ) : (
                <span className={`story-fabric-library__uses ${dmSans.className}`}>{item.uses}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
