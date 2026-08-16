import { STORY_MEET_DOE_MODAL_BACKDROPS } from "@/lib/story/story-meet-doe-backdrops";
import { STORY_TEAM_JAMES_BACKDROP, STORY_TEAM_MATTHEW_BACKDROP } from "@/lib/story/story-team-backdrops";

/** All baked /story shader PNGs — preload on the story route. */
export const STORY_BAKED_SHADER_BACKDROP_PATHS = [
  STORY_TEAM_JAMES_BACKDROP,
  STORY_TEAM_MATTHEW_BACKDROP,
  ...STORY_MEET_DOE_MODAL_BACKDROPS,
] as const;
