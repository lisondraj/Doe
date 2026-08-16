import { StoryShaderPosterFill } from "@/components/story/StoryShaderPosterFill";
import { suisseIntl } from "@/lib/home/fonts";
import { STORY_ROADMAP_TILES } from "@/lib/story/story-roadmap";

/** Roadmap tab — six-tile bento grid with hover expansion. */
export function StoryRoadmapPanel() {
  return (
    <div className={`story-roadmap-panel ${suisseIntl.className}`} aria-label="Roadmap">
      <ul className="story-roadmap-grid story-roadmap-grid--bento m-0 list-none p-0">
        {STORY_ROADMAP_TILES.map((tile) => (
          <li
            key={tile.id}
            className={`story-roadmap-tile${tile.posterSrc ? " story-roadmap-tile--poster" : ""}`}
          >
            {tile.posterSrc ? (
              <>
                <StoryShaderPosterFill
                  src={tile.posterSrc}
                  className="story-roadmap-tile__poster"
                />
                <div className="story-roadmap-tile__poster-scrim" aria-hidden />
              </>
            ) : null}
            <span className="story-roadmap-tile__label">{tile.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
