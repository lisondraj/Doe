import { PitchShaderFillBox } from "@/components/pitch/PitchShaderFillBox";
import { suisseIntl } from "@/lib/home/fonts";
import { PITCH_TEAM } from "@/lib/pitch/pitch-deck-copy";
import {
  STORY_TEAM_JAMES_POSTER,
  STORY_TEAM_MATTHEW_POSTER,
} from "@/lib/story/story-shader-posters";

/** Team tab — four-tile bento: founder shader cards + gold label tiles. */
export function StoryTeamPanel() {
  const [james, matthew] = PITCH_TEAM.founders;

  return (
    <div className={`story-team-callout ${suisseIntl.className}`} aria-label="Team">
      <ul className="story-team-grid story-team-grid--bento m-0 list-none p-0">
        <li className="story-team-grid__box story-team-grid__box--james">
          <PitchShaderFillBox
            posterSrc={STORY_TEAM_JAMES_POSTER}
            label={`${james.lines.join(" ")} — ${james.roleLabel}`}
            className="story-team-grid__fill"
            nameLines={james.lines}
            namePlacement="bottom-right"
            roleLabel={james.roleLabel}
            roleLabelPlacement={james.roleLabelPlacement}
            credentials={james.credentials}
            credentialsPlacement="top-left"
            tags={james.tags}
            tagsPlacement={james.tagsPlacement}
          />
        </li>
        <li className="story-team-grid__filler story-team-grid__filler--tr">
          <p className="story-team-grid__filler-label m-0">
            <span className="story-team-grid__filler-label-line block">Founding Team</span>
            <span className="story-team-grid__filler-label-line block">Structure</span>
          </p>
        </li>
        <li className="story-team-grid__filler story-team-grid__filler--bl">
          <p className="story-team-grid__filler-label m-0">
            <span className="story-team-grid__filler-label-line block">Clinical Partners</span>
            <span className="story-team-grid__filler-label-line block">Program</span>
          </p>
        </li>
        <li className="story-team-grid__box story-team-grid__box--matthew">
          <PitchShaderFillBox
            posterSrc={STORY_TEAM_MATTHEW_POSTER}
            label={`${matthew.lines.join(" ")} — ${matthew.roleLabel}`}
            className="story-team-grid__fill"
            nameLines={matthew.lines}
            namePlacement="top-left"
            roleLabel={matthew.roleLabel}
            roleLabelPlacement={matthew.roleLabelPlacement}
            credentials={matthew.credentials}
            credentialsPlacement="bottom-right"
            tags={matthew.tags}
            tagsPlacement={matthew.tagsPlacement}
          />
        </li>
      </ul>
    </div>
  );
}
