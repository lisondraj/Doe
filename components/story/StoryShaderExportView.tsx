"use client";

import { StoryShaderExportFrame } from "@/components/story/StoryShaderExportFrame";
import { STORY_MEET_DOE_MODAL_SHADERS } from "@/lib/story/story-contact-shader";
import {
  STORY_FABRIC_TALL_LEFT_SHADER,
} from "@/lib/story/story-fabric-shaders";
import {
  STORY_FLOAT_MID_LEFT_SHADER,
  STORY_FLOAT_TOP_RIGHT_SHADER,
} from "@/lib/story/story-float-shaders";
import {
  STORY_GENOME_BOTTOM_RIGHT_SHADER,
  STORY_GENOME_TOP_LEFT_SHADER,
} from "@/lib/story/story-genome-shaders";
import {
  STORY_PULSE_TALL_LEFT_SHADER,
  STORY_PULSE_WIDE_BOTTOM_SHADER,
} from "@/lib/story/story-pulse-shaders";
import {
  STORY_ROADMAP_FRONT_DESK_SHADER,
  STORY_ROADMAP_PRIOR_AUTH_SHADER,
  STORY_ROADMAP_RESULTS_SHADER,
} from "@/lib/story/story-roadmap-shaders";
import { STORY_GOALS_ARR_HERO_SHADER } from "@/lib/story/story-goals-shaders";
import {
  STORY_FABRIC_TALL_POSTER_EXPORT,
  STORY_FLOAT_CELL_POSTER_EXPORT,
  STORY_GENOME_POSTER_EXPORT,
  STORY_GOALS_ARR_HERO_POSTER_EXPORT,
  STORY_MEET_DOE_POSTER_EXPORT,
  STORY_PULSE_TALL_POSTER_EXPORT,
  STORY_PULSE_WIDE_POSTER_EXPORT,
  STORY_ROADMAP_POSTER_EXPORT,
  STORY_TEAM_POSTER_EXPORT,
} from "@/lib/story/story-shader-posters";
import { STORY_TEAM_JAMES_SHADER, STORY_TEAM_MATTHEW_SHADER } from "@/lib/story/story-team-shaders";

/** All story shader posters in one page for batch export. */
export function StoryShaderExportView() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
        padding: 24,
        background: "#0e0c0a",
      }}
    >
      {STORY_TEAM_JAMES_SHADER ? (
        <StoryShaderExportFrame
          exportId="team-james"
          surface={STORY_TEAM_JAMES_SHADER}
          width={STORY_TEAM_POSTER_EXPORT.width}
          height={STORY_TEAM_POSTER_EXPORT.height}
        />
      ) : null}
      {STORY_TEAM_MATTHEW_SHADER ? (
        <StoryShaderExportFrame
          exportId="team-matthew"
          surface={STORY_TEAM_MATTHEW_SHADER}
          width={STORY_TEAM_POSTER_EXPORT.width}
          height={STORY_TEAM_POSTER_EXPORT.height}
        />
      ) : null}
      {STORY_MEET_DOE_MODAL_SHADERS.map((surface, index) => (
        <StoryShaderExportFrame
          key={`meet-doe-${index + 1}`}
          exportId={`meet-doe-slide-${index + 1}`}
          surface={surface}
          width={STORY_MEET_DOE_POSTER_EXPORT.width}
          height={STORY_MEET_DOE_POSTER_EXPORT.height}
        />
      ))}
      <StoryShaderExportFrame
        exportId="genome-top-left"
        surface={STORY_GENOME_TOP_LEFT_SHADER}
        width={STORY_GENOME_POSTER_EXPORT.width}
        height={STORY_GENOME_POSTER_EXPORT.height}
      />
      <StoryShaderExportFrame
        exportId="genome-bottom-right"
        surface={STORY_GENOME_BOTTOM_RIGHT_SHADER}
        width={STORY_GENOME_POSTER_EXPORT.width}
        height={STORY_GENOME_POSTER_EXPORT.height}
      />
      <StoryShaderExportFrame
        exportId="pulse-tall-left"
        surface={STORY_PULSE_TALL_LEFT_SHADER}
        width={STORY_PULSE_TALL_POSTER_EXPORT.width}
        height={STORY_PULSE_TALL_POSTER_EXPORT.height}
      />
      <StoryShaderExportFrame
        exportId="pulse-wide-bottom"
        surface={STORY_PULSE_WIDE_BOTTOM_SHADER}
        width={STORY_PULSE_WIDE_POSTER_EXPORT.width}
        height={STORY_PULSE_WIDE_POSTER_EXPORT.height}
      />
      <StoryShaderExportFrame
        exportId="fabric-tall-left"
        surface={STORY_FABRIC_TALL_LEFT_SHADER}
        width={STORY_FABRIC_TALL_POSTER_EXPORT.width}
        height={STORY_FABRIC_TALL_POSTER_EXPORT.height}
      />
      <StoryShaderExportFrame
        exportId="float-top-right"
        surface={STORY_FLOAT_TOP_RIGHT_SHADER}
        width={STORY_FLOAT_CELL_POSTER_EXPORT.width}
        height={STORY_FLOAT_CELL_POSTER_EXPORT.height}
      />
      <StoryShaderExportFrame
        exportId="float-mid-left"
        surface={STORY_FLOAT_MID_LEFT_SHADER}
        width={STORY_FLOAT_CELL_POSTER_EXPORT.width}
        height={STORY_FLOAT_CELL_POSTER_EXPORT.height}
      />
      <StoryShaderExportFrame
        exportId="roadmap-front-desk"
        surface={STORY_ROADMAP_FRONT_DESK_SHADER}
        width={STORY_ROADMAP_POSTER_EXPORT.width}
        height={STORY_ROADMAP_POSTER_EXPORT.height}
      />
      <StoryShaderExportFrame
        exportId="roadmap-prior-auth"
        surface={STORY_ROADMAP_PRIOR_AUTH_SHADER}
        width={STORY_ROADMAP_POSTER_EXPORT.width}
        height={STORY_ROADMAP_POSTER_EXPORT.height}
      />
      <StoryShaderExportFrame
        exportId="roadmap-results"
        surface={STORY_ROADMAP_RESULTS_SHADER}
        width={STORY_ROADMAP_POSTER_EXPORT.width}
        height={STORY_ROADMAP_POSTER_EXPORT.height}
      />
      <StoryShaderExportFrame
        exportId="goals-arr-hero"
        surface={STORY_GOALS_ARR_HERO_SHADER}
        width={STORY_GOALS_ARR_HERO_POSTER_EXPORT.width}
        height={STORY_GOALS_ARR_HERO_POSTER_EXPORT.height}
      />
    </main>
  );
}
