import { PitchShaderFillBox } from "@/components/pitch/PitchShaderFillBox";
import { suisseIntl } from "@/lib/home/fonts";
import { PITCH_TEAM } from "@/lib/pitch/pitch-deck-copy";
import {
  STORY_TEAM_JAMES_BACKDROP,
  STORY_TEAM_MATTHEW_BACKDROP,
} from "@/lib/story/story-team-backdrops";
import { DOE_HOME_HERO_DUSK_PALETTE } from "@/lib/proto/proto-shader-backdrop-colors";

const teamCardColorBack = DOE_HOME_HERO_DUSK_PALETTE.back;

/** Team tab — James and Matthew founder cards from the pitch deck. */
export function StoryTeamPanel() {
  const [james, matthew] = PITCH_TEAM.founders;

  return (
    <div className={`story-team-callout ${suisseIntl.className}`} aria-label="Team">
      <div className="story-team-stage">
        <div className="story-team-grid">
          <div
            className="story-team-grid__box story-team-grid__box--james"
            style={{ backgroundColor: teamCardColorBack }}
          >
            <PitchShaderFillBox
              backdropImageSrc={STORY_TEAM_JAMES_BACKDROP}
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
          </div>
          <div
            className="story-team-grid__box story-team-grid__box--matthew"
            style={{ backgroundColor: teamCardColorBack }}
          >
            <PitchShaderFillBox
              backdropImageSrc={STORY_TEAM_MATTHEW_BACKDROP}
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
          </div>
        </div>
      </div>
    </div>
  );
}
